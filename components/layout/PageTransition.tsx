'use client';

/**
 * PageTransition — Spec #1
 * AnimatePresence mode="wait"
 * initial { opacity:0, y:12 } → animate { opacity:1, y:0 } → exit { opacity:0, y:-8 }
 * duration 0.35s, ease [0.25,0.46,0.45,0.94]
 * Spec #9: useReducedMotion guard
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };
  const exit    = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.35,
          ease: EASE,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
