// Single source of truth for the canonical origin. Import this — never write the
// host as a literal. Consumers: app/layout.tsx (metadataBase + openGraph.url),
// app/robots.ts, app/sitemap.ts, lib/structured-data.ts, blog share URLs, and
// the affiliate dashboard's referral-link fallback.
//
// This MUST be the host that actually serves 200, not the one that redirects.
// The apex (bagpackerme.com) 301s to www at the hosting layer, so canonicals,
// hreflang, og:url, JSON-LD @ids and sitemap <loc> values all have to be www —
// pointing them at a redirecting host turns every sitemap entry into a "Page
// with redirect" in Search Console and splits signals across two hosts. If the
// redirect direction is ever flipped in Vercel, flip this line with it.
export const SITE_URL = 'https://www.bagpackerme.com';

/** Absolute URL for a site-relative path, e.g. absoluteUrl('/packages') */
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
