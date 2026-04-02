'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Newspaper, MapPin } from 'lucide-react';

const SERVICES = [
  {
    title: 'Curated Trips',
    desc: '5 signature experiential journeys across India — Culinary, Spiritual, Adventure, Heritage, and the Hippy Trail. Small groups, deep immersion, local expertise.',
    icon: <Compass className="w-8 h-8" style={{ color: '#0ED2E9' }} />,
    number: '01',
  },
  {
    title: 'Travel Media',
    desc: 'Destination guides, travel stories, weekly newsletter, and video content reaching 2,000+ engaged travelers across India and the world.',
    icon: <Newspaper className="w-8 h-8" style={{ color: '#0ED2E9' }} />,
    number: '02',
  },
  {
    title: 'Local Expertise',
    desc: 'Personal itinerary consulting, bespoke trip planning, and connections to vetted local guides, photographers, and experience hosts across India.',
    icon: <MapPin className="w-8 h-8" style={{ color: '#0ED2E9' }} />,
    number: '03',
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-void py-[var(--space-section)] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14,210,233,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label justify-center mb-5">✦ OUR SERVICES</div>
            <h2
              className="font-heading font-bold text-white"
              style={{ fontSize: 'clamp(30px, 4.5vw, 56px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              Three Things We Do Better Than Anyone
            </h2>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="relative bg-white/5 border border-white/10 hover:border-white/20 p-8 md:p-10 group overflow-hidden"
              style={{
                transition: 'background 400ms, transform 350ms, box-shadow 350ms',
              }}
              whileHover={{ y: -6 }}
            >
              {/* Number badge */}
              <span
                className="absolute top-6 right-8 font-display font-bold text-[48px] leading-none select-none pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.03em' }}
              >
                {service.number}
              </span>

              {/* Cyan corner glow */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl -mr-4 -mt-4 pointer-events-none transition-opacity duration-300"
                style={{ background: 'rgba(14,210,233,0.10)' }}
              />

              <div className="mb-6">{service.icon}</div>

              <h3 className="font-heading font-bold text-white mb-4" style={{ fontSize: '22px', lineHeight: 1.2 }}>
                {service.title}
              </h3>
              <p className="font-sans text-white/60 leading-relaxed text-[15px]">{service.desc}</p>

              {/* Bottom lime line on hover */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: 'linear-gradient(90deg, var(--lime), transparent)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
