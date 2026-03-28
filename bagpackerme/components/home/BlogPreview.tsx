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
        const fetchedBlogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
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

  return (
    <section className="bg-white py-[var(--space-section)]">
      <div className="container-custom">
        {/* Header */}
        <FadeInSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="section-label mb-[16px]">✦ STORIES FROM THE ROAD</div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-void leading-tight mb-4" style={{ textWrap: 'balance', letterSpacing: '-0.02em' }}>
              Travel Tales Worth Reading
            </h2>
            <p className="text-gray-500 font-sans text-lg">
              Destination guides, cultural deep-dives, and honest travel stories from the road.
            </p>
          </div>
          <Link href="/blog" className="card-cta-link inline-flex items-center gap-2">
            Read All Stories <span aria-hidden="true">→</span>
          </Link>
        </FadeInSection>

        {/* Grid Area — Spec #4: stagger 0.08, useInView */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-t-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={gridInView ? 'visible' : 'hidden'}
          >
            {blogs.map(blog => (
              <motion.div
                key={blog.id}
                variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                className="group flex flex-col h-full cursor-pointer"
              >
                {/* Image */}
                <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/9] overflow-hidden mb-6">
                  <div className="absolute top-4 left-4 z-10 bg-cyan text-void text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-none">
                    {blog.category}
                  </div>
                  <img 
                    src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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
                  
                  <Link href={`/blog/${blog.slug}`} className="block mb-3">
                    <h3 className="font-heading font-bold text-[22px] leading-tight text-void group-hover:text-teal transition-colors line-clamp-2" style={{ textWrap: 'balance' }}>
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <p className="font-sans text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-gray-100">
                    <Link href={`/blog/${blog.slug}`} className="card-cta-link inline-flex items-center gap-2">
                      Read More <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-100">
            <h3 className="font-heading font-bold text-2xl text-gray-400 mb-2">No Stories Yet</h3>
            <p className="text-gray-500 font-sans">We&apos;re working on gathering the best travel tales.</p>
          </div>
        )}
      </div>
    </section>
  );
}
