import { Package } from '@/types';
import { Check, X } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';

export default function WhatsIncluded({ pkg }: { pkg: Package }) {
  if (!pkg.inclusions) return null;
  const inc = pkg.inclusions;

  const items = [
    { label: 'Accommodation', included: inc.accommodation },
    { label: 'Meals (as per itinerary)', included: inc.meals },
    { label: 'Transfers & Transportation', included: inc.transfers },
    { label: 'Expert Guides', included: inc.guides },
    { label: 'Domestic/International Flights', included: inc.flights },
    { label: 'Activities & Entrance Fees', included: inc.activities }
  ];

  const includedItems = items.filter(i => i.included);
  const excludedItems = items.filter(i => !i.included);
  const otherExclusions = pkg.exclusions || [];

  return (
    <section id="inclusions" className="w-full bg-[#E9F5F7] py-mobile md:py-desktop px-mobile md:px-desktop">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <FadeInSection className="mb-[48px] md:mb-[64px] flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[24px]">
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Inclusions</span>
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
          </div>
          <h2 className="text-[#221E2A] font-display text-[clamp(2rem,4vw,3rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            What&apos;s Included
          </h2>
        </FadeInSection>

        {/* 2-Column List Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] md:gap-[80px] max-w-5xl mx-auto">
          
          {/* Included */}
          <FadeInSection delay={0.1}>
            <h3 className="font-display text-[18px] font-bold text-[#221E2A] mb-[24px]">Included in the Price</h3>
            <ul className="flex flex-col">
               {includedItems.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-[16px] py-[12px] border-b border-[rgba(34,30,42,0.06)]">
                    <Check className="w-[18px] h-[18px] text-[#22c55e] shrink-0 mt-[4px]" />
                    <span className="font-body text-[15px] text-[#4a5568] leading-[1.6]">
                       {item.label}
                    </span>
                 </li>
               ))}
               {/* Note about itinerary covering specific meals and activities */}
               <li className="flex items-start gap-[16px] py-[12px] border-b border-[rgba(34,30,42,0.06)]">
                    <Check className="w-[18px] h-[18px] text-[#22c55e] shrink-0 mt-[4px]" />
                    <span className="font-body text-[15px] text-[#4a5568] leading-[1.6]">
                       24/7 On-ground Support
                    </span>
               </li>
            </ul>
          </FadeInSection>

          {/* Excluded */}
          <FadeInSection delay={0.2}>
            <h3 className="font-display text-[18px] font-bold text-[#221E2A] mb-[24px]">Not Included</h3>
            <ul className="flex flex-col">
               {excludedItems.map((item, idx) => (
                 <li key={`ex-${idx}`} className="flex items-start gap-[16px] py-[12px] border-b border-[rgba(34,30,42,0.06)]">
                    <X className="w-[18px] h-[18px] text-[#ef4444] shrink-0 mt-[4px]" />
                    <span className="font-body text-[15px] text-[#4a5568] leading-[1.6]">
                       {item.label}
                    </span>
                 </li>
               ))}
               {otherExclusions.map((exclusion, idx) => (
                 <li key={`o-ex-${idx}`} className="flex items-start gap-[16px] py-[12px] border-b border-[rgba(34,30,42,0.06)]">
                    <X className="w-[18px] h-[18px] text-[#ef4444] shrink-0 mt-[4px]" />
                    <span className="font-body text-[15px] text-[#4a5568] leading-[1.6]">
                       {exclusion}
                    </span>
                 </li>
               ))}
            </ul>
          </FadeInSection>
          
        </div>

      </div>
    </section>
  );
}
