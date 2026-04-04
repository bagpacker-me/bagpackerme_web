'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function LimitedTimePromo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={containerRef} className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0 origin-bottom scale-110"
      >
        <Image 
          src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2000&auto=format&fit=crop" 
          alt="Mount Bromo" 
          fill 
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark Overlay Mask */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-void/90 via-void/50 to-transparent" />

      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 lg:px-8 text-center max-w-4xl mt-32">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
        >
          Limited Time Travel Promo
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-body text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto drop-shadow-md"
        >
          Grab personalized deals tailored for you. Don&apos;t miss out on your dream destination, it&apos;s just a click away.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button className="bg-white text-void font-body px-10 py-5 rounded-full text-base font-bold hover:bg-lime hover:text-teal hover:shadow-glow-lime transition-all duration-300">
            Claim My Trip Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
