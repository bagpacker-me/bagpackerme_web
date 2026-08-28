'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { scheduleIdleTask } from '@/lib/browser-idle';
import { PackageMarket, Testimonial } from '@/types';

export default function MemorableMoments({ market = 'global' }: { market?: PackageMarket }) {
  const shouldReduceMotion = useReducedMotion();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  const heading =
    market === 'india'
      ? 'Moments that made every journey unforgettable'
      : 'Travel moments across borders';

  useEffect(() => {
    let mounted = true;
    setTestimonials([]);
    setLoaded(false);

    const cancel = scheduleIdleTask(async () => {
      // REST rather than the Firebase SDK — the section renders a handful of
      // quotes and is hidden when there are none, so it has no business
      // pulling the SDK (and its auth iframe) onto the homepage.
      const { fetchPublishedTestimonials } = await import('@/lib/public-reads-rest');
      const next = await fetchPublishedTestimonials(market);
      if (!mounted) return;
      if (next) setTestimonials(next);
      setLoaded(true);
    }, 1200);

    return () => {
      mounted = false;
      cancel();
    };
  }, [market]);

  // Hidden until there is at least one real, published testimonial. The prior
  // version shipped invented customers with stock-photo avatars; an empty state
  // is more credible than fabricated 5-star reviews (and keeps us clear of the
  // FTC Consumer Reviews Rule). Render nothing while loading, too, so the
  // section never flashes an empty header.
  if (!loaded || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-dark-grain overflow-hidden py-28 md:py-36">
      {/* Header */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl"
          >
            <div className="accent-line" />
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              {heading}
            </h2>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contact?intent=trip"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime text-void px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
            >
              Plan your journey
              <ArrowRight strokeWidth={2} className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Grid container aligned with the header */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {testimonials.map((moment, idx) => {
            const rating = Math.max(0, Math.min(5, Math.round(moment.rating)));
            return (
              <motion.div
                key={moment.id}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={shouldReduceMotion ? undefined : { delay: idx * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="glass-card-dark rounded-[20px] p-6 cursor-default flex flex-col justify-between w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]"
              >
                <div>
                  {/* Image + profile row */}
                  <div className="flex items-start gap-4 mb-4">
                    {moment.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/15">
                        <Image
                          src={moment.avatarUrl}
                          alt={moment.authorName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex w-12 h-12 items-center justify-center rounded-full flex-shrink-0 border border-white/15 bg-white/5 font-display text-base font-bold text-lime"
                      >
                        {moment.authorName.trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-base text-white leading-tight">{moment.authorName}</h4>
                      <p className="font-body text-[11px] text-content-inverse-muted tracking-wide">{moment.location}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  {rating > 0 && (
                    <div className="flex gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-lime text-lime" />
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <p className="font-body text-sm text-white/70 leading-relaxed italic">
                    &ldquo;{moment.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
