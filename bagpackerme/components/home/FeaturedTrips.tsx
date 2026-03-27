'use client';

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { getFeaturedPackages } from '@/lib/firestore';
import { Package } from '@/types';
import PackageCard, { PackageCardSkeleton } from './PackageCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedTrips() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="bg-white w-full" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 px-4">
          <div className="section-label justify-center">
            ✦ SIGNATURE JOURNEYS
            {/* The ::before element will only show on the left in css, let's reverse to center properly or rely on css flex. Actually the css has it on left. We will keep it simple. */}
          </div>
          <h2 className="section-heading mt-2 mb-6 max-w-2xl text-[#221E2A]">
            Five Ways to Experience India
          </h2>
          <p className="font-body text-gray-500 max-w-xl mx-auto text-lg">
            Curated experiential journeys — small groups, deep immersion, real India.
          </p>
        </div>

        {/* Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 px-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {packages.map(pkg => (
              <motion.div key={pkg.id} variants={itemVariants}>
                <PackageCard pkg={pkg} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center w-full px-4">
          <Link href="/packages" className="btn-lime">
            View All Journeys <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
