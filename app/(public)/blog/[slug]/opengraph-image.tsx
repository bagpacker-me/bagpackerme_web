import { getBlogBySlug, getPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const runtime = 'nodejs';
export const alt = 'BagPackerMe Journal';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const { docs } = await getPublishedBlogs();
  return docs.map((d) => ({ slug: (d.data() as BlogPost).slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    return renderOgCard({ eyebrow: 'Journal', title: 'BagPackerMe Journal' });
  }

  return renderOgCard({
    eyebrow: blog.category || 'Journal',
    title: blog.title,
    meta: `By ${blog.author}`,
  });
}
