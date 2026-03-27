import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/firestore';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
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
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const currentUrl = `https://bagpackerme.com/blog/${blog.slug}`;

  // CSS for inner HTML elements since we don't have tailwindcss/typography
  const articleStyles = `
    max-w-none font-sans leading-relaxed text-gray-600 text-lg
    [&>h2]:font-heading [&>h2]:font-bold [&>h2]:text-[28px] [&>h2]:text-brand-teal [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:leading-tight
    [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-2xl [&>h3]:text-brand-void [&>h3]:mt-10 [&>h3]:mb-4
    [&>blockquote]:border-l-4 [&>blockquote]:border-lime-400 [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:text-2xl [&>blockquote]:pl-6 [&>blockquote]:text-brand-void [&>blockquote]:my-10
    [&>img]:w-full [&>img]:rounded-2xl [&>img]:shadow-sm [&>img]:my-12 [&>img]:object-cover
    [&>p>img]:w-full [&>p>img]:rounded-2xl [&>p>img]:shadow-sm [&>p>img]:my-12 [&>p>img]:object-cover
    [&_a]:text-brand-cyan [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand-teal [&_a]:transition-colors [&_a]:font-bold
    [&>p]:mb-6
    [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:pl-2
    [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:pl-2
    [&>strong]:text-brand-void
  `;

  return (
    <main className="min-h-screen bg-white pb-24 pt-[80px]">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-end pb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#221E2A] via-[#221E2A]/70 to-transparent"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto md:mx-0">
            <div className="inline-block bg-brand-cyan text-[#221E2A] text-sm font-bold uppercase tracking-wider px-4 py-2 mb-6 font-sans">
              {blog.category}
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-5xl text-white leading-tight mb-8">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300 font-sans text-sm tracking-wider uppercase font-bold">
              <span className="flex items-center gap-2"><User size={16} className="text-brand-cyan" /> {blog.author}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-brand-cyan" /> {formatDate(blog.publishDate)}</span>
              {blog.readTimeMinutes && <span className="flex items-center gap-2"><Clock size={16} className="text-brand-cyan" /> {blog.readTimeMinutes} MIN READ</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="container-custom mt-16 md:mt-24">
        <div className="max-w-[720px] mx-auto">
          
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
          <ShareButtons title={blog.title} url={currentUrl} />

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-100 mt-12 mb-20 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0 border-4 border-white shadow-sm overflow-hidden">
              <User size={40} className="text-brand-teal" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-brand-void mb-3">Written by {blog.author}</h3>
              <p className="font-sans text-gray-500 mb-6 text-base leading-relaxed">
                Traveler, storyteller, and culture enthusiast exploring the hidden gems and spiritual profoundness of our world. Follow my journey with BagPackerMe.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6">
                <a href="#" className="text-gray-400 hover:text-[#1DA1F2] transition-colors font-sans text-[11px] font-bold uppercase tracking-wider">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-[#E1306C] transition-colors font-sans text-[11px] font-bold uppercase tracking-wider">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors font-sans text-[11px] font-bold uppercase tracking-wider">Website</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-20 border-t border-gray-100">
          <div className="container-custom">
            <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2 block font-sans">Read More</span>
                <h2 className="text-4xl font-heading font-bold text-brand-void">Similar Stories</h2>
              </div>
              <Link href="/blog" className="text-brand-teal font-bold hover:text-brand-void transition-colors inline-flex items-center">
                All Stories <span className="ml-2">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map(related => (
                <Link href={`/blog/${related.slug}`} key={related.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-brand-cyan text-[#221E2A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 font-sans">
                      {related.category}
                    </div>
                    <img 
                      src={related.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-gray-400 font-sans text-xs uppercase tracking-wider">
                      <span>{formatDate(related.publishDate)}</span>
                      {related.readTimeMinutes && <span>• {related.readTimeMinutes} MIN READ</span>}
                    </div>
                    <h3 className="font-heading font-bold text-2xl leading-tight text-brand-void group-hover:text-brand-teal transition-colors mb-4 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="font-sans text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {related.excerpt}
                    </p>
                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50">
                      <span className="text-brand-teal text-xs font-bold uppercase tracking-wider group-hover:text-brand-void transition-colors">
                        Read Story
                      </span>
                      <span className="text-brand-teal group-hover:text-brand-void transition-colors">
                        <ChevronRight size={18} />
                      </span>
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
