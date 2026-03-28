'use client';

import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

// ─── THUMBNAIL DATA ─────────────────────────────────────────────────────────
const THUMBNAILS = [
  {
    id: 1,
    title: 'Heritage',
    image:
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&q=80',
    alt: 'Rajasthan Heritage Fort',
  },
  {
    id: 2,
    title: 'Spiritual',
    image:
      'https://images.unsplash.com/photo-1561058778-e59265ea5642?w=400&q=80',
    alt: 'Varanasi Ghats at Dawn',
  },
  {
    id: 3,
    title: 'Culinary',
    image:
      'https://images.unsplash.com/photo-1596791242371-55dbcc2bfb15?w=400&q=80',
    alt: 'Indian Spice Markets',
  },
  {
    id: 4,
    title: 'Adventure',
    image:
      'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?w=400&q=80',
    alt: 'Himalayan Trek Landscape',
  },
];

// ─── HEADLINE WORDS ──────────────────────────────────────────────────────────
const HERO_WORDS = [
  'EXPERIENTIAL',
  'JOURNEYS',
  'THROUGH',
  'INDIA',
];

// ─── WORD ANIMATION VARIANTS ─────────────────────────────────────────────────
// Spec #2: y:60→0, opacity:0→1, rotateX:15→0, stagger 0.11s per word
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
  // Maps 0→1 scroll to "0%" → "20%" background-position Y
  const parallaxBgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '20%']
  );

  const wordVariants = buildWordVariants(shouldReduceMotion);

  // Generic fade-up helper (respects reduced-motion)
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  });

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-center overflow-hidden"
      aria-label="Hero — Experiential Journeys Through India"
    >
      {/* ── 1. PARALLAX BACKGROUND IMAGE ─────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed', // CSS fallback
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 0%',
          y: parallaxBgY,
        }}
        aria-hidden="true"
      />

      {/* ── 2. DARK GRADIENT OVERLAY ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(34,30,42,0.55) 0%, rgba(34,30,42,0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── 3. GRAIN OVERLAY ─────────────────────────────────────────────── */}
      {/* Using inline SVG data-uri so no external assets are needed */}
      <div
        className="hero-grain"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="relative z-[10] flex flex-col h-full px-[clamp(20px,5vw,80px)] pt-[152px] pb-8 justify-between">

        {/* Logo row */}
        <div className="w-full flex justify-start">
          <Logo variant="light" />
        </div>

        {/* ── HERO COPY ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-5xl">

          {/* Eyebrow */}
          <motion.div
            {...fadeUp(0)}
            className="flex items-center justify-center md:justify-start gap-3 mb-6 w-full md:w-max"
          >
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

          {/* Headline — staggered word-by-word, spec #2: perspective + rotateX */}
          <div style={{ perspective: 1000 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(52px, 8.5vw, 104px)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textWrap: 'balance',
              }}
              className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-[0.22em]"
            >
              {HERO_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
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
              fontSize: 'clamp(18px, 2vw, 24px)',
              color: 'rgba(255,255,255,0.82)',
              marginTop: '24px',
              maxWidth: '560px',
              lineHeight: 1.5,
            }}
          >
            We don&apos;t just plan trips. We create memories that last a
            lifetime — connecting adventurous souls with the heart of India.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            {...fadeUp(0.72)}
            className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto"
            style={{ marginTop: '40px' }}
          >
            <button className="btn-lime w-full md:w-auto justify-center">Explore Trips →</button>
            <button className="btn-ghost backdrop-blur-md bg-white/5 w-full md:w-auto justify-center">
              Our Story
            </button>
          </motion.div>
        </div>

        {/* ── BOTTOM ROW: THUMBNAILS + SCROLL INDICATOR ─────────────────── */}
        <div className="flex justify-between items-end w-full pb-0">

          {/* 4. THUMBNAIL STRIP */}
          <div
            className="flex gap-3 justify-center md:justify-start mx-auto md:mx-0 w-full md:w-auto"
            role="list"
            aria-label="Journey highlights"
          >
            {THUMBNAILS.map((thumb, i) => (
              <motion.div
                key={thumb.id}
                role="listitem"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: 0.9 + i * 0.15,
                        duration: 0.55,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }
                }
                className={`group flex flex-col gap-2 cursor-pointer ${i >= 2 ? 'hidden md:flex' : ''}`}
              >
                {/* Card */}
                <div
                  className="hero-thumb-card"
                  style={{
                    width: '90px',
                    height: '120px',
                    border: '1px solid rgba(255,255,255,0.6)',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 4px 16px rgba(34,30,42,0.32)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.image}
                    alt={thumb.alt}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Caption */}
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '9px',
                    letterSpacing: '0.25em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  {thumb.title}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 5. SCROLL INDICATOR */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: 1.4, duration: 0.8 }
            }
            className="flex flex-col items-center gap-2 mx-auto md:mx-0 pb-8"
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.25em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              SCROLL
            </span>
            {/* Animated growing line */}
            <span className="hero-scroll-line" />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
