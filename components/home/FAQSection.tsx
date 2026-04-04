'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: 'Can I change or cancel my trip after booking?',
    answer: 'Yes! We know plans can change. You can easily update or cancel your trip through your BagPackerMe account — just make sure to check the flexible date options before confirming.'
  },
  {
    question: 'Does BagPackerMe offer group travel options?',
    answer: 'Absolutely. We specialize in curating incredible journeys for solo travelers, couples, and both small and large groups. Contact us for custom group rates.'
  },
  {
    question: 'How do I get travel support during my trip?',
    answer: 'You will have access to 24/7 dedicated support via WhatsApp and phone throughout your entire journey with BagPackerMe.'
  },
  {
    question: 'Can I save destinations to plan later?',
    answer: 'Yes, if you create a BagPackerMe account, you can favorite any destination or package to build your own dream itinerary.'
  },
  {
    question: 'Does BagPackerMe offer special deals or discounts?',
    answer: "We regularly provide early-bird specials and seasonal discounts for our newsletter subscribers. Subscribe below so you don't miss out!"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-surface-lowest py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Eyebrow */}
          <div className="section-label justify-center mb-5">
            FAQ
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-void/60 text-base md:text-lg font-body leading-relaxed max-w-2xl mx-auto">
            Got questions before your next trip? We&apos;ve got you covered — here&apos;s everything you need to know about using BagPackerMe.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-white shadow-card-teal border-teal/20' 
                    : 'bg-transparent border-medium hover:border-teal/30 cursor-pointer'
                }`}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div className="flex justify-between items-center gap-4 p-6 md:p-8">
                  <h3 className={`font-display font-semibold text-lg md:text-xl transition-colors ${
                    isOpen ? 'text-teal' : 'text-void/80'
                  }`}>
                    {faq.question}
                  </h3>

                  {/* Premium Plus/Minus toggle */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen 
                      ? 'bg-teal text-white rotate-0' 
                      : 'bg-void/5 text-void/50 hover:bg-teal/10 hover:text-teal'
                  }`}>
                    {isOpen 
                      ? <Minus className="w-4 h-4" /> 
                      : <Plus className="w-4 h-4" />
                    }
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-6 md:pb-8 font-body text-void/70 text-sm md:text-base leading-relaxed pr-16">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
