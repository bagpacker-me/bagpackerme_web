'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

// Keep the journeys receiving a complete editorial refresh discoverable at the
// top of the unfiltered India catalogue. This is a deterministic sort of the
// server-rendered cards — not a carousel or a client-only promotion — so the
// routes remain visible and crawlable in the initial document.
const INDIA_EDITORIAL_FEATURES = [
  'soulmates-in-the-safari-sariskas-luxe-romance-experience',
  'timeless-textile-traditions-of-gujarat',
  'sacred-sands-and-spiritual-cities-a-journey-through-north-india',
  'heritage-havens-golden-triangle-with-jodhpur',
  'ahmedabad-heritage-handcraft-and-history',
  'golden-triangle-and-sacred-varanasi',
  'the-sacred-flames-of-kerala-theyyam-hills-and-coast',
  'wild-trails-and-royal-tales',
  'tales-and-trails-of-golden-triangle',
  'hornbill-festival',
  'the-royal-rath-yatra-chronicles',
] as const;

const INDIA_EDITORIAL_FEATURE_RANK = new Map<string, number>(
  INDIA_EDITORIAL_FEATURES.map((slug, index) => [slug, index])
);

const EMPTY_PACKAGES: Package[] = [];

function CatalogueEditorialContent({ market }: { market: PackageMarket }) {
  const isIndia = market === 'india';
  const heading = isIndia
    ? 'How to choose an India journey that feels like your own'
    : 'How to choose an international journey that feels like your own';
  const destinationCopy = isIndia
    ? 'India rewards a slower, more considered route. A romantic safari in Sariska, a textile trail through Gujarat, a spiritual circuit across North India, or a heritage journey to Jodhpur each asks for a different rhythm. Start with the experiences you want to have, then decide how much moving between places feels enjoyable rather than rushed.'
    : 'A great international itinerary leaves room for the reason you chose a place in the first place. That might mean a few unhurried days in a European city, time for food and neighbourhoods in Japan, a mix of coast and culture in Vietnam, or a safari paced around the natural world.';
  const planningCopy = isIndia
    ? 'Use the filters above to compare the journey themes, trip lengths, and price ranges that fit your plans. Each itinerary is a starting point: we can adjust dates, accommodation style, transport, activity level, and the balance between guided time and time to explore independently.'
    : 'Use the filters above to compare themes, trip lengths, and price ranges. Each itinerary is a starting point rather than a rigid template, so dates, stays, transport, activity level, and free time can be shaped around the people travelling.';

  return (
    <section
      aria-labelledby={`catalogue-planning-${market}`}
      className="border-t border-teal/10 bg-white py-16 lg:py-20"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-teal">
            Plan with purpose
          </span>
          <h2
            id={`catalogue-planning-${market}`}
            className="mt-3 font-display text-3xl font-bold leading-tight text-void md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-5 font-body text-base leading-relaxed text-void/70">
            {destinationCopy}
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-ice/50 p-7">
            <h3 className="font-display text-xl font-bold text-void">Start with your travel priorities</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-void/70">
              Think about who is travelling, the time of year, the pace you enjoy, and the moments you
              do not want to miss. Those choices are more useful than choosing a destination from a
              list alone, and they help shape a route that works in real life.
            </p>
          </div>
          <div className="rounded-2xl bg-ice/50 p-7">
            <h3 className="font-display text-xl font-bold text-void">Make the itinerary flexible</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-void/70">
              {planningCopy}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-3xl font-body text-sm leading-relaxed text-void/70">
          When you are ready, share the places and experiences you have in mind. We will help turn
          them into a considered travel plan with practical timings and a clear next step.
        </p>
        <Link
          href="/contact#trip"
          className="mt-7 inline-flex min-h-[44px] items-center rounded-full bg-teal px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Start planning your journey
        </Link>
      </div>
    </section>
  );
}

const MARKET_PRICE_CONFIG = {
  global: {
    // Global source prices are converted at the fixed ₹100 per US$ rate.
    // Keep this above the priciest converted price because the range filter is
    // inclusive at both ends, including its default position.
    max: 800000,
    step: 10000,
    currency: 'INR' as const,
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
  /** Server-rendered cards keep every published package crawlable before JS runs. */
  initialPackages?: Package[];
}

export default function PackagesListingPage({
  market,
  title,
  description,
  eyebrow = 'Our Journeys',
  heroImage,
  heroAlt,
  initialPackages,
}: PackagesListingPageProps) {
  const priceConfig = MARKET_PRICE_CONFIG[market];
  const seedPackages = initialPackages ?? (market === 'global' ? STATIC_GLOBAL_PACKAGE_SUMMARIES : EMPTY_PACKAGES);
  const hasServerPackages = initialPackages !== undefined;
  const [packages, setPackages] = useState<Package[]>(
    seedPackages
  );
  const [loading, setLoading] = useState(!hasServerPackages && market !== 'global');
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

    setPackages(seedPackages);
    setLoading(!hasServerPackages && market !== 'global');
    setHasError(false);

    const cancel = scheduleIdleTask(async () => {
      // REST rather than the Firebase SDK — the listing renders card fields
      // only, so it has no use for the SDK or for whole package documents.
      const { fetchPublishedPackageCards, mergePackagesBySlug } = await import(
        '@/lib/public-reads-rest'
      );
      const livePackages = await fetchPublishedPackageCards(market);
      if (!mounted) return;

      if (livePackages) {
        setPackages(
          market === 'global'
            ? mergePackagesBySlug(STATIC_GLOBAL_PACKAGE_SUMMARIES, livePackages)
            : livePackages
        );
      } else {
        setHasError(market !== 'global');
      }
      setLoading(false);
    }, market === 'global' ? 2000 : 500);

    return () => {
      mounted = false;
      cancel();
    };
  }, [hasServerPackages, market, seedPackages]);

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

      // Public package prices are normalised to INR, including global packages
      // whose stored USD source values are converted at the fixed site rate.
      // An on-request package remains visible until a visitor narrows the
      // range, rather than disappearing from the default listing.
      if (!hasPackagePrice(amount) || primary.currency !== priceConfig.currency) {
        return usingDefaultPriceRange;
      }

      return amount >= filters.priceRange[0] && amount <= filters.priceRange[1];
    });

    const showingDefaultCatalogue =
      filters.category === 'All' &&
      filters.duration === 'Any' &&
      usingDefaultPriceRange;

    if (market !== 'india' || !showingDefaultCatalogue) return result;

    return [...result].sort((a, b) => {
      const aRank = INDIA_EDITORIAL_FEATURE_RANK.get(a.slug);
      const bRank = INDIA_EDITORIAL_FEATURE_RANK.get(b.slug);
      if (aRank === undefined && bRank === undefined) return 0;
      if (aRank === undefined) return 1;
      if (bRank === undefined) return -1;
      return aRank - bRank;
    });
  }, [packages, filters, market, priceConfig.max, priceConfig.currency]);

  return (
    <main className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#e9f7f8_0%,#f8fcfc_28%,#ffffff_68%)]">
      <section className="relative flex min-h-[540px] w-full items-end overflow-hidden bg-void pb-20 pt-36 md:min-h-[600px] md:pb-28">
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(34,30,42,0.86)_0%,rgba(34,30,42,0.58)_53%,rgba(34,30,42,0.2)_100%)]" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(34,30,42,0.66)_0%,transparent_50%)]" />

        <Image
          src={heroImage}
          alt={heroAlt}
          width={1920}
          height={1080}
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-90"
        />

        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className="relative z-30 mx-auto flex w-full max-w-6xl flex-col px-6 md:px-10">
          <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-[1.5px] w-6 bg-lime" />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              {eyebrow}
            </span>
          </div>
          <h1 className="mb-6 max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white">
            {title}
          </h1>
          <p className="max-w-[620px] font-body text-base leading-relaxed text-white/75 md:text-lg">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5" aria-label="Journey planning highlights">
            <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-body text-xs text-white/85 backdrop-blur-sm">
              {packages.length > 0 ? `${packages.length} curated routes` : 'Curated routes'}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-body text-xs text-white/85 backdrop-blur-sm">
              Built around your pace
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-body text-xs text-white/85 backdrop-blur-sm">
              Culture, nature & wellness
            </span>
          </div>
          </div>
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

      <section id="journeys" className="min-h-[500px] py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-5 border-b border-teal/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <span className="block h-[1.5px] w-6 bg-teal/30" aria-hidden="true" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-teal">
                {filteredPackages.length} curated {filteredPackages.length === 1 ? 'itinerary' : 'itineraries'}
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-center font-body text-sm leading-relaxed text-void/60 md:text-left">
              Every route is a considered starting point, ready to be shaped around your dates, interests,
              stays and preferred pace.
            </p>
            </div>
            <span className="hidden rounded-full bg-teal/5 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-teal md:inline-flex">
              Choose a journey, then make it yours
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
                        href="/contact#trip"
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

      <CatalogueEditorialContent market={market} />
    </main>
  );
}
