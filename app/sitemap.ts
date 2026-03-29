import type { MetadataRoute } from 'next';
import { getPublishedPackages, getPublishedBlogs } from '@/lib/firestore';
import { Package, BlogPost } from '@/types';

const BASE_URL = 'https://bagpackerme.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic package pages
  let packagePages: MetadataRoute.Sitemap = [];
  try {
    const snap = await getPublishedPackages();
    packagePages = snap.docs.map((d) => {
      const pkg = { id: d.id, ...d.data() } as Package;
      return {
        url: `${BASE_URL}/packages/${pkg.slug}`,
        lastModified: pkg.createdAt ? new Date(pkg.createdAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });
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

  return [...staticPages, ...packagePages, ...blogPages];
}
