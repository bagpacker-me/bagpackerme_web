'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignatureRetreats() {
  return (
    <section className="bg-brand-ice py-[var(--space-section)]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-serif text-brand-teal italic text-2xl md:text-3xl block mb-4">
              Signature Retreats
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-brand-void leading-tight mb-6">
              Corporate Retreats That Actually Work
            </h2>
            <p className="text-brand-void/70 font-sans text-lg mb-8">
              Whether your team has 4 hours or 48 — Recharge & Realign delivers real connection, renewed energy, and clarity of purpose.
            </p>
            <div className="inline-block bg-brand-lime text-brand-void font-sans font-medium text-sm px-6 py-2 rounded-full tracking-wide">
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
            className="bg-white rounded-none shadow-sm hover:shadow-xl transition-shadow duration-300 p-8 md:p-12 relative flex flex-col h-full border border-gray-100"
          >
            {/* Number Badge */}
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-heading font-bold text-3xl md:text-4xl shadow-lg border-[4px] border-white z-10">
              1
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                The Express Edition
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-brand-void mb-4">
              HALF-DAY WORKSHOP
            </h3>
            <div className="text-3xl font-heading font-bold text-brand-teal mb-8">
              ₹4,000 <span className="text-base text-gray-500 font-sans font-normal">/ person</span>
            </div>

            <div className="flex-grow">
              <h4 className="font-bold text-sm text-brand-void mb-3 uppercase tracking-wider">Includes:</h4>
              <ul className="space-y-3 font-sans text-brand-void/70 text-sm">
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Lunch
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> 1 curated group activity
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Welcome refreshments
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Retreat token
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Transfers
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/packages/half-day-workshop" className="text-brand-teal font-bold hover:text-brand-void transition-colors inline-flex items-center">
                Learn More <span className="ml-2">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-none shadow-sm hover:shadow-xl transition-shadow duration-300 p-8 md:p-12 relative flex flex-col h-full border border-gray-100"
          >
            {/* Number Badge */}
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-amber-400 rounded-full flex items-center justify-center text-white font-heading font-bold text-3xl md:text-4xl shadow-lg border-[4px] border-white z-10">
              2
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                The Deep Dive
              </span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-brand-void mb-4">
              2-DAY RETREAT
            </h3>
            <div className="text-3xl font-heading font-bold text-brand-teal mb-8">
              ₹7,500 <span className="text-base text-gray-500 font-sans font-normal">/ person</span>
            </div>

            <div className="flex-grow">
              <h4 className="font-bold text-sm text-brand-void mb-3 uppercase tracking-wider">Includes:</h4>
              <ul className="space-y-3 font-sans text-brand-void/70 text-sm">
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Boutique stay
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> All meals included
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> 1 curated group activity
                </li>
                <li className="flex items-start">
                  <span className="text-brand-teal mr-2">✓</span> Retreat kit
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/packages/2-day-retreat" className="text-brand-teal font-bold hover:text-brand-void transition-colors inline-flex items-center">
                Learn More <span className="ml-2">→</span>
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
