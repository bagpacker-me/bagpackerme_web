import { Metadata } from 'next';
import { getPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import BlogListingClient from './_components/BlogListingClient';

export const metadata: Metadata = {
  title: 'Travel Stories & Inspiration | BagPackerMe',
  description: 'Destination guides, cultural deep-dives, and honest travel stories from the road.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  let blogs: BlogPost[] = [];
  try {
    const snap = await getPublishedBlogs();
    blogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[100px]">
      {/* Hero Section */}
      <section className="bg-[#221E2A] relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span 
            className="font-heading font-bold text-transparent whitespace-nowrap"
            style={{ 
              fontSize: 'clamp(100px, 25vw, 250px)',
              WebkitTextStroke: '2px #FFFFFF',
              lineHeight: 1
            }}
          >
            STORIES
          </span>
        </div>
        <div className="container-custom relative z-10 text-center flex flex-col items-center">
          <h1 className="font-serif italic text-white text-5xl md:text-7xl mb-6 font-bold tracking-wide">
            From The Road
          </h1>
          <p className="text-gray-300 font-sans text-lg md:text-xl max-w-2xl mx-auto">
            Destination guides, cultural deep-dives, and honest travel stories.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
