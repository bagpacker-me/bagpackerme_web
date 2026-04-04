'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Asia',
  'Europe',
  'Oceania',
  'Africa',
  'Caribbean',
  'Pacific Island',
  'Middle East'
];

const DESTINATIONS = [
  {
    id: 1,
    title: 'Santorini, Greece',
    description: 'Watch golden sunsets over whitewashed cliffs and enjoy romantic getaways by the Aegean Sea.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
    tags: ['Romantic', 'Luxury'],
    curatedCount: '85+ Curated Destinations',
    category: 'Europe'
  },
  {
    id: 2,
    title: 'Kyoto, Japan',
    description: 'Wander through ancient temples, peaceful gardens, and charming streets filled with culture and tradition.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    tags: ['Cultural', 'Calm Escape'],
    curatedCount: '120+ Curated Destination',
    category: 'Asia'
  },
  {
    id: 3,
    title: 'Palawan, Philippines',
    description: 'A tropical paradise of crystal lagoons and limestone cliffs perfect for sun-seekers and island dreamers.',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop',
    tags: ['Nature', 'Relaxation'],
    curatedCount: '60+ Curated Destinations',
    category: 'Asia'
  },
  {
    id: 4,
    title: 'Halong Bay, Vietnam',
    description: 'Cruise emerald waters among thousands of towering limestone islands topped with rainforests.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
    tags: ['Adventure', 'Scenic'],
    curatedCount: '70+ Curated Destinations',
    category: 'Asia'
  }
];

export default function DiscoverTheWorld() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredDestinations = DESTINATIONS.filter(
    dest => activeTab === 'All' || dest.category === activeTab
  );

  return (
    <section className="py-24 bg-surface-lowest overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-6 tracking-tight">
            Discover the World
          </h2>
          <p className="text-void/70 text-lg md:text-xl font-body leading-relaxed">
            From hidden beaches to buzzing cities explore handpicked destinations around the globe, curated for every kind of traveler.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-body ${
                activeTab === cat
                  ? 'bg-teal text-white shadow-md'
                  : 'bg-white text-void border border-strong hover:border-teal hover:text-teal'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="w-full relative px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 pt-4 -mx-6 px-6 lg:mx-0 lg:px-0">
          {filteredDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              className="relative w-[85vw] md:w-[400px] flex-shrink-0 aspect-[4/5] rounded-3xl overflow-hidden snap-center group cursor-pointer shadow-diffuse"
            >
              {/* Background Image */}
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                sizes="(max-width: 768px) 85vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent opacity-80" />
              
              {/* Top Chip */}
              <div className="absolute top-6 left-6">
                <span className="backdrop-blur-md bg-white/20 text-white border border-white/30 text-xs font-medium px-4 py-2 rounded-full">
                  {dest.curatedCount}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-display font-bold text-white mb-3">
                  {dest.title}
                </h3>
                <p className="text-white/80 font-body text-sm leading-relaxed mb-6 line-clamp-3">
                  {dest.description}
                </p>
                
                <div className="flex items-center gap-3 mt-auto">
                  {dest.tags.map(tag => (
                     <span key={tag} className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full">
                       {tag}
                     </span>
                  ))}
                  
                  <div className="ml-auto w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-lime group-hover:text-teal group-hover:border-lime transition-all duration-300">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
