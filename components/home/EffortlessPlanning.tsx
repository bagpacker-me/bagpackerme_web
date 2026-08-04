'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PackageMarket } from '@/types';

// A three-step "how it works", replacing the previous animated vanity counters
// ("1200+ Happy explorers", "4 Live global journeys") — the latter of which
// advertised how little inventory exists. This says what actually happens when
// you enquire, which is the real differentiator for a bespoke operator.
const STEPS = [
  {
    step: '01',
    label: 'Share your vision',
    desc: 'Tell us who is travelling, roughly when, and the experiences you are dreaming of. No commitment, no obligation.',
  },
  {
    step: '02',
    label: 'We design it around you',
    desc: 'A dedicated planner builds a private, fully tailored itinerary — stays, transfers, guides and experiences in one clear plan. Never a template.',
  },
] as const;

export default function EffortlessPlanning({ market = 'global' }: { market?: PackageMarket }) {
  const shouldReduceMotion = useReducedMotion();
  const packagesHref = market === 'india' ? '/in/packages' : '/packages';
  const heading =
    market === 'india'
      ? 'We make planning effortless so you can focus on the journey'
      : 'Global trip planning, handled with local care';
  const intro =
    market === 'india'
      ? 'Founded by travelers, for travelers. Every journey is planned by a real person, around you.'
      : 'We connect destination expertise, stays, transfers, and experiences into one clear plan — designed by a real person.';

  return (
    <section className="bg-white pt-28 pb-28 relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-ice/80 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Intro — left-aligned for variety */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mb-16"
        >
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-teal/60 block mb-4">
            How it works
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-void tracking-tight leading-[1.05] mb-5">
            {heading}
          </h2>
          <p className="text-void/55 font-body text-base md:text-lg leading-relaxed max-w-lg">
            {intro}
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Step 01 — spans 7 columns */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 card-bezel"
          >
            <div className="card-bezel-inner p-7 sm:p-10 md:p-14 min-h-[240px] flex flex-col justify-between">
              <div>
                <span className="font-display text-6xl lg:text-8xl font-bold text-teal mb-3 tracking-tight block">
                  {STEPS[0].step}
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-teal/60 block mb-3">
                  {STEPS[0].label}
                </span>
                <p className="font-body text-void/65 text-base max-w-md leading-relaxed">
                  {STEPS[0].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 02 — spans 5 columns */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 card-bezel"
          >
            <div className="card-bezel-inner p-7 sm:p-10 md:p-12 min-h-[240px] flex flex-col justify-between">
              <div>
                <span className="font-display text-6xl lg:text-7xl font-bold text-void mb-3 tracking-tight block">
                  {STEPS[1].step}
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-void/40 block mb-3">
                  {STEPS[1].label}
                </span>
                <p className="font-body text-void/60 text-sm leading-relaxed">
                  {STEPS[1].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 03 — full-width row with the CTA and the real 10% member perk */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-12"
          >
            <div className="bg-gradient-to-r from-teal to-teal/90 rounded-[24px] p-7 sm:p-10 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
              {/* Subtle grain on dark card */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '128px 128px',
                }}
              />
              <div className="flex-1 relative z-10">
                <span className="font-display text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight block">
                  03
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">
                  You travel, we&apos;re on call
                </span>
                <p className="font-body text-white/75 text-base max-w-xl leading-relaxed">
                  Enjoy the trip with 24/7 support on the ground. Members save 10% on their next journey with us.
                </p>
              </div>
              <div className="flex-shrink-0 relative z-10">
                <Link
                  href={packagesHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime text-void px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
                >
                  See sample journeys
                  <ArrowRight strokeWidth={2} className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
