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
    <section id="inclusions" className="w-full bg-[#F0F7F8] py-[64px] md:py-[96px] px-mobile md:px-desktop">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <FadeInSection className="mb-[48px] md:mb-[64px] flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[20px]">
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Inclusions</span>
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
          </div>
          <h2 className="text-[#221E2A] font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            What&apos;s Included
          </h2>
        </FadeInSection>

        {/* 2-Column List Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[64px] max-w-5xl mx-auto">

          {/* Included */}
          <FadeInSection delay={0.1} className="bg-white p-[32px] shadow-sm border border-[rgba(34,30,42,0.05)]">
            <h3 className="font-display text-[17px] font-bold text-[#221E2A] mb-[20px] flex items-center gap-[10px]">
              <span className="w-[24px] h-[24px] bg-[#dcfce7] flex items-center justify-center shrink-0">
                <Check className="w-[14px] h-[14px] text-[#22c55e]" />
              </span>
              Included in the Price
            </h3>
            <ul className="flex flex-col">
               {includedItems.map((item, idx) => (
                 <li key={idx} className="flex items-center gap-[14px] py-[10px] border-b border-[rgba(34,30,42,0.05)] last:border-0">
                    <Check className="w-[16px] h-[16px] text-[#22c55e] shrink-0" />
                    <span className="font-body text-[14px] text-[#4a5568]">
                       {item.label}
                    </span>
                 </li>
               ))}
               <li className="flex items-center gap-[14px] py-[10px]">
                    <Check className="w-[16px] h-[16px] text-[#22c55e] shrink-0" />
                    <span className="font-body text-[14px] text-[#4a5568]">
                       24/7 On-ground Support
                    </span>
               </li>
            </ul>
          </FadeInSection>

          {/* Excluded */}
          <FadeInSection delay={0.2} className="bg-white p-[32px] shadow-sm border border-[rgba(34,30,42,0.05)]">
            <h3 className="font-display text-[17px] font-bold text-[#221E2A] mb-[20px] flex items-center gap-[10px]">
              <span className="w-[24px] h-[24px] bg-[#fee2e2] flex items-center justify-center shrink-0">
                <X className="w-[14px] h-[14px] text-[#ef4444]" />
              </span>
              Not Included
            </h3>
            <ul className="flex flex-col">
               {excludedItems.map((item, idx) => (
                 <li key={`ex-${idx}`} className="flex items-center gap-[14px] py-[10px] border-b border-[rgba(34,30,42,0.05)] last:border-0">
                    <X className="w-[16px] h-[16px] text-[#ef4444] shrink-0" />
                    <span className="font-body text-[14px] text-[#4a5568]">
                       {item.label}
                    </span>
                 </li>
               ))}
               {otherExclusions.map((exclusion, idx) => (
                 <li key={`o-ex-${idx}`} className="flex items-center gap-[14px] py-[10px] border-b border-[rgba(34,30,42,0.05)] last:border-0">
                    <X className="w-[16px] h-[16px] text-[#ef4444] shrink-0" />
                    <span className="font-body text-[14px] text-[#4a5568]">
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
