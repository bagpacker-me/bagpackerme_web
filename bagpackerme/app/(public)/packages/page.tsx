'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublishedPackages } from '@/lib/firestore';
import { Package } from '@/types';
import PackageCard, { PackageCardSkeleton } from '@/components/home/PackageCard';

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
        <div className="absolute inset-0 bg-[#0F172A]/80 z-10 mix-blend-multiply" />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-15 z-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/images/noise.png")', backgroundRepeat: 'repeat' }} />
        
        {/* BG Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600" 
          alt="India Landscape" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Hero Content */}
        <div className="relative z-30 text-center flex flex-col items-center px-4 w-full">
          {/* Temporary Seed Button for testing */}
          {packages.length === 0 && !loading && (
             <button onClick={handleSeed} className="absolute -top-16 right-4 btn-lime text-xs px-2 py-1">Auto-Seed Database</button>
          )}

          <div className="section-label justify-center text-white/90 border-white/30 before:bg-white/50 mb-4">
            ✦ OUR JOURNEYS
          </div>
          <h1 className="font-display text-5xl md:text-[72px] text-white font-bold leading-tight mb-6">
            Curated Trips Across India
          </h1>
          <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl text-center">
            From culinary trails to corporate retreats — every journey is deeply intentional.
          </p>
        </div>
      </section>

      {/* Filter Bar (Sticky) */}
      <div className="sticky top-[80px] lg:top-[100px] z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 md:items-center">
          
          <div className="flex items-center w-full md:w-auto">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-display mr-4 whitespace-nowrap">Category</span>
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0 w-full snap-x">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 py-2 rounded-full whitespace-nowrap font-display text-[12px] tracking-wider transition-colors snap-center ${
                      isActive ? 'text-white' : 'text-gray-600 bg-[#F3F4F6] hover:bg-gray-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 bg-[#285056] rounded-full z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />

          <div className="flex items-center w-full md:w-auto">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-display mr-4 whitespace-nowrap">Duration</span>
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0 w-full snap-x">
              {DURATIONS.map(dur => {
                const isActive = activeDuration === dur.value;
                return (
                  <button
                    key={dur.value}
                    onClick={() => setActiveDuration(dur.value)}
                    className={`relative px-4 py-2 rounded-full whitespace-nowrap font-display text-[12px] tracking-wider transition-colors snap-center ${
                      isActive ? 'text-white' : 'text-gray-600 bg-[#F3F4F6] hover:bg-gray-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeDurationIndicator"
                        className="absolute inset-0 bg-[#285056] rounded-full z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{dur.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Packages Grid */}
      <section className="bg-white min-h-[500px]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div className="container mx-auto px-4 w-full">
          
          <div className="mb-8">
            <span className="font-body text-[14px] text-gray-500 font-medium tracking-wide">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Journey' : 'Journeys'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div layout className="min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {filteredPackages.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map(pkg => (
                      <motion.div 
                        layout 
                        key={pkg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
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
                    className="flex flex-col items-center justify-center py-24 px-4 bg-white border border-gray-100 mt-8 rounded-sm"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl opacity-50">🌍</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2 text-center">No packages found</h3>
                    <p className="font-body text-gray-500 mb-6 text-center max-w-md">
                      We couldn&apos;t find any packages matching your current filters. 
                      Try adjusting the category or duration.
                    </p>
                    <button 
                      onClick={() => { setActiveCategory('All'); setActiveDuration('Any'); }}
                      className="font-display text-[#285056] border-b border-[#285056] pb-1 uppercase tracking-widest text-xs font-bold hover:text-[#c4a962] hover:border-[#c4a962] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>
    </main>
  );
}
