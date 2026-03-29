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
        const pkgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Package));
        setPackages(pkgs);
      } catch (error) {
        console.error('Failed to load featured packages:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  return (
    <section className="bg-[#F7F9FA] w-full" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="container">
        {/* Header */}
        <FadeInSection className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="section-label justify-center mb-4">✦ SIGNATURE JOURNEYS</div>
          <h2
            className="font-heading font-bold text-void mb-5 max-w-2xl"
            style={{ fontSize: 'clamp(30px, 4.5vw, 56px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
          >
            Five Ways to Experience India
          </h2>
          <p className="font-sans text-gray-500 max-w-xl text-[17px] leading-relaxed">
            Curated experiential journeys — small groups, deep immersion, real India.
          </p>
        </FadeInSection>

        {/* Grid */}
        <div ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : packages.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              variants={shouldReduceMotion ? undefined : CARD_GRID_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={gridInView ? 'visible' : 'hidden'}
            >
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={shouldReduceMotion ? undefined : CARD_ITEM_VARIANTS}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Premium empty state with destination teaser */
            <div className="relative overflow-hidden text-center py-24 bg-white border border-gray-100">
              <div className="relative z-10 max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-teal/10 flex items-center justify-center">
                  <span className="text-2xl">🌏</span>
                </div>
                <h3 className="font-heading font-bold text-void text-2xl mb-3">Journeys Coming Soon</h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed mb-8">
                  We&apos;re crafting our signature India journeys. Stay tuned — something extraordinary is being built.
                </p>
                <Link href="/contact" className="btn-lime text-sm">
                  Get Notified When We Launch
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {packages.length > 0 && (
          <FadeInSection className="mt-16 flex justify-center" delay={0.2}>
            <Link href="/packages" className="btn-lime">
              View All Journeys <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeInSection>
        )}
      </div>
    </section>
  );
}
