import 'server-only';
import { unstable_cache } from 'next/cache';
import {
  restDocumentToObject,
  firestoreRestConfig,
  type FirestoreRestDocument,
  type FirestoreRunQueryResult,
} from '@/lib/firestore-rest';
import type { JobOpening } from '@/types';

// Reads published openings server-side WITHOUT the client Firestore SDK (which
// stalls Node builds and leaks handles) and WITHOUT the Admin SDK (credentials
// aren't reliably present at build time, and generateStaticParams runs there).
// Mirrors getPublishedPackagesFromRest in lib/firestore.ts and
// getSiteSettingsServer in lib/site-settings-server.ts.
//
// The rule `allow read: if resource.data.status == 'published'` makes this
// keyless query safe: drafts and closed roles are rejected by Firestore itself,
// not merely filtered here.

const jobFromRestDocument = (document: FirestoreRestDocument): JobOpening => {
  const data = restDocumentToObject(document) as Omit<JobOpening, 'id'>;

  return {
    ...data,
    id: document.name.split('/').pop() ?? data.slug,
    // A doc written before a field existed decodes to undefined; the UI treats
    // these as always-present arrays.
    responsibilities: data.responsibilities ?? [],
    requirements: data.requirements ?? [],
  };
};

// Openings are ordered by `order` ascending, then newest first as a tiebreak.
// Sorted here rather than in the query so no composite index is needed — the
// same trade the packages query makes, and the volume is tens of docs.
const sortJobs = (jobs: JobOpening[]) =>
  [...jobs].sort((a, b) => {
    const orderDelta = (a.order ?? 0) - (b.order ?? 0);
    if (orderDelta !== 0) return orderDelta;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

async function fetchPublishedJobOpenings(): Promise<JobOpening[]> {
  const config = firestoreRestConfig();
  if (!config) return [];

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents:runQuery?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'job_openings' }],
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

    if (!response.ok) return [];

    const results = (await response.json()) as FirestoreRunQueryResult[];
    return sortJobs(
      results
        .map((result) => result.document)
        .filter((document): document is FirestoreRestDocument => Boolean(document))
        .map(jobFromRestDocument)
    );
  } catch {
    // Never throws: /careers renders an empty state rather than 500ing when
    // Firestore blips.
    return [];
  }
}

/** Published openings, newest-first within their manual order. Never throws. */
export const getPublishedJobOpenings = unstable_cache(fetchPublishedJobOpenings, ['job-openings'], {
  revalidate: 300,
});

/** A single published opening by slug, or null. Never throws. */
export async function getPublishedJobOpeningBySlug(slug: string): Promise<JobOpening | null> {
  const jobs = await getPublishedJobOpenings();
  return jobs.find((job) => job.slug === slug) ?? null;
}
