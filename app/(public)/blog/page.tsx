import { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blogs';
import BlogHub from './_components/BlogHub';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBlogCollectionSchema, buildBreadcrumbSchema } from '@/lib/structured-data';

const BLOG_TITLE = 'Travel Stories, Ideas & Guides for the Curious';
const BLOG_DESCRIPTION =
  'Practical guides, honest answers and stories for people who want to see more of the world—even when their usual travel group can’t come.';

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

export const revalidate = 3600;

export default async function BlogPage() {
  const blogs = await getPublishedBlogPosts();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
        ])}
      />
      <JsonLd data={buildBlogCollectionSchema(blogs)} />
      <BlogHub posts={blogs} />
    </>
  );
}
