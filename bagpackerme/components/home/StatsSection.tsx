'use client';

/**
 * StatsSection — Spec #5
 * Counter animation: useMotionValue + useSpring + useTransform
 * spring config: { stiffness: 100, damping: 30 }
 * Rounds integer values for display.
 * Spec #9: useReducedMotion guard.
 */

import React from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';
import { useRef, useEffect } from 'react';

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 1200, suffix: '+', label: 'Travelers Hosted' },
  { value: 25,   suffix: '+', label: 'Destinations'    },
  { value: 4.9,  suffix: '★', label: 'Satisfaction'    },
  { value: 2020, suffix: '',  label: 'Founded'          },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── ANIMATED NUMBER (spec #5) ────────────────────────────────────────────────
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
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={
        reduced
          ? { duration: 0 }
          : { delay: 0.1 + index * 0.1, duration: 0.55, ease: EASE }
      }
      className="flex flex-col items-center justify-center py-8 px-6 text-center relative"
    >
      {/* Vertical divider (desktop only) */}
      {!isLast && (
        <span
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          aria-hidden="true"
        />
      )}

      <span
        className="stat-number"
        style={{
          fontSize:      'clamp(36px, 5vw, 60px)',
          color:         '#FFFFFF',
          display:       'inline-flex',
          alignItems:    'baseline',
          gap:           '2px',
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
            style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            aria-hidden="true"
          >
            {stat.suffix}
          </span>
        )}
      </span>

      <span className="stat-label" style={{ color: 'rgba(255,255,255,0.72)' }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

// ─── STATS SECTION ─────────────────────────────────────────────────────────────
export default function StatsSection() {
  const ref    = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const reduced  = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ zIndex: 10, marginTop: '-50px' }}
    >
      <div
        className="mx-auto w-full max-w-5xl grid grid-cols-2 md:grid-cols-4"
        style={{
          background:
            'linear-gradient(90deg, #285056 0%, #1e3d42 100%)',
          minHeight: '100px',
          boxShadow: '0 12px 40px rgba(34,30,42,0.22)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
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

      {/* Lime accent line */}
      <div
        className="absolute top-0 left-0 w-full max-w-5xl mx-auto"
        style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 960px)' }}
      >
        <div style={{ height: '2px', background: '#C1EA00', opacity: 0.85 }} />
      </div>
    </section>
  );
}
