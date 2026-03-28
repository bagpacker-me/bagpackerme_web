import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/firestore';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '../_components/ShareButtons';
import NewsletterCard from '../_components/NewsletterCard';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) return { title: 'Post Not Found' };
  
  return {
    title: blog.metaTitle || `${blog.title} | BagPackerMe`,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      images: [blog.featuredImageUrl],
    }
  };
}

const splitHtml = (html: string) => {
  const paragraphs = html.split('</p>');
  if (paragraphs.length < 4) {
    return { firstHalf: html, secondHalf: '' }; 
  }
  const midIndex = Math.floor(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, midIndex).join('</p>') + '</p>';
  const secondHalf = paragraphs.slice(midIndex).join('</p>');
  return { firstHalf, secondHalf };
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, blog.slug, 3);
  const { firstHalf, secondHalf } = splitHtml(blog.contentHtml);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const currentUrl = `https://bagpackerme.com/blog/${blog.slug}`;

  // CSS for inner HTML elements since we don't have tailwindcss/typography
  const articleStyles = `
    max-w-none font-sans text-[16px] md:text-[18px] leading-[1.75] text-[#221E2A]
    [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-[28px] md:[&>h2]:text-[32px] [&>h2]:text-[#285056] [&>h2]:mt-[64px] [&>h2]:mb-[24px] [&>h2]:leading-tight
    [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-[24px] [&>h3]:text-[#221E2A] [&>h3]:mt-[48px] [&>h3]:mb-[16px]
    [&>blockquote]:border-l-[4px] [&>blockquote]:border-[#0ED2E9] [&>blockquote]:font-accent [&>blockquote]:italic [&>blockquote]:text-[24px] [&>blockquote]:pl-[24px] [&>blockquote]:text-[#4a5568] [&>blockquote]:my-[48px]
    [&>img]:w-full [&>img]:rounded-none [&>img]:my-[48px] [&>img]:object-cover
    [&>p>img]:w-full [&>p>img]:rounded-none [&>p>img]:my-[48px] [&>p>img]:object-cover
    [&_a]:text-[#0ED2E9] [&_a]:underline hover:[&_a]:text-[#285056] [&_a]:transition-colors [&_a]:font-bold
    [&>p]:mb-[24px]
    [&>ul]:list-disc [&>ul]:pl-[24px] [&>ul]:mb-[24px] [&>ul>li]:mb-[8px] [&>ul>li]:pl-[8px]
    [&>ol]:list-decimal [&>ol]:pl-[24px] [&>ol]:mb-[24px] [&>ol>li]:mb-[8px] [&>ol>li]:pl-[8px]
    [&>strong]:text-[#221E2A]
  `;

  return (
    <main className="min-h-screen bg-[#FFFFFF] pt-[80px]">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-center pb-[64px]">
        <div className="absolute inset-0 z-0">
          <Image 
            src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
            alt={blog.title} 
            fill
            className="object-cover"
          />
          {/* Dark gradient + grain overlay matching BlogListing */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1517] via-[rgba(11,21,23,0.7)] to-transparent"></div>
          <div 
            className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
            style={{ backgroundImage: 'url("/images/noise.png")', backgroundSize: '128px' }}
          ></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-mobile md:px-desktop relative z-10 text-center flex flex-col items-center mt-[80px]">
          <div className="inline-block bg-[#0ED2E9] text-[#221E2A] text-[11px] font-bold uppercase tracking-widest px-[12px] py-[4px] mb-[24px] font-display">
            {blog.category}
          </div>
          <h1 className="font-display font-bold text-[clamp(2.5rem,4vw,3.5rem)] text-white leading-[1.15] mb-[32px] max-w-[800px] [text-wrap:balance]">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-[16px] text-[rgba(255,255,255,0.7)] font-body text-[12px] tracking-widest uppercase">
            <span className="flex items-center gap-[8px] font-bold text-white"><User size={14} className="text-[#0ED2E9]" /> {blog.author}</span>
            <span>•</span>
            <span className="flex items-center gap-[8px]"><Calendar size={14} className="text-[#0ED2E9]" /> {formatDate(blog.publishDate)}</span>
            {blog.readTimeMinutes && (
              <>
                <span>•</span>
                <span className="flex items-center gap-[8px]"><Clock size={14} className="text-[#0ED2E9]" /> {blog.readTimeMinutes} MIN</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="w-full max-w-[720px] mx-auto px-mobile md:px-desktop py-[64px] md:py-[96px]">
        
        <div 
          className={articleStyles}
          dangerouslySetInnerHTML={{ __html: firstHalf }}
        />

        {secondHalf && <NewsletterCard />}

        {secondHalf && (
          <div 
            className={articleStyles}
            dangerouslySetInnerHTML={{ __html: secondHalf }}
          />
        )}

        {!secondHalf && <NewsletterCard />}

        {/* Share Row */}
        <div className="my-[48px]">
          <ShareButtons title={blog.title} url={currentUrl} />
        </div>

        {/* Author Bio */}
        <div className="bg-[#F7F9FA] p-[32px] md:p-[48px] flex flex-col md:flex-row items-center md:items-start gap-[32px] border border-[rgba(34,30,42,0.1)] mt-[64px] mb-[64px] text-center md:text-left rounded-none">
          <div className="w-[96px] h-[96px] rounded-full bg-[rgba(40,80,86,0.1)] flex items-center justify-center shrink-0 border-[4px] border-white shadow-sm overflow-hidden">
            <User size={40} className="text-[#285056]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[24px] text-[#221E2A] mb-[12px]">Written by {blog.author}</h3>
            <p className="font-body text-[#4a5568] mb-[24px] text-[15px] leading-[1.75]">
              Traveler, storyteller, and culture enthusiast exploring the hidden gems and spiritual profoundness of our world. Follow my journey with BagPackerMe.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-[24px]">
              <a href="#" className="font-body text-[#718096] hover:text-cyan transition-colors text-[11px] font-bold uppercase tracking-widest">Twitter</a>
              <a href="#" className="font-body text-[#718096] hover:text-cyan transition-colors text-[11px] font-bold uppercase tracking-widest">Instagram</a>
              <a href="#" className="font-body text-[#718096] hover:text-[#285056] transition-colors text-[11px] font-bold uppercase tracking-widest">Website</a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="bg-[#F7F9FA] py-mobile md:py-desktop px-mobile md:px-desktop border-t border-[rgba(34,30,42,0.06)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-[48px] flex flex-col md:flex-row md:items-end justify-between gap-[24px]">
              <div>
                <span className="text-[#285056] text-[12px] font-bold tracking-widest uppercase mb-[12px] block font-display">Read More</span>
                <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-display font-bold text-[#221E2A] leading-[1.1]">Similar Stories</h2>
              </div>
              <Link href="/blog" className="text-[#285056] font-display font-bold text-[13px] tracking-widest uppercase hover:text-cyan transition-colors inline-flex items-center">
                All Stories <ChevronRight size={16} className="ml-[8px]" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
              {relatedBlogs.map(related => (
                <Link href={`/blog/${related.slug}`} key={related.id} className="group flex flex-col bg-white border border-[rgba(34,30,42,0.08)] hover:border-[rgba(34,30,42,0.15)] transition-colors duration-300">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image 
                      src={related.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                      alt={related.title} 
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute top-[16px] left-[16px] z-10 bg-lime text-[#221E2A] px-[12px] py-[4px] font-display text-[11px] font-bold uppercase tracking-widest leading-none">
                      {related.category}
                    </div>
                  </div>
                  <div className="p-[24px] flex flex-col flex-grow">
                     <div className="font-body text-[12px] text-[#718096] mb-[12px]">
                       {formatDate(related.publishDate)}
                     </div>
                     <h3 className="font-display font-bold text-[20px] text-[#221E2A] mb-[12px] leading-[1.2] group-hover:text-[#285056] transition-colors duration-300 line-clamp-2">
                       {related.title}
                     </h3>
                     <p className="font-body text-[15px] text-[#4a5568] leading-[1.75] line-clamp-3">
                       {related.excerpt}
                     </p>
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
