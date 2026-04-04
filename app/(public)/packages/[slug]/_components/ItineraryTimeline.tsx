'use client';

import { Package } from '@/types';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function ItineraryTimeline({ pkg }: { pkg: Package }) {
  const isCorporate = pkg.category === 'Corporate Retreat';

  if (!pkg.itinerary || pkg.itinerary.length === 0) return null;

  return (
    <section id="itinerary" className="w-full bg-[#221E2A] py-[64px] md:py-[96px] relative overflow-hidden">
      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="mb-[56px] md:mb-[80px] text-center flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[20px]">
            <div className="h-[1px] w-[32px] bg-[#FFFFFF]/40" />
            <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#0ED2E9]">The Journey</span>
            <div className="h-[1px] w-[32px] bg-[#FFFFFF]/40" />
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
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-[24px] md:gap-[40px] pb-[48px] last:pb-0"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, ease: EASE, delay: index * 0.05 }}
    >
      {/* Left: Timeline line + circle */}
      <div className="relative flex flex-col items-center shrink-0" style={{ width: 40 }}>
        {/* Circle node */}
        <div className="w-[36px] h-[36px] rounded-full bg-[#285056] border-[2px] border-[#0ED2E9]/40 flex items-center justify-center text-[11px] font-display font-bold text-[#0ED2E9] z-10 shrink-0">
          {day.day}
        </div>
        {/* Vertical connector (not shown on last item) */}
        <div className="flex-1 w-[1px] mt-[8px]" style={{ background: 'linear-gradient(to bottom, rgba(40,80,86,0.5), rgba(255,255,255,0.05))' }} />
      </div>

      {/* Right: Content */}
      <div className="flex-1 pt-[4px] min-w-0">
        <div className="flex flex-col md:flex-row md:gap-[40px] md:items-start">
          {/* Text */}
          <div className="flex-1 min-w-0 pb-[24px] md:pb-0">
            <div className="font-body text-[11px] text-[#0ED2E9] mb-[8px] tracking-[0.12em] uppercase">Day {day.day}</div>
            <h3 className="font-display text-[clamp(18px,2.2vw,26px)] font-bold text-white tracking-[-0.01em] mb-[12px] leading-[1.2]">{day.location}</h3>
            <p className="font-body text-[15px] text-[rgba(255,255,255,0.65)] leading-[1.75] max-w-[520px] whitespace-pre-wrap">{day.description}</p>
          </div>

          {/* Image (optional) */}
          {day.imageUrl && (
            <motion.div
              className="relative shrink-0 self-start"
              initial={shouldReduceMotion ? {} : { scale: 0.93, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.15 + index * 0.05 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            >
              <Image
                src={day.imageUrl}
                alt={day.location}
                width={280}
                height={210}
                className="w-full md:w-[260px] h-auto object-cover rounded-xl border border-white/10"
                sizes="(max-width: 768px) 90vw, 260px"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItinerary({ itinerary }: { itinerary: Package['itinerary'] }) {
  return (
    <div className="max-w-4xl mx-auto">
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
    <div className="max-w-5xl mx-auto border border-white/10 rounded-2xl p-[32px] md:p-[48px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[48px] gap-y-[40px]">
        {itinerary.map((day, index) => (
          <div key={index} className="flex flex-col border-t border-white/10 pt-[24px] first:border-t-0 md:first:border-t-0 md:[&:nth-child(2)]:border-t-0">
            <span className="font-body text-[11px] text-[#0ED2E9] mb-[8px] tracking-[0.1em] uppercase">Day {day.day}</span>
            <h3 className="font-display text-[22px] font-bold text-white tracking-[-0.01em] mb-[12px]">{day.location}</h3>
            <p className="font-body text-[15px] text-[rgba(255,255,255,0.68)] leading-[1.7] whitespace-pre-wrap">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
