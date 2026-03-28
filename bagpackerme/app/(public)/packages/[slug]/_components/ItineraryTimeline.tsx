'use client';

/**
 * ItineraryTimeline — Spec #6
 * Odd items (index%2===0, left-side text): initial { x:-40, opacity:0 } → animate { x:0, opacity:1 }
 * Even items (index%2!==0, right-side text): initial { x:40, opacity:0 } → animate { x:0, opacity:1 }
 * Images: scale(0.9)→scale(1) on scroll, whileHover rotation change
 * Trigger: useInView per item, triggerOnce
 * Spec #9: useReducedMotion guard
 */

import { Package } from '@/types';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const TRANSITION = { duration: 0.7, ease: EASE };

export default function ItineraryTimeline({ pkg }: { pkg: Package }) {
  const isCorporate = pkg.category === 'Corporate Retreat';

  if (!pkg.itinerary || pkg.itinerary.length === 0) return null;

  return (
    <section id="itinerary" className="w-full bg-[#221E2A] py-mobile md:py-desktop relative overflow-hidden">
      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="mb-[64px] md:mb-[96px] text-center flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <div className="h-[1px] w-[32px] bg-[#FFFFFF]" />
            <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#0ED2E9]">The Journey</span>
            <div className="h-[1px] w-[32px] bg-[#FFFFFF]" />
          </div>
          <h2 className="text-white font-display text-[clamp(2rem,4vw,3rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            Day by Day
          </h2>
        </div>

        {isCorporate ? (
          <CorporateItinerary itinerary={pkg.itinerary} />
        ) : (
          <TimelineItinerary itinerary={pkg.itinerary} />
        )}

      </div>
    </section>
  );
}

// ─── Per-item animated wrapper ────────────────────────────────────────────────
function TimelineItem({
  day,
  index,
}: {
  day: NonNullable<Package['itinerary']>[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  // Spec #6: odd=Day1,3,5... have text on LEFT (isEven===false → x: -40)
  // even=Day2,4,6... have text on RIGHT (isEven===true → x: +40)
  const isEven = index % 2 !== 0;
  const textX  = shouldReduceMotion ? 0 : (isEven ? 40 : -40);

  return (
    <div ref={ref} className="relative w-full mb-[80px] last:mb-0">
      {/* Mobile Layout (Stacked/Left aligned) */}
      <div className="md:hidden pl-[48px] relative">
        <div className="absolute left-[24px] top-0 -translate-x-1/2 w-[24px] h-[24px] rounded-full bg-[#221E2A] border-[2px] border-[#285056] z-10 flex items-center justify-center text-[10px] font-display text-white">
          {day.day}
        </div>
        <div className="text-left pb-[16px]">
          <div className="font-body text-[12px] text-[#0ED2E9] mb-[8px] tracking-[0.1em] uppercase">Day {day.day}</div>
          <h3 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-white tracking-[-0.01em] mb-[12px]">{day.location}</h3>
          <p className="font-body text-[15px] text-[rgba(255,255,255,0.68)] leading-[1.7] max-w-[380px]">{day.description}</p>
        </div>
        {day.imageUrl && (
          <div className="mt-[16px]">
            <Image
              src={day.imageUrl}
              alt={day.location}
              width={200}
              height={160}
              className="w-full max-w-[280px] h-auto object-cover border-[2px] border-[rgba(255,255,255,0.15)]"
              sizes="200px"
            />
          </div>
        )}
      </div>

      {/* Desktop Layout (Grid Split) — Spec #6 */}
      <motion.div
        className="hidden md:grid grid-cols-[1fr_48px_1fr] items-center relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: textX }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={shouldReduceMotion ? { duration: 0 } : TRANSITION}
      >
        {/* Text Content */}
        <div className={`${isEven ? 'col-start-3 text-left pl-[60px]' : 'col-start-1 text-right pr-[60px]'}`}>
          <div className="font-body text-[12px] text-[#0ED2E9] mb-[8px] tracking-[0.1em] uppercase">Day {day.day}</div>
          <h3 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-white tracking-[-0.01em] mb-[12px]">{day.location}</h3>
          <p className={`font-body text-[15px] text-[rgba(255,255,255,0.68)] leading-[1.7] max-w-[380px] inline-block ${isEven ? 'text-left' : 'text-right'}`}>
            {day.description}
          </p>
        </div>

        {/* Center Circle */}
        <div className="col-start-2 flex justify-center z-10 relative">
          <div className="w-[24px] h-[24px] rounded-full bg-[#221E2A] border-[2px] border-[#285056] flex items-center justify-center text-[10px] font-display text-white">
            {day.day}
          </div>
        </div>

        {/* Image Content — Spec #6: scale 0.9→1 on inView, hover rotation */}
        <div className={`${isEven ? 'col-start-1 pr-[60px] flex justify-end' : 'col-start-3 pl-[60px] flex justify-start'}`}>
          {day.imageUrl && (
            <motion.div
              className="relative"
              initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { ...TRANSITION, delay: 0.15 }}
              whileHover={shouldReduceMotion ? {} : { rotate: 0 }}
              style={{ rotate: isEven ? 1.5 : -1.5 }}
            >
              <Image
                src={day.imageUrl}
                alt={day.location}
                width={200}
                height={160}
                className="w-[200px] h-[160px] object-cover border-[2px] border-[rgba(255,255,255,0.15)]"
                sizes="200px"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TimelineItinerary({ itinerary }: { itinerary: Package['itinerary'] }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Center Line for Desktop, Left Line for Mobile */}
      <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2" />
      <div className="flex flex-col">
        {itinerary.map((day, index) => (
          <TimelineItem key={index} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

function CorporateItinerary({ itinerary }: { itinerary: Package['itinerary'] }) {
  return (
    <div className="max-w-5xl mx-auto bg-[#221E2A] border border-white/10 rounded-none p-[32px] md:p-[48px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[48px] gap-y-[48px]">
        {itinerary.map((day, index) => (
          <div key={index} className="flex flex-col border-t border-white/10 pt-[24px] first:border-t-0 md:first:border-t-0 md:[&:nth-child(2)]:border-t-0">
            <span className="font-body text-[12px] text-[#0ED2E9] mb-[8px] tracking-[0.1em] uppercase">Day {day.day}</span>
            <h3 className="font-display text-[24px] font-bold text-white tracking-[-0.01em] mb-[16px]">{day.location}</h3>
            <p className="font-body text-[15px] text-[rgba(255,255,255,0.68)] leading-[1.7]">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
