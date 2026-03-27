import Image from 'next/image';
import { Package } from '@/types';

export default function HeroSection({ pkg }: { pkg: Package }) {
  return (
    <section className="relative w-full h-[100svh] min-h-[600px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={pkg.heroImageUrl}
          alt={pkg.title}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient Overlay bottom-heavy */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(34,30,42,0)] via-[rgba(34,30,42,0.3)] to-[rgba(34,30,42,0.9)]" />
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[#221E2A] opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('/noise.png')` }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        {/* Breadcrumb & Badge */}
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-lime text-void px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
            {pkg.category}
          </span>
          <span className="text-white/70 text-sm font-body uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
            Home / Trips / {pkg.title}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-white uppercase text-[clamp(48px,7vw,88px)] leading-[0.9] mb-4">
          {pkg.title}
        </h1>

        {/* Tagline */}
        <p className="font-accent italic text-[22px] text-white/80 mb-8 max-w-2xl">
          {pkg.tagline}
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-y-4 gap-x-4 md:gap-x-6">
          <Stat text={pkg.duration} />
          <Divider />
          <Stat text={pkg.groupSize} />
          <Divider />
          <Stat text={`From ₹${pkg.priceInr.toLocaleString('en-IN')}/person`} />
          <Divider />
          <Stat text={`${pkg.destinations?.length || 0} Cities`} />
        </div>
      </div>
    </section>
  );
}

function Stat({ text }: { text: string }) {
  return (
    <span className="text-white text-xs md:text-sm font-display font-semibold uppercase tracking-widest">
      {text}
    </span>
  );
}

function Divider() {
  return <div className="w-[1px] h-4 bg-white/30 hidden sm:block" />;
}
