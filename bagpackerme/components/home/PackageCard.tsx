import React from 'react';
import Link from 'next/link';
import { Package } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className="flex flex-col bg-white border-0 rounded-none shadow-none group">
      {/* Image Area with 4/5 Aspect Ratio and Hover Overlay */}
      <div className="relative w-full aspect-[4/5] img-zoom">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={pkg.heroImageUrl} 
          alt={pkg.title} 
          className="object-cover w-full h-full"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#285056]/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center pointer-events-none z-10">
          <ArrowRight className="w-8 h-8 text-white mb-2" />
          <span className="font-display text-white text-lg tracking-wider">View Journey</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-6 pb-2 flex flex-col flex-1">
        <div className="mb-3">
          <span className="badge">{pkg.category}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-[#221E2A] mb-2 leading-tight">
          {pkg.title}
        </h3>
        
        {/* Destinations Tags */}
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pkg.destinations.map((dest, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-500 px-2 py-0.5 text-[10px] rounded uppercase tracking-wider font-body">
                {dest}
              </span>
            ))}
          </div>
        )}

        <p className="font-body text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
          {pkg.tagline}
        </p>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-xs font-body text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#221E2A]">Duration:</span>
            <span>{pkg.duration}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#221E2A]">Group:</span>
            <span>{pkg.groupSize}</span>
          </div>
        </div>

        {/* Price & Link Area */}
        <div className="mt-auto pt-4 border-t border-[#E9F5F7] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-body">Starts From</span>
            <span className="font-display font-semibold text-lg text-[#285056]">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(pkg.priceInr)}
              <span className="text-sm font-normal text-gray-500"> /psn</span>
            </span>
          </div>
          <Link href={`/packages/${pkg.slug}`} className="font-display text-[#285056] font-bold text-sm tracking-widest uppercase hover:underline flex items-center gap-1">
            Explore &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border-0 rounded-none shadow-none animate-pulse">
      <div className="relative w-full aspect-[4/5] bg-gray-200" />
      <div className="pt-6 pb-2 flex flex-col flex-1">
        <div className="mb-3 w-20 h-5 bg-gray-200" />
        <div className="w-full h-6 bg-gray-200 mb-2" />
        <div className="w-3/4 h-6 bg-gray-200 mb-4" />
        <div className="w-full h-4 bg-gray-200 mb-6" />
        <div className="w-1/2 h-4 bg-gray-200 mb-6" />
        <div className="mt-auto pt-4 border-t border-[#E9F5F7] flex items-center justify-between">
          <div className="w-24 h-10 bg-gray-200" />
          <div className="w-16 h-4 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
