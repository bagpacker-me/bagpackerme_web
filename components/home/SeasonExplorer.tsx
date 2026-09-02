'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  MONTHS,
  MONTH_LABELS,
  getCurrentMonth,
  getDestinationsForMonth,
  type Month,
} from '@/lib/destination-seasons';
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  WORLD_LAND_PATH,
  projectLatLng,
} from '@/lib/world-map-geometry';

const EASE_HOUSE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function SeasonExplorer() {
  // Opening on the visitor's current month makes the first pin relevant
  // without needing any personalisation.
  const [month, setMonth] = useState<Month>(() => getCurrentMonth());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const monthButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const destinations = useMemo(() => getDestinationsForMonth(month), [month]);

  // The dataset guarantees every month qualifies at least three destinations,
  // but clamp anyway so a future data edit can't render an empty panel.
  const activeIndex = Math.min(selectedIndex, destinations.length - 1);
  const active = destinations[activeIndex];

  const selectMonth = useCallback((next: Month) => {
    setMonth(next);
    setSelectedIndex(0);
  }, []);

  const handleMonthKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!delta) return;

      event.preventDefault();
      const nextIndex = (index + delta + MONTHS.length) % MONTHS.length;
      selectMonth(MONTHS[nextIndex]);
      monthButtonRefs.current[nextIndex]?.focus();
    },
    [selectMonth]
  );

  if (!active) return null;

  const total = destinations.length;
  const counter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const ctaHref = active.packageSlug
    ? `/packages/${active.packageSlug}`
    : '/contact#trip';
  const ctaLabel = active.packageSlug ? 'View this journey' : `Plan a trip to ${active.name}`;

  return (
    <section className="section-teal overflow-hidden py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="accent-line-cyan" />
            <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Where should you go
              <br />
              <span className="font-accent italic font-normal">this month?</span>
            </h2>
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md font-body text-base leading-relaxed text-content-inverse-muted"
          >
            Pick when you want to travel and we&apos;ll show you the places entering their
            finest season — not simply the ones everyone is posting about.
          </motion.p>
        </div>

        {/* Month selector */}
        {/* A 12-across row cannot fit a phone, and the horizontal scroller it
            used to fall back to was the single worst thing on the mobile site:
            twelve 68px tabs forced 816px of content, which widened the layout
            viewport and pushed the fixed navbar — hamburger included — off the
            right edge of every screen on this page. It also hid nine months
            behind a scrollbar-less swipe nobody could see. A 3×4 grid shows the
            whole year at once and costs one extra row of height. */}
        <div
          role="tablist"
          aria-label="Choose a travel month"
          className="mt-12 grid grid-cols-3 border border-b-0 border-white/15 sm:grid-cols-6 md:grid-cols-12"
        >
          {MONTHS.map((candidate, index) => {
            const isActive = candidate === month;
            return (
              <button
                key={candidate}
                ref={(node) => {
                  monthButtonRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectMonth(candidate)}
                onKeyDown={(event) => handleMonthKeyDown(event, index)}
                className={`min-h-[52px] border-b border-r border-white/10 px-3 py-4 font-body text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime [&:nth-child(3n)]:border-r-0 sm:[&:nth-child(3n)]:border-r sm:[&:nth-child(6n)]:border-r-0 md:[&:nth-child(6n)]:border-r md:last:border-r-0 ${
                  isActive
                    ? 'bg-lime text-teal ring-2 ring-inset ring-void'
                    : 'text-content-inverse-muted hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="sr-only">{MONTH_LABELS[candidate]}</span>
                <span aria-hidden="true">
                  {candidate}{isActive ? ' ✓' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explorer */}
        <div className="grid border border-white/15 border-t-0 lg:grid-cols-[1.45fr_0.55fr]">
          {/* Map */}
          {/* Below lg the column matches the map's own ratio so nothing is
              cropped and every pin stays on screen. From lg it stretches to the
              detail panel's height and the wrapper below covers the extra. */}
          <div className="relative aspect-[1000/460] overflow-hidden bg-[#1d4247] lg:aspect-auto lg:min-h-[460px]">
            {/* This wrapper is locked to the viewBox ratio, so the land drawing
                and the percentage-positioned pins share one coordinate space and
                can never drift apart. It fits inside the column rather than
                covering it — cropping would hide edge pins like New Zealand. */}
            <div className="absolute left-1/2 top-1/2 aspect-[1000/460] max-h-full w-full -translate-x-1/2 -translate-y-1/2">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                preserveAspectRatio="none"
                className="block h-full w-full"
                role="img"
                aria-label={`World map showing ${total} destinations at their best in ${MONTH_LABELS[month]}: ${destinations
                  .map((destination) => destination.name)
                  .join(', ')}`}
              >
                <defs>
                  <pattern id="season-graticule" width="41.7" height="32.9" patternUnits="userSpaceOnUse">
                    <path
                      d="M41.7 0V32.9M0 32.9H41.7"
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#season-graticule)" />
                <path
                  d={WORLD_LAND_PATH}
                  fill="rgba(255,255,255,0.14)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Pins sit in HTML above the SVG so focus rings, hover and text
                  labels behave like ordinary interactive elements. */}
              {destinations.map((destination, index) => {
                const { x, y } = projectLatLng(destination.lat, destination.lng);
                const isActive = index === activeIndex;
                return (
                  /* Several destinations share the same map coordinates at all
                     rendered widths. Keeping them as visual markers avoids
                     overlapping touch targets; the 48px previous/next buttons
                     in the adjacent panel select every destination. */
                  <span
                    key={destination.id}
                    aria-hidden="true"
                    style={{
                      left: `${(x / MAP_WIDTH) * 100}%`,
                      top: `${(y / MAP_HEIGHT) * 100}%`,
                    }}
                    className={`pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 transition-all duration-300 ${
                      isActive
                        ? 'z-20 bg-lime ring-lime/30 shadow-glow-lime scale-125'
                        : 'z-10 bg-white/80 ring-white/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex flex-col justify-center bg-ice px-6 py-9 text-void sm:px-8 sm:py-10 md:px-10">
            {/* Close-together pins (Maldives and Sri Lanka in March, say) overlap
                on a world map at this scale, so stepping through the list is the
                reliable way to reach every destination. */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="font-display text-[11px] font-bold uppercase tracking-widest text-content-subtle">
                {counter} · Best in {MONTH_LABELS[month]}
              </p>
              <div className="flex flex-shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedIndex((activeIndex - 1 + total) % total)}
                  aria-label="Previous destination"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-void/15 text-content-muted transition-colors duration-300 hover:border-teal hover:bg-teal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal md:h-9 md:w-9"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((activeIndex + 1) % total)}
                  aria-label="Next destination"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-void/15 text-content-muted transition-colors duration-300 hover:border-teal hover:bg-teal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal md:h-9 md:w-9"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${month}-${active.id}`}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE_HOUSE }}
              >
                <p className="font-display text-[11px] font-bold uppercase tracking-widest text-teal">
                  {active.region}
                </p>
                <h3 className="mt-2 font-accent text-4xl italic leading-tight md:text-5xl">
                  {active.name}
                </h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-content-muted">
                  {active.blurb}. Every journey is shaped around your pace, your stays and
                  the people you travel with.
                </p>

                <div className="mt-7 border-t border-void/10 pt-5">
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-content-subtle">
                    Ideal for
                  </p>
                  <p className="mt-1.5 font-body text-xs font-semibold text-void/80">
                    Private journeys · Couples · Curious travellers
                  </p>
                </div>

                <Link href={ctaHref} className="btn-teal btn-shimmer mt-8 inline-flex">
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
