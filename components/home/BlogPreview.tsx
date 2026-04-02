/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { getRecentPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import Link from 'next/link';
import { FadeInSection, CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';

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
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="bg-surface-high py-[var(--space-section)]">
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

        {/* Grid */}
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
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-medium">
              <p className="font-sans text-gray-400 text-sm mb-4">No stories published yet.</p>
              <Link href="/blog" className="card-cta-link inline-flex items-center gap-2">
                Visit the Blog →
              </Link>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={gridInView ? 'visible' : 'hidden'}
            >
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                  className="group flex flex-col h-full cursor-pointer transition-all duration-700 hover:-translate-y-1 hover:shadow-diffuse"
                >
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="block relative aspect-[16/9] overflow-hidden mb-6"
                  >
                    <div className="absolute top-4 left-4 z-10 bg-cyan text-void text-[10px] font-display font-bold uppercase tracking-[0.14em] px-3 py-1">
                      {blog.category}
                    </div>
                    <img
                      src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop'}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-void/0 group-hover:bg-void/15 transition-colors duration-300" />
                  </Link>

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

                    <Link href={`/blog/${blog.slug}`} className="block mb-3">
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

                    <div className="mt-auto pt-5 border-t border-subtle">
                      <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-primary hover:text-white text-xs font-display font-bold uppercase tracking-wider text-primary transition-all duration-200">
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
