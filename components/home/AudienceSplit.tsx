'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AudienceSplit() {
  return (
    <section className="w-full flex flex-col md:flex-row" aria-label="Who we serve">
      {/* ── LEFT PANEL — Foreign Travelers ────────────────────────────── */}
      <div className="w-full md:w-[55%] bg-white text-void flex items-center justify-start py-20 px-8 md:px-16 lg:px-20 xl:px-24 relative overflow-hidden group">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-lg w-full relative z-10"
        >
          <div className="section-label mb-5">✦ FOR FOREIGN TRAVELERS</div>

          <h2
            className="font-heading font-bold text-void leading-tight mb-5"
            style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.02em' }}
          >
            Planning an Immersive India Journey?
          </h2>

          <p className="text-gray-600 font-sans text-[15px] leading-[1.75] mb-8">
            Tailor-made itineraries for travelers from the US, UK, Europe, and Australia. We
            handle the logistics, so you can dive deep into the culture. Designed for those
            planning 3–12 months ahead with a focus on premium, hassle-free experiences.
          </p>

          <div className="flex gap-4 mb-10">
            <div className="bg-surface-high border border-subtle px-5 py-3">
              <span className="block text-gray-500 text-[10px] mb-1 font-display tracking-[0.12em] uppercase">Avg. Planning</span>
              <span className="font-display font-bold text-void text-[15px]">3–12 Months</span>
            </div>
            <div className="bg-surface-high border border-subtle px-5 py-3">
              <span className="block text-gray-500 text-[10px] mb-1 font-display tracking-[0.12em] uppercase">Trip Budget</span>
              <span className="font-display font-bold text-void text-[15px]">$3K–$8K USD</span>
            </div>
          </div>

          <Link href="/packages" className="btn-lime">
            Explore Journeys →
          </Link>
        </motion.div>

        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-lime/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
      </div>

      {/* ── RIGHT PANEL — Indian Explorers ─────────────────────────────── */}
      <div className="w-full md:w-[45%] bg-surface-container text-void flex items-center justify-start py-20 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden group">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="section-label mb-5" style={{ color: '#285056' }}>
            <style>{`.ice-label::before { background: #285056; }`}</style>
            ✦ FOR INDIAN EXPLORERS
          </div>

          <h2
            className="font-heading font-bold text-void leading-tight mb-5"
            style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.02em' }}
          >
            Discover Real India
          </h2>

          <p className="text-void/65 font-sans text-[15px] leading-[1.75] mb-8">
            Curated group trips and bespoke getaways for young professionals from Mumbai, Delhi,
            Bangalore and beyond. Skip the tourist traps and connect with like-minded travelers
            on weekend escapes or week-long adventures.
          </p>

          <div className="flex gap-4 mb-10">
            <div className="bg-void/6 border border-void/10 px-5 py-3">
              <span className="block text-void/50 text-[10px] mb-1 font-display tracking-[0.12em] uppercase">Best For</span>
              <span className="font-display font-bold text-void text-[15px]">Millennials / Gen Z</span>
            </div>
            <div className="bg-void/6 border border-void/10 px-5 py-3">
              <span className="block text-void/50 text-[10px] mb-1 font-display tracking-[0.12em] uppercase">Avg. Spend</span>
              <span className="font-display font-bold text-void text-[15px]">₹30K–₹1.2L</span>
            </div>
          </div>

          <Link href="/packages?duration=short" className="btn-lime inline-flex items-center justify-center">
            Explore Domestic Trips →
          </Link>
        </motion.div>

        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-teal/8 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
