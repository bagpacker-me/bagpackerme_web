import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPackageMarket, getPackagePrimaryPrice, hasPackageMarketPrice } from '@/lib/packagePricing';
import { Package, PackageMarket } from '@/types';
import { ArrowRight, Clock, MapPin, Users } from 'lucide-react';

const FALLBACK_IMAGE = '/web_photos/hero_1.webp';

export default function PackageCard({ pkg, market }: { pkg: Package; market?: PackageMarket }) {
  const resolvedMarket = market ?? getPackageMarket(pkg);
  const hasPrice = hasPackageMarketPrice(pkg, resolvedMarket);
  const price = getPackagePrimaryPrice(pkg, resolvedMarket);
  const href = `${resolvedMarket === 'india' ? '/in' : ''}/packages/${pkg.slug}`;
  const destinations = (pkg.destinations ?? []).filter(Boolean);

  return (
    <Link 
      href={href}
      aria-label={`Explore ${pkg.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-medium/10 bg-white shadow-[0_10px_30px_rgba(40,80,86,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_54px_rgba(40,80,86,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
    >
      {/* A landscape-led cover gives every India route the same calm, editorial
          rhythm while still leaving enough room for the real destination. */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-void/10">
        <Image
          src={pkg.heroImageUrl || FALLBACK_IMAGE}
          alt={pkg.heroImageAlt || pkg.title}
          width={760}
          height={950}
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
          quality={65}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.055]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(34,30,42,0.08)_18%,rgba(34,30,42,0.04)_46%,rgba(34,30,42,0.72)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-void/55 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          {pkg.category}
        </span>
        {pkg.duration?.trim() && (
          <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-body text-[11px] font-medium text-white backdrop-blur-sm">
            {pkg.duration}
          </span>
        )}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          {destinations.length > 0 && (
            <span className="line-clamp-1 font-body text-xs font-medium text-white/90 drop-shadow-sm">
              {destinations.slice(0, 3).join(' · ')}
            </span>
          )}
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime text-void shadow-lg transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
            <ArrowRight className="size-4" />
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-void/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            View journey
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="min-h-[3.15rem] font-display text-xl font-bold leading-[1.25] text-void transition-colors group-hover:text-teal">
          <span className="line-clamp-2">{pkg.title}</span>
        </h3>

        {pkg.tagline?.trim() && (
          <p className="mt-3 line-clamp-2 min-h-[2.75rem] font-body text-sm leading-relaxed text-content-muted">
            {pkg.tagline}
          </p>
        )}

        {destinations.length > 0 && (
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-teal/75">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1 font-body font-medium">{destinations.join(' · ')}</span>
          </div>
        )}

        {/* Details Row */}
        <div className="mb-5 mt-4 flex items-center gap-4 text-[11px] font-body text-content-muted">
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
        <div className="mt-auto flex items-center justify-between border-t border-void/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-content-subtle uppercase tracking-[0.08em] font-display font-bold mb-[2px]">
              {hasPrice ? 'Starts From' : 'Pricing'}
            </span>
            <span className="font-display font-bold text-[18px] text-teal leading-none">
              {price.label}
              {hasPrice && <span className="text-xs font-normal text-void/50 ml-1 font-body">/psn</span>}
            </span>
          </div>
          <span className="flex items-center gap-1 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-teal transition-all duration-300 group-hover:text-lime">
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
      <div className="relative aspect-[16/11] w-full bg-void/5" />
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
