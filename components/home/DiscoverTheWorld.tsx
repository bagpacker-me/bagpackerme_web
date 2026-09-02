'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { scheduleIdleTask } from '@/lib/browser-idle';
import { STATIC_GLOBAL_PACKAGE_SUMMARIES } from '@/lib/static-global-package-summaries';
import { Package, PackageMarket, PACKAGE_CATEGORIES } from '@/types';

const FALLBACK_IMAGE = '/web_photos/hero_1.webp';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, x: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
};

const categoryOrder = new Map(PACKAGE_CATEGORIES.map((category, index) => [category, index]));

function sortCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const aIndex = categoryOrder.get(a as typeof PACKAGE_CATEGORIES[number]);
    const bIndex = categoryOrder.get(b as typeof PACKAGE_CATEGORIES[number]);

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;
    return a.localeCompare(b);
  });
}

function getCardTags(pkg: Package) {
  const tags: string[] = [pkg.category];

  if (pkg.destinations?.[0]) {
    tags.push(pkg.destinations[0]);
  } else if (pkg.subTheme) {
    tags.push(pkg.subTheme);
  } else if (pkg.vibe) {
    tags.push(pkg.vibe);
  }

  return tags.slice(0, 2);
}

function getCardChip(pkg: Package) {
  if (pkg.duration) return pkg.duration;
  if (pkg.groupSize) return `Group ${pkg.groupSize}`;
  return 'Signature Journey';
}

function LoadingCard({ index }: { index: number }) {
  return (
    <div
      className="relative w-[85vw] md:w-[400px] flex-shrink-0 aspect-[4/5] rounded-3xl overflow-hidden snap-center bg-surface-highest animate-pulse"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="absolute top-6 left-6 h-9 w-28 rounded-full bg-white/50" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <div className="h-10 w-2/3 rounded bg-white/50" />
        <div className="mt-4 h-4 w-full rounded bg-white/40" />
        <div className="mt-2 h-4 w-5/6 rounded bg-white/40" />
        <div className="mt-8 flex gap-3">
          <div className="h-9 w-20 rounded-full bg-white/40" />
          <div className="h-9 w-24 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverTheWorld({ market = 'global' }: { market?: PackageMarket }) {
  const [packages, setPackages] = useState<Package[]>(
    market === 'global' ? STATIC_GLOBAL_PACKAGE_SUMMARIES : []
  );
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(market !== 'global');
  const [hasError, setHasError] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const packagesHref = market === 'india' ? '/in/packages' : '/packages';
  const heading =
    market === 'india' ? 'Discover India\'s hidden gems' : 'Discover global journeys';
  const description =
    market === 'india'
      ? 'Live journeys curated for the experiences travelers seek right now.'
      : 'Thailand, Vietnam, Kenya, and custom routes ready for your next chapter.';

  useEffect(() => {
    let mounted = true;

    setPackages(market === 'global' ? STATIC_GLOBAL_PACKAGE_SUMMARIES : []);
    setLoading(market !== 'global');
    setHasError(false);

    const cancel = scheduleIdleTask(async () => {
      // REST rather than the Firebase SDK: this refresh is not worth ~200 KB of
      // SDK plus an auth iframe on a marketing page. See lib/public-reads-rest.
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
        // Global always has the static seed, so a failed read there is
        // invisible. On India the list would otherwise look deceptively empty.
        setHasError(market !== 'global');
      }
      setLoading(false);
    }, market === 'global' ? 2500 : 800);

    return () => {
      mounted = false;
      cancel();
    };
  }, [market]);

  const availableCategories = ['All', ...sortCategories(Array.from(new Set(packages.map((pkg) => pkg.category).filter(Boolean))))];
  const filteredPackages = packages.filter((pkg) => activeTab === 'All' || pkg.category === activeTab);

  useEffect(() => {
    const categorySet = new Set<string>(packages.map((pkg) => pkg.category).filter(Boolean));

    if (activeTab !== 'All' && !categorySet.has(activeTab)) {
      setActiveTab('All');
    }
  }, [activeTab, packages]);

  return (
    <section className="py-28 bg-ice/50 overflow-hidden">
      {/* Header — Left-aligned with filters to the right on desktop */}
      <div className="container mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="accent-line-cyan" />

            <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-4 tracking-tight">
              {heading}
            </h2>
            <p className="text-content-muted text-base md:text-lg font-body leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Filter pills — right-aligned on desktop */}
          <div className="flex flex-wrap gap-2 lg:justify-end lg:max-w-lg">
            {availableCategories.map((category, index) => (
              <motion.button
                key={category}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.04, duration: 0.4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                onClick={() => setActiveTab(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-body border cursor-pointer ${
                  activeTab === category
                    ? 'bg-teal text-white border-teal shadow-card-teal'
                    : 'bg-white text-void/70 border-void/8 hover:border-teal/30 hover:text-teal'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Carousel */}
      <div className="w-full relative px-6 lg:px-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 pt-4 -mx-6 px-6 lg:mx-0 lg:px-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingCard key={index} index={index} />
            ))}
          </div>
        ) : filteredPackages.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={shouldReduceMotion ? undefined : containerVariants}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 pt-4 -mx-6 px-6 lg:mx-0 lg:px-0"
            >
              {filteredPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={shouldReduceMotion ? undefined : cardVariants}
                  whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="relative w-[85vw] md:w-[380px] flex-shrink-0 aspect-[4/5] rounded-[24px] overflow-hidden snap-center group cursor-pointer"
                  style={{ boxShadow: '0 8px 40px rgba(40,80,86,0.10)' }}
                >
                  <Image
                    src={pkg.heroImageUrl || FALLBACK_IMAGE}
                    alt={pkg.title}
                    width={760}
                    height={950}
                    sizes="(max-width: 768px) 85vw, 380px"
                    quality={60}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/25 to-transparent" />

                  {/* Duration chip */}
                  <div className="absolute top-5 left-5">
                    <span className="backdrop-blur-md bg-white/15 text-white border border-white/20 text-xs font-medium px-4 py-2 rounded-full">
                      {getCardChip(pkg)}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col justify-end">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight">
                      {pkg.title}
                    </h3>
                    {pkg.tagline?.trim() && (
                      <p className="text-white/70 font-body text-sm leading-relaxed mb-5 line-clamp-2">
                        {pkg.tagline}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-auto">
                      {getCardTags(pkg).map((tag) => (
                        <span
                          key={`${pkg.id}-${tag}`}
                          className="backdrop-blur-md bg-white/8 border border-white/12 text-white/80 text-[11px] font-medium px-3 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}

                      <Link
                        href={`${packagesHref}/${pkg.slug}`}
                        // shrink-0: as a flex child next to a long destination
                        // name it was being squeezed under 44px on 360px screens.
                        className="ml-auto shrink-0 w-11 h-11 rounded-full backdrop-blur-md bg-white/8 border border-white/15 flex items-center justify-center text-white group-hover:bg-lime group-hover:text-void group-hover:border-lime transition-all duration-300 active:scale-90"
                        aria-label={`Explore ${pkg.title}`}
                      >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-subtle bg-white px-8 py-16 text-center" style={{ boxShadow: '0 8px 40px rgba(40,80,86,0.08)' }}>
            <div className="mx-auto max-w-xl">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-void mb-4">
                {hasError ? 'We couldn’t load journeys just now' : 'New journeys are on the way'}
              </h3>
              <p className="font-body text-content-muted text-base md:text-lg leading-relaxed mb-8">
                {hasError
                  ? 'Something went wrong on our end. Please refresh, or tell us where you’d like to go and we’ll plan it with you.'
                  : 'Our next set of curated journeys is being prepared. In the meantime, tell us where you’d like to go and we’ll design a private trip around you.'}
              </p>
              <Link href={hasError ? packagesHref : '/contact#trip'} className="btn-teal btn-shimmer inline-flex">
                {hasError ? 'Browse all journeys' : 'Start planning'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {!loading && filteredPackages.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-6"
        >
          <Link href={packagesHref} className="btn-teal btn-shimmer inline-flex">
            View all journeys
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
