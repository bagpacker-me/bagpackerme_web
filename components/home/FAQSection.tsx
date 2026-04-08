'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: 'What services does Bagpackerme offer?',
    answer: 'We provide fully customized travel planning, including itinerary design, hotel recommendations, transportation, and on-trip concierge support.'
  },
  {
    question: 'Is this a group tour or a private experience?',
    answer: 'All our trips are completely private and tailored to your preferences, pace, and travel style.'
  },
  {
    question: 'When do I need to make a payment?',
    answer: 'A partial payment is required to begin detailed planning, with the remaining balance depending on the scope of services and support during your trip.'
  },
  {
    question: 'What kind of support will I get during the trip?',
    answer: 'You’ll have real-time support via WhatsApp or phone for any changes, delays, or assistance needed while traveling.'
  },
  {
    question: 'Can the itinerary be changed after it’s created?',
    answer: 'Yes, we offer flexible planning and can adjust your itinerary based on your preferences or unexpected changes.'
  },
  {
    question: 'Why should I choose Bagpackerme over booking everything myself?',
    answer: 'We save you time, reduce stress, and provide expert guidance, trusted recommendations, and seamless coordination for a smoother travel experience.'
  },
  {
    question: 'How personalized is the itinerary?',
    answer: 'Every itinerary is built from scratch based on your interests, travel style, pace, and priorities.'
  },
  {
    question: 'Do you help with hotel bookings?',
    answer: 'Yes, we recommend and assist in booking carefully selected, well-located, and reliable hotels.'
  },
  {
    question: 'Can you arrange transportation within the destination?',
    answer: 'Absolutely. We help with routes, private drivers, train bookings, and the most efficient ways to get around.'
  },
  {
    question: 'What destinations do you specialize in?',
    answer: 'We focus on curated, experience-driven travel across select destinations, with deep local insight and planning expertise.'
  },
  {
    question: 'Do you offer last-minute planning?',
    answer: 'We can accommodate last-minute requests depending on availability, but we recommend planning in advance for the best experience.'
  },
  {
    question: 'Will I get a day-by-day itinerary?',
    answer: 'Yes, you\'ll receive a detailed, easy-to-follow day-by-day plan covering all key aspects of your trip.'
  },
  {
    question: 'Can you plan trips for couples, families, or groups?',
    answer: 'Yes, we customize trips for solo travelers, couples, families, and small groups.'
  },
  {
    question: 'What if something goes wrong during the trip?',
    answer: 'We\'re available to support you in real time and help resolve any issues, changes, or unexpected situations.'
  },
  {
    question: 'Do you include activities and experiences in the plan?',
    answer: 'Yes, we recommend and curate experiences that match your interests—from cultural to adventure to relaxation.'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply reach out to us with your travel idea, and we\'ll guide you through the next steps to start planning your journey.'
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
