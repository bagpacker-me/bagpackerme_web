import type { MetadataRoute } from 'next';
import { getPublishedJobOpenings } from '@/lib/careers-server';
import { CLUB_TRIPS, tripPath } from '@/lib/club-trips';
import { SITE_URL } from '@/lib/site-url';
import { blogTechnicalModifiedDate, getPublishedBlogPosts } from '@/lib/blogs';
import { Package } from '@/types';

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages. /corporate and /book are deliberately absent — both are
  // permanentRedirect stubs into /contact, and a sitemap must only list URLs
  // that return 200. /affiliate/dashboard is absent because it is noindex, and
  // /curious-club/apply for the same reason.
  const staticPages: MetadataRoute.Sitemap = [
    // No `lastModified` on static pages: generating a new timestamp at every
    // sitemap revalidation is inaccurate and encourages unnecessary recrawls.
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/packages`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/in`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/in/packages`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/curious-club`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/affiliate`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Curious Club departures. Hard-coded content, so no try/catch needed.
  const tripPages: MetadataRoute.Sitemap = CLUB_TRIPS.map((trip) => ({
    url: `${BASE_URL}${tripPath(trip)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic package pages
  let packagePages: MetadataRoute.Sitemap = [];
  try {
    // The client Firestore SDK validates its browser key at module evaluation.
    // Keep it out of sitemap's static path so the crawl-critical static URLs
    // still render when a local build deliberately omits CMS credentials.
    const { getPublishedPackagesForMarket } = await import('@/lib/firestore');
    const globalPackages = await getPublishedPackagesForMarket('global');
    const indiaPackages = await getPublishedPackagesForMarket('india');
    packagePages = [
      ...globalPackages.map((pkg: Package) => ({
        url: `${BASE_URL}/packages/${pkg.slug}`,
        lastModified: pkg.createdAt ? new Date(pkg.createdAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...indiaPackages.map((pkg: Package) => ({
        url: `${BASE_URL}/in/packages/${pkg.slug}`,
        lastModified: pkg.createdAt ? new Date(pkg.createdAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      })),
    ];
  } catch {
    // Sitemap generation continues even if Firestore fails
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedBlogPosts();
    blogPages = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        // Never emit the editorial display date here. A sitemap lastmod must
        // correspond to the page's actual technical change history.
        lastModified: new Date(blogTechnicalModifiedDate(post)),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch {
    // Sitemap generation continues even if Firestore fails
  }

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await getPublishedJobOpenings();
    jobPages = jobs.map((job) => ({
      url: `${BASE_URL}/careers/${job.slug}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Sitemap generation continues even if Firestore fails
  }

  return [...staticPages, ...tripPages, ...packagePages, ...blogPages, ...jobPages];
}
