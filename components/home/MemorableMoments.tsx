'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const MOMENTS = [
  {
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&auto=format&fit=crop',
    name: 'Maria Carolina',
    text: 'BagPackerMe made everything effortless. The balloon ride was magical!',
    rotation: -5,
    yOffset: 30
  },
  {
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=600&auto=format&fit=crop',
    name: 'Alessia Marika',
    text: 'The guided tour was incredible. I learned so much about the history.',
    rotation: 2,
    yOffset: 10
  },
  {
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop',
    name: 'Aisha Davina',
    text: 'BagPackerMe made my solo trip feel safe and easy, every sunset felt like home.',
    rotation: 0,
    yOffset: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?q=80&w=600&auto=format&fit=crop',
    name: 'Tino Kenji',
    text: 'Everything was planned perfectly. I just had to show up and enjoy.',
    rotation: 4,
    yOffset: 15
  },
  {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
    name: 'John Philips',
    text: 'The best time of my life! I\'ll remember these islands forever.',
    rotation: -3,
    yOffset: 35
  }
];

export default function MemorableMoments() {
  return (
    <section className="bg-surface-lowest overflow-hidden py-32">
      {/* Section Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-label justify-center mb-5"
      >
        TRAVELER STORIES
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl relative z-10 mb-20">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-void/60 mb-4 font-body text-sm tracking-wider"
        >
          Real stories from real travelers
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold text-void tracking-tight leading-[1.1]"
        >
          Moments that made every<br className="hidden md:block"/> journey unforgettable
        </motion.h2>
      </div>

      {/* Polaroid Carousel Setup */}
      <div className="w-full relative px-6 lg:px-8 max-w-[1400px] mx-auto min-h-[500px] flex justify-center items-center">
        <div className="flex justify-center flex-nowrap w-full -space-x-12 md:-space-x-8">
          {MOMENTS.map((moment, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 100, rotate: 0 }}
              whileInView={{ 
                opacity: 1, 
                y: moment.yOffset, 
                rotate: moment.rotation 
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.7, type: "spring", stiffness: 50 }}
              style={{
                zIndex: MOMENTS.length - Math.abs(2 - idx) // middle items have higher z-index
              }}
              className="relative flex-shrink-0 w-[240px] md:w-[280px] bg-white rounded-xl p-3 md:p-4 shadow-diffuse border border-strong transition-transform hover:z-50 hover:scale-105 hover:rotate-0 duration-300"
            >
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-4 bg-void/5">
                <Image 
                  src={moment.image} 
                  alt={moment.name} 
                  fill 
                  sizes="(max-width: 768px) 240px, 280px"
                  className="object-cover"
                />
              </div>
              <div className="text-left py-2">
                <h4 className="font-display font-bold text-lg text-void mb-1">{moment.name}</h4>
                <p className="font-body text-xs text-void/70 leading-relaxed">
                  {moment.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <Link href="/contact" className="btn-teal btn-shimmer inline-flex">
          Plan Your Journey
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </motion.div>
    </section>
  );
}
