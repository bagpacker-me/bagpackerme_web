'use client';

import Image from 'next/image';
import { Package } from '@/types';
import { Clock, Users, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection({ pkg }: { pkg: Package }) {
  const shouldReduceMotion = useReducedMotion();
  const words = pkg.title.split(' ');

  const wordVariants = {
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
            ease: EASE,
          },
    }),
  };
  const scrollToForm = () => {
    const el = document.getElementById('book');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  const scrollToItinerary = () => {
    const el = document.getElementById('itinerary');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={pkg.heroImageUrl}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        {/* Exact Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(34,30,42,0.30) 0%, rgba(34,30,42,0.50) 60%, rgba(34,30,42,0.85) 100%)'
          }}
        />
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[#221E2A] opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('/noise.png')` }} />
      </div>

      {/* Content (bottom-anchored) */}
      <div className="relative z-10 w-full px-mobile md:px-desktop pb-[80px] max-w-7xl mx-auto">
        <div className="max-w-[700px]">
          {/* Eyebrow & Badge */}
          <div className="flex items-center gap-4 mb-[12px]">
            <span className="bg-lime text-void font-display font-bold uppercase tracking-widest text-[9px] px-2 py-1 flex items-center shrink-0">
               {pkg.category}
            </span>
            <span className="font-body text-[13px] text-white/65 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              Home / Trips / {pkg.title}
            </span>
          </div>

          {/* Title - Spec #2 Staggered word animation */}
          <div style={{ perspective: 1000 }}>
            <h1 className="font-display font-bold text-white text-[calc(clamp(3rem,8vw,5.5rem))] tracking-[-0.02em] leading-none uppercase flex flex-wrap gap-x-[0.22em]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
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
          <p className="font-accent italic text-[clamp(18px,2vw,26px)] text-white/75 mt-[16px]">
            {pkg.tagline}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-[24px] mt-[20px]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0ED2E9]" />
              <span className="font-body text-[14px] text-white/65">{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0ED2E9]" />
              <span className="font-body text-[14px] text-white/65">{pkg.groupSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0ED2E9]" />
              <span className="font-body text-[14px] text-white/65">{pkg.destinations?.length || 0} Cities</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-[16px] mt-[32px]">
            <button 
              onClick={scrollToForm}
              className="bg-lime text-void font-display font-bold uppercase tracking-widest text-[11px] px-8 h-12 hover:bg-white transition-colors duration-300 flex items-center justify-center shrink-0"
            >
              Enquire Now
            </button>
            <button 
              onClick={scrollToItinerary}
              className="bg-transparent border border-white/20 text-white font-display font-bold uppercase tracking-widest text-[11px] px-8 h-12 hover:bg-white/10 hover:border-white/40 transition-colors duration-300 flex items-center justify-center shrink-0"
            >
              View Itinerary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
