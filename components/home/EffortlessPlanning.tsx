'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { PackageMarket } from '@/types';

const INDIA_STATS = [
  {
    target: 1200,
    suffix: '+',
    label: 'Happy explorers',
    desc: 'Travelers who found their dream trip with us'
  },
  {
    target: 25,
    suffix: '+',
    label: 'Destinations',
    desc: 'Handpicked locations curated for every kind of traveler'
  },
  {
    target: 10,
    suffix: '%',
    label: 'Member deals',
    desc: 'Exclusive savings when you book your next journey'
  }
];

const GLOBAL_STATS = [
  {
    target: 4,
    suffix: '',
    label: 'Live global journeys',
    desc: 'Reference-built packages across Thailand, Vietnam, and Kenya',
  },
  {
    target: 3,
    suffix: '',
    label: 'Destination regions',
    desc: 'Beach breaks, cultural circuits, and safari routes ready to tailor',
  },
  {
    target: 10,
    suffix: '%',
    label: 'Member deals',
    desc: 'Exclusive savings when you book your next journey',
  },
];

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  useGrouping = true,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  useGrouping?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();
  const isDecimal = target % 1 !== 0;
  const formatValue = (value: number) =>
    isDecimal
      ? value.toFixed(1)
      : new Intl.NumberFormat('en-US', {
          useGrouping,
          maximumFractionDigits: 0,
        }).format(Math.round(value));

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const displayVal = useTransform(springVal, formatValue);

  useEffect(() => {
    if (inView && !shouldReduceMotion) {
      motionVal.set(target);
    }
  }, [inView, motionVal, shouldReduceMotion, target]);

  if (shouldReduceMotion) {
    return (
      <span ref={ref}>
        {prefix}{formatValue(target)}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {prefix}<motion.span>{displayVal}</motion.span>{suffix}
    </span>
  );
}

export default function EffortlessPlanning({ market = 'global' }: { market?: PackageMarket }) {
  const shouldReduceMotion = useReducedMotion();
  const stats = market === 'india' ? INDIA_STATS : GLOBAL_STATS;
  const packagesHref = market === 'india' ? '/in/packages' : '/packages';
  const heading =
    market === 'india'
      ? 'We make planning effortless so you can focus on the journey'
      : 'Global trip planning, handled with local care';
  const intro =
    market === 'india'
      ? 'Founded by travelers, for travelers. Every journey deserves a personal touch.'
      : 'We connect destination expertise, stays, transfers, and experiences into one clear plan.';

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
          <h2 className="font-display text-4xl md:text-6xl font-bold text-void tracking-tight leading-[1.05] mb-5">
            {heading}
          </h2>
          <p className="text-void/55 font-body text-base md:text-lg leading-relaxed max-w-lg">
            {intro}
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Hero stat — spans 7 columns */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 card-bezel"
          >
            <div className="card-bezel-inner p-10 md:p-14 min-h-[240px] flex flex-col justify-between">
              <div>
                <h3 className="font-display text-6xl lg:text-8xl font-bold text-teal mb-3 tracking-tight">
                  <AnimatedCounter target={stats[0].target} suffix={stats[0].suffix} />
                </h3>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-teal/60 block mb-3">
                  {stats[0].label}
                </span>
                <p className="font-body text-void/65 text-base max-w-md leading-relaxed">
                  {stats[0].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Second stat — spans 5 columns */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 card-bezel"
          >
            <div className="card-bezel-inner p-10 md:p-12 min-h-[240px] flex flex-col justify-between">
              <div>
                <h3 className="font-display text-6xl lg:text-7xl font-bold text-void mb-3 tracking-tight">
                  <AnimatedCounter target={stats[1].target} suffix={stats[1].suffix} />
                </h3>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-void/40 block mb-3">
                  {stats[1].label}
                </span>
                <p className="font-body text-void/60 text-sm leading-relaxed">
                  {stats[1].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Third stat — full-width CTA row */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-12"
          >
            <div className="bg-gradient-to-r from-teal to-teal/90 rounded-[24px] p-10 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
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
                <h3 className="font-display text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
                  <AnimatedCounter target={stats[2].target} suffix={stats[2].suffix} />
                </h3>
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">
                  {stats[2].label}
                </span>
                <p className="font-body text-white/75 text-base max-w-xl leading-relaxed">
                  {stats[2].desc}
                </p>
              </div>
              <div className="flex-shrink-0 relative z-10">
                <Link 
                  href={packagesHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime text-void px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
                >
                  Find your trip
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
