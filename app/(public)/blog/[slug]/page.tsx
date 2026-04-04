import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/firestore';
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '../_components/ShareButtons';
import NewsletterCard from '../_components/NewsletterCard';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) return { title: 'Post Not Found' };

  return {
    title: blog.metaTitle || `${blog.title} | BagPackerMe Journal`,
    description: blog.metaDescription || blog.excerpt,
    openGraph: { images: [blog.featuredImageUrl] },
  };
}

const splitHtml = (html: string) => {
  const paragraphs = html.split('</p>');
  if (paragraphs.length < 4) return { firstHalf: html, secondHalf: '' };
  const midIndex = Math.floor(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, midIndex).join('</p>') + '</p>';
  const secondHalf = paragraphs.slice(midIndex).join('</p>');
  return { firstHalf, secondHalf };
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(blog.category, blog.slug, 3);
  const { firstHalf, secondHalf } = splitHtml(blog.contentHtml);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const currentUrl = `https://bagpackerme.com/blog/${blog.slug}`;

  const articleStyles = `
    max-w-none font-sans text-[16px] md:text-[18px] leading-[1.85] text-[#2D2D2D]
    [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-[clamp(1.5rem,2.5vw,2rem)] [&>h2]:text-[#285056] [&>h2]:mt-[56px] [&>h2]:mb-[20px] [&>h2]:leading-tight
    [&>h3]:font-display [&>h3]:font-bold [&>h3]:text-[1.25rem] [&>h3]:text-[#221E2A] [&>h3]:mt-[40px] [&>h3]:mb-[14px]
    [&>blockquote]:border-l-[3px] [&>blockquote]:border-lime [&>blockquote]:font-accent [&>blockquote]:italic [&>blockquote]:text-[1.25rem] [&>blockquote]:pl-[24px] [&>blockquote]:text-[#555] [&>blockquote]:my-[40px] [&>blockquote]:bg-[#F5F5F5] [&>blockquote]:py-[14px] [&>blockquote]:pr-[20px] [&>blockquote]:rounded-r-lg
    [&>img]:w-full [&>img]:my-[40px] [&>img]:object-cover [&>img]:rounded-xl [&>img]:shadow-md
    [&_a]:text-teal [&_a]:underline [&_a]:decoration-teal/30 hover:[&_a]:decoration-teal [&_a]:transition-all [&_a]:font-medium
    [&>p]:mb-[22px]
    [&>ul]:list-disc [&>ul]:pl-[24px] [&>ul]:mb-[22px] [&>ul>li]:mb-[8px] [&>ul>li]:pl-[6px]
    [&>ol]:list-decimal [&>ol]:pl-[24px] [&>ol]:mb-[22px] [&>ol>li]:mb-[8px] [&>ol>li]:pl-[6px]
  `;

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 md:px-8 lg:px-12 pt-4 pb-0">
        <div className="max-w-[1400px] mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-body font-medium text-gray-500 hover:text-teal transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>

          {/* Hero image container */}
          <div className="relative w-full rounded-[20px] md:rounded-[28px] overflow-hidden aspect-[16/7] min-h-[300px] md:min-h-[460px] bg-void">
            <Image
              src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1400'}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent" />

            {/* Category pill */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-display text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                {blog.category}
              </span>
            </div>

            {/* Hero text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 z-10">
              <h1 className="font-display font-bold text-white text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.08] mb-5 [text-wrap:balance] max-w-[80%]">
                {blog.title}
              </h1>

              {/* Meta strip */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-white/75 font-body text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal/50 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-white font-medium">{blog.author}</span>
                </div>
                <span className="text-white/30 hidden md:block">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-lime" />
                  {formatDate(blog.publishDate)}
                </span>
                {blog.readTimeMinutes && (
                  <>
                    <span className="text-white/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-lime" />
                      {blog.readTimeMinutes} min read
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ───────────────────────────────────────────────────── */}
      <section className="w-full px-5 md:px-8 lg:px-12 pt-12 md:pt-16 pb-8">
        <div className="max-w-[740px] mx-auto">

          {/* Excerpt pull-quote */}
          {blog.excerpt && (
            <p className="font-accent italic text-[1.35rem] md:text-[1.5rem] text-void/80 leading-[1.6] mb-10 pb-10 border-b border-gray-100 [text-wrap:balance]">
              {blog.excerpt}
            </p>
          )}

          {/* First half of content */}
          <div
            className={articleStyles}
            dangerouslySetInnerHTML={{ __html: firstHalf }}
          />

          {/* Inline newsletter */}
          {secondHalf && <NewsletterCard />}

          {/* Second half of content */}
          {secondHalf && (
            <div
              className={articleStyles}
              dangerouslySetInnerHTML={{ __html: secondHalf }}
            />
          )}

          {!secondHalf && <NewsletterCard />}

          {/* Share */}
          <div className="my-12 pt-10 border-t border-gray-100">
            <ShareButtons title={blog.title} url={currentUrl} />
          </div>

          {/* Author card */}
          <div className="bg-[#F7F9FA] rounded-[20px] p-7 md:p-10 flex flex-col sm:flex-row gap-6 items-start mb-16">
            <div className="w-16 h-16 rounded-full bg-teal/10 border-2 border-teal/20 flex items-center justify-center flex-shrink-0">
              <User size={28} className="text-teal" />
            </div>
            <div className="flex-grow">
              <p className="font-display text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">Written by</p>
              <h3 className="font-display font-bold text-[20px] text-void mb-2">{blog.author}</h3>
              <p className="font-body text-[14px] text-gray-500 leading-[1.7] mb-4">
                Traveler, storyteller, and culture enthusiast exploring the hidden gems and spiritual depth of our world. Follow the journey with BagPackerMe.
              </p>
              <div className="flex gap-5">
                {['Twitter', 'Instagram', 'Website'].map(s => (
                  <a key={s} href="#" className="font-body text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-teal transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ─────────────────────────────────────────────────── */}
      {relatedBlogs.length > 0 && (
        <section className="w-full px-5 md:px-8 lg:px-12 py-12 md:py-20 bg-[#F5F5F5]">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-display text-[11px] font-bold tracking-widest uppercase text-teal mb-2">Read More</p>
                <h2 className="font-display font-bold text-[clamp(1.8rem,3vw,2.5rem)] text-void leading-tight">Similar Stories</h2>
              </div>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 font-display font-bold text-[12px] uppercase tracking-widest text-teal hover:text-void transition-colors group"
              >
                All Stories
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link
                  href={`/blog/${related.slug}`}
                  key={related.id}
                  className="group flex flex-col bg-white rounded-[14px] overflow-hidden shadow-sm hover:shadow-[0_16px_40px_rgba(34,30,42,0.12)] hover:-translate-y-1.5 transition-all duration-350"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={related.featuredImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=700'}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.06]"
                    />
                    <span className="absolute top-3 left-3 z-10 inline-block bg-white/90 backdrop-blur-sm text-void px-2.5 py-1 rounded-full font-display text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {related.category}
                    </span>
                  </div>
                  <div className="flex flex-col flex-grow p-5 md:p-6">
                    <p className="font-body text-[12px] text-gray-400 mb-2.5">
                      {formatDate(related.publishDate)}
                      {related.readTimeMinutes && <span className="mx-1.5 text-gray-300">•</span>}
                      {related.readTimeMinutes && <span>{related.readTimeMinutes} min read</span>}
                    </p>
                    <h3 className="font-display font-bold text-[18px] text-void leading-[1.25] mb-3 group-hover:text-teal transition-colors duration-300 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="font-body text-[14px] text-gray-500 leading-[1.7] line-clamp-2 mb-4 flex-grow">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-ice flex items-center justify-center text-teal flex-shrink-0 border border-gray-100">
                        <User size={13} />
                      </div>
                      <span className="font-body font-medium text-[13px] text-void line-clamp-1">{related.author || 'BagPackerMe'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
