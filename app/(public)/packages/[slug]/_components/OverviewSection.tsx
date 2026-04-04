'use client';

import { Package } from '@/types';
import { BadgeCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeInSection } from '@/components/ui/FadeInSection';

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function OverviewSection({ pkg }: { pkg: Package }) {
  const shouldReduceMotion = useReducedMotion();
  const scrollToForm = () => {
    const el = document.getElementById('book');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/919920992026?text=${encodeURIComponent(`Hi, I'm interested in the ${pkg.title} trip.`)}`;

  return (
    <section id="overview" className="w-full bg-white py-[64px] md:py-[96px] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[48px] lg:gap-[64px] relative items-start">

          {/* Main Content (65% on desktop) */}
          <FadeInSection className="lg:col-span-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-[16px] mb-[24px]">
               <div className="h-[1px] w-[32px] bg-[#221E2A]" />
               <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Overview</span>
            </div>

            <h2 className="font-display font-bold text-[#221E2A] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] mb-[28px]">
              About This Journey
            </h2>

            {/* description HTML content from Firestore */}
            <div
              className="prose prose-lg max-w-[65ch] font-body text-[16px] text-[#4a5568] leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: pkg.overviewHtml }}
            />
          </FadeInSection>

          {/* Sticky Sidebar (35% on desktop) */}
          <motion.div
            className="lg:col-span-4 hidden lg:block sticky top-[136px] bg-white border border-[rgba(34,30,42,0.10)] border-l-[3px] border-l-teal p-[32px] shadow-lg z-30"
            initial={shouldReduceMotion ? false : { x: 40, opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.25 }}
          >
            <div className="mb-[20px]">
              <div className="font-display font-bold text-[34px] text-[#221E2A] leading-[1.05]">
                 ₹{pkg.priceInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[12px] font-body text-[#718096]">per person</span>
            </div>

            <div className="space-y-[10px] mb-[24px]">
               <div className="flex justify-between font-body text-[13px] text-[#4a5568] py-[6px] border-b border-[rgba(34,30,42,0.05)]">
                 <span className="font-semibold text-[#221E2A]">Duration</span>
                 <span>{pkg.duration}</span>
               </div>
               <div className="flex justify-between font-body text-[13px] text-[#4a5568] py-[6px] border-b border-[rgba(34,30,42,0.05)]">
                 <span className="font-semibold text-[#221E2A]">Group Size</span>
                 <span>{pkg.groupSize}</span>
               </div>
               <div className="flex justify-between font-body text-[13px] text-[#4a5568] py-[6px]">
                 <span className="font-semibold text-[#221E2A]">Destinations</span>
                 <span className="text-right max-w-[140px]">{pkg.destinations?.join(', ')}</span>
               </div>
            </div>

            {/* Separator */}
            <div className="w-full h-[1px] bg-[#E9F5F7] my-[20px]" />

            <div className="flex flex-col gap-[12px]">
              <button
                onClick={scrollToForm}
                className="w-full bg-lime text-void font-display font-bold uppercase tracking-widest text-[11px] px-6 h-12 hover:bg-[#221E2A] hover:text-white transition-colors duration-300 flex items-center justify-center rounded-none"
              >
                Enquire Now
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-transparent border border-teal text-teal font-display font-bold uppercase tracking-widest text-[11px] px-6 h-12 hover:bg-teal hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                Call Us
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-[20px] pt-[16px] border-t border-[rgba(34,30,42,0.05)] space-y-[10px]">
               <div className="flex items-center gap-[10px] p-2 -m-2 hover:bg-ice transition-colors duration-200">
                  <BadgeCheck className="w-[16px] h-[16px] text-[#22c55e]" />
                  <span className="font-body text-[12px] text-[#718096]">Free Cancellation</span>
               </div>
               <div className="flex items-center gap-[10px] p-2 -m-2 hover:bg-ice transition-colors duration-200">
                  <ShieldCheck className="w-[16px] h-[16px] text-[#22c55e]" />
                  <span className="font-body text-[12px] text-[#718096]">Instant Confirmation</span>
               </div>
               <div className="flex items-center gap-[10px] p-2 -m-2 hover:bg-ice transition-colors duration-200">
                  <HeartHandshake className="w-[16px] h-[16px] text-[#22c55e]" />
                  <span className="font-body text-[12px] text-[#718096]">24/7 Support</span>
               </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[rgba(34,30,42,0.08)] p-4 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="font-display font-bold text-[20px] text-[#221E2A] leading-none">
            ₹{pkg.priceInr.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-body text-[#718096]">per person</span>
        </div>
        <button
          onClick={scrollToForm}
          className="bg-lime text-void font-display font-bold uppercase tracking-widest text-[11px] px-6 h-12 flex items-center justify-center hover:bg-[#221E2A] hover:text-white transition-colors duration-300"
        >
          Book Now
        </button>
      </div>
    </section>
  );
}
