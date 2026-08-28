import { absoluteUrl } from '@/lib/site-url';

export const revalidate = 86400;

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /affiliate/dashboard\nDisallow: /curious-club/apply\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\nLLMs: ${absoluteUrl('/llms.txt')}\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
      },
    }
  );
}
