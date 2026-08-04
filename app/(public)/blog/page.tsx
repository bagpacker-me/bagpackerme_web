import { Metadata } from 'next';
import { getPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import BlogListingClient from './_components/BlogListingClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Travel Stories & The Journal',
  description: 'Destination guides, cultural deep-dives, and honest travel stories from the road to inspire your next adventure.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 60;

export default async function BlogPage() {
  let blogs: BlogPost[] = [];
  try {
    const snap = await getPublishedBlogs();
    blogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  return (
    <main className="min-h-[100vh] bg-[#F5F5F5]">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
        ])}
      />
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
