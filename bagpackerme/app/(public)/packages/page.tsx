'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { getPublishedPackages } from '@/lib/firestore';
import { Package } from '@/types';
import PackageCard, { PackageCardSkeleton } from '@/components/home/PackageCard';
import { CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';

const CATEGORIES = ['All', 'Culinary', 'Spiritual', 'Adventure', 'Heritage', 'Hippy Trail', 'Corporate Retreat'];

const DURATIONS = [
  { label: 'Any', value: 'Any' },
  { label: 'Short (1–7 days)', value: 'Short', min: 1, max: 7 },
  { label: 'Medium (7–14 days)', value: 'Medium', min: 8, max: 13 },
  { label: 'Long (14+ days)', value: 'Long', min: 14, max: 999 }
];

const parseDurationDays = (durationStr: string): number => {
  if (!durationStr) return 0;
  if (durationStr.toLowerCase().includes('half')) return 0.5;
  const match = durationStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDuration, setActiveDuration] = useState('Any');
  const shouldReduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.05 });

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

    return result;
  }, [packages, activeCategory, activeDuration]);

  const handleSeed = async () => {
    const res = await fetch('/api/seed-packages');
    const data = await res.json();
    if (data.success) {
      alert(`Seeded ${data.seeded} packages! Refreshing...`);
      window.location.reload();
    } else {
      alert("Error seeding: " + data.error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#0B1517]/80 z-10" />
        
        {/* BG Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600" 
          alt="India Landscape" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Hero Content */}
        <div className="relative z-30 text-center flex flex-col items-center px-[24px] w-full max-w-[800px]">
          {/* Temporary Seed Button for testing */}
          {packages.length === 0 && !loading && (
             <button onClick={handleSeed} className="btn-teal absolute -top-16 right-4 sm:right-6">Auto-Seed Database</button>
          )}

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

      {/* Filter Bar (Sticky) */}
      <div className="sticky top-[80px] lg:top-[100px] z-40 bg-[rgba(255,255,255,0.9)] backdrop-blur-md shadow-sm border-b border-[rgba(34,30,42,0.08)] py-[16px]">
        <div className="container mx-auto px-[24px] flex flex-col md:flex-row gap-[16px] md:items-center max-w-[1400px]">
          
          <div className="flex items-center w-full md:w-auto">
            <span className="text-[11px] text-[#718096] uppercase tracking-[0.06em] font-semibold font-body mr-[16px] whitespace-nowrap">Category</span>
            <div className="flex overflow-x-auto no-scrollbar gap-[8px] pb-[8px] md:pb-0 w-full snap-x">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-[16px] py-[8px] rounded-none whitespace-nowrap font-body text-[13px] font-medium transition-colors snap-center border ${
                      isActive ? 'text-[#221E2A] border-[#C1EA00] bg-[#C1EA00]' : 'text-[#718096] border-[rgba(34,30,42,0.08)] bg-[#FFFFFF] hover:bg-[#F7F9FA]'
                    }`}
                  >
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block w-px h-[32px] bg-[rgba(34,30,42,0.08)] mx-[8px]" />

          <div className="flex items-center w-full md:w-auto">
            <span className="text-[11px] text-[#718096] uppercase tracking-[0.06em] font-semibold font-body mr-[16px] whitespace-nowrap">Duration</span>
            <div className="flex overflow-x-auto no-scrollbar gap-[8px] pb-[8px] md:pb-0 w-full snap-x">
              {DURATIONS.map(dur => {
                const isActive = activeDuration === dur.value;
                return (
                  <button
                    key={dur.value}
                    onClick={() => setActiveDuration(dur.value)}
                    className={`relative px-[16px] py-[8px] rounded-none whitespace-nowrap font-body text-[13px] font-medium transition-colors snap-center border ${
                      isActive ? 'text-[#221E2A] border-[#C1EA00] bg-[#C1EA00]' : 'text-[#718096] border-[rgba(34,30,42,0.08)] bg-[#FFFFFF] hover:bg-[#F7F9FA]'
                    }`}
                  >
                    <span className="relative z-10">{dur.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

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
                  ref={gridRef}
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]"
                  variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
                  initial={shouldReduceMotion ? undefined : 'hidden'}
                  animate={gridInView ? 'visible' : 'hidden'}
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
                      onClick={() => { setActiveCategory('All'); setActiveDuration('Any'); }}
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
