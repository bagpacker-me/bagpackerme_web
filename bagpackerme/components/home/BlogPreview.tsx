/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { getRecentPublishedBlogs } from '@/lib/firestore';
import { BlogPost } from '@/types';
import Link from 'next/link';

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="bg-white py-[var(--space-section)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cyan text-sm">✦</span>
              <span className="text-cyan font-bold tracking-[0.2em] text-sm uppercase">Stories From The Road</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-void leading-tight mb-4">
              Travel Tales Worth Reading
            </h2>
            <p className="text-gray-500 font-sans text-lg">
              Destination guides, cultural deep-dives, and honest travel stories from the road.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/blog" className="text-teal font-bold hover:text-void transition-colors inline-flex items-center">
              Read All Stories <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Grid Area */}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {blogs.map(blog => (
              <motion.div key={blog.id} variants={itemVariants} className="group flex flex-col h-full cursor-pointer">
                {/* Image */}
                <Link href={`/blog/${blog.slug}`} className="block relative aspect-video overflow-hidden rounded-[24px] mb-6">
                  <div className="absolute top-4 left-4 z-10 bg-cyan text-void text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
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
                  <div className="flex items-center gap-4 mb-3 text-gray-400 font-sans text-[11px] uppercase tracking-wider">
                    <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                    {blog.readTimeMinutes && <span>• {blog.readTimeMinutes} MIN READ</span>}
                  </div>
                  
                  <Link href={`/blog/${blog.slug}`} className="block mb-3">
                    <h3 className="font-heading font-bold text-[22px] leading-tight text-void group-hover:text-teal transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <p className="font-sans text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-gray-100">
                    <Link href={`/blog/${blog.slug}`} className="text-teal text-sm font-bold uppercase tracking-wider group-hover:text-void transition-colors inline-flex items-center">
                      Read More <span className="ml-2">→</span>
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
