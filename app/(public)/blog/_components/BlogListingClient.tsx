'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Adventure', 'Culture', 'Food', 'Spiritual', 'Tips & Guides', 'Corporate Travel'];
const POSTS_PER_PAGE = 6;

export default function BlogListingClient({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchCategory = activeCategory === 'All' || blog.category === activeCategory;
      const matchSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [initialBlogs, activeCategory, searchQuery]);

  // Only use featuredPost layout when there are MORE than 1 result — otherwise
  // the single post would be consumed by the featured section leaving the grid empty.
  const isDefaultView = activeCategory === 'All' && !searchQuery && filteredBlogs.length > 1;
  const featuredPost = isDefaultView ? filteredBlogs[0] : null;
  const gridPosts = isDefaultView ? filteredBlogs.slice(1) : filteredBlogs;

  const currentGridPosts = gridPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    setTimeout(() => {
      alert("Thanks for subscribing!");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <>
      {/* 2. FEATURED POST */}
      {isDefaultView && currentPage === 1 && featuredPost && (
        <section className="w-full bg-[#F7F9FA] pt-[clamp(40px,5vw,64px)] pb-[clamp(32px,4vw,48px)] px-mobile md:px-desktop relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-0 items-stretch bg-white border border-gray-100 shadow-md transition-all duration-500 hover:shadow-[0_24px_56px_rgba(34,30,42,0.12)] group/feature relative overflow-hidden">
              {/* Accent line on hover */}
              <div className="absolute top-0 left-0 h-full w-[4px] bg-lime scale-y-0 group-hover/feature:scale-y-100 origin-bottom transition-transform duration-500" />
              {/* Left (55%) */}
              <div className="w-full lg:w-[55%] relative overflow-hidden">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="absolute top-[16px] left-[16px] z-10 bg-cyan text-void px-[14px] py-[5px] font-display text-[10px] font-bold uppercase tracking-widest leading-none shadow-sm">
                    {featuredPost.category}
                  </div>
                  <div className="aspect-[16/9] lg:aspect-[4/3] relative w-full overflow-hidden">
                    <Image
                      src={featuredPost.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--ease-default)] group-hover/feature:scale-[1.04]"
                    />
                  </div>
                </Link>
              </div>

              {/* Right (45%) */}
              <div className="w-full lg:w-[45%] flex flex-col items-start p-[40px] lg:p-[56px]">
                <span className="section-label text-teal before:bg-teal mb-[16px]">
                  ✦ Featured Story
                </span>
                <Link href={`/blog/${featuredPost.slug}`} className="block group/title">
                  <h2 className="font-display text-[clamp(1.75rem,2.5vw,2.5rem)] text-void font-bold leading-[1.15] mb-[20px] group-hover/title:text-teal transition-colors duration-300" style={{ textWrap: 'balance' }}>
                    {featuredPost.title}
                  </h2>
                </Link>
                
                <p className="font-body text-[16px] text-gray-500 leading-[1.75] max-w-[90%] mb-[32px] line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-[32px] w-full">
                  <div className="w-10 h-10 bg-ice flex items-center justify-center text-teal font-display font-bold text-sm border border-gray-100">
                    {featuredPost.author ? featuredPost.author.charAt(0) : 'B'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body font-bold text-[14px] text-void">{featuredPost.author || 'BagPackerMe'}</span>
                    <span className="font-body text-[13px] text-gray-400">
                      {formatDate(featuredPost.publishDate)} 
                      {featuredPost.readTimeMinutes && <span className="mx-2">&bull;</span>}
                      {featuredPost.readTimeMinutes && <span>{featuredPost.readTimeMinutes} min read</span>}
                    </span>
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.slug}`} className="btn-teal text-[12px] flex items-center gap-2">
                  Read Story
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN GRID + SIDEBAR */}
      <section className="w-full bg-[#F7F9FA] pb-[clamp(64px,10vw,120px)] pt-8 px-mobile md:px-desktop relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-[48px] lg:gap-[64px]">
          
          {/* Main Content (2/3) */}
          <div className="w-full lg:w-[66.666%]">
            
            {gridPosts.length === 0 ? (
               <div className="text-center py-24 bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-ice flex items-center justify-center mb-6">
                    <Search className="text-teal" size={24} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-void mb-3">No Stories Found</h3>
                  <p className="font-body text-gray-500 max-w-sm mx-auto">We couldn&apos;t find any travel stories matching your criteria. Try adjusting your search or categories.</p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-8 text-teal font-display font-medium border-b border-teal pb-0.5 hover:text-void hover:border-void transition-colors">
                    Clear all filters
                  </button>
               </div>
            ) : (
               <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[64px]">
                   {currentGridPosts.map(post => (
                     <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(34,30,42,0.10)] hover:-translate-y-1 transition-all duration-300 relative">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-teal scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-400" />
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image 
                            src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />
                          <div className="absolute top-[16px] left-[16px] z-10 bg-cyan text-void px-[12px] py-[4px] font-display text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            {post.category}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-[28px] flex flex-col flex-grow bg-white">
                            <div className="flex items-center text-xs font-body text-gray-400 mb-4 gap-2">
                              <span>{formatDate(post.publishDate)}</span>
                              {post.readTimeMinutes && (
                                <>
                                  <span className="w-1 h-1 bg-gray-300"></span>
                                  <span>{post.readTimeMinutes} min read</span>
                                </>
                              )}
                           </div>
                           <h3 className="font-display font-bold text-[22px] text-void mb-[14px] leading-[1.3] group-hover:text-teal transition-colors duration-300 line-clamp-2">
                             {post.title}
                           </h3>
                           <p className="font-body text-[15px] text-gray-500 leading-[1.65] line-clamp-3 mb-6 flex-grow">
                             {post.excerpt}
                           </p>
                           <div className="mt-auto flex items-center font-display text-[13px] font-medium text-teal">
                             Read article 
                             <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                           </div>
                        </div>
                     </Link>
                   ))}
                 </div>

                 {/* Pagination */}
                 {totalPages > 1 && (
                   <div className="flex items-center justify-center gap-2 mt-16">
                     <button 
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-void hover:border-teal hover:text-teal hover:bg-ice disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                       aria-label="Previous Page"
                     >
                       <ChevronLeft size={18} />
                     </button>
                     
                     <div className="flex items-center gap-2 mx-2">
                       {Array.from({ length: totalPages }).map((_, i) => (
                         <button
                           key={i}
                           onClick={() => setCurrentPage(i + 1)}
                           className={`w-10 h-10 flex items-center justify-center font-display font-bold text-[14px] transition-all ${
                             currentPage === i + 1
                               ? 'bg-teal text-white shadow-md'
                               : 'bg-white border border-gray-200 text-void hover:border-teal hover:text-teal'
                           }`}
                         >
                           {i + 1}
                         </button>
                       ))}
                     </div>

                     <button 
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages}
                       className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-void hover:border-teal hover:text-teal hover:bg-ice disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                       aria-label="Next Page"
                     >
                       <ChevronRight size={18} />
                     </button>
                   </div>
                 )}
               </>
            )}

          </div>

          {/* Sidebar (1/3) */}
          <div className="hidden lg:block lg:w-[33.333%] relative">
             <div className="sticky top-[120px] flex flex-col gap-8">
                
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-[20px] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search stories..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-[56px] pr-[20px] py-[18px] border border-gray-200 bg-white shadow-sm text-void font-body text-[15px] focus:border-teal focus:ring-4 focus:ring-teal/10 focus:shadow-[0_0_0_3px_rgba(40,80,86,0.08)] transition-all outline-none"
                  />
                </div>

                {/* Categories Filter */}
                <div className="bg-white border border-gray-100 p-[32px] shadow-sm">
                   <h4 className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-void/70 mb-[24px]">
                     Topics
                   </h4>
                   <ul className="flex flex-col gap-1.5">
                     {CATEGORIES.map(cat => {
                       const count = cat === 'All' ? initialBlogs.length : initialBlogs.filter(b => b.category === cat).length;
                       const isActive = activeCategory === cat;
                       return (
                         <li key={cat}>
                           <button
                             onClick={() => handleCategoryChange(cat)}
                             className={`w-full flex items-center justify-between px-[16px] py-[12px] transition-all duration-200 group ${isActive ? 'bg-ice text-teal border-l-[3px] border-teal' : 'hover:bg-gray-50 hover:scale-[1.01] border-l-[3px] border-transparent'}`}
                           >
                             <span className={`font-body text-[15px] transition-colors ${isActive ? 'font-semibold' : 'text-gray-600 group-hover:text-void'}`}>
                               {cat}
                             </span>
                             <span className={`font-display font-semibold text-[11px] px-[10px] py-[3px] transition-colors ${isActive ? 'bg-teal/10 text-teal' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                               {count}
                             </span>
                           </button>
                         </li>
                       );
                     })}
                   </ul>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-void p-[36px] relative overflow-hidden shadow-xl">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-teal/30 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                   <div className="grain absolute inset-0 pointer-events-none opacity-50" />
                   
                   <div className="relative z-10">
                     <h4 className="font-display font-bold text-[22px] text-white leading-tight">Travel Inspiration <br />in your inbox</h4>
                     <p className="font-body text-[14px] text-white/70 mt-[12px] mb-[28px] leading-relaxed">
                       Get destination guides, practical tips, and our latest honest travel stories. No spam.
                     </p>
                     <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                       <input 
                         type="email" 
                         placeholder="Your email address" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-white/10 border border-white/20 text-white font-body text-[15px] px-[20px] py-[16px] focus:border-cyan focus:bg-white/15 focus:ring-0 transition-all outline-none placeholder:text-white/40"
                       />
                       <button 
                         type="submit" 
                         disabled={isSubscribing}
                         className="btn-lime w-full disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                         {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                         {!isSubscribing && <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />}
                       </button>
                     </form>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

    </>
  );
}
