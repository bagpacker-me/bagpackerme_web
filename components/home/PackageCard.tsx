import React from 'react';
import Link from 'next/link';
import { formatPackagePriceInr, hasPackagePrice } from '@/lib/packagePricing';
import { Package } from '@/types';
import { ArrowRight, Clock, Users } from 'lucide-react';

export default function PackageCard({ pkg }: { pkg: Package }) {
  const hasPrice = hasPackagePrice(pkg.priceInr);

  return (
    <Link 
      href={`/packages/${pkg.slug}`} 
      className="flex flex-col bg-white border border-medium/10 rounded-[24px] overflow-hidden group hover:shadow-[0_20px_48px_rgba(40,80,86,0.12)] hover:-translate-y-1.5 transition-all duration-500 h-full"
    >
      {/* Image Area with 3/2 Mobile and 4/5 Desktop Aspect Ratio and Hover Overlay */}
      <div className="relative w-full aspect-[3/2] md:aspect-[4/5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={pkg.heroImageUrl} 
          alt={pkg.title} 
          className="object-cover w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-void/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-10 h-10 rounded-full bg-lime text-void flex items-center justify-center mb-2 transition-transform duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
            <ArrowRight className="w-5 h-5" />
          </div>
          <span className="font-display text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
            View Journey
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="mb-4">
          <span className="bg-void/5 text-void/65 border border-void/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase font-display tracking-[0.1em]">
            {pkg.category}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold text-void mb-3 leading-[1.25] group-hover:text-teal transition-colors">
          {pkg.title}
        </h3>
        
        {/* Destinations Tags */}
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.destinations.slice(0, 3).map((dest, idx) => (
              <span key={idx} className="bg-ice text-teal/80 border border-teal/5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.05em] font-body font-medium">
                {dest}
              </span>
            ))}
            {pkg.destinations.length > 3 && (
              <span className="dest-overflow-pill">
                +{pkg.destinations.length - 3} more
              </span>
            )}
          </div>
        )}

        <p className="font-body text-sm text-void/60 mb-5 line-clamp-2 min-h-[40px] leading-relaxed">
          {pkg.tagline}
        </p>

        {/* Details Row */}
        <div className="flex items-center gap-5 text-[11px] font-body text-void/60 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-void/40" />
            <span>{pkg.duration || 'Flexible'}</span>
          </div>
          <div className="w-[1.5px] h-3 bg-void/10" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-void/40" />
            <span>{pkg.groupSize || 'Private'}</span>
          </div>
        </div>

        {/* Price & Link Area */}
        <div className="mt-auto pt-5 border-t border-void/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-void/45 uppercase tracking-[0.08em] font-display font-bold mb-[2px]">
              {hasPrice ? 'Starts From' : 'Pricing'}
            </span>
            <span className="font-display font-bold text-[18px] text-teal leading-none">
              {formatPackagePriceInr(pkg.priceInr)}
              {hasPrice && <span className="text-xs font-normal text-void/50 ml-1 font-body">/psn</span>}
            </span>
          </div>
          <span className="font-display text-teal font-bold text-[12px] tracking-[0.14em] uppercase group-hover:text-lime transition-all duration-300 flex items-center gap-1">
            Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-medium/10 rounded-[24px] overflow-hidden animate-pulse">
      <div className="relative w-full aspect-[3/2] md:aspect-[4/5] bg-void/5" />
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="mb-4 w-20 h-5 bg-void/5 rounded-full" />
        <div className="w-full h-6 bg-void/5 rounded mb-2" />
        <div className="w-3/4 h-6 bg-void/5 rounded mb-4" />
        <div className="w-full h-4 bg-void/5 rounded mb-5" />
        <div className="w-1/2 h-4 bg-void/5 rounded mb-5" />
        <div className="mt-auto pt-5 border-t border-void/5 flex items-center justify-between">
          <div className="w-24 h-10 bg-void/5 rounded" />
          <div className="w-20 h-4 bg-void/5 rounded" />
        </div>
      </div>
    </div>
  );
}
