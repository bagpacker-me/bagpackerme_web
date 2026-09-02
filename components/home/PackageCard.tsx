import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPackageMarket, getPackagePrimaryPrice, hasPackageMarketPrice } from '@/lib/packagePricing';
import { Package, PackageMarket } from '@/types';
import { ArrowRight, Clock, Users } from 'lucide-react';

const FALLBACK_IMAGE = '/web_photos/hero_1.webp';

export default function PackageCard({ pkg, market }: { pkg: Package; market?: PackageMarket }) {
  const resolvedMarket = market ?? getPackageMarket(pkg);
  const hasPrice = hasPackageMarketPrice(pkg, resolvedMarket);
  const price = getPackagePrimaryPrice(pkg, resolvedMarket);
  const href = `${resolvedMarket === 'india' ? '/in' : ''}/packages/${pkg.slug}`;

  return (
    <Link 
      href={href}
      className="flex flex-col bg-white border border-medium/10 rounded-[24px] overflow-hidden group hover:shadow-[0_20px_48px_rgba(40,80,86,0.12)] hover:-translate-y-1.5 transition-all duration-500 h-full"
    >
      {/* Image Area with 3/2 Mobile and 4/5 Desktop Aspect Ratio and Hover Overlay */}
      <div className="relative w-full aspect-[3/2] md:aspect-[4/5] overflow-hidden">
        <Image
          src={pkg.heroImageUrl || FALLBACK_IMAGE}
          alt={pkg.title}
          width={760}
          height={950}
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
          quality={60}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
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
        <div className="mb-2.5">
          <span className="bg-void/5 text-void/65 border border-void/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase font-display tracking-[0.1em]">
            {pkg.category}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold text-void mb-2 leading-[1.25] group-hover:text-teal transition-colors">
          {pkg.title}
        </h3>
        
        {/* Destinations Tags */}
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 ${pkg.tagline?.trim() ? 'mb-3' : 'mb-5'}`}>
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

        {pkg.tagline?.trim() && (
          <p className="font-body text-sm text-content-muted mb-4 line-clamp-2 leading-relaxed">
            {pkg.tagline}
          </p>
        )}

        {/* Details Row */}
        <div className="flex items-center gap-5 text-[11px] font-body text-content-muted mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-content-subtle" />
            <span>{pkg.duration || 'Flexible'}</span>
          </div>
          <div className="w-[1.5px] h-3 bg-void/10" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-content-subtle" />
            <span>{pkg.groupSize || 'Private'}</span>
          </div>
        </div>

        {/* Price & Link Area */}
        <div className="mt-auto pt-4 border-t border-void/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-content-subtle uppercase tracking-[0.08em] font-display font-bold mb-[2px]">
              {hasPrice ? 'Starts From' : 'Pricing'}
            </span>
            <span className="font-display font-bold text-[18px] text-teal leading-none">
              {price.label}
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
        {/* Category */}
        <div className="mb-2.5 w-20 h-5 bg-void/5 rounded-full" />
        
        {/* Title */}
        <div className="w-full h-6 bg-void/5 rounded mb-1.5" />
        <div className="w-3/4 h-6 bg-void/5 rounded mb-3" />
        
        {/* Destination tags */}
        <div className="w-1/3 h-5 bg-void/5 rounded-full mb-4" />

        {/* Details Row */}
        <div className="w-1/2 h-4 bg-void/5 rounded mb-5" />

        {/* Price & Link Area */}
        <div className="mt-auto pt-4 border-t border-void/5 flex items-center justify-between">
          <div className="w-24 h-10 bg-void/5 rounded" />
          <div className="w-20 h-4 bg-void/5 rounded" />
        </div>
      </div>
    </div>
  );
}
