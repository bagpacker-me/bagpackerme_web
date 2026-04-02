'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, Clock, Wallet, FilterX } from 'lucide-react';
import { getPublishedPackages } from '@/lib/firestore';
import { Package } from '@/types';
import PackageCard, { PackageCardSkeleton } from '@/components/home/PackageCard';
import { CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';

const CATEGORIES = ['All', 'Culinary', 'Spiritual', 'Adventure', 'Heritage', 'Hippy Trail'];

const DURATIONS = [
  { label: 'Any', value: 'Any' },
  { label: 'Short (1–7 days)', value: 'Short', min: 1, max: 7 },
  { label: 'Medium (7–14 days)', value: 'Medium', min: 8, max: 13 },
  { label: 'Long (14+ days)', value: 'Long', min: 14, max: 999 }
];

const PRICES = [
  { label: 'Any', value: 'Any' },
  { label: 'Budget (< ₹50k)', value: 'Budget', max: 50000 },
  { label: 'Mid (₹50k-100k)', value: 'Mid', min: 50000, max: 100000 },
  { label: 'Luxury (> ₹100k)', value: 'Luxury', min: 100000 }
];

const parseDurationDays = (durationStr: string): number => {
  if (!durationStr) return 0;
  if (durationStr.toLowerCase().includes('half')) return 0.5;
  const matches = durationStr.match(/\d+/g);
  if (matches) {
    const numbers = matches.map(n => parseInt(n, 10));
    return Math.max(...numbers);
  }
  return 0;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDuration, setActiveDuration] = useState('Any');
  const [activePrice, setActivePrice] = useState('Any');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchPackages() {
      try {
        const snap = await getPublishedPackages();
        const pkgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        
        // Sort: created at descending
        pkgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPackages(pkgs);
      } catch (error) {
        console.error("Failed to load packages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    let result = packages;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (activeDuration !== 'Any') {
      const dOpt = DURATIONS.find(d => d.value === activeDuration);
      if (dOpt && dOpt.min !== undefined) {
        result = result.filter(p => {
          const days = parseDurationDays(p.duration);
          if (activeDuration === 'Medium') {
            return days > 7 && days < 14; 
          }
          if (activeDuration === 'Short') {
            return days >= 1 && days <= 7;
          }
          if (activeDuration === 'Long') {
            return days >= 14;
          }
          return true;
        });
      }
    }

    if (activePrice !== 'Any') {
      const pOpt = PRICES.find(p => p.value === activePrice);
      if (pOpt) {
        result = result.filter(p => {
          if (pOpt.min && p.priceInr < pOpt.min) return false;
          if (pOpt.max && p.priceInr > pOpt.max) return false;
          return true;
        });
      }
    }

    return result;
  }, [packages, activeCategory, activeDuration, activePrice]);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#0B1517]/80 z-10" />
        
        {/* BG Image */}
        <Image
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600"
          alt="India Landscape"
          fill
          priority
          className="object-cover z-0"
        />

        {/* Hero Content */}
        <div className="relative z-30 text-center flex flex-col items-center px-[24px] w-full max-w-[800px]">

          <div className="section-label mb-[24px]">
            OUR JOURNEYS
          </div>
          <h1 className="font-display text-[40px] md:text-[64px] text-[#FFFFFF] font-bold leading-[1.1] mb-[24px]" style={{ textWrap: 'balance', letterSpacing: '-0.02em' }}>
            Curated Trips Across India
          </h1>
          <p className="font-body text-[#FFFFFF]/80 text-[16px] md:text-[18px] leading-relaxed max-w-[600px] text-center">
            From culinary trails to corporate retreats — every journey is deeply intentional.
          </p>
        </div>
      </section>

      {/* Filter Section - Premium Floating Card Style */}
      <section className="relative z-40 bg-[#F7F9FA]">
        {/* Decorative top shape to bridge background */}
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[rgba(11,21,23,0.1)] to-transparent opacity-100 pointer-events-none" />
        
        <div className="container mx-auto px-[16px] md:px-[24px] max-w-[1400px]">
          {/* Glass Card Container */}
          <div className="relative -mt-[40px] md:-mt-[60px] bg-white/95 backdrop-blur-2xl rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_-15px_rgba(34,30,42,0.1)] border border-[rgba(255,255,255,0.5)] p-[24px] md:p-[32px] flex flex-col xl:flex-row gap-[32px] xl:gap-[40px] justify-between">
            
            {/* Category Filter */}
            <div className="flex-1 flex flex-col gap-[16px]">
              <div className="flex items-center gap-[8px] text-[#285056]">
                <div className="w-[32px] h-[32px] rounded-full bg-[#E9F5F7] flex items-center justify-center">
                  <Compass className="w-[16px] h-[16px] text-[#285056]" />
                </div>
                <span className="text-[13px] uppercase tracking-[0.1em] font-bold font-display">Category</span>
              </div>
              <div className="flex flex-wrap gap-[8px] md:gap-[12px]">
                {CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative px-[20px] py-[10px] rounded-full whitespace-nowrap font-body text-[14px] md:text-[15px] font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#C1EA00] ${
                        isActive 
                          ? 'text-white' 
                          : 'bg-[#F7F9FA] text-[#718096] hover:bg-[#E9F5F7] hover:text-[#285056] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="category-active"
                          className="absolute inset-0 bg-[#285056] rounded-full shadow-md z-0"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="hidden xl:block w-[1px] bg-[rgba(34,30,42,0.06)] self-stretch" />

            {/* Duration Filter */}
            <div className="flex-1 flex flex-col gap-[16px]">
              <div className="flex items-center gap-[8px] text-[#285056]">
                <div className="w-[32px] h-[32px] rounded-full bg-[#E9F5F7] flex items-center justify-center">
                  <Clock className="w-[16px] h-[16px] text-[#285056]" />
                </div>
                <span className="text-[13px] uppercase tracking-[0.1em] font-bold font-display">Duration</span>
              </div>
              <div className="flex flex-wrap gap-[8px] md:gap-[12px]">
                {DURATIONS.map(dur => {
                  const isActive = activeDuration === dur.value;
                  return (
                    <button
                      key={dur.value}
                      onClick={() => setActiveDuration(dur.value)}
                      className={`relative px-[20px] py-[10px] rounded-full whitespace-nowrap font-body text-[14px] md:text-[15px] font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#C1EA00] ${
                        isActive 
                          ? 'text-[#221E2A]' 
                          : 'bg-[#F7F9FA] text-[#718096] hover:bg-[#C1EA00]/20 hover:text-[#221E2A] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="duration-active"
                          className="absolute inset-0 bg-[#C1EA00] rounded-full shadow-md z-0"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{dur.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="hidden xl:block w-[1px] bg-[rgba(34,30,42,0.06)] self-stretch" />

            {/* Price Filter */}
            <div className="flex-1 flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px] text-[#285056]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#E9F5F7] flex items-center justify-center">
                    <Wallet className="w-[16px] h-[16px] text-[#285056]" />
                  </div>
                  <span className="text-[13px] uppercase tracking-[0.1em] font-bold font-display">Price</span>
                </div>
                
                {/* Clear Filters Button (If Any Active) */}
                {(activeCategory !== 'All' || activeDuration !== 'Any' || activePrice !== 'Any') && (
                  <button 
                    onClick={() => { setActiveCategory('All'); setActiveDuration('Any'); setActivePrice('Any'); }}
                    className="flex items-center gap-[6px] text-[12px] font-body text-[#718096] hover:text-[#285056] transition-colors"
                  >
                    <FilterX className="w-[14px] h-[14px]" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-[8px] md:gap-[12px]">
                {PRICES.map(price => {
                  const isActive = activePrice === price.value;
                  return (
                    <button
                      key={price.value}
                      onClick={() => setActivePrice(price.value)}
                      className={`relative px-[20px] py-[10px] rounded-full whitespace-nowrap font-body text-[14px] md:text-[15px] font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0ED2E9] ${
                        isActive 
                          ? 'text-[#221E2A]' 
                          : 'bg-[#F7F9FA] text-[#718096] hover:bg-[#0ED2E9]/10 hover:text-[#285056] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="price-active"
                          className="absolute inset-0 bg-[#0ED2E9] rounded-full shadow-md z-0"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{price.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="bg-[#F7F9FA] min-h-[500px] py-[80px] lg:py-[120px]">
        <div className="container mx-auto px-[24px] max-w-[1400px]">
          
          <div className="mb-[32px] flex items-center gap-[12px]">
            <span className="block w-[24px] h-[1px] bg-[#0ED2E9]" aria-hidden="true" />
            <span className="font-display text-[11px] text-[#0ED2E9] font-bold tracking-[0.22em] uppercase">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Journey' : 'Journeys'} Found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPackages.length > 0 ? (
                /* Spec #4: stagger 0.08 with useInView */
                <motion.div
                  key={`package-grid-${activeCategory}-${activeDuration}`}
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]"
                  variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
                  initial={shouldReduceMotion ? undefined : 'hidden'}
                  whileInView={shouldReduceMotion ? undefined : 'visible'}
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {filteredPackages.map(pkg => (
                    <motion.div
                      layout
                      key={pkg.id}
                      variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                    >
                      <PackageCard pkg={pkg} />
                    </motion.div>
                  ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-[80px] px-[24px] bg-[#FFFFFF] border border-[rgba(34,30,42,0.06)] mt-[32px]"
                  >
                    <div className="w-[64px] h-[64px] bg-[#F7F9FA] flex items-center justify-center mb-[16px]">
                      <span className="text-[24px] opacity-20">🌍</span>
                    </div>
                    <h3 className="font-display text-[20px] font-bold text-[#221E2A] mb-[8px] text-center">No packages found</h3>
                    <p className="font-body text-[#718096] mb-[24px] text-center max-w-[400px]">
                      We couldn&apos;t find any journeys matching your current filters. 
                      Try exploring other categories or duration lengths.
                    </p>
                    <button 
                      onClick={() => { setActiveCategory('All'); setActiveDuration('Any'); setActivePrice('Any'); }}
                      className="btn-primary"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
        </div>
      </section>
    </main>
  );
}
