'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Newspaper, MapPin } from 'lucide-react';

export default function WhatWeDo() {
  const services = [
    {
      title: 'Curated Trips',
      desc: '5 signature experiential journeys across India — Culinary, Spiritual, Adventure, Heritage, and the Hippy Trail. Small groups, deep immersion, local expertise.',
      icon: <Compass className="w-8 h-8 text-cyan" />
    },
    {
      title: 'Travel Media',
      desc: 'Destination guides, travel stories, weekly newsletter, and video content reaching 2,000+ engaged travelers across India and the world.',
      icon: <Newspaper className="w-8 h-8 text-cyan" />
    },
    {
      title: 'Local Expertise',
      desc: 'Personal itinerary consulting, bespoke trip planning, and connections to vetted local guides, photographers, and experience hosts across India.',
      icon: <MapPin className="w-8 h-8 text-cyan" />
    }
  ];

  return (
    <section className="bg-[#221E2A] py-[var(--space-section)]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-cyan text-sm">✦</span>
              <span className="text-cyan font-bold tracking-[0.2em] text-sm uppercase">Our Services</span>
              <span className="text-cyan text-sm">✦</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-white leading-tight">
              Three Things We Do Better Than Anyone
            </h2>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className="bg-[#2a2533] rounded-[32px] shadow-lg border border-white/10 p-8 md:p-10 hover:bg-[#322d3e] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Liquid glass accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan/20 transition-all duration-300" />
              <div className="mb-6">
                {service.icon}
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-4">
                {service.title}
              </h3>
              <p className="font-sans text-white/65 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
