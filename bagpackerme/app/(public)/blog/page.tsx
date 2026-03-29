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
      <section className="bg-void relative flex items-center justify-center min-h-[360px] max-h-[500px] h-[45vh] pt-[80px] pb-10 shadow-md z-20 overflow-hidden">
        {/* Grain overlay */}
        <div className="grain absolute inset-0 pointer-events-none z-0" />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal opacity-30 blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-cyan opacity-15 blur-[90px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-mobile md:px-desktop relative z-10 text-center flex flex-col items-center justify-center w-full mt-8">
          <div className="section-label mb-[28px]">
             ✦ The Journal
          </div>
          <h1 className="text-white font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-tight leading-[1.05] drop-shadow-lg" style={{ textWrap: 'balance' }}>
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
