'use client';

import Image from 'next/image';
import { Package } from '@/types';
import { Clock, Users, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection({ pkg }: { pkg: Package }) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.9, ease: EASE, delay: 0.1 },
    },
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
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(34,30,42,0.20) 0%, rgba(34,30,42,0.45) 50%, rgba(34,30,42,0.90) 100%)'
          }}
        />
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '256px 256px' }} />
      </div>

      {/* Content (bottom-anchored) */}
      <div className="relative z-10 w-full px-mobile md:px-desktop pb-[80px] max-w-7xl mx-auto">
        <motion.div
          className="max-w-[750px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow & Badge */}
          <div className="flex items-center gap-4 mb-[16px]">
            <span className="bg-lime text-void font-display font-bold uppercase tracking-widest text-[9px] px-2 py-1 flex items-center shrink-0">
               {pkg.category}
            </span>
            <span className="font-body text-[13px] text-white/55 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              Home / Trips / {pkg.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-white text-[clamp(2.5rem,6vw,4.5rem)] tracking-[-0.02em] leading-[1.05] uppercase break-words">
            {pkg.title}
          </h1>

          {/* Tagline */}
          <p className="font-accent italic text-[clamp(16px,1.8vw,22px)] text-white/70 mt-[16px] max-w-[540px]">
            {pkg.tagline}
          </p>

          {/* Meta row — stat blocks */}
          <div className="flex flex-wrap items-center gap-[12px] mt-[24px]">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/15">
              <Clock className="w-4 h-4 text-[#0ED2E9] shrink-0" />
              <span className="font-body text-[13px] text-white/80">{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/15">
              <Users className="w-4 h-4 text-[#0ED2E9] shrink-0" />
              <span className="font-body text-[13px] text-white/80">{pkg.groupSize}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/15">
              <MapPin className="w-4 h-4 text-[#0ED2E9] shrink-0" />
              <span className="font-body text-[13px] text-white/80">{pkg.destinations?.length || 0} Cities</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-[16px] mt-[36px]">
            <button
              onClick={scrollToForm}
              className="bg-lime text-void font-display font-bold uppercase tracking-widest text-[12px] px-8 h-12 hover:bg-white transition-colors duration-300 flex items-center justify-center shrink-0"
            >
              Enquire Now
            </button>
            <button
              onClick={scrollToItinerary}
              className="bg-transparent border border-white/30 text-white font-display font-bold uppercase tracking-widest text-[12px] px-8 h-12 hover:bg-white/10 hover:border-white/50 transition-colors duration-300 flex items-center justify-center shrink-0"
            >
              View Itinerary
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
