'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { getFeaturedPackages } from '@/lib/firestore';
import { Package } from '@/types';
import PackageCard, { PackageCardSkeleton } from './PackageCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeInSection, CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';

export default function FeaturedTrips() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  useEffect(() => {
    async function loadPackages() {
      try {
        const snap = await getFeaturedPackages(6);
        const pkgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        setPackages(pkgs);
      } catch (error) {
        console.error("Failed to load featured packages:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  return (
    <section className="bg-white w-full" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="container mx-auto">
        {/* Header */}
        <FadeInSection className="flex flex-col items-center text-center mb-16 md:mb-24 px-4">
          <div className="section-label justify-center">
            ✦ SIGNATURE JOURNEYS
          </div>
          <h2 className="section-heading mt-2 mb-6 max-w-2xl text-void" style={{ textWrap: 'balance', letterSpacing: '-0.02em' }}>
            Five Ways to Experience India
          </h2>
          <p className="font-body text-gray-500 max-w-xl mx-auto text-lg">
            Curated experiential journeys — small groups, deep immersion, real India.
          </p>
        </FadeInSection>

        {/* Grid Area — Spec #4: stagger 0.08 with useInView */}
        <div ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 px-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : packages.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 px-4"
              variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={gridInView ? 'visible' : 'hidden'}
            >
              {packages.map(pkg => (
                <motion.div
                  key={pkg.id}
                  variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-gray-50 border border-gray-100">
              <h3 className="font-heading font-bold text-2xl text-gray-400 mb-2">No Packages Yet</h3>
              <p className="text-gray-500 font-sans">We&apos;re working on gathering the best journey packages.</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <FadeInSection className="mt-20 flex justify-center w-full px-4" delay={0.2}>
          <Link href="/packages" className="btn-lime">
            View All Journeys <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}
