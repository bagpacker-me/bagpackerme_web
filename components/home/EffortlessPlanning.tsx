'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', // Woman
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', // Man
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', // Woman
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', // Man
];

const STATS = [
  {
    value: '44K+',
    desc: 'Happy explorers who found their dream trips with BagPackerMe'
  },
  {
    value: '300+',
    desc: 'Handpicked destinations curated for every kind of traveler'
  },
  {
    value: '30%',
    desc: 'Book your next trip today and enjoy exclusive member deals'
  }
];

export default function EffortlessPlanning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section className="bg-surface-lowest pt-24 pb-0 relative">
      {/* Intro Text Section */}
      <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl relative z-10 mb-32">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-void/60 mb-6 font-body text-sm uppercase tracking-widest"
        >
          Travel made simple, stories made unforgettable.
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-semibold text-void tracking-tight leading-[1.1] mb-16"
        >
          We make planning effortless so you can focus on what really matters
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          {/* Avatar Group */}
          <div className="flex -space-x-4 mb-6">
            {AVATARS.map((src, i) => (
              <div key={i} className="w-14 h-14 rounded-full border-2 border-white overflow-hidden relative shadow-md">
                <Image src={src} alt="Traveler" fill className="object-cover" />
              </div>
            ))}
          </div>
          <p className="text-void/60 font-body max-w-sm text-sm">
            Founded by travelers, for travelers. because every journey deserves a personal touch.
          </p>
        </motion.div>
      </div>

      {/* Stats Ticket Section */}
      <div ref={containerRef} className="relative w-full py-32 md:py-48 overflow-hidden px-4 md:px-8">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 z-0 scale-110"
        >
          <div className="absolute inset-0 bg-teal/50 mix-blend-multiply z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=80&w=2000&auto=format&fit=crop" 
            alt="Deep Ocean" 
            fill 
            className="object-cover"
          />
        </motion.div>

        {/* Content */}
        <div className="container mx-auto relative z-20 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row shadow-2xl relative bg-white mix-blend-normal"
            style={{ 
              borderRadius: '24px',
              // A simple way to simulate stamp edges is using a repeating radial gradient mask on the container 
              // but it can be very tricky for CSS across different browsers.
              // Let's use standard border-radius and large circle cutouts via pseudo-elements to divide the sections
            }}
          >
            {STATS.map((stat, idx) => (
              <div 
                key={idx} 
                className={`flex-1 relative p-12 lg:p-16 flex flex-col justify-center bg-white 
                  ${idx !== STATS.length - 1 ? 'border-b md:border-b-0 md:border-r border-dashed border-gray-300' : ''}`
                }
              >
                {/* Circle cutouts for the dashed lines between sections */}
                {idx !== STATS.length - 1 && (
                  <>
                    <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 rounded-full bg-void/50 backdrop-blur-3xl z-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=80&w=2000&auto=format&fit=crop')", backgroundAttachment: 'fixed' }} />
                    <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-void/50 backdrop-blur-3xl z-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=80&w=2000&auto=format&fit=crop')", backgroundAttachment: 'fixed' }} />
                  </>
                )}

                <h3 className="font-display text-6xl lg:text-7xl font-bold text-void mb-6">
                  {stat.value}
                </h3>
                <p className="font-body text-void/70 text-sm lg:text-base leading-relaxed max-w-[250px]">
                  {stat.desc}
                </p>
              </div>
            ))}
          </motion.div>
          <div className="text-center mt-6">
              <span className="text-white font-body text-sm drop-shadow-md">Trusted by thousands of travelers around the world</span>
          </div>
        </div>
      </div>
    </section>
  );
}
