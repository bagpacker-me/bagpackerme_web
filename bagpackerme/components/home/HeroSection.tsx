'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

const THUMBNAILS = [
  { id: 1, title: 'Heritage', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&q=80' }, // Rajasthan Fort
  { id: 2, title: 'Spiritual', image: 'https://images.unsplash.com/photo-1561058778-e59265ea5642?w=400&q=80' }, // Varanasi
  { id: 3, title: 'Culinary', image: 'https://images.unsplash.com/photo-1596791242371-55dbcc2bfb15?w=400&q=80' }, // Spices
  { id: 4, title: 'Adventure', image: 'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?w=400&q=80' }, // Mountain Trek
];

const staggerVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as const }
  })
};

export default function HeroSection() {
  return (
    <section className="relative w-full h-[100svh] flex flex-col justify-center section-dark overflow-hidden">
      {/* Background Image & Overlays */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600)' }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#221E2A]/70 to-[#221E2A]/40" />
      <div className="grain absolute inset-0 z-[2]" />

      <div className="container relative z-[10] flex flex-col h-full pt-24 pb-32 justify-between">
        
        {/* Top Space (Logo) */}
        <div className="w-full flex justify-start">
          <Logo variant="light" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl space-y-6 lg:-ml-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-display font-bold tracking-[0.22em] text-[#0ED2E9]">✦ EXPERIENTIAL TRAVEL</span>
          </motion.div>

          <h1 className="font-display font-bold text-[clamp(52px,8vw,96px)] text-white uppercase leading-[0.95] tracking-[0.04em]">
            <motion.div custom={0} variants={staggerVariants} initial="hidden" animate="visible">EXPERIENTIAL</motion.div>
            <motion.div custom={1} variants={staggerVariants} initial="hidden" animate="visible">JOURNEYS</motion.div>
            <motion.div custom={2} variants={staggerVariants} initial="hidden" animate="visible">THROUGH INDIA</motion.div>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-body font-normal text-base text-white/75 max-w-[480px] leading-relaxed"
          >
            We don&apos;t just plan trips. We create memories that last a lifetime — connecting adventurous souls with the heart of India.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <button className="btn-lime">Explore Trips &rarr;</button>
            <button className="btn-ghost">Our Story</button>
          </motion.div>
        </div>

        {/* Bottom Area: Thumbnails and Scroll */}
        <div className="flex justify-between items-end w-full pb-8">
          {/* Thumbnails */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden md:flex gap-4"
          >
            {THUMBNAILS.map((thumb) => (
              <div key={thumb.id} className="group flex flex-col gap-2 cursor-pointer">
                <div className="w-[100px] h-[130px] border border-white/20 overflow-hidden relative transition-transform duration-500 hover:-translate-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb.image} alt={thumb.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                </div>
                <span className="font-display text-[10px] text-white tracking-[0.18em] uppercase text-center">{thumb.title}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-2 mx-auto md:mx-0"
          >
            <span className="font-display text-[10px] tracking-widest text-white uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
