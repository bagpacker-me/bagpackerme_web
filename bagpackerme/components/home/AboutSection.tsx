/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Map, Leaf, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection() {
  const pillars = [
    {
      icon: <Users className="w-6 h-6 text-brand-cyan" />,
      title: 'COMMUNITY-FIRST',
      desc: 'Started as a travel community, not a company',
    },
    {
      icon: <Map className="w-6 h-6 text-brand-cyan" />,
      title: 'DEEPLY PERSONAL',
      desc: 'No two itineraries are ever the same',
    },
    {
      icon: <Leaf className="w-6 h-6 text-brand-cyan" />,
      title: 'RESPONSIBLE TOURISM',
      desc: 'Local guides, artisans, eco practices',
    },
    {
      icon: <UserCircle className="w-6 h-6 text-brand-cyan" />,
      title: 'FOUNDER-LED',
      desc: 'Real expertise, real accountability',
    },
  ];

  return (
    <section className="bg-[#221E2A] py-[var(--space-section)] overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column (55%) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[55%]"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-brand-cyan text-sm">✦</span>
              <span className="text-brand-cyan font-bold tracking-[0.2em] text-sm uppercase">Who We Are</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-white leading-tight mb-8">
              A Community Built on Real Travel
            </h2>
            
            <motion.blockquote 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-brand-cyan text-2xl font-serif italic border-l-[3px] border-brand-lime pl-6 py-1 mb-8"
            >
              &quot;At BAGPACKERME, we create meaningful journeys that combine culture, adventure, and sustainability.&quot;
            </motion.blockquote>
            
            <p className="text-white/72 font-sans text-base leading-[1.7] mb-12 max-w-2xl">
              Founded in 2020, BAGPACKERME began as a travel community — not a company. We connect adventurous travelers with the real India through curated journeys, authentic local experiences, and a passionate community of explorers. You speak directly with the founder, not a call centre.
            </p>
            
            {/* 2x2 Mini Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {pillars.map((pillar, index) => (
                <motion.div 
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex flex-col gap-3"
                >
                  {pillar.icon}
                  <div>
                    <h3 className="text-white font-heading font-bold text-[13px] tracking-[0.1em] mb-1">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[13px] text-white/60 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/about" className="btn-ghost text-white border-white hover:bg-white hover:text-[#221E2A] inline-flex items-center justify-center">
                Our Story <span className="ml-2">→</span>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column (45%) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[45%] relative h-[600px] lg:h-[700px] hidden md:block"
          >
            {/* Large Portrait Image */}
            <div className="absolute top-10 left-10 w-[70%] h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" 
                alt="Real India Travel" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Top Right Square */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-0 right-0 w-[45%] aspect-square rounded-2xl overflow-hidden shadow-xl z-20 border-[2px] border-brand-teal"
            >
              <img 
                src="https://images.unsplash.com/photo-1514222047879-8ab28e7eb224?auto=format&fit=crop&q=80" 
                alt="Cultural Experience" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Bottom Left Square */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-0 left-0 w-[50%] aspect-square rounded-2xl overflow-hidden shadow-2xl z-30 ring-8 ring-[#221E2A]"
            >
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
                alt="Heritage Journey" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
