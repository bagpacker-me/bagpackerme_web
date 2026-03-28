'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignatureRetreats() {
  return (
    <section className="bg-ice py-[var(--space-section)]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label justify-center mb-[16px]">✦ SIGNATURE RETREATS</div>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-void leading-tight mb-6" style={{ textWrap: 'balance', letterSpacing: '-0.02em' }}>
              Corporate Retreats That Actually Work
            </h2>
            <p className="text-void/70 font-sans text-lg mb-8 leading-[1.7]">
              Whether your team has 4 hours or 48 — Recharge & Realign delivers real connection, renewed energy, and clarity of purpose.
            </p>
            <div className="inline-block bg-teal text-white font-display font-bold text-[11px] px-[24px] py-[8px] rounded-none tracking-[0.14em] uppercase">
              step out, breathe deep, and come back stronger
            </div>
          </motion.div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-none shadow-lg hover:shadow-[0_20px_60px_rgba(34,30,42,0.22)] hover:-translate-y-[6px] transition-all duration-600 p-8 md:p-12 relative flex flex-col h-full border border-ice"
          >
            {/* Number Badge */}
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-cyan rounded-none flex items-center justify-center text-void font-heading font-bold text-3xl md:text-4xl shadow-lg border-[4px] border-white z-10">
              1
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                The Express Edition
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-void mb-4">
              HALF-DAY WORKSHOP
            </h3>
            <div className="text-3xl font-heading font-bold text-teal mb-8" style={{ fontVariantNumeric: 'oldstyle-nums' }}>
              ₹{Number(4000).toLocaleString('en-IN')} <span className="text-base text-gray-500 font-sans font-normal">/ person</span>
            </div>

            <div className="flex-grow">
              <h4 className="font-bold text-sm text-void mb-3 uppercase tracking-wider">Includes:</h4>
              <ul className="space-y-3 font-sans text-void/70 text-sm leading-[1.7]">
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Lunch
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> 1 curated group activity
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Welcome refreshments
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Retreat token
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Transfers
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/packages/half-day-workshop" className="card-cta-link inline-flex items-center gap-2">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-none shadow-lg hover:shadow-[0_20px_60px_rgba(34,30,42,0.22)] hover:-translate-y-[6px] transition-all duration-600 p-8 md:p-12 relative flex flex-col h-full border border-ice"
          >
            {/* Number Badge */}
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-teal rounded-none flex items-center justify-center text-white font-heading font-bold text-3xl md:text-4xl shadow-lg border-[4px] border-white z-10">
              2
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                The Deep Dive
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-void mb-4">
              2-DAY RETREAT
            </h3>
            <div className="text-3xl font-heading font-bold text-teal mb-8" style={{ fontVariantNumeric: 'oldstyle-nums' }}>
              ₹{Number(7500).toLocaleString('en-IN')} <span className="text-base text-gray-500 font-sans font-normal">/ person</span>
            </div>

            <div className="flex-grow">
              <h4 className="font-bold text-sm text-void mb-3 uppercase tracking-wider">Includes:</h4>
              <ul className="space-y-3 font-sans text-void/70 text-sm leading-[1.7]">
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Boutique stay
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> All meals included
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> 1 curated group activity
                </li>
                <li className="flex items-start">
                  <span className="text-teal mr-2">✓</span> Retreat kit
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/packages/2-day-retreat" className="card-cta-link inline-flex items-center gap-2">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/packages?category=Corporate+Retreat" className="btn-lime">
            View All Retreat Packages <span className="ml-2">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
