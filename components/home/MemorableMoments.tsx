'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const MOMENTS = [
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&auto=format&fit=crop',
    name: 'Maria Carolina',
    location: 'Rajasthan, India',
    text: 'BagPackerMe made everything effortless. The balloon ride was pure magic — one of the best mornings of my life.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=600&auto=format&fit=crop',
    name: 'Alessia Marika',
    location: 'Kerala, India',
    text: 'The guided tour through the backwaters was incredible. I learned so much about the history and culture.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop',
    name: 'Aisha Davina',
    location: 'Goa, India',
    text: 'My solo trip felt safe and seamless. Every sunset felt like coming home. Truly life-changing.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?q=80&w=600&auto=format&fit=crop',
    name: 'Tino Kenji',
    location: 'Varanasi, India',
    text: 'Everything was planned perfectly. I just had to show up and enjoy the spiritual energy of the ghats.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
    name: 'John Philips',
    location: 'Himachal, India',
    text: 'The best time of my life! The mountains, the people, the food — I\'ll remember this forever.',
    rating: 5,
  }
];

export default function MemorableMoments() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section 
      ref={sectionRef}
      className="section-dark-grain overflow-hidden py-28 md:py-36"
    >
      {/* Header */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.div 
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl"
          >
            <div className="accent-line" />
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Moments that made every journey unforgettable
            </h2>
          </motion.div>
          
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/contact?intent=trip" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime text-void px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
            >
              Plan your journey
              <ArrowRight strokeWidth={2} className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll strip — parallax driven */}
      <motion.div 
        style={shouldReduceMotion ? undefined : { x }}
        className="flex gap-5 px-6 lg:px-8"
      >
        {MOMENTS.map((moment, idx) => (
          <motion.div
            key={idx}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={shouldReduceMotion ? undefined : { delay: idx * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
            className="glass-card-dark rounded-[20px] p-5 w-[300px] md:w-[340px] flex-shrink-0 cursor-default"
          >
            {/* Image + profile row */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/15">
                <Image 
                  src={moment.image} 
                  alt={moment.name} 
                  fill 
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-base text-white leading-tight">{moment.name}</h4>
                <p className="font-body text-[11px] text-white/45 tracking-wide">{moment.location}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: moment.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-lime text-lime" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-body text-sm text-white/70 leading-relaxed">
              &ldquo;{moment.text}&rdquo;
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
