'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
    answer: 'We regularly provide early-bird specials and seasonal discounts for our newsletter subscribers. Subscribe below so you don\'t miss out!'
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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-void/60 text-base md:text-lg font-body leading-relaxed max-w-2xl mx-auto">
            Got questions before your next trip? We&apos;ve got you covered here&apos;s everything you need to know about using BagPackerMe.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-[20px] transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white shadow-card-teal border border-subtle p-6 md:p-8' 
                    : 'bg-transparent border border-medium p-6 md:p-8 hover:border-strong cursor-pointer'
                }`}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className={`font-display font-medium text-lg md:text-xl transition-colors ${
                    isOpen ? 'text-void' : 'text-void/80'
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-void text-white' : 'bg-void/5 text-void/50'
                  }`}>
                    {isOpen ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-6 font-body text-void/70 text-sm md:text-base leading-relaxed pr-8">
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
