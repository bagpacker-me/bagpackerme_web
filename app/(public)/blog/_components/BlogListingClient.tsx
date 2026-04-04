'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BlogPost } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Adventure', 'Culture', 'Food', 'Spiritual', 'Tips & Guides', 'Corporate Travel'];
const SORT_OPTIONS = ['Newest', 'Oldest', 'Popular'];
const POSTS_PER_PAGE = 9;

// ── Animation variants ──────────────────────────────────────────────────────
const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay: i * 0.08 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function FeaturedHero({ post, formatDate }: { post: BlogPost; formatDate: (d?: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);

  return (
    // Full-bleed: no side padding, starts from top-0 behind the fixed navbar
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="w-full relative"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block relative w-full overflow-hidden bg-void"
        style={{ aspectRatio: '16/7', minHeight: '480px' }}
      >
        <Image
          src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1400'}
          alt={post.title}
          fill
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Top gradient — ensures white navbar text is readable */}
        <div className="absolute top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-void/70 to-transparent z-10" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent" />

        {/* Category pill — positioned below navbar */}
        <div className="absolute top-[88px] left-6 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-display text-[11px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            {post.category}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <h2 className="font-display font-bold text-white text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.05] mb-5 [text-wrap:balance] max-w-[70%]">
            {post.title}
          </h2>
          <div className="flex items-center gap-3 text-white/80 font-body text-[13px]">
            <div className="w-7 h-7 rounded-full bg-teal/60 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
              <User size={14} className="text-white" />
            </div>
            <span className="text-white font-medium">{post.author || 'BagPackerMe'}</span>
            <span className="text-white/40">•</span>
            <span>{formatDate(post.publishDate)}</span>
            {post.readTimeMinutes && (
              <>
                <span className="text-white/40">•</span>
                <span>{post.readTimeMinutes} min read</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BlogCard({ post, formatDate, index }: { post: BlogPost; formatDate: (d?: string) => string; index: number }) {
  return (
    <motion.div variants={fadeUp} custom={index}>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col bg-white rounded-[14px] overflow-hidden shadow-sm hover:shadow-[0_16px_40px_rgba(34,30,42,0.12)] hover:-translate-y-1.5 transition-all duration-350 h-full"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0">
          <Image
            src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=700'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.06]"
          />
          {/* Category badge */}
          <span className="absolute top-3 left-3 z-10 inline-block bg-white/90 backdrop-blur-sm text-void px-2.5 py-1 rounded-full font-display text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5 md:p-6">
          <p className="font-body text-[12px] text-gray-400 mb-2.5">
            {formatDate(post.publishDate)}
            {post.readTimeMinutes && <span className="mx-1.5 text-gray-300">•</span>}
            {post.readTimeMinutes && <span>{post.readTimeMinutes} min read</span>}
          </p>

          <h3 className="font-display font-bold text-[18px] md:text-[20px] text-void leading-[1.25] mb-3 group-hover:text-teal transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="font-body text-[14px] text-gray-500 leading-[1.7] line-clamp-2 mb-4 flex-grow">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-gray-100">
            <div className="w-7 h-7 rounded-full bg-ice flex items-center justify-center text-teal flex-shrink-0 border border-gray-100">
              <User size={13} />
            </div>
            <span className="font-body font-medium text-[13px] text-void line-clamp-1">{post.author || 'BagPackerMe'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PromoBanners({ articleCount }: { articleCount: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, 0.1);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className="w-full px-5 md:px-8 lg:px-12 pb-12 md:pb-20 pt-4"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Dark CTA card */}
          <motion.div
            variants={fadeUp}
            className="relative bg-void rounded-[20px] overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-lime/10 rounded-full blur-[60px] -ml-8 -mb-8 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                <span className="text-lime text-xl">✦</span>
              </div>
              <h3 className="font-display font-bold text-white text-[22px] md:text-[26px] leading-tight mb-3 max-w-[240px]">
                Explore more to get your comfort zone
              </h3>
              <p className="font-body text-white/55 text-[14px] mb-6 max-w-[280px]">
                As it&apos;s your perfect trip, tell us.
              </p>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 bg-white text-void font-display font-bold text-[12px] uppercase tracking-widest px-5 py-3 rounded-full hover:bg-lime transition-colors duration-300 group/btn"
              >
                Booking Now
                <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Article count card */}
          <motion.div
            variants={fadeUp}
            className="relative bg-teal rounded-[20px] overflow-hidden p-8 flex items-center gap-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal to-[#1a3438]" />
            <div className="relative z-10">
              <span className="font-display font-bold text-[52px] md:text-[64px] text-white leading-none">{articleCount}</span>
              <p className="font-body text-white/70 text-[14px] mt-1">Articles Available</p>
            </div>
            <div className="relative z-10 ml-auto">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-lime text-2xl font-bold">✦</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column – big image card */}
        <motion.div variants={fadeUp} className="relative rounded-[20px] overflow-hidden min-h-[380px] md:min-h-[460px] group">
          <Image
            src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=900"
            alt="Beyond accommodation, creating memories of a lifetime"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-void/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <h3 className="font-display font-bold text-white text-[22px] md:text-[28px] leading-tight [text-wrap:balance]">
              Beyond accommodation, creating memories of a lifetime
            </h3>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function BlogListingClient({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const filteredBlogs = useMemo(() => {
    let result = initialBlogs.filter((blog) => {
      return activeCategory === 'All' || blog.category === activeCategory;
    });

    if (sortBy === 'Newest') {
      result = [...result].sort((a, b) =>
        new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
      );
    } else if (sortBy === 'Oldest') {
      result = [...result].sort((a, b) =>
        new Date(a.publishDate || 0).getTime() - new Date(b.publishDate || 0).getTime()
      );
    }
    return result;
  }, [initialBlogs, activeCategory, sortBy]);

  // Always show the first post as a featured hero on the default view
  const isDefaultView = activeCategory === 'All' && sortBy === 'Newest' && filteredBlogs.length > 0;
  const featuredPost = isDefaultView ? filteredBlogs[0] : null;
  const gridPosts = isDefaultView ? filteredBlogs.slice(1) : filteredBlogs;

  const currentGridPosts = gridPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef as React.RefObject<Element>, 0.05);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as React.RefObject<Element>);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* ── Featured Post Hero (full-bleed, behind navbar) ───── */}
      {featuredPost && currentPage === 1 && (
        <FeaturedHero post={featuredPost} formatDate={formatDate} />
      )}

      {/* ── Blog Header + Filters ────────────────────────────── */}
      {/* When no hero (filtered/paginated), add top padding for fixed navbar */}
      <section className={`w-full px-5 md:px-8 lg:px-12 py-8 md:py-10 bg-[#F5F5F5] ${!featuredPost || currentPage > 1 ? 'pt-[110px]' : ''}`}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            ref={headerRef}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {/* Title row */}
            <motion.div variants={fadeUp} className="mb-6">
              <h1 className="font-display font-bold text-[36px] md:text-[44px] text-void leading-[1.1]">Blog</h1>
              <p className="font-body text-[15px] text-gray-500 mt-2">
                Here, we share travel tips, destination guides, and stories that inspire your next adventure.
              </p>
            </motion.div>

            {/* Filter row */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-[18px] py-[8px] rounded-full font-body text-[13px] font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F5] ${
                      activeCategory === cat
                        ? 'bg-teal text-white shadow-glow-teal cursor-default'
                        : 'bg-white text-void/70 border border-void/10 hover:border-teal/30 hover:bg-ice hover:text-teal hover:shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-3 flex-shrink-0 bg-white rounded-full pl-4 pr-1 py-1 border border-void/10 shadow-sm focus-within:border-teal/40 focus-within:ring-2 focus-within:ring-teal/20 transition-all duration-300 hover:shadow-md">
                <span className="font-body text-[12px] font-medium text-void/50 uppercase tracking-wider">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent border-none py-[6px] pl-1 pr-6 font-display font-bold text-[14px] text-teal outline-none cursor-pointer appearance-none hover:text-teal/80 transition-colors"
                >
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Blog Grid ────────────────────────────────────────── */}
      <section className="w-full px-5 md:px-8 lg:px-12 pb-10 bg-[#F5F5F5]">
        <div className="max-w-[1400px] mx-auto">
          {filteredBlogs.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-[100px] px-6 bg-white rounded-[32px] border border-void/5 shadow-card-teal flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-lime/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="relative mb-6 z-10">
                <div className="absolute inset-0 bg-lime/20 blur-xl rounded-full" />
                <div className="w-20 h-20 bg-gradient-to-tr from-ice to-white rounded-full border border-white flex items-center justify-center shadow-lg relative z-10">
                  <span className="text-teal text-3xl">✦</span>
                </div>
              </div>
              
              <h3 className="font-display font-bold text-[28px] text-void mb-3 relative z-10">No Stories Found</h3>
              <p className="font-body text-void/60 max-w-[420px] text-[16px] mx-auto mb-8 relative z-10">
                We couldn&apos;t find any travel stories matching your criteria. Try selecting another category or check back later!
              </p>
              <button
                onClick={() => { setActiveCategory('All'); }}
                className="relative z-10 px-[32px] py-[16px] bg-teal text-white font-display font-bold uppercase tracking-widest text-[12px] rounded-full hover:bg-teal/90 transition-all duration-300 shadow-glow-teal hover:-translate-y-1"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                ref={gridRef}
                initial="hidden"
                animate={gridInView ? 'visible' : 'hidden'}
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentGridPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} formatDate={formatDate} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Pagination ──────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-void hover:border-teal hover:text-teal disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full font-display font-bold text-[14px] transition-all ${
                    currentPage === i + 1
                      ? 'bg-void text-white shadow-md'
                      : 'bg-white border border-gray-200 text-void hover:border-teal hover:text-teal'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-void hover:border-teal hover:text-teal disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banners ────────────────────────────────────── */}
      <PromoBanners articleCount={initialBlogs.length} />
    </div>
  );
}
