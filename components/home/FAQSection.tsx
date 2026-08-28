'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus, Minus, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { HOME_FAQS, type FaqItem } from '@/lib/faq';

const FAQS = HOME_FAQS;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const defaultFaqsCount = 6;
  const visibleFaqs = FAQS.slice(0, defaultFaqsCount);
  const hiddenFaqs = FAQS.slice(defaultFaqsCount);

  const renderFaqItem = (faq: FaqItem, idx: number) => {
    const isOpen = openIndex === idx;
    const panelId = `faq-panel-${idx}`;
    const triggerId = `faq-trigger-${idx}`;
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
            : 'bg-transparent border-medium hover:border-teal/30'
        }`}
      >
        <h3 className="m-0">
          <button
            type="button"
            id={triggerId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            className="flex w-full cursor-pointer justify-between items-center gap-4 p-6 md:p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset rounded-2xl"
          >
            <span className={`font-display font-semibold text-base md:text-lg transition-colors ${
              isOpen ? 'text-teal' : 'text-void/80'
            }`}>
              {faq.question}
            </span>

            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-teal text-white rotate-0'
                : 'bg-void/5 text-void/50'
            }`}>
              {isOpen
                ? <Minus strokeWidth={2} className="w-3.5 h-3.5" />
                : <Plus strokeWidth={2} className="w-3.5 h-3.5" />
              }
            </span>
          </button>
        </h3>

        {/* The answer stays mounted and is collapsed by height, rather than
            being conditionally rendered. Google's structured-data policy
            requires content marked up in FAQPage JSON-LD to be present on the
            page, and an answer that only enters the DOM on click is not present
            for any crawler or AI answer engine — they do not click. Content
            collapsed behind an accordion is explicitly fine to index; content
            that does not exist until an event fires is not. */}
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          initial={false}
          animate={
            shouldReduceMotion
              ? undefined
              : { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
          }
          style={shouldReduceMotion ? { height: isOpen ? 'auto' : 0 } : undefined}
          transition={shouldReduceMotion ? undefined : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <p className="px-6 md:px-7 pb-6 md:pb-7 font-body text-content-muted text-sm md:text-base leading-relaxed pr-8">
            {faq.answer}
          </p>
        </motion.div>
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
            <p className="text-content-muted text-base font-body leading-relaxed mb-8">
              Got questions before your next trip? Here is everything you need to know about starting your journey with BagPackerMe.
            </p>

            {/* Quick Contact Card */}
            <div className="bg-ice/40 border border-medium rounded-2xl p-6 md:p-8">
              <h3 className="font-display font-semibold text-lg text-void mb-2">Still have questions?</h3>
              <p className="font-body text-sm text-content-muted mb-6 leading-relaxed">
                Can&apos;t find what you are looking for? Send us a quick inquiry and we&apos;ll get right back to you.
              </p>
              <Link
                href="/contact"
                // A 16px-tall text link is the smallest kind of target there is.
                // The negative margin keeps its optical position in the card.
                className="inline-flex min-h-[44px] -my-3 items-center gap-2 text-teal font-display text-xs font-bold uppercase tracking-widest hover:text-teal/85 group"
              >
                Let&apos;s chat
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Accordions list */}
          <div className="space-y-3">
            {visibleFaqs.map((faq, idx) => renderFaqItem(faq, idx))}

            {/* Same reasoning as the answer panels: the overflow questions stay
                mounted and are revealed by height so all 16 Q&As are in the
                served HTML, matching what the FAQPage JSON-LD claims. Hiding
                them behind a conditional mount put 10 of 16 answers beyond
                reach of every crawler. aria-hidden + inert keeps the collapsed
                block out of the a11y tree and tab order while it is closed. */}
            <motion.div
              initial={false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { height: showAll ? 'auto' : 0, opacity: showAll ? 1 : 0 }
              }
              style={shouldReduceMotion ? { height: showAll ? 'auto' : 0 } : undefined}
              transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
              aria-hidden={!showAll}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ inert: showAll ? undefined : '' } as any)}
            >
              <div className="space-y-3 pt-3">
                {hiddenFaqs.map((faq, idx) => renderFaqItem(faq, idx + defaultFaqsCount))}
              </div>
            </motion.div>

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
