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
      <section className="bg-void relative flex items-center justify-center min-h-[360px] max-h-[500px] h-[45vh] pt-[80px] pb-10 rounded-b-[40px] shadow-sm z-20">
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay z-0 rounded-b-[40px]" />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-b-[40px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal opacity-20 blur-[100px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="max-w-7xl mx-auto px-mobile md:px-desktop relative z-10 text-center flex flex-col items-center justify-center w-full mt-8">
          <div className="flex items-center gap-[16px] mb-[28px] bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
             <div className="h-[4px] w-[4px] bg-cyan rounded-full animate-pulse" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-cyan">The Journal</span>
             <div className="h-[4px] w-[4px] bg-cyan rounded-full" />
          </div>
          <h1 className="text-white font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-tight leading-[1.05] drop-shadow-lg">
            Stories from the Road
          </h1>
          <p className="font-body text-[clamp(16px,2vw,20px)] text-white/70 mt-[24px] max-w-2xl font-light">
            Destination guides, cultural deep-dives, and honest travel stories to inspire your next adventure.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
