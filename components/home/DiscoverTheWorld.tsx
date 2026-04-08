'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getPublishedPackages } from '@/lib/firestore';
import { Package, PACKAGE_CATEGORIES } from '@/types';

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

export default function DiscoverTheWorld() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadPackages() {
      try {
        const snap = await getPublishedPackages();
        const nextPackages = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Package))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setPackages(nextPackages);
      } catch (error) {
        console.error('Failed to load homepage journey cards:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  const availableCategories = ['All', ...sortCategories(Array.from(new Set(packages.map((pkg) => pkg.category).filter(Boolean))))];
  const filteredPackages = packages.filter((pkg) => activeTab === 'All' || pkg.category === activeTab);

  useEffect(() => {
    const categorySet = new Set<string>(packages.map((pkg) => pkg.category).filter(Boolean));

    if (activeTab !== 'All' && !categorySet.has(activeTab)) {
      setActiveTab('All');
    }
  }, [activeTab, packages]);

  return (
    <section className="py-24 bg-surface-lowest overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 mb-12">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-label justify-center mb-5">
            EXPLORE INDIA
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-6 tracking-tight">
            Discover India&apos;s Hidden Gems
          </h2>
          <p className="text-void/70 text-lg md:text-xl font-body leading-relaxed">
            Live journeys from our backend, filtered by the experiences travelers can book right now.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {availableCategories.map((category, index) => (
            <motion.button
              key={category}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, duration: 0.4 }}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-body border ${
                activeTab === category
                  ? 'bg-teal text-white border-teal shadow-card-teal'
                  : 'bg-white text-void border-medium hover:border-teal hover:text-teal'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

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
                  className="relative w-[85vw] md:w-[400px] flex-shrink-0 aspect-[4/5] rounded-3xl overflow-hidden snap-center group shadow-diffuse"
                >
                  <Image
                    src={pkg.heroImageUrl || FALLBACK_IMAGE}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent opacity-90" />

                  <div className="absolute top-6 left-6">
                    <span className="backdrop-blur-md bg-white/20 text-white border border-white/30 text-xs font-medium px-4 py-2 rounded-full">
                      {getCardChip(pkg)}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                    <h3 className="text-3xl font-display font-bold text-white mb-3">
                      {pkg.title}
                    </h3>
                    <p className="text-white/80 font-body text-sm leading-relaxed mb-6 line-clamp-3">
                      {pkg.tagline}
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                      {getCardTags(pkg).map((tag) => (
                        <span
                          key={`${pkg.id}-${tag}`}
                          className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}

                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="ml-auto w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-lime group-hover:text-teal group-hover:border-lime transition-all duration-300"
                        aria-label={`Explore ${pkg.title}`}
                      >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-subtle bg-white/80 px-8 py-16 text-center shadow-diffuse">
            <div className="mx-auto max-w-xl">
              <div className="section-label justify-center mb-5">SIGNATURE JOURNEYS</div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-void mb-4">
                No published journeys yet
              </h3>
              <p className="font-body text-void/65 text-base md:text-lg leading-relaxed mb-8">
                This section is now reading directly from the live backend, and there are no published packages to show at the moment.
              </p>
              <Link href="/packages" className="btn-teal btn-shimmer inline-flex">
                Browse All Journeys
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
          className="text-center mt-4"
        >
          <Link href="/packages" className="btn-teal btn-shimmer inline-flex">
            View All Journeys
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
