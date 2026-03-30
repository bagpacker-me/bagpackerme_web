/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Map, Leaf, UserCircle } from 'lucide-react';
import Link from 'next/link';

const PILLARS = [
  {
    icon: <Users className="w-6 h-6 text-cyan" />,
    title: 'COMMUNITY-FIRST',
    desc: 'Started as a travel community, not a company',
  },
  {
    icon: <Map className="w-6 h-6 text-cyan" />,
    title: 'DEEPLY PERSONAL',
    desc: 'No two itineraries are ever the same',
  },
  {
    icon: <Leaf className="w-6 h-6 text-cyan" />,
    title: 'RESPONSIBLE TOURISM',
    desc: 'Local guides, artisans, eco practices',
  },
  {
    icon: <UserCircle className="w-6 h-6 text-cyan" />,
    title: 'FOUNDER-LED',
    desc: 'Real expertise, real accountability',
  },
];

// Properly formed Unsplash URLs with width & quality params
const IMAGES = {
  main: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=85&auto=format&fit=crop',
  top: 'https://images.unsplash.com/photo-1514222047879-8ab28e7eb224?w=600&q=80&auto=format&fit=crop',
  bottom: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80&auto=format&fit=crop',
};

export default function AboutSection() {
  return (
    <section className="bg-void py-[var(--space-section)] overflow-hidden relative">
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-center">

          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[55%]"
          >
            <div className="section-label mb-6">✦ WHO WE ARE</div>

            <h2
              className="font-heading font-bold text-white mb-8"
              style={{
                fontSize: 'clamp(34px, 4.5vw, 56px)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              A Community Built on Real Travel
            </h2>

            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pull-quote mb-8"
            >
              At BAGPACKERME, we create meaningful journeys that combine
              culture, adventure, and sustainability.
            </motion.blockquote>

            <p className="text-white/65 font-sans text-base leading-[1.75] mb-12 max-w-xl">
              Founded in 2020, BAGPACKERME began as a travel community — not a
              company. We connect adventurous travelers with the real India
              through curated journeys, authentic local experiences, and a
              passionate community of explorers. You speak directly with the
              founder, not a call centre.
            </p>

            {/* 2×2 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-12">
              {PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="flex items-start gap-4 p-3 -m-3 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="mt-0.5 flex-shrink-0">{pillar.icon}</div>
                  <div>
                    <h3 className="text-white font-display font-bold text-[12px] tracking-[0.12em] uppercase mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[13px] text-white/55 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/about"
              className="btn-ghost border-white/40 text-white hover:bg-white hover:text-void inline-flex items-center justify-center"
            >
              Our Story →
            </Link>
          </motion.div>

          {/* ── RIGHT COLUMN — Image Collage ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden md:block w-full lg:w-[45%] relative"
            style={{ height: 'clamp(420px, 55vw, 660px)' }}
          >
            {/* Large portrait image — left & top offset */}
            <div
              className="absolute overflow-hidden shadow-2xl"
              style={{
                top: '5%',
                left: '5%',
                width: '65%',
                height: '78%',
                zIndex: 10,
              }}
            >
              <img
                src={IMAGES.main}
                alt="Real India Travel — Taj Mahal"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Top-right accent image */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute overflow-hidden shadow-xl"
              style={{
                top: '0%',
                right: '0%',
                width: '38%',
                aspectRatio: '1',
                zIndex: 20,
                border: '3px solid #285056',
              }}
            >
              <img
                src={IMAGES.top}
                alt="Cultural Experience"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Bottom-right accent image */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute overflow-hidden shadow-2xl"
              style={{
                bottom: '2%',
                right: '2%',
                width: '42%',
                aspectRatio: '1',
                zIndex: 30,
                border: '3px solid #221E2A',
              }}
            >
              <img
                src={IMAGES.bottom}
                alt="Heritage Journey"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Teal glow accent */}
            <div
              className="absolute bottom-10 left-10 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
              style={{ background: 'rgba(40,80,86,0.6)', zIndex: 5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
