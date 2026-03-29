'use client';

/**
 * FadeInSection — Reusable scroll-triggered reveal wrapper.
 * Spec #3: threshold 0.15, triggerOnce, opacity+y fade up.
 * Spec #9: full useReducedMotion guard.
 */

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Override y offset (default 30) */
  yOffset?: number;
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  yOffset = 30,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const inView = useInView(ref, { once: true, amount: 0.15 });

  const resolvedVariants: Variants = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={resolvedVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * CardGrid — stagger container.
 * Spec #4: staggerChildren 0.08, per-item fade+y.
 */
export const CARD_GRID_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const CARD_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};
