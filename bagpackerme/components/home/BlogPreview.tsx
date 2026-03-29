/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { getRecentPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import Link from 'next/link';
import { FadeInSection, CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';

// Placeholder blog posts shown when no real data exists
const PLACEHOLDER_BLOGS = [
  {
    id: 'placeholder-1',
    slug: '#',
    title: 'The Magic of Rajasthan: Forts, Colors & Desert Nights',
    excerpt: 'From the pink walls of Jaipur to the golden sands of Jaisalmer, Rajasthan is a sensory overload in the best possible way. Here\'s how we experienced it.',
    category: 'Destination Guide',
    publishDate: '2024-03-15',
    readTimeMinutes: 7,
    featuredImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'placeholder-2',
    slug: '#',
    title: 'Varanasi at Dawn: A Spiritual Awakening on the Ganges',
    excerpt: 'Watching the Ganga Aarti as the sun rises over the holy city is an experience that transcends words. Our guide to spending 48 hours in the spiritual heart of India.',
    category: 'Travel Story',
    publishDate: '2024-02-28',
    readTimeMinutes: 5,
    featuredImageUrl: 'https://images.unsplash.com/photo-1561058778-e59265ea5642?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'placeholder-3',
    slug: '#',
    title: 'Spice Route: Eating Your Way Through Kerala',
    excerpt: 'Coconut curries, fish molee, and appam at dawn — Kerala\'s cuisine is as rich as its backwaters. A food lover\'s guide to the spice coast of India.',
    category: 'Culinary',
    publishDate: '2024-02-10',
    readTimeMinutes: 6,
    featuredImageUrl: 'https://images.unsplash.com/photo-1596791242371-55dbcc2bfb15?w=800&q=80&auto=format&fit=crop',
  },
];

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const snap = await getRecentPublishedBlogs(3);
        const fetchedBlogs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost));
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Use real data or fall back to placeholders
  const displayBlogs = blogs.length > 0 ? blogs : (!loading ? PLACEHOLDER_BLOGS as unknown as BlogPost[] : []);

  return (
    <section className="bg-white py-[var(--space-section)]">
      <div className="container">
        {/* Header */}
        <FadeInSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="section-label mb-4">✦ STORIES FROM THE ROAD</div>
            <h2
              className="font-heading font-bold text-void leading-tight mb-4"
              style={{ fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: '-0.02em' }}
            >
              Travel Tales Worth Reading
            </h2>
            <p className="text-gray-500 font-sans text-[17px] leading-relaxed max-w-lg">
              Destination guides, cultural deep-dives, and honest travel stories from the road.
            </p>
          </div>
          <Link href="/blog" className="card-cta-link inline-flex items-center gap-2 flex-shrink-0">
            Read All Stories <span aria-hidden="true">→</span>
          </Link>
        </FadeInSection>

        {/* Grid Area */}
        <div ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 aspect-video mb-5" />
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                  <div className="h-5 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-5" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={gridInView ? 'visible' : 'hidden'}
            >
              {displayBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                  className="group flex flex-col h-full cursor-pointer"
                >
                  {/* Image */}
                  <Link
                    href={blog.slug === '#' ? '/blog' : `/blog/${blog.slug}`}
                    className="block relative aspect-[16/9] overflow-hidden mb-6"
                  >
                    <div className="absolute top-4 left-4 z-10 bg-cyan text-void text-[10px] font-display font-bold uppercase tracking-[0.14em] px-3 py-1">
                      {blog.category}
                    </div>
                    <img
                      src={
                        blog.featuredImageUrl ||
                        'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-void/0 group-hover:bg-void/15 transition-colors duration-300" />
                  </Link>

                  {/* Content */}
                  <div className="flex-grow flex flex-col">
                    <div className="meta-row mb-3">
                      <span className="meta-item">{formatDate(blog.publishDate || blog.createdAt)}</span>
                      {blog.readTimeMinutes && (
                        <>
                          <span className="meta-sep" aria-hidden="true">·</span>
                          <span className="meta-item">{blog.readTimeMinutes} min read</span>
                        </>
                      )}
                    </div>

                    <Link
                      href={blog.slug === '#' ? '/blog' : `/blog/${blog.slug}`}
                      className="block mb-3"
                    >
                      <h3
                        className="font-heading font-bold text-void group-hover:text-teal transition-colors line-clamp-2"
                        style={{ fontSize: 'clamp(18px, 1.6vw, 22px)', lineHeight: 1.25, letterSpacing: '-0.01em' }}
                      >
                        {blog.title}
                      </h3>
                    </Link>

                    <p className="font-sans text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-5 border-t border-gray-100">
                      <Link
                        href={blog.slug === '#' ? '/blog' : `/blog/${blog.slug}`}
                        className="card-cta-link inline-flex items-center gap-2"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
