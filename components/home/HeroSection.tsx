'use client';

import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';


// ─── HEADLINE WORDS ──────────────────────────────────────────────────────────
const HERO_WORDS = ['EXPERIENTIAL', 'JOURNEYS', 'THROUGH', 'INDIA'];


// ─── WORD ANIMATION VARIANTS ─────────────────────────────────────────────────
function buildWordVariants(shouldReduceMotion: boolean) {
  return {
    hidden: {
      y: shouldReduceMotion ? 0 : 60,
      opacity: 0,
      rotateX: shouldReduceMotion ? 0 : 15,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            delay: 0.11 * i,
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          },
    }),
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Parallax scroll
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxBgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '20%']
  );

  const wordVariants = buildWordVariants(shouldReduceMotion);

  // Generic fade-up helper
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  });

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[680px] flex flex-col overflow-hidden"
      aria-label="Hero — Experiential Journeys Through India"
    >
      {/* ── 1. PARALLAX BACKGROUND IMAGE ─────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=90&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          y: parallaxBgY,
        }}
        aria-hidden="true"
      />

      {/* ── 2. LAYERED GRADIENT OVERLAY ──────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(160deg, rgba(34,30,42,0.72) 0%, rgba(34,30,42,0.55) 50%, rgba(34,30,42,0.85) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── 3. GRAIN OVERLAY ─────────────────────────────────────────────── */}
      <div
        className="hero-grain"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── MAIN CONTENT LAYOUT ──────────────────────────────────────────── */}
      <div className="relative z-[10] flex flex-col h-full px-[clamp(24px,5vw,80px)]">

        {/* Spacer for navbar (navbar is fixed at ~72px) */}
        <div className="h-[88px] flex-shrink-0" />

        {/* ── HERO COPY — vertically centered ────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Eyebrow */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              className="w-8 h-px bg-cyan"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.9 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.6, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'left' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#0ED2E9',
              }}
            >
              ✦ Experiential Travel
            </span>
          </motion.div>

          {/* Headline — staggered word-by-word */}
          <div style={{ perspective: 1000 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(48px, 8.5vw, 104px)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
              className="flex flex-col"
            >
              {HERO_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'block', transformOrigin: 'bottom left' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            {...fadeUp(0.56)}
            style={{
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(17px, 1.8vw, 22px)',
              color: 'rgba(255,255,255,0.80)',
              marginTop: '28px',
              maxWidth: '520px',
              lineHeight: 1.6,
            }}
          >
            We don&apos;t just plan trips. We create memories that last a
            lifetime — connecting adventurous souls with the heart of India.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            {...fadeUp(0.72)}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            style={{ marginTop: '44px' }}
          >
            <Link href="/packages" className="btn-lime btn-shimmer">Explore Trips →</Link>
            <Link href="/about" className="btn-ghost backdrop-blur-sm bg-white/5">
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* ── BOTTOM: SCROLL INDICATOR ──────────────────────────────────── */}
        <div className="flex justify-end items-end pb-10 pt-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: 0.8, duration: 0.8 }
            }
            className="flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.25em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              SCROLL
            </span>
            <span className="hero-scroll-line" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
