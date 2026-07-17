import type { MetadataRoute } from 'next';
import { getPublishedPackagesForMarket, getPublishedBlogs } from '@/lib/firestore';
import { getPublishedJobOpenings } from '@/lib/careers-server';
import { Package, BlogPost } from '@/types';

const BASE_URL = 'https://bagpackerme.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/in`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/in/packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Dynamic package pages
  let packagePages: MetadataRoute.Sitemap = [];
  try {
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
    const snap = await getPublishedBlogs();
    blogPages = snap.docs.map((d) => {
      const post = { id: d.id, ...d.data() } as BlogPost;
      return {
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
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

  return [...staticPages, ...packagePages, ...blogPages, ...jobPages];
}
