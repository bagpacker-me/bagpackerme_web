'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { scheduleIdleTask } from '@/lib/browser-idle';
import { getPackagePrimaryPrice, hasPackagePrice } from '@/lib/packagePricing';
import { STATIC_GLOBAL_PACKAGE_SUMMARIES } from '@/lib/static-global-package-summaries';
import { Package, PackageMarket, PACKAGE_CATEGORIES } from '@/types';
import PackageCard, { PackageCardSkeleton } from '@/components/home/PackageCard';
import { CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';
import { PremiumFilter, type PremiumFilterState } from '@/components/packages/PremiumFilter';

const DURATIONS = [
  { label: 'Any', value: 'Any' },
  { label: 'Short (1-7 days)', value: 'Short', min: 1, max: 7 },
  { label: 'Medium (7-14 days)', value: 'Medium', min: 8, max: 13 },
  { label: 'Long (14+ days)', value: 'Long', min: 14, max: 999 },
];

const MARKET_PRICE_CONFIG = {
  global: {
    max: 6000,
    step: 100,
    currency: 'USD' as const,
  },
  india: {
    max: 200000,
    step: 5000,
    currency: 'INR' as const,
  },
};

const parseDurationDays = (durationStr: string): number => {
  if (!durationStr) return 0;
  if (durationStr.toLowerCase().includes('half')) return 0.5;
  const matches = durationStr.match(/\d+/g);
  if (matches) {
    const numbers = matches.map((n) => parseInt(n, 10));
    return Math.max(...numbers);
  }
  return 0;
};

interface PackagesListingPageProps {
  market: PackageMarket;
  title: string;
  description: string;
  eyebrow?: string;
  heroImage: string;
  heroAlt: string;
}

export default function PackagesListingPage({
  market,
  title,
  description,
  eyebrow = 'Our Journeys',
  heroImage,
  heroAlt,
}: PackagesListingPageProps) {
  const priceConfig = MARKET_PRICE_CONFIG[market];
  const [packages, setPackages] = useState<Package[]>(
    market === 'global' ? STATIC_GLOBAL_PACKAGE_SUMMARIES : []
  );
  const [loading, setLoading] = useState(market !== 'global');
  const [hasError, setHasError] = useState(false);
  const [filters, setFilters] = useState<PremiumFilterState>({
    category: 'All',
    duration: 'Any',
    priceRange: [0, priceConfig.max],
  });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setFilters({ category: 'All', duration: 'Any', priceRange: [0, priceConfig.max] });
  }, [market, priceConfig.max]);

  useEffect(() => {
    let mounted = true;

    setPackages(market === 'global' ? STATIC_GLOBAL_PACKAGE_SUMMARIES : []);
    setLoading(market !== 'global');
    setHasError(false);

    const cancel = scheduleIdleTask(async () => {
      try {
        const { getPublishedPackagesForMarket } = await import('@/lib/firestore');
        const pkgs = await getPublishedPackagesForMarket(market);
        if (mounted) setPackages(pkgs);
      } catch (error) {
        console.error('Failed to load packages:', error);
        if (mounted) setHasError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }, market === 'global' ? 2000 : 500);

    return () => {
      mounted = false;
      cancel();
    };
  }, [market]);

  const categories = useMemo(() => {
    const available = new Set(packages.map((pkg) => pkg.category).filter(Boolean));
    const ordered = PACKAGE_CATEGORIES.filter((category) => available.has(category));
    return ['All', ...ordered];
  }, [packages]);

  const filteredPackages = useMemo(() => {
    let result = packages;

    if (filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.duration !== 'Any') {
      result = result.filter((p) => {
        const days = parseDurationDays(p.duration);
        if (filters.duration === 'Medium') return days > 7 && days < 14;
        if (filters.duration === 'Short') return days >= 1 && days <= 7;
        if (filters.duration === 'Long') return days >= 14;
        return true;
      });
    }

    const usingDefaultPriceRange =
      filters.priceRange[0] === 0 && filters.priceRange[1] === priceConfig.max;

    result = result.filter((p) => {
      const primary = getPackagePrimaryPrice(p, market);
      const amount = primary.amount;

      // The slider is denominated in priceConfig.currency (USD for global, INR
      // for india). A package priced in the *other* currency — e.g. a global
      // package with only an INR price — has no comparable amount here, and we
      // have no FX table to convert it. Comparing an INR figure against a USD
      // range would silently hide it at every slider position, so treat it like
      // an on-request price: visible at the default range, filtered out only
      // once the visitor actively narrows the range.
      if (!hasPackagePrice(amount) || primary.currency !== priceConfig.currency) {
        return usingDefaultPriceRange;
      }

      return amount >= filters.priceRange[0] && amount <= filters.priceRange[1];
    });

    return result;
  }, [packages, filters, market, priceConfig.max, priceConfig.currency]);

  return (
    <main className="flex min-h-screen flex-col bg-ice/30">
      <section className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-void">
        <div className="absolute inset-0 z-10 bg-void/70" />

        <Image
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          className="z-0 object-cover opacity-80"
        />

        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className="relative z-30 mt-12 flex w-full max-w-[800px] flex-col items-center px-6 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-[1.5px] w-6 bg-lime" />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              {eyebrow}
            </span>
            <div className="h-[1.5px] w-6 bg-lime" />
          </div>
          <h1 className="mb-6 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="max-w-[560px] text-center font-body text-base leading-relaxed text-white/70 md:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="relative z-40">
        <div className="container mx-auto max-w-6xl px-6">
          <PremiumFilter
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            durations={DURATIONS}
            maxPrice={priceConfig.max}
            priceStep={priceConfig.step}
            currency={priceConfig.currency}
          />
        </div>
      </section>

      <section className="min-h-[500px] py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-center justify-center gap-3 md:justify-start">
            <span className="block h-[1.5px] w-6 bg-teal/30" aria-hidden="true" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-teal">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Journey' : 'Journeys'} found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPackages.length > 0 ? (
                <motion.div
                  key={`package-grid-${market}-${filters.category}-${filters.duration}-${filters.priceRange[0]}-${filters.priceRange[1]}`}
                  layout
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
                  initial={shouldReduceMotion ? undefined : 'hidden'}
                  animate={shouldReduceMotion ? undefined : 'visible'}
                >
                  {filteredPackages.map((pkg) => (
                    <motion.div
                      layout
                      key={pkg.id}
                      variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                      className="h-full"
                    >
                      <PackageCard pkg={pkg} market={market} />
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
                  className="relative mt-8 flex flex-col items-center justify-center overflow-hidden rounded-[24px] border border-medium/10 bg-white px-6 py-24 shadow-[0_8px_32px_rgba(40,80,86,0.06)]"
                >
                  <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-teal/5 blur-[80px]" />
                  <div className="absolute bottom-0 left-0 h-[200px] w-[200px] rounded-full bg-lime/5 blur-[60px]" />

                  {hasError && packages.length === 0 ? (
                    <>
                      <h3 className="relative z-10 mb-3 text-center font-display text-2xl font-bold text-void">
                        We couldn’t load journeys
                      </h3>
                      <p className="relative z-10 mb-8 max-w-[380px] text-center font-body text-sm leading-relaxed text-void/60">
                        Something went wrong on our end — this isn’t an empty catalogue. Please refresh, or tell us where you’d like to go and we’ll plan it with you.
                      </p>
                      <a
                        href="/contact?intent=trip"
                        className="relative z-10 rounded-full bg-teal px-8 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(40,80,86,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal/90 active:scale-[0.98]"
                      >
                        Start planning
                      </a>
                    </>
                  ) : (
                    <>
                      <h3 className="relative z-10 mb-3 text-center font-display text-2xl font-bold text-void">
                        No journeys found
                      </h3>
                      <p className="relative z-10 mb-8 max-w-[380px] text-center font-body text-sm leading-relaxed text-void/60">
                        We could not find journeys matching your current filters. Try another category, duration, or price range.
                      </p>
                      <button
                        onClick={() => setFilters({ category: 'All', duration: 'Any', priceRange: [0, priceConfig.max] })}
                        className="relative z-10 rounded-full bg-teal px-8 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(40,80,86,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal/90 active:scale-[0.98]"
                      >
                        Reset Filters
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </main>
  );
}
