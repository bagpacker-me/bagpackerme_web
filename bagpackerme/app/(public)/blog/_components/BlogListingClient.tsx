'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '@/types';
import Link from 'next/link';
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

  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  // In the active category 'All' without search, first post is featured. Rest are grid.
  const isDefaultView = activeCategory === 'All' && !searchQuery;
  const gridPosts = isDefaultView ? filteredBlogs.slice(1) : filteredBlogs;

  const currentGridPosts = gridPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);

  // For Popular Posts (just take a random/different slice or latest 4)
  const popularPosts = initialBlogs.slice(0, 4);

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
        <section className="w-full bg-[#FFFFFF] py-[clamp(64px,8vw,96px)] px-mobile md:px-desktop">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-[48px] items-center">
              {/* Left (60%) */}
              <div className="w-full lg:w-[60%] relative group overflow-hidden cursor-crosshair">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="absolute top-[16px] left-[16px] z-10 bg-[#0ED2E9] text-[#221E2A] px-[12px] py-[4px] font-display text-[11px] font-bold uppercase tracking-widest leading-none">
                    {featuredPost.category}
                  </div>
                  <div className="aspect-[16/9] lg:aspect-[3/2] relative w-full overflow-hidden">
                    <img
                      src={featuredPost.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-[1.06]"
                    />
                  </div>
                </Link>
              </div>

              {/* Right (40%) */}
              <div className="w-full lg:w-[40%] flex flex-col items-start">
                <span className="font-display text-[11px] font-bold tracking-widest text-[#0ED2E9] uppercase mb-[12px]">
                  {featuredPost.category}
                </span>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="font-display text-[clamp(2rem,3vw,2.5rem)] text-[#221E2A] font-bold leading-[1.15] mb-[16px] hover:text-[#0ED2E9] transition-colors duration-300 [text-wrap:balance]">
                    {featuredPost.title}
                  </h2>
                </Link>
                <blockquote className="pull-quote my-[24px]">
                  Travel is the only thing you buy that makes you richer.
                </blockquote>
                <p className="font-body text-[16px] text-[#4a5568] leading-[1.75] max-w-[68ch] mb-[28px] line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="meta-row mb-[32px]">
                  <span className="meta-item font-bold text-[#221E2A]">{featuredPost.author || 'BagPackerMe'}</span>
                  <span className="meta-sep" aria-hidden="true">·</span>
                  <span className="meta-item">{formatDate(featuredPost.publishDate)}</span>
                  {featuredPost.readTimeMinutes && (
                    <>
                      <span className="meta-sep" aria-hidden="true">·</span>
                      <span className="meta-item">{featuredPost.readTimeMinutes} min read</span>
                    </>
                  )}
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <button className="bg-[#285056] text-[#FFFFFF] font-display font-bold text-[13px] uppercase tracking-widest px-[32px] py-[16px] transition-colors duration-300 hover:bg-[#1a363b]">
                    Read Full Story
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN GRID + SIDEBAR */}
      <section className="w-full bg-[#F7F9FA] py-mobile md:py-desktop px-mobile md:px-desktop">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-[48px]">
          
          {/* Main Content (2/3) */}
          <div className="w-full lg:w-[66.666%]">
            
            {gridPosts.length === 0 ? (
               <div className="text-center py-24 bg-white border border-[rgba(34,30,42,0.08)]">
                  <h3 className="font-display font-bold text-2xl text-[#221E2A] mb-2">No Stories Found</h3>
                  <p className="font-body text-[#4a5568]">Try adjusting your filters or search query.</p>
               </div>
            ) : (
               <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] mb-[64px]">
                   {currentGridPosts.map(post => (
                     <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white border border-[rgba(34,30,42,0.08)] hover:border-[rgba(34,30,42,0.15)] transition-colors duration-300">
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          <img 
                            src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-[1.06]"
                          />
                          <div className="absolute top-[16px] left-[16px] z-10 bg-lime text-[#221E2A] px-[12px] py-[4px] font-display text-[11px] font-bold uppercase tracking-widest leading-none">
                            {post.category}
                          </div>
                        </div>
                        <div className="p-[24px] flex flex-col flex-grow">
                            <div className="meta-row mb-[12px]">
                              <span className="meta-item">{formatDate(post.publishDate)}</span>
                           </div>
                           <h3 className="font-display font-bold text-[20px] text-[#221E2A] mb-[12px] leading-[1.2] group-hover:text-[#285056] transition-colors duration-300 line-clamp-2">
                             {post.title}
                           </h3>
                           <p className="font-body text-[15px] text-[#4a5568] leading-[1.75] line-clamp-3">
                             {post.excerpt}
                           </p>
                        </div>
                     </Link>
                   ))}
                 </div>

                 {/* Pagination */}
                 {totalPages > 1 && (
                   <div className="flex items-center justify-center gap-[8px] mt-[48px]">
                     <button 
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="font-display font-bold text-[13px] border border-[rgba(34,30,42,0.12)] bg-transparent text-[#4a5568] hover:border-[#285056] hover:text-[#285056] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-[16px] py-[10px] rounded-none flex items-center gap-[8px]"
                     >
                       <ChevronLeft size={16} /> Prev
                     </button>
                     
                     <div className="flex items-center gap-[4px] mx-[8px]">
                       {Array.from({ length: totalPages }).map((_, i) => (
                         <button
                           key={i}
                           onClick={() => setCurrentPage(i + 1)}
                           className={`font-display font-bold text-[13px] px-[16px] py-[10px] rounded-none border transition-colors ${
                             currentPage === i + 1
                               ? 'bg-[#285056] border-[#285056] text-white'
                               : 'bg-transparent border-[rgba(34,30,42,0.12)] text-[#4a5568] hover:border-[#285056] hover:text-[#285056]'
                           }`}
                         >
                           {i + 1}
                         </button>
                       ))}
                     </div>

                     <button 
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages}
                       className="font-display font-bold text-[13px] border border-[rgba(34,30,42,0.12)] bg-transparent text-[#4a5568] hover:border-[#285056] hover:text-[#285056] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-[16px] py-[10px] rounded-none flex items-center gap-[8px]"
                     >
                       Next <ChevronRight size={16} />
                     </button>
                   </div>
                 )}
               </>
            )}

          </div>

          {/* Sidebar (1/3) */}
          <div className="hidden lg:block lg:w-[33.333%] relative">
             <div className="sticky top-[144px]">
                
                {/* Search */}
                <div className="relative mb-[32px]">
                  <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#4a5568]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search stories..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-[48px] pr-[16px] py-[16px] rounded-none border border-[rgba(34,30,42,0.15)] bg-white text-[#221E2A] font-body text-[14px] focus:border-[#285056] focus:ring-0 transition-colors"
                  />
                </div>

                {/* Categories Filter */}
                <div className="mb-[32px]">
                   <h4 className="font-display text-[12px] font-bold tracking-widest uppercase text-[#221E2A] mb-[16px] pb-[12px] border-b border-[rgba(34,30,42,0.1)]">
                     Categories
                   </h4>
                   <ul className="flex flex-col">
                     {CATEGORIES.map(cat => {
                       const count = cat === 'All' ? initialBlogs.length : initialBlogs.filter(b => b.category === cat).length;
                       const isActive = activeCategory === cat;
                       return (
                         <li key={cat}>
                           <button
                             onClick={() => handleCategoryChange(cat)}
                             className={`w-full flex items-center justify-between py-[10px] border-b border-[rgba(34,30,42,0.06)] group`}
                           >
                             <span className={`font-body text-[14px] transition-colors ${isActive ? 'text-[#285056] font-bold' : 'text-[#4a5568] group-hover:text-[#285056]'}`}>
                               {cat}
                             </span>
                             <span className="font-body text-[12px] text-teal bg-[rgba(40,80,86,0.08)] px-[8px] py-[1px]">
                               {count}
                             </span>
                           </button>
                         </li>
                       );
                     })}
                   </ul>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-[#221E2A] p-[32px] rounded-none mb-[32px]">
                   <h4 className="font-display font-bold text-[18px] text-white">Join Our Newsletter</h4>
                   <p className="font-body text-[13px] text-[rgba(255,255,255,0.65)] mt-[8px] mb-[20px]">
                     Get destination guides, tips, and inspiration delivered.
                   </p>
                   <form onSubmit={handleSubscribe}>
                     <input 
                       type="email" 
                       placeholder="Your email address" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white font-body text-[14px] px-[16px] py-[12px] rounded-none focus:border-[#0ED2E9] focus:ring-0 transition-colors placeholder:text-[rgba(255,255,255,0.4)]"
                     />
                     <button 
                       type="submit" 
                       disabled={isSubscribing}
                       className="w-full mt-[12px] bg-lime text-[#221E2A] font-display font-bold text-[12px] uppercase tracking-widest px-[28px] py-[12px] rounded-none hover:bg-white transition-colors"
                     >
                       {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                     </button>
                   </form>
                </div>

                {/* Popular Posts */}
                <div>
                   <h4 className="font-display text-[12px] font-bold tracking-widest uppercase text-[#221E2A] mb-[16px]">
                     Popular Posts
                   </h4>
                   <div className="flex flex-col">
                     {popularPosts.map((post, idx) => (
                       <Link href={`/blog/${post.slug}`} key={post.id} className={`flex items-start gap-[12px] py-[12px] group ${idx !== popularPosts.length - 1 ? 'border-b border-[rgba(34,30,42,0.06)]' : ''}`}>
                         <img 
                           src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'}
                           alt={post.title}
                           className="w-[48px] h-[48px] object-cover shrink-0"
                         />
                         <div>
                           <h5 className="font-body font-medium text-[13px] text-[#221E2A] line-clamp-2 leading-[1.3] group-hover:text-[#285056] transition-colors">
                             {post.title}
                           </h5>
                           <div className="font-body text-[11px] text-[#718096] mt-[4px]">
                             {formatDate(post.publishDate)}
                           </div>
                         </div>
                       </Link>
                     ))}
                   </div>
                </div>

             </div>
          </div>

        </div>
      </section>

    </>
  );
}
