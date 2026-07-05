'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Minus, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
  const [showAll, setShowAll] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const defaultFaqsCount = 6;
  const visibleFaqs = FAQS.slice(0, defaultFaqsCount);
  const hiddenFaqs = FAQS.slice(defaultFaqsCount);

  const renderFaqItem = (faq: typeof FAQS[0], idx: number) => {
    const isOpen = openIndex === idx;
    return (
      <motion.div 
        key={idx}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={shouldReduceMotion ? undefined : { duration: 0.4 }}
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen 
            ? 'bg-white shadow-card-teal border-teal/20' 
            : 'bg-transparent border-medium hover:border-teal/30 cursor-pointer'
        }`}
        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
      >
        <div className="flex justify-between items-center gap-4 p-6 md:p-7">
          <h3 className={`font-display font-semibold text-base md:text-lg transition-colors ${
            isOpen ? 'text-teal' : 'text-void/80'
          }`}>
            {faq.question}
          </h3>

          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-teal text-white rotate-0' 
              : 'bg-void/5 text-void/50'
          }`}>
            {isOpen 
              ? <Minus strokeWidth={2} className="w-3.5 h-3.5" /> 
              : <Plus strokeWidth={2} className="w-3.5 h-3.5" />
            }
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={shouldReduceMotion ? undefined : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <p className="px-6 md:px-7 pb-6 md:pb-7 font-body text-void/70 text-sm md:text-base leading-relaxed pr-8">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="bg-surface-lowest py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="split-layout">
          {/* Left Column: Heading and Info card */}
          <div className="lg:sticky lg:top-28">
            <div className="accent-line-cyan" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-void mb-5 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-void/60 text-base font-body leading-relaxed mb-8">
              Got questions before your next trip? Here is everything you need to know about starting your journey with BagPackerMe.
            </p>

            {/* Quick Contact Card */}
            <div className="bg-ice/40 border border-medium rounded-2xl p-6 md:p-8">
              <h3 className="font-display font-semibold text-lg text-void mb-2">Still have questions?</h3>
              <p className="font-body text-sm text-void/60 mb-6 leading-relaxed">
                Can&apos;t find what you are looking for? Send us a quick inquiry and we&apos;ll get right back to you.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 text-teal font-display text-xs font-bold uppercase tracking-widest hover:text-teal/85 group"
              >
                Let&apos;s chat
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Accordions list */}
          <div className="space-y-3">
            {visibleFaqs.map((faq, idx) => renderFaqItem(faq, idx))}

            <AnimatePresence initial={false}>
              {showAll && (
                <motion.div
                  initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden space-y-3 pt-3"
                >
                  {hiddenFaqs.map((faq, idx) => renderFaqItem(faq, idx + defaultFaqsCount))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 rounded-full border border-teal text-teal hover:bg-teal hover:text-white px-6 py-3 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-card-teal active:scale-[0.98] cursor-pointer"
              >
                {showAll ? (
                  <>
                    Show less questions
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show all questions ({FAQS.length})
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
