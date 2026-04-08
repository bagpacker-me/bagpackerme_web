'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getPublishedPackages } from '@/lib/firestore';
import { hasPackagePrice } from '@/lib/packagePricing';
import { Package, PACKAGE_CATEGORIES } from '@/types';
import PackageCard, { PackageCardSkeleton } from '@/components/home/PackageCard';
import { CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';
import { PremiumFilter, type PremiumFilterState } from '@/components/packages/PremiumFilter';

const DEFAULT_MAX_PRICE = 200000;
const CATEGORIES = ['All', ...PACKAGE_CATEGORIES];

const DURATIONS = [
  { label: 'Any', value: 'Any' },
  { label: 'Short (1–7 days)', value: 'Short', min: 1, max: 7 },
  { label: 'Medium (7–14 days)', value: 'Medium', min: 8, max: 13 },
  { label: 'Long (14+ days)', value: 'Long', min: 14, max: 999 }
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
  const [filters, setFilters] = useState<PremiumFilterState>({
    category: 'All',
    duration: 'Any',
    priceRange: [0, DEFAULT_MAX_PRICE]
  });
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

    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.duration !== 'Any') {
      const dOpt = DURATIONS.find(d => d.value === filters.duration);
      if (dOpt && dOpt.min !== undefined) {
        result = result.filter(p => {
          const days = parseDurationDays(p.duration);
          if (filters.duration === 'Medium') {
            return days > 7 && days < 14; 
          }
          if (filters.duration === 'Short') {
            return days >= 1 && days <= 7;
          }
          if (filters.duration === 'Long') {
            return days >= 14;
          }
          return true;
        });
      }
    }

    const usingDefaultPriceRange = filters.priceRange[0] === 0 && filters.priceRange[1] === DEFAULT_MAX_PRICE;

    result = result.filter((p) => {
      if (!hasPackagePrice(p.priceInr)) {
        return usingDefaultPriceRange;
      }

      return p.priceInr >= filters.priceRange[0] && p.priceInr <= filters.priceRange[1];
    });

    return result;
  }, [packages, filters]);

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
          <PremiumFilter 
            filters={filters}
            setFilters={setFilters}
            categories={CATEGORIES}
            durations={DURATIONS}
            maxPrice={DEFAULT_MAX_PRICE}
          />
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
                  key={`package-grid-${filters.category}-${filters.duration}-${filters.priceRange[0]}-${filters.priceRange[1]}`}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-[100px] px-[24px] bg-white rounded-[32px] border border-void/5 shadow-card-teal-hover mt-[32px] overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal/5 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-lime/10 rounded-full blur-[60px] pointer-events-none" />
                    
                    <div className="relative mb-[24px] z-10">
                       <div className="absolute inset-0 bg-lime/30 blur-2xl rounded-full" />
                       <div className="relative w-[80px] h-[80px] rounded-full bg-gradient-to-tr from-ice to-white border border-white flex items-center justify-center shadow-lg">
                         <span className="text-[32px]">🏕️</span>
                       </div>
                    </div>
                    <h3 className="font-display text-[28px] font-bold text-void mb-[12px] text-center relative z-10">No journeys found</h3>
                    <p className="font-body text-void/60 mb-[32px] text-center max-w-[420px] text-[16px] relative z-10">
                      We couldn&apos;t find any journeys matching your current filters. 
                      Try exploring other categories or duration lengths.
                    </p>
                    <button 
                      onClick={() => { setFilters({ category: 'All', duration: 'Any', priceRange: [0, DEFAULT_MAX_PRICE] }); }}
                      className="relative z-10 px-[32px] py-[16px] bg-teal text-white font-display font-bold tracking-widest uppercase text-[12px] rounded-full hover:bg-teal/90 transition-all duration-300 shadow-[0_8px_24px_rgba(40,80,86,0.25)] hover:shadow-[0_12px_32px_rgba(40,80,86,0.4)] hover:-translate-y-1"
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
