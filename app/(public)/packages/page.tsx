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
    <main className="flex flex-col min-h-screen bg-ice/30">
      {/* Hero Section */}
      <section className="relative w-full h-[460px] flex items-center justify-center overflow-hidden bg-void">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-void/70 z-10" />
        
        {/* BG Image */}
        <Image
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600"
          alt="India Landscape"
          fill
          priority
          className="object-cover z-0 opacity-80"
        />

        {/* Grain overlay for texture */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-30 text-center flex flex-col items-center px-6 w-full max-w-[800px] mt-12">
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="w-6 h-[1.5px] bg-lime" />
            <span className="font-display text-[11px] font-bold tracking-[0.22em] uppercase text-lime">
              OUR JOURNEYS
            </span>
            <div className="w-6 h-[1.5px] bg-lime" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white font-extrabold leading-[1.1] mb-6 tracking-tight" style={{ textWrap: 'balance' }}>
            Curated trips across India
          </h1>
          <p className="font-body text-white/70 text-base md:text-lg leading-relaxed max-w-[540px] text-center">
            From culinary trails to spiritual paths — experience the sub-continent through deeply intentional travel.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative z-40">
        <div className="container mx-auto px-6 max-w-6xl">
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
      <section className="min-h-[500px] py-20 lg:py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="mb-10 flex items-center gap-3 justify-center md:justify-start">
            <span className="block w-6 h-[1.5px] bg-teal/30" aria-hidden="true" />
            <span className="font-display text-xs text-teal font-bold tracking-[0.15em] uppercase">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Journey' : 'Journeys'} found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPackages.length > 0 ? (
                <motion.div
                  key={`package-grid-${filters.category}-${filters.duration}-${filters.priceRange[0]}-${filters.priceRange[1]}`}
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
                  initial={shouldReduceMotion ? undefined : 'hidden'}
                  animate={shouldReduceMotion ? undefined : 'visible'}
                >
                  {filteredPackages.map(pkg => (
                    <motion.div
                      layout
                      key={pkg.id}
                      variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                      className="h-full"
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
                  className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[24px] border border-medium/10 shadow-[0_8px_32px_rgba(40,80,86,0.06)] mt-8 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal/5 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-lime/5 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="relative mb-6 z-10">
                    <div className="absolute inset-0 bg-lime/20 blur-2xl rounded-full" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-ice to-white border border-white flex items-center justify-center shadow-md">
                      <span className="text-2xl">🏕️</span>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-void mb-3 text-center relative z-10">No journeys found</h3>
                  <p className="font-body text-void/60 mb-8 text-center max-w-[380px] text-sm relative z-10 leading-relaxed">
                    We couldn&apos;t find any journeys matching your current filters. Try adjusting categories or pricing range.
                  </p>
                  <button 
                    onClick={() => { setFilters({ category: 'All', duration: 'Any', priceRange: [0, DEFAULT_MAX_PRICE] }); }}
                    className="relative z-10 px-8 py-3.5 bg-teal text-white font-display font-bold tracking-widest uppercase text-[11px] rounded-full hover:bg-teal/90 transition-all duration-300 shadow-[0_8px_24px_rgba(40,80,86,0.2)] hover:-translate-y-0.5 active:scale-98"
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
