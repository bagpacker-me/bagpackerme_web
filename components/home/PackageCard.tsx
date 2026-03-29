import React from 'react';
import Link from 'next/link';
import { Package } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className="flex flex-col bg-[#FFFFFF] border border-[rgba(34,30,42,0.06)] rounded-none shadow-sm overflow-hidden group hover:shadow-[0_20px_60px_rgba(34,30,42,0.22)] hover:-translate-y-[6px] transition-all duration-600">
      {/* Image Area with 3/2 Mobile and 4/5 Desktop Aspect Ratio and Hover Overlay */}
      <div className="relative w-full aspect-[3/2] md:aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={pkg.heroImageUrl} 
          alt={pkg.title} 
          className="object-cover w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-void/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center pointer-events-none z-10">
          <ArrowRight className="w-[32px] h-[32px] text-[#FFFFFF] mb-[8px]" />
          <span className="font-display text-[#FFFFFF] text-[16px] tracking-[0.1em] uppercase">View Journey</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-[16px] md:p-[24px] flex flex-col flex-1">
        <div className="mb-[12px]">
          <span className="bg-[#F7F9FA] border border-[rgba(34,30,42,0.06)] text-[#4a5568] px-[8px] py-[4px] text-[10px] uppercase font-body tracking-[0.06em]">{pkg.category}</span>
        </div>
        <h3 className="font-display text-[20px] font-bold text-[#221E2A] mb-[8px] leading-[1.2]">
          {pkg.title}
        </h3>
        
        {/* Destinations Tags */}
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className="flex flex-wrap gap-[8px] mb-[12px]">
            {pkg.destinations.map((dest, idx) => (
              <span key={idx} className="bg-[rgba(34,30,42,0.04)] text-[#718096] px-[8px] py-[2px] text-[10px] uppercase tracking-[0.05em] font-body">
                {dest}
              </span>
            ))}
          </div>
        )}

        <p className="font-body text-[14px] text-[#718096] mb-[16px] line-clamp-2 min-h-[44px] leading-relaxed">
          {pkg.tagline}
        </p>

        {/* Details Row */}
        <div className="flex items-center gap-[16px] text-[12px] font-body text-[#718096] mb-[24px]">
          <div className="flex items-center gap-[4px]">
            <span className="font-semibold text-[#221E2A]">Duration:</span>
            <span>{pkg.duration}</span>
          </div>
          <div className="w-[4px] h-[4px] bg-[rgba(34,30,42,0.2)] rounded-full" />
          <div className="flex items-center gap-[4px]">
            <span className="font-semibold text-[#221E2A]">Group:</span>
            <span>{pkg.groupSize}</span>
          </div>
        </div>

        {/* Price & Link Area */}
        <div className="mt-auto pt-[16px] border-t border-[rgba(34,30,42,0.06)] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#718096] uppercase tracking-[0.05em] font-body mb-[2px]">Starts From</span>
            <span className="font-display font-semibold text-[18px] text-[#285056]">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(pkg.priceInr)}
              <span className="text-[12px] font-normal text-[#718096] ml-[4px]">/psn</span>
            </span>
          </div>
          <Link href={`/packages/${pkg.slug}`} className="font-display text-[#285056] font-bold text-[13px] tracking-[0.1em] uppercase hover:text-[#C1EA00] transition-colors flex items-center gap-[4px]">
            Explore <ArrowRight className="w-[14px] h-[14px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFFFF] border border-[rgba(34,30,42,0.06)] rounded-none shadow-sm overflow-hidden animate-pulse">
      <div className="relative w-full aspect-[3/2] md:aspect-[4/5] bg-[#F7F9FA]" />
      <div className="p-[16px] md:p-[24px] flex flex-col flex-1">
        <div className="mb-[12px] w-[80px] h-[20px] bg-[#F7F9FA]" />
        <div className="w-full h-[24px] bg-[#F7F9FA] mb-[8px]" />
        <div className="w-3/4 h-[24px] bg-[#F7F9FA] mb-[12px]" />
        <div className="w-full h-[16px] bg-[#F7F9FA] mb-[24px]" />
        <div className="w-1/2 h-[16px] bg-[#F7F9FA] mb-[24px]" />
        <div className="mt-auto pt-[16px] border-t border-[rgba(34,30,42,0.06)] flex items-center justify-between">
          <div className="w-[100px] h-[40px] bg-[#F7F9FA]" />
          <div className="w-[80px] h-[16px] bg-[#F7F9FA]" />
        </div>
      </div>
    </div>
  );
}
