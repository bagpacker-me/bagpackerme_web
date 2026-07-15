// Single source of truth for the canonical origin. Previously hardcoded in
// app/layout.tsx (metadataBase), app/sitemap.ts, app/robots.ts, and
// blog/[slug]/page.tsx — structured data and OG images need it too.
export const SITE_URL = 'https://bagpackerme.com';

/** Absolute URL for a site-relative path, e.g. absoluteUrl('/packages') */
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
