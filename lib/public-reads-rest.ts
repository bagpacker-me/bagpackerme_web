// Browser-safe public reads over the Firestore REST API.
//
// Why this exists rather than reusing lib/firestore.ts: that module imports
// lib/firebase.ts, which calls initializeApp/getFirestore/getAuth/getStorage at
// module scope. Importing it from a client component — even lazily — pulls the
// whole Firebase JS SDK onto a marketing page, and getAuth() then injects the
// bagpackerme-webb.firebaseapp.com/__/auth/iframe.js frame. On the homepage that
// measured ~200 KB of third-party transfer, three extra origin connections, and
// roughly a second of main-thread work for data the page already renders from
// STATIC_GLOBAL_PACKAGE_SUMMARIES.
//
// These reads are exactly as privileged as the SDK ones were: same public API
// key, same rules. firestore.rules allows `read` on packages where
// `status == 'published'` and on every `settings/{docId}`, so a keyed REST call
// is permitted and the response is CORS-enabled for browser origins.
//
// Every function resolves to null on failure instead of throwing — callers
// render seeded/static content and a refresh that fails must stay invisible.

import {
  firestoreRestConfig,
  restDocumentToObject,
  type FirestoreRestDocument,
  type FirestoreRunQueryResult,
} from './firestore-rest';
import type { Package, PackageMarket, SiteSettings, Testimonial } from '@/types';
import { withPackageImageOverrides } from './package-image-overrides';

/**
 * The fields PackageCard, PremiumFilter, and the listing filters actually read.
 * Fetching whole documents instead pulled ~500 KB across the wire (200 KB of it
 * `itinerary`) for grids that never render a single day. The projection brings
 * the same 63 packages down to ~80 KB.
 */
const PACKAGE_CARD_FIELDS = [
  'title',
  'slug',
  'market',
  'category',
  'tagline',
  'heroImageUrl',
  'duration',
  'groupSize',
  'priceInr',
  'priceUsd',
  'destinations',
  'subTheme',
  'vibe',
  'createdAt',
] as const;

const REST_BASE = 'https://firestore.googleapis.com/v1/projects';

const packageFromRestDocument = (document: FirestoreRestDocument): Package => {
  const data = restDocumentToObject(document) as Omit<Package, 'id'>;

  return withPackageImageOverrides({
    id: document.name.split('/').pop() ?? data.slug,
    ...data,
    market: data.market === 'global' ? 'global' : 'india',
  } as Package);
};

const sortByCreatedAtDesc = (packages: Package[]) =>
  [...packages].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

/**
 * Live published packages for one market, card fields only. `null` means the
 * read failed and the caller should keep whatever it is already showing.
 */
export async function fetchPublishedPackageCards(
  market: PackageMarket,
  signal?: AbortSignal
): Promise<Package[] | null> {
  const config = firestoreRestConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${REST_BASE}/${config.projectId}/databases/(default)/documents:runQuery?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal,
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'packages' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'status' },
                op: 'EQUAL',
                value: { stringValue: 'published' },
              },
            },
            select: { fields: PACKAGE_CARD_FIELDS.map((fieldPath) => ({ fieldPath })) },
          },
        }),
      }
    );

    if (!response.ok) return null;

    const results = (await response.json()) as FirestoreRunQueryResult[];
    const packages = results
      .map((result) => result.document)
      .filter((document): document is FirestoreRestDocument => Boolean(document))
      .map(packageFromRestDocument)
      .filter((pkg) => pkg.market === market);

    return sortByCreatedAtDesc(packages);
  } catch {
    return null;
  }
}

/**
 * Overlays live packages onto a static seed, keyed by slug, so an editor's
 * change wins while the hand-authored global catalogue still shows through.
 * Mirrors mergeWithStaticGlobalPackages in lib/firestore.ts, but takes the seed
 * as an argument so the client can pass the lightweight card summaries instead
 * of the 110 KB full-package file.
 */
export function mergePackagesBySlug(seed: Package[], live: Package[]): Package[] {
  const bySlug = new Map<string, Package>();
  seed.forEach((pkg) => bySlug.set(pkg.slug, pkg));
  live.forEach((pkg) => bySlug.set(pkg.slug, pkg));
  return sortByCreatedAtDesc(Array.from(bySlug.values()));
}

/**
 * Published testimonials for one market. A testimonial with no `market` is
 * shown on both homepages, matching getPublishedTestimonialsForMarket.
 */
export async function fetchPublishedTestimonials(
  market: PackageMarket,
  signal?: AbortSignal
): Promise<Testimonial[] | null> {
  const config = firestoreRestConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${REST_BASE}/${config.projectId}/databases/(default)/documents:runQuery?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal,
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'testimonials' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'status' },
                op: 'EQUAL',
                value: { stringValue: 'published' },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) return null;

    const results = (await response.json()) as FirestoreRunQueryResult[];
    return results
      .map((result) => result.document)
      .filter((document): document is FirestoreRestDocument => Boolean(document))
      .map((document) => ({
        id: document.name.split('/').pop() ?? '',
        ...(restDocumentToObject(document) as Omit<Testimonial, 'id'>),
      }))
      .filter((testimonial) => !testimonial.market || testimonial.market === market);
  } catch {
    return null;
  }
}

/** The `settings/site` document, or null if it is missing or unreadable. */
export async function fetchSiteSettingsRest(
  signal?: AbortSignal
): Promise<Partial<SiteSettings> | null> {
  const config = firestoreRestConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${REST_BASE}/${config.projectId}/databases/(default)/documents/settings/site?key=${config.apiKey}`,
      { signal }
    );
    if (!response.ok) return null;

    // A missing doc still returns 200, just without `fields`.
    const document = (await response.json()) as FirestoreRestDocument;
    if (!document.fields) return null;

    return restDocumentToObject(document) as Partial<SiteSettings>;
  } catch {
    return null;
  }
}
