'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '@/types';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Mail, Calendar, Clock, User } from 'lucide-react';

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
  const latestPosts = filteredBlogs.slice(1, 5);
  const remainingPosts = filteredBlogs.slice(5);

  const currentRemainingPosts = remainingPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      alert("Thanks for subscribing!");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="flex-grow lg:w-[calc(100%-340px)]">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-heading font-bold text-gray-400 mb-2">No Stories Found</h3>
              <p className="text-gray-500 font-sans">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              {/* Featured + Latest Posts block (only show on page 1 of All categories) */}
              {currentPage === 1 && activeCategory === 'All' && !searchQuery && featuredPost && (
                <div className="mb-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured Post */}
                    <Link href={`/blog/${featuredPost.slug}`} className="lg:col-span-2 group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="relative aspect-video lg:aspect-[16/9] overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 bg-brand-cyan text-[#221E2A] text-xs font-bold uppercase tracking-wider px-3 py-1 font-sans">
                          {featuredPost.category}
                        </div>
                        <img 
                          src={featuredPost.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-void mb-4 group-hover:text-brand-teal transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="font-sans text-gray-500 text-base md:text-lg mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 text-gray-400 font-sans text-xs uppercase tracking-wider">
                            <span className="flex items-center gap-1"><User size={14} /> {featuredPost.author}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(featuredPost.publishDate)}</span>
                            {featuredPost.readTimeMinutes && <span className="flex items-center gap-1"><Clock size={14} /> {featuredPost.readTimeMinutes} min</span>}
                          </div>
                          <span className="text-brand-teal text-sm font-bold uppercase tracking-wider group-hover:text-brand-void transition-colors inline-flex items-center whitespace-nowrap">
                            Read Story →
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Latest Posts */}
                    {latestPosts.length > 0 && (
                      <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-2xl text-brand-void mb-6 border-b border-gray-200 pb-4">Latest Posts</h3>
                        <div className="flex flex-col gap-6 flex-grow justify-between">
                          {latestPosts.map(post => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex gap-4 items-center">
                              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden relative">
                                <img 
                                  src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div>
                                <h4 className="font-heading font-bold text-base text-brand-void leading-tight mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <div className="text-gray-400 font-sans text-[10px] uppercase tracking-wider">
                                  {formatDate(post.publishDate)}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining Posts Header */}
              {remainingPosts.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading font-bold text-3xl text-brand-void">
                    {(currentPage === 1 && activeCategory === 'All' && !searchQuery && featuredPost) ? 'More Stories' : 'Results'}
                  </h3>
                </div>
              )}

              {/* Grid (Show remaining posts if on default view, else show all filtered posts in the grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {((currentPage === 1 && activeCategory === 'All' && !searchQuery) ? currentRemainingPosts : filteredBlogs.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)).map(blog => (
                  <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute top-4 left-4 z-10 bg-brand-cyan text-[#221E2A] text-[10px] font-bold uppercase tracking-wider px-2 py-1 font-sans">
                        {blog.category}
                      </div>
                      <img 
                        src={blog.featuredImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-3 mb-3 text-gray-400 font-sans text-[10px] uppercase tracking-wider">
                        <span>{formatDate(blog.publishDate)}</span>
                        {blog.readTimeMinutes && <span>• {blog.readTimeMinutes} MIN READ</span>}
                      </div>
                      <h3 className="font-heading font-bold text-xl leading-tight text-brand-void group-hover:text-brand-teal transition-colors mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="font-sans text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="mt-auto flex justify-end">
                        <span className="text-brand-teal p-2 rounded-full bg-teal-50 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {Math.ceil(((currentPage === 1 && activeCategory === 'All' && !searchQuery) ? remainingPosts.length : filteredBlogs.length) / POSTS_PER_PAGE) > 1 && (
                <div className="flex items-center justify-center gap-4 border-t border-gray-200 pt-8">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 pt-1 pb-1 px-4 rounded-full border border-gray-200 text-gray-500 hover:border-brand-teal hover:text-brand-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans font-bold flex items-center gap-2"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span className="font-sans text-gray-500">
                    Page <span className="font-bold text-brand-void">{currentPage}</span> of {Math.ceil(((activeCategory === 'All' && !searchQuery) ? remainingPosts.length : filteredBlogs.length) / POSTS_PER_PAGE)}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(((activeCategory === 'All' && !searchQuery) ? remainingPosts.length : filteredBlogs.length) / POSTS_PER_PAGE), p + 1))}
                    disabled={currentPage === Math.ceil(((activeCategory === 'All' && !searchQuery) ? remainingPosts.length : filteredBlogs.length) / POSTS_PER_PAGE)}
                    className="p-2 pt-1 pb-1 px-4 rounded-full border border-gray-200 text-gray-500 hover:border-brand-teal hover:text-brand-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans font-bold flex items-center gap-2"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-10">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-sans text-brand-void shadow-sm bg-white"
            />
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-xl text-brand-void mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full font-sans text-sm font-bold transition-colors ${
                    activeCategory === cat 
                      ? 'bg-brand-void text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-brand-teal p-8 rounded-2xl shadow-md text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-void/20 rounded-full blur-2xl"></div>
            
            <Mail className="mb-6 opacity-80" size={32} />
            <h3 className="font-heading font-bold text-2xl mb-2 relative z-10">Join Our Newsletter</h3>
            <p className="font-sans text-teal-50 text-sm mb-6 relative z-10">
              Get destination guides, tips, and inspiration delivered.
            </p>
            <form onSubmit={handleSubscribe} className="relative z-10">
              <input 
                type="email" 
                placeholder="Your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-t-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors mb-2 font-sans text-sm"
              />
              <button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-[#18151D] text-white font-sans font-bold py-3 px-4 rounded-b-lg hover:bg-black transition-colors disabled:opacity-70 whitespace-nowrap"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </aside>

      </div>
    </div>
  );
}
