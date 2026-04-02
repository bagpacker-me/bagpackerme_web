'use client';

import React from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useEffect } from 'react';

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 1200, suffix: '+', label: 'Travelers Hosted' },
  { value: 25, suffix: '+', label: 'Destinations' },
  { value: 4.9, suffix: '★', label: 'Satisfaction' },
  { value: 2020, suffix: '', label: 'Founded' },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────
function AnimatedNumber({
  target,
  isDecimal,
  active,
  reduced,
}: {
  target: number;
  isDecimal: boolean;
  active: boolean;
  reduced: boolean;
}) {
  const motionVal = useMotionValue(reduced || !active ? target : 0);
  const springVal = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const displayVal = useTransform(springVal, (v) =>
    isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (active && !reduced) {
      motionVal.set(target);
    }
  }, [active, target, motionVal, reduced]);

  return <motion.span>{displayVal}</motion.span>;
}

// ─── STAT ITEM ─────────────────────────────────────────────────────────────────
function StatItem({
  stat,
  index,
  active,
  reduced,
}: {
  stat: (typeof STATS)[0];
  index: number;
  active: boolean;
  reduced: boolean;
}) {
  const isDecimal = stat.value % 1 !== 0;
  const isLast = index === STATS.length - 1;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={
        reduced
          ? { duration: 0 }
          : { delay: 0.1 + index * 0.1, duration: 0.55, ease: EASE }
      }
      className="flex flex-col items-center justify-center py-8 px-4 md:px-8 text-center relative"
    >
      {/* Vertical divider (desktop only) */}
      {!isLast && (
        <span
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10"
          style={{ background: 'var(--color-border-dark)' }}
          aria-hidden="true"
        />
      )}

      <span
        className="stat-number"
        style={{
          fontSize: 'clamp(30px, 4vw, 52px)',
          color: 'var(--color-surface-lightest)',
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '2px',
        }}
        aria-label={`${stat.value}${stat.suffix}`}
      >
        <AnimatedNumber
          target={stat.value}
          isDecimal={isDecimal}
          active={active}
          reduced={reduced}
        />
        {stat.suffix && (
          <span
            className="stat-suffix"
            style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}
            aria-hidden="true"
          >
            {stat.suffix}
          </span>
        )}
      </span>

      <span className="stat-label mt-2" style={{ color: 'var(--color-text-inverse-dim)', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

// ─── STATS SECTION ─────────────────────────────────────────────────────────────
export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion() ?? false;

  return (
    <section ref={ref} className="relative w-full bg-white py-0">
      <div
        className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        style={{
          background: 'linear-gradient(100deg, var(--teal) 0%, var(--primary-dark) 50%, #1e3d42 100%)',
          boxShadow: 'var(--shadow-teal)',
        }}
      >
        {STATS.map((stat, idx) => (
          <StatItem
            key={stat.label}
            stat={stat}
            index={idx}
            active={isInView}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}
