'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { scheduleIdleTask } from '@/lib/browser-idle';
import { PackageMarket } from '@/types';

const indiaDestinations = [
  {
    id: 'delhi',
    title: 'DELHI',
    stateName: 'DELHI',
    location: 'New Delhi',
    description: 'A bustling metropolis where ancient history intertwines with vibrant modernity.',
    image: '/web_photos/hero_1.webp',
  },
  {
    id: 'agra',
    title: 'AGRA',
    stateName: 'UTTAR PRADESH',
    location: 'Agra, Uttar Pradesh',
    description: 'Home to the iconic Taj Mahal, a timeless symbol of love and Mughal artistry.',
    image: '/web_photos/hero_2.webp',
  },
  {
    id: 'jaipur',
    title: 'JAIPUR',
    stateName: 'RAJASTHAN',
    location: 'Jaipur, Rajasthan',
    description: 'Majestic forts, opulent palaces, and the vibrant colors of the Pink City.',
    image: '/web_photos/hero_3.webp',
  },
  {
    id: 'varanasi',
    title: 'VARANASI',
    stateName: 'UTTAR PRADESH',
    location: 'Varanasi, Uttar Pradesh',
    description: 'The spiritual soul of India. Ancient ghats along the sacred Ganges.',
    image: '/web_photos/hero_4.webp',
  },
  {
    id: 'goa',
    title: 'GOA',
    stateName: 'GOA',
    location: 'Goa',
    description: 'Pristine beaches, Portuguese heritage, and golden coastal sunsets.',
    image: '/web_photos/hero_5.webp',
  }
];

const globalDestinations = [
  {
    id: 'thailand',
    title: 'THAILAND',
    stateName: 'PATTAYA',
    location: 'Pattaya, Thailand',
    description: 'Island waters, tropical gardens, private transfers, and a short coastal reset.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'vietnam',
    title: 'VIETNAM',
    stateName: 'DA NANG',
    location: 'Da Nang and Hoi An',
    description: 'Golden Bridge views, lantern-lit streets, coastal days, and layered city history.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'halong',
    title: 'HALONG',
    stateName: 'HANOI',
    location: 'Hanoi and Halong Bay',
    description: 'Old Quarter walks, limestone cruises, island time, and northern Vietnam scenery.',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'kenya',
    title: 'KENYA',
    stateName: 'MASAI MARA',
    location: 'Amboseli and Masai Mara',
    description: 'Elephant country, Rift Valley lakes, big-cat plains, and slow safari days.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600',
  },
];

export default function HeroInteractive({ market = 'global' }: { market?: PackageMarket }) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progressKey, setProgressKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Auto-advance is withheld until the page has actually finished loading, and
  // suspended whenever the hero is scrolled away or the tab is in the
  // background. A full-viewport crossfade every 6s otherwise means the page
  // never reaches a visually stable state: it costs nothing a visitor can see
  // and it was dominating Speed Index (18.4s on mobile), because the filmstrip
  // keeps changing for as long as the trace runs.
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const INTERVAL_MS = 6000;
  // The opening slide holds twice as long as the rest. Someone who has just
  // arrived is still reading the headline, and the crossfade repaints the whole
  // viewport — doing that while the page is still settling is what makes the
  // filmstrip churn. Every later slide keeps the original 6s rhythm.
  const FIRST_INTERVAL_MS = 12000;
  const [dwellMs, setDwellMs] = useState(FIRST_INTERVAL_MS);
  const destinations = market === 'india' ? indiaDestinations : globalDestinations;
  const packagesHref = market === 'india' ? '/in/packages' : '/packages';
  // A stable, meaningful headline — the previous <h1> was the destination name,
  // which changed every 6s (bad for SEO and for a first-time visitor) and sat
  // above a "Book now" CTA promising a checkout that doesn't exist.
  const headline =
    market === 'india' ? 'Experiential India, designed around you' : 'Private journeys, designed around you';

  const totalSlides = destinations.length;
  // Honour prefers-reduced-motion and the pause control: no auto-advance.
  const autoPlay = !shouldReduceMotion && !isPaused && isLoaded && isOnScreen && isTabVisible;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProgressKey(k => k + 1);
    if (!autoPlay) return;
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % totalSlides);
      setProgressKey(k => k + 1);
      // Past the opening slide the carousel settles into its normal cadence.
      setDwellMs(INTERVAL_MS);
    }, dwellMs);
  }, [totalSlides, autoPlay, dwellMs]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [resetTimer]);

  // Arm auto-advance only once the load event has fired and the browser has a
  // spare idle slot, so the carousel never competes with the first paint.
  useEffect(() => {
    if (document.readyState === 'complete') {
      const cancel = scheduleIdleTask(() => setIsLoaded(true), 1000);
      return cancel;
    }

    let cancelIdle: (() => void) | undefined;
    const onLoad = () => { cancelIdle = scheduleIdleTask(() => setIsLoaded(true), 1000); };
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      cancelIdle?.();
    };
  }, []);

  // Stop the timer when the hero is off-screen or the tab is hidden — a
  // crossfade nobody is looking at is pure battery and main-thread cost.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsTabVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    // Driving the carousel by hand ends the opening slide's longer hold.
    setDwellMs(INTERVAL_MS);
    resetTimer();
  }, [totalSlides, resetTimer]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setDwellMs(INTERVAL_MS);
    resetTimer();
  }, [totalSlides, resetTimer]);

  // The prev/next buttons are the only way through the carousel on a phone —
  // the stacked preview cards that drive it on desktop are hidden below lg.
  // A horizontal swipe is what a visitor actually reaches for on a full-bleed
  // image, so wire it to the same handlers.
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      // Require a deliberate, mostly-horizontal drag: anything shorter is a tap
      // on the CTA underneath, and anything steeper is the visitor scrolling.
      if (Math.abs(deltaX) < 56 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX < 0) handleNext();
      else handlePrev();
    },
    [handleNext, handlePrev]
  );

  const activeDest = destinations[currentIndex];
  const stringIndex = String(currentIndex + 1).padStart(2, '0');
  const stringTotal = String(totalSlides).padStart(2, '0');
  
  const upcomingSlides = [
    destinations[(currentIndex + 1) % totalSlides],
    destinations[(currentIndex + 2) % totalSlides],
  ];

  return (
    <section
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-void font-sans text-white"
    >
      {/* Background Images Crossfade */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeDest.id}
          custom={direction}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={activeDest.image}
            alt={activeDest.title}
            fill
            className="object-cover"
            sizes="100vw"
            // The LCP image, so the first slide preloads. Later slides load
            // eagerly but without a preload hint — they are not the LCP and
            // must not compete with it for early bandwidth.
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? undefined : 'eager'}
            // It sits under two gradient scrims and a grain layer, so the
            // default quality of 75 is spending bytes nobody can see.
            quality={60}
          />
          {/* Layered gradient scrims for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/20" />
        </motion.div>
      </AnimatePresence>

      {/* Grain overlay for texture */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Main Content Area */}
      {/* The bottom padding keeps the vertically-centred block clear of the
          controls row below it. Without it, on a 360×640 phone the second CTA
          and the pagination overlapped. */}
      <div className="absolute inset-y-0 left-0 z-40 flex flex-col justify-center w-full md:w-[55%] px-6 md:px-12 lg:px-16 pb-28 md:pb-0 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Stable value-proposition headline — does not change with the carousel */}
          <h1 className="font-display text-[clamp(38px,6.5vw,84px)] font-extrabold tracking-[-0.02em] leading-[0.95] mb-6 max-w-[14ch]">
            {headline}
          </h1>

          {/* Rotating destination caption — the demoted destination name */}
          {/* initial={false}, like the background crossfade above it: without
              it the server-rendered caption and description ship at opacity 0
              and stay invisible until Framer Motion hydrates, which on a
              mid-range phone is seconds of blank space beside the headline. */}
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={activeDest.id}
              custom={direction}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? -24 : 24 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-lime" />
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
                  Now featuring · {activeDest.location}
                </span>
              </div>
              <p className="text-base md:text-lg mb-8 max-w-md text-white/75 leading-relaxed font-body">
                {activeDest.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact?intent=trip"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-void transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98] active:translate-y-0"
            >
              Start planning
              <ArrowRight strokeWidth={2} className="h-4 w-4" />
            </Link>
            <Link
              href={packagesHref}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
            >
              Explore trips
            </Link>
          </div>
        </div>
      </div>

      {/* Card Carousel (Right Side — Desktop Only) */}
      <div className="absolute top-[18%] bottom-[18%] right-[4vw] w-[38vw] z-40 hidden lg:flex items-center">
        <div className="relative w-full h-full flex items-center">
          <AnimatePresence mode="popLayout">
            {upcomingSlides.map((slide, i) => {
              const xOffset = i * 260; 
              const scale = 1 - (i * 0.08);
              const opacity = 1 - (i * 0.25);
              const zIndex = 30 - i;

              return (
                <motion.button
                  type="button"
                  key={`${slide.id}-${currentIndex}`}
                  initial={shouldReduceMotion ? { opacity: 0 } : { x: xOffset + 80, opacity: 0 }}
                  animate={shouldReduceMotion ? { opacity } : { x: xOffset, scale, opacity }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { x: -80, opacity: 0, scale: 1.05 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute w-[220px] h-[330px] rounded-[20px] overflow-hidden cursor-pointer glass-card-dark text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                  style={{ zIndex, transformOrigin: 'left center' }}
                  onClick={handleNext}
                  aria-label={`Next destination: ${slide.location}`}
                  // Only the front card is a real tab stop; the stacked one behind it is decorative.
                  tabIndex={i === 0 ? 0 : -1}
                  aria-hidden={i === 0 ? undefined : true}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="220px"
                    quality={60}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />

                  {/* Card label */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 block mb-1">
                      Next
                    </span>
                    <span className="font-display font-bold text-lg leading-tight text-white block">{slide.location}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      {/* The extra right padding below md keeps the slide counter clear of the
          fixed WhatsApp button, which sits in this exact corner and was
          covering the total ("04") on every phone. */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-between px-6 pr-20 md:px-12 lg:px-16 pb-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))]">
        {/* Watermark — purely decorative, hidden from assistive tech */}
        <div className="hidden md:block" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeDest.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-[clamp(48px,7vw,96px)] font-display font-extrabold uppercase text-white/[0.04] whitespace-nowrap pointer-events-none tracking-tighter leading-none"
            >
              {activeDest.stateName}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Carousel controls + pagination */}
        {/* Tighter gaps below md: at 360px the 44px touch targets plus the
            counter no longer fit the width left over beside the WhatsApp
            button, and the slide total was the piece that got clipped. */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5" role="group" aria-label="Featured destinations carousel controls">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous destination"
              className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {!shouldReduceMotion && (
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
                aria-pressed={isPaused}
                className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next destination"
              className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Pagination + Auto-Progress */}
          <div className="flex items-center gap-2 md:gap-3 text-sm font-medium tracking-widest font-display">
            <span className="text-white">{stringIndex}</span>
            <div className="relative w-10 md:w-16 h-[2px] bg-white/15 overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
              {autoPlay && (
                <div
                  key={progressKey}
                  className="absolute top-0 left-0 h-full bg-lime hero-progress-bar"
                  // Track the real dwell so the fill lands exactly when the
                  // slide turns, including the longer opening hold.
                  style={{ animationDuration: `${dwellMs}ms` }}
                />
              )}
            </div>
            <span className="text-white/40">{stringTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
