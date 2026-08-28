import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { PackageMarket } from '@/types';

const HERO_BY_MARKET = {
  global: {
    headline: 'Private journeys, designed around you',
    description:
      'Island waters, lantern-lit streets, and slow safari days — shaped around your pace.',
    image:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=60&w=1600',
    alt: 'Pattaya coastline with boats on blue water',
    packagesHref: '/packages',
    destinations: [
      { label: 'Thailand', href: '/packages' },
      { label: 'Vietnam', href: '/packages' },
      { label: 'Kenya', href: '/packages' },
    ],
  },
  india: {
    headline: 'Experiential India, designed around you',
    description:
      'Ancient cities, quiet coastlines, and remarkable stays — planned around the way you want to travel.',
    image: '/web_photos/hero_1.webp',
    alt: 'India travel destination',
    packagesHref: '/in/packages',
    destinations: [
      { label: 'Delhi', href: '/in/packages' },
      { label: 'Agra', href: '/in/packages' },
      { label: 'Jaipur', href: '/in/packages' },
    ],
  },
} as const;

/**
 * The first hero frame is deliberately a Server Component. It gives the
 * browser meaningful text, links and the actual LCP image in the initial HTML,
 * instead of making their first paint wait for carousel hydration.
 */
export default function Hero({ market = 'global' }: { market?: PackageMarket }) {
  const hero = HERO_BY_MARKET[market];

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-void font-sans text-white">
      <Image
        src={hero.image}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        quality={60}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/20" />

      <div className="absolute inset-y-0 left-0 z-10 flex w-full flex-col justify-center px-6 pb-28 md:w-[55%] md:px-12 md:pb-0 lg:px-16">
        <h1 className="mb-6 max-w-[14ch] font-display text-[clamp(38px,6.5vw,84px)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          {hero.headline}
        </h1>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-lime" aria-hidden="true" />
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
            Tailor-made travel
          </span>
        </div>
        <p className="mb-8 max-w-md font-body text-base leading-relaxed text-content-inverse-muted md:text-lg">
          {hero.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?intent=trip"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void active:translate-y-0 active:scale-[0.98]"
          >
            Start planning
            <ArrowRight strokeWidth={2} className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={hero.packagesHref}
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            Explore trips
          </Link>
        </div>
      </div>

      <nav
        aria-label="Featured journey regions"
        className="absolute bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))] left-6 z-10 flex flex-wrap gap-x-5 gap-y-2 pr-20 font-display text-[11px] font-bold uppercase tracking-[0.18em] md:left-12 lg:left-16"
      >
        {hero.destinations.map((destination) => (
          <Link
            key={destination.label}
            href={destination.href}
            className="text-content-inverse-muted underline decoration-white/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            {destination.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
