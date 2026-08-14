import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /affiliate/dashboard is a signed-in partner's own click/earnings
        // stats — no search value, and it renders under a shareable ?code=
        // query. The page also emits noindex; this just saves the crawl.
        // /curious-club/apply is a 19-question form behind the club page — no
        // search value of its own, and it emits noindex too.
        disallow: ['/admin/', '/api/', '/affiliate/dashboard', '/curious-club/apply'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
