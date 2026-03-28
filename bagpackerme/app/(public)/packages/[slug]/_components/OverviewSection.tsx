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
    <section id="overview" className="w-full bg-white py-mobile md:py-desktop px-mobile md:px-desktop">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[48px] lg:gap-[64px] relative items-start">
          
          {/* Main Content (65% on desktop basically) */}
          <FadeInSection className="lg:col-span-8 lg:pr-[40px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-[16px] mb-[24px]">
               <div className="h-[1px] w-[32px] bg-[#221E2A]" />
               <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Overview</span>
            </div>
            
            <h2 className="font-display font-bold text-[#221E2A] text-[clamp(2rem,4vw,3rem)] leading-[1.1] mb-[32px]">
              About This Journey
            </h2>

            {/* The overview HTML content from Firestore */}
            <div 
              className="prose prose-lg max-w-[65ch] font-body text-[16px] text-[#4a5568] leading-[1.8] paragraph-gap-[20px]"
              dangerouslySetInnerHTML={{ __html: pkg.overviewHtml }}
            />
          </FadeInSection>

          {/* Sticky Sidebar (35% on desktop) — Spec #8 */}
          <motion.div
            className="lg:col-span-4 hidden lg:block sticky top-[92px] bg-white border border-[rgba(34,30,42,0.08)] p-[32px] z-40"
            initial={shouldReduceMotion ? false : { x: 40, opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.25 }}
          >
            <div className="mb-[24px]">
              <div className="font-display font-bold text-[32px] text-[#221E2A] leading-[1.1]">
                 ₹{pkg.priceInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[12px] font-body text-[#718096]">per person</span>
            </div>

            <div className="space-y-[8px] mb-[24px]">
               <div className="font-body text-[13px] text-[#4a5568]">
                 <strong>Duration:</strong> {pkg.duration}
               </div>
               <div className="font-body text-[13px] text-[#4a5568]">
                 <strong>Group Size:</strong> {pkg.groupSize}
               </div>
               <div className="font-body text-[13px] text-[#4a5568]">
                 <strong>Destinations:</strong> {pkg.destinations?.join(', ')}
               </div>
            </div>

            {/* Separator */}
            <div className="w-full h-[1px] bg-[#E9F5F7] my-[24px]" />

            <div className="flex flex-col gap-[12px]">
              <button 
                onClick={scrollToForm}
                className="w-full bg-lime text-void font-display font-bold uppercase tracking-widest text-[11px] px-6 h-12 hover:bg-[#221E2A] hover:text-white transition-colors duration-300 flex items-center justify-center"
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
            <div className="mt-[24px] space-y-[12px]">
               <div className="flex items-center gap-[12px]">
                  <BadgeCheck className="w-[18px] h-[18px] text-[#718096]" />
                  <span className="font-body text-[12px] text-[#718096]">Free Cancellation</span>
               </div>
               <div className="flex items-center gap-[12px]">
                  <ShieldCheck className="w-[18px] h-[18px] text-[#718096]" />
                  <span className="font-body text-[12px] text-[#718096]">Instant Confirmation</span>
               </div>
               <div className="flex items-center gap-[12px]">
                  <HeartHandshake className="w-[18px] h-[18px] text-[#718096]" />
                  <span className="font-body text-[12px] text-[#718096]">24/7 Support</span>
               </div>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(34,30,42,0.08)] p-4 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
