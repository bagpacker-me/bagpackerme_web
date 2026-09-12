import { Metadata } from 'next';
import { getPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import BlogListingClient from './_components/BlogListingClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBlogCollectionSchema, buildBreadcrumbSchema } from '@/lib/structured-data';

const BLOG_TITLE = 'India Travel Guides, Culture & Safari Stories';
const BLOG_DESCRIPTION =
  'Explore India travel guides, heritage walks, wildlife safaris, slow journeys and cultural experiences from BagPackerMe’s Journal.';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    siteName: 'BagPackerMe',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [{
      url: '/web_photos/hero_3.webp',
      alt: 'The illuminated Hawa Mahal facade in Jaipur at dusk',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: ['/web_photos/hero_3.webp'],
  },
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
      <JsonLd data={buildBlogCollectionSchema(blogs)} />
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
