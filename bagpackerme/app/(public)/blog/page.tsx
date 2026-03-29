import { Metadata } from 'next';
import { getPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import BlogListingClient from './_components/BlogListingClient';

export const metadata: Metadata = {
  title: 'Travel Stories & Inspiration | BagPackerMe',
  description: 'Destination guides, cultural deep-dives, and honest travel stories from the road.',
};

export const dynamic = 'force-dynamic';


export default async function BlogPage() {
  let blogs: BlogPost[] = [];
  try {
    const snap = await getPublishedBlogs();
    blogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <main className="min-h-[100vh] bg-[#F7F9FA]">
      {/* Hero Section */}
      <section className="bg-[#221E2A] relative overflow-hidden flex items-center justify-center min-h-[320px] max-h-[500px] h-[40vh] pt-[72px]">
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
        
        <div className="max-w-7xl mx-auto px-mobile md:px-desktop relative z-10 text-center flex flex-col items-center justify-center w-full">
          <div className="flex items-center gap-[16px] mb-[24px]">
             <div className="h-[1px] w-[32px] bg-cyan" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-cyan">Journal</span>
             <div className="h-[1px] w-[32px] bg-cyan" />
          </div>
          <h1 className="text-white font-display text-[clamp(2.5rem,5vw,4rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            Stories from the Road
          </h1>
          <p className="font-serif italic text-[clamp(18px,2vw,24px)] text-[rgba(255,255,255,0.72)] mt-[16px]">
            Destination guides, cultural deep-dives, and honest travel stories.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
