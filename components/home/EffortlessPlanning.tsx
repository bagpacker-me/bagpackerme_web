'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
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

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', // Woman
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', // Man
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', // Woman
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', // Man
];

const STATS = [
  {
    target: 1200,
    suffix: '+',
    desc: 'Happy explorers who found their dream trips with BagPackerMe'
  },
  {
    target: 25,
    suffix: '+',
    desc: 'Handpicked destinations curated for every kind of traveler'
  },
  {
    target: 10,
    suffix: '%',
    desc: 'Book your next trip today and enjoy exclusive member deals'
  }
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

export default function EffortlessPlanning() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-lowest pt-24 pb-24 relative">
      {/* Intro Text Section */}
      <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl relative z-10 mb-20">
        <motion.p 
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-void/60 mb-6 font-body text-sm uppercase tracking-widest"
        >
          Travel made simple, stories made unforgettable.
        </motion.p>
        
        <motion.h2 
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-semibold text-void tracking-tight leading-[1.1] mb-16"
        >
          We make planning effortless so you can focus on what really matters
        </motion.h2>

        <motion.div 
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          {/* Avatar Group */}
          <div className="flex -space-x-4 mb-6">
            {AVATARS.map((src, i) => (
              <div key={i} className="w-14 h-14 rounded-full border-2 border-white overflow-hidden relative shadow-md">
                <Image src={src} alt="Traveler" fill sizes="56px" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="text-void/60 font-body max-w-sm text-sm">
            Founded by travelers, for travelers. because every journey deserves a personal touch.
          </p>
        </motion.div>
      </div>

      {/* Stats Bento Grid Section */}
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 1200+ Happy Explorers */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="md:col-span-2 relative p-8 md:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/10 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <h3 className="font-display text-6xl lg:text-7xl font-bold text-teal mb-4">
                <AnimatedCounter target={STATS[0].target} suffix={STATS[0].suffix} />
              </h3>
              <p className="font-body text-void/80 text-base md:text-lg max-w-md leading-relaxed">
                {STATS[0].desc}
              </p>
            </div>
          </motion.div>

          {/* Card 2: 25+ Handpicked Destinations */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
            className="p-8 md:p-12 rounded-3xl bg-white border border-medium shadow-sm flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <h3 className="font-display text-6xl lg:text-7xl font-bold text-void mb-4">
                <AnimatedCounter target={STATS[1].target} suffix={STATS[1].suffix} />
              </h3>
              <p className="font-body text-void/70 text-sm md:text-base leading-relaxed">
                {STATS[1].desc}
              </p>
            </div>
          </motion.div>

          {/* Card 3: 10% Member Deals */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
            className="md:col-span-3 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-ice to-white border border-medium shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 min-h-[160px]"
          >
            <div className="flex-1">
              <h3 className="font-display text-5xl lg:text-6xl font-bold text-teal mb-2">
                <AnimatedCounter target={STATS[2].target} suffix={STATS[2].suffix} />
              </h3>
              <p className="font-body text-void/80 text-base md:text-lg max-w-xl leading-relaxed">
                {STATS[2].desc}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                href="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal text-white hover:bg-teal/95 px-6 py-3.5 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-card-teal-hover active:scale-[0.98]"
              >
                Find Your Trip
                <ArrowRight strokeWidth={2} className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <span className="text-void/45 font-body text-sm font-medium tracking-wide">
            Trusted by thousands of travelers around the world
          </span>
        </div>
      </div>
    </section>
  );
}
