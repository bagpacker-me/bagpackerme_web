import 'server-only';
import { unstable_cache } from 'next/cache';
import { resolveSiteSettings, type ResolvedSiteSettings } from '@/lib/site-settings';
import { restDocumentToObject, firestoreRestConfig, type FirestoreRestDocument } from '@/lib/firestore-rest';

// Reads settings/site server-side WITHOUT the client Firestore SDK (which stalls
// Node builds) and WITHOUT the Admin SDK (credentials aren't reliably present at
// build time). Mirrors the existing REST bypass in lib/firestore.ts. The rule
// `match /settings/{docId} { allow read: if true }` makes a keyed GET safe.
//
// Always resolves — never throws — because this runs in the public layout on
// every page; a Firestore blip must degrade to defaults, not 500 the site.
async function fetchSiteSettings(): Promise<ResolvedSiteSettings> {
  const config = firestoreRestConfig();
  if (!config) return resolveSiteSettings(null);

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/settings/site?key=${config.apiKey}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return resolveSiteSettings(null);

    const document = (await response.json()) as FirestoreRestDocument;
    // A missing doc returns 200 with no `fields`; resolveSiteSettings fills gaps.
    return resolveSiteSettings(restDocumentToObject(document) as Partial<ResolvedSiteSettings>);
  } catch {
    return resolveSiteSettings(null);
  }
}

// Cache for the same hour the pages revalidate on, so `next build` does one
// fetch rather than one per page.
export const getSiteSettingsServer = unstable_cache(fetchSiteSettings, ['site-settings'], {
  revalidate: 3600,
});
