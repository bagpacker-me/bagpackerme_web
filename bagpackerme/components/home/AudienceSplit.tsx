'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AudienceSplit() {
  return (
    <section className="w-full flex flex-col md:flex-row">
      {/* Left Panel - Foreign Travelers (55%) */}
      <div className="w-full md:w-[55%] bg-brand-teal text-white flex items-center justify-center py-20 px-8 md:px-16 lg:px-24 relative overflow-hidden group">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full relative z-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-brand-cyan text-xs">✦</span>
            <span className="text-brand-cyan font-bold tracking-[0.2em] text-xs uppercase">For Foreign Travelers</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
            Planning an Immersive India Journey?
          </h2>
          
          <p className="text-white/80 font-sans text-base leading-relaxed mb-8">
            Tailor-made itineraries for travelers from the US, UK, Europe, and Australia. We handle the logistics, so you can dive deep into the culture. Designed for those planning 3–12 months ahead with a focus on premium, hassle-free experiences.
          </p>
          
          <div className="flex gap-4 mb-10 text-sm font-sans">
            <div className="bg-white/10 px-4 py-2 rounded">
              <span className="block text-white/60 text-xs mb-1">Avg. Planning</span>
              <span className="font-bold">3–12 Months</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded">
              <span className="block text-white/60 text-xs mb-1">Trip Budget</span>
              <span className="font-bold">$3K–$8K USD</span>
            </div>
          </div>
          
          <Link href="/plan-my-trip?audience=foreign" className="btn-lime">
            Plan My Trip <span className="ml-2">→</span>
          </Link>
        </motion.div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
      </div>

      {/* Right Panel - Indian Explorers (45%) */}
      <div className="w-full md:w-[45%] bg-brand-lime text-brand-void flex items-center justify-center py-20 px-8 md:px-16 lg:px-20 relative overflow-hidden group">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg w-full relative z-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-brand-teal text-xs">✦</span>
            <span className="text-brand-teal font-bold tracking-[0.2em] text-xs uppercase">For Indian Explorers</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
            Discover Real India
          </h2>
          
          <p className="text-brand-void/80 font-sans text-base leading-relaxed mb-8">
            Curated group trips and bespoke getaways for young professionals from Mumbai, Delhi, Bangalore and beyond. Skip the tourist traps and connect with like-minded travelers on weekend escapes or week-long adventures.
          </p>
          
          <div className="flex gap-4 mb-10 text-sm font-sans">
            <div className="bg-brand-void/5 px-4 py-2 rounded">
              <span className="block text-brand-void/60 text-xs mb-1">Best For</span>
              <span className="font-bold">Millennials / Gen Z</span>
            </div>
            <div className="bg-brand-void/5 px-4 py-2 rounded">
              <span className="block text-brand-void/60 text-xs mb-1">Avg. Spend</span>
              <span className="font-bold">₹30K–₹1.2L</span>
            </div>
          </div>
          
          <Link href="/packages?duration=short" className="bg-brand-teal hover:bg-brand-void text-white font-sans font-bold text-sm tracking-widest uppercase px-8 py-4 transition-colors duration-300 inline-flex items-center justify-center">
            Explore Domestic Trips <span className="ml-2">→</span>
          </Link>
        </motion.div>
        
        {/* Decorative background element */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl group-hover:bg-brand-teal/10 transition-colors duration-700"></div>
      </div>
    </section>
  );
}
