'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'All',
  'Culinary',
  'Spiritual',
  'Adventure',
  'Heritage',
  'Hippy Trail',
];

const DESTINATIONS = [
  {
    id: 1,
    title: 'Kerala Backwaters',
    description: 'Glide through emerald waterways, past swaying palms and vibrant paddy fields. A soul-stirring journey through God\'s Own Country.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    tags: ['Culinary', 'Heritage'],
    curatedCount: '12+ Curated Experiences',
    category: 'Culinary'
  },
  {
    id: 2,
    title: 'Rajasthan Royale',
    description: 'Step into the land of kings. Discover majestic forts, opulent palaces, and golden sands that whisper tales of a glorious past.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    tags: ['Heritage', 'Luxury'],
    curatedCount: '15+ Curated Experiences',
    category: 'Heritage'
  },
  {
    id: 3,
    title: 'Ladakh Himalayan',
    description: 'Journey to the top of the world. Crystal lakes, ancient monasteries and stark Himalayan beauty at 3,500m altitude.',
    image: 'https://images.unsplash.com/photo-1542458402-998cbcc1fc46?q=80&w=800&auto=format&fit=crop',
    tags: ['Adventure', 'Scenic'],
    curatedCount: '10+ Curated Experiences',
    category: 'Adventure'
  },
  {
    id: 4,
    title: 'Varanasi Spiritual',
    description: 'Wake up to the ancient ghats at dawn, witness the evening Aarti, and feel the pulse of the oldest living city on earth.',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop',
    tags: ['Spiritual', 'Cultural'],
    curatedCount: '8+ Curated Experiences',
    category: 'Spiritual'
  },
  {
    id: 5,
    title: 'Spiti Valley Trail',
    description: 'Drive the legendary Manali–Leh highway. High altitude desert, remote monasteries, and a landscape unlike anything else.',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b5bca4?q=80&w=800&auto=format&fit=crop',
    tags: ['Hippy Trail', 'Adventure'],
    curatedCount: '7+ Curated Experiences',
    category: 'Hippy Trail'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.94, x: 40 },
  visible: { opacity: 1, scale: 1,    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

export default function DiscoverTheWorld() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredDestinations = DESTINATIONS.filter(
    dest => activeTab === 'All' || dest.tags.includes(activeTab)
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
          {/* Section Label Eyebrow */}
          <div className="section-label justify-center mb-5">
            EXPLORE INDIA
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-6 tracking-tight">
            Discover India&apos;s Hidden&nbsp;Gems
          </h2>
          <p className="text-void/70 text-lg md:text-xl font-body leading-relaxed">
            From mystical backwaters to Himalayan heights — handpicked journeys curated for every kind of soul.
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
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-body border ${
                activeTab === cat
                  ? 'bg-teal text-white border-teal shadow-card-teal'
                  : 'bg-white text-void border-medium hover:border-teal hover:text-teal'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="w-full relative px-6 lg:px-8 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 pt-4 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {filteredDestinations.map((dest) => (
              <motion.div
                key={dest.id}
                variants={cardVariants}
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
                    {dest.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full">
                         {tag}
                       </span>
                    ))}

                    <Link
                      href="/packages"
                      className="ml-auto w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-lime group-hover:text-teal group-hover:border-lime transition-all duration-300"
                      aria-label={`Explore ${dest.title}`}
                    >
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mt-4"
      >
        <Link href="/packages" className="btn-teal btn-shimmer inline-flex">
          View All Journeys
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </motion.div>
    </section>
  );
}
