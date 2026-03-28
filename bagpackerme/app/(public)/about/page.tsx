'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FadeInSection } from '@/components/ui/FadeInSection';

// ─── Animated Counter (spec #5) ───────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  // Spec #5: useMotionValue + useSpring + useTransform
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const isDecimal = target % 1 !== 0;
  const displayVal = useTransform(springVal, (v) =>
    isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (inView && !shouldReduceMotion) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span ref={ref}>
        {isDecimal ? target.toFixed(1) : target.toLocaleString()}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      <motion.span>{displayVal}</motion.span>{suffix}
    </span>
  );
}

// ─── Grain Overlay ────────────────────────────────────────────────────────────
const GrainOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
    }}
  />
);

export default function AboutPage() {
  return (
    <main>
      {/* ── Section 1: Hero ──────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center" style={{ height: '70vh' }}>
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-void/70" />
        <GrainOverlay />

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="section-label justify-center mb-[16px]">✦ ABOUT US</div>
          <h1
            className="font-display text-white leading-none mb-[24px]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            We Are Bagpackerme
          </h1>
          <p className="font-body text-white/80 text-[16px] md:text-[18px] max-w-[600px] mx-auto leading-relaxed">
            A travel community built on real journeys, authentic connections, and a deep love for India.
          </p>
        </motion.div>
      </section>

      {/* ── Section 2: Our Story ─────────────────────────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[120px] px-[24px]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center">
          <FadeInSection className="relative group">
            <div className="grid grid-cols-2 gap-[8px]">
              <div className="col-span-2 overflow-hidden bg-void/5 relative h-[240px] md:h-[320px]">
                <Image
                  src="https://images.unsplash.com/photo-1477587458883-47145ed31f2f?auto=format&fit=crop&w=600&q=80"
                  alt="India travel"
                  fill
                  className="rounded-none object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden bg-void/5 relative h-[160px] md:h-[240px]">
                <Image
                  src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=400&q=80"
                  alt="India stairs"
                  fill
                  className="rounded-none object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden bg-void/5 relative h-[160px] md:h-[240px]">
                <Image
                  src="https://images.unsplash.com/photo-1506461883276-594a12b5bca4?auto=format&fit=crop&w=400&q=80"
                  alt="India group"
                  fill
                  className="rounded-none object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <div className="absolute -bottom-[24px] -right-[24px] md:-right-[40px] bg-lime text-void font-display text-[11px] md:text-[12px] font-bold tracking-widest px-[24px] py-[16px] rounded-none uppercase z-10 border border-[rgba(34,30,42,0.1)]">
              EST. 2020
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="section-label mb-[16px]">✦ OUR STORY</div>
            <h2 className="font-display text-void text-[32px] md:text-[48px] leading-[1.1] mb-[32px]">
              Born from a passion for exploration
            </h2>
            <div className="flex flex-col gap-[16px] font-body text-void/80 text-[15px] md:text-[16px] leading-[1.7]">
              <p>
                BagpackerMe was founded in 2020 as a small community of curious travellers who believed
                India deserved to be explored deeply — not just ticked off a bucket list. What started
                as a WhatsApp group grew into a movement.
              </p>
              <p>
                Today we have guided <strong className="text-void font-bold">1,200+ travellers</strong> across{' '}
                <strong className="text-void font-bold">25+ handpicked destinations</strong> — from the ghats of
                Varanasi to the valleys of Spiti, from the backwaters of Kerala to the deserts of Rajasthan.
              </p>
            </div>
            <div className="mt-[48px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { emoji: '🤝', label: 'Community-First' },
                { emoji: '🌿', label: 'Responsible' },
                { emoji: '👤', label: 'Founder-Led' },
              ].map((v) => (
                <div key={v.label} className="flex flex-col items-center justify-center p-[24px] bg-ice rounded-none border border-void/10">
                  <span className="text-[24px] mb-[8px]">{v.emoji}</span>
                  <span className="font-display text-[11px] font-bold tracking-widest uppercase text-void text-center">{v.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Section 3: Founder ───────────────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-void relative overflow-hidden">
        {/* Grain overlay for dark section */}
        <div className="grain absolute inset-0 z-0 pointer-events-none" />
        <div className="max-w-[1024px] mx-auto relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-white/20 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 flex items-center justify-center p-[40px] bg-white/5">
                <div className="relative">
                  <div className="w-[200px] h-[200px] lg:w-[280px] lg:h-[320px] rounded-none overflow-hidden border border-white/20 shadow-xl group relative">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Kevin — Founder of BagpackerMe"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 bg-lime text-void text-[11px] font-bold font-display tracking-widest px-[16px] py-[8px] rounded-none whitespace-nowrap uppercase">
                    Founder
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-[32px] md:p-[48px] flex flex-col justify-center">
                <div className="section-label mb-[8px]">✦ MEET THE FOUNDER</div>
                <h2 className="font-display text-white text-[32px] md:text-[40px] mb-[4px]">Kevin</h2>
                <p className="text-white/40 font-display font-bold text-[11px] mb-[24px] tracking-widest uppercase">
                  Founder, BAGPACKERME
                </p>
                <p className="font-body text-white/80 leading-[1.7] text-[15px] mb-[32px]">
                  Kevin built BagpackerMe from the ground up — designing every itinerary, walking every
                  trail, and ensuring every traveller returns with stories worth telling. With over a decade
                  of travelling across India, he brings not just routes but real insight, cultural context,
                  and genuine care for each guest&apos;s experience.
                </p>
                <blockquote className="border-l border-lime pl-[24px] py-[8px] italic text-white font-accent text-[20px] leading-snug mb-[32px]">
                  &ldquo;You speak directly with the founder — not a call centre. Real expertise, real accountability.&rdquo;
                </blockquote>
                <div className="flex gap-[16px]">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/bagpackerme/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-[40px] h-[40px] rounded-none border border-white/20 flex items-center justify-center text-[18px] text-white/60 hover:border-lime hover:text-lime transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@BagpackerMe"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-[40px] h-[40px] rounded-none border border-white/20 flex items-center justify-center text-[18px] text-white/60 hover:border-lime hover:text-lime transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919920992026"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-[40px] h-[40px] rounded-none border border-white/20 flex items-center justify-center text-[18px] text-white/60 hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: By the Numbers ────────────────────────────────────────── */}
      <section className="bg-teal py-[80px] md:py-[120px] px-[24px]">
        <div className="max-w-[1024px] mx-auto text-center mb-[48px] md:mb-[64px]">
          <div className="section-label justify-center mb-[16px]">✦ IMPACT</div>
          <h2 className="font-display text-white text-[32px] md:text-[48px]">By the Numbers</h2>
        </div>
        <div className="max-w-[1024px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
          {[
            { target: 1200, suffix: '+', label: 'Travellers' },
            { target: 25, suffix: '+', label: 'Destinations' },
            { isStatic: true, display: '4.5★', label: 'Avg Rating' },
            { target: 2020, suffix: '', label: 'Founded' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-none p-[32px] text-center flex flex-col items-center gap-[8px] border border-white/20"
              style={{ background: 'rgba(255,255,255,0.02)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-white text-[32px] md:text-[48px] font-bold">
                {stat.isStatic ? (
                  <span>{stat.display}</span>
                ) : (
                  <AnimatedCounter target={stat.target!} suffix={stat.suffix} />
                )}
              </div>
              <div className="font-display font-bold text-white/50 text-[11px] tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Media / YouTube ───────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-ice">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-[48px]">
            <div className="section-label justify-center mb-[16px]">✦ OUR SERIES</div>
            <h2 className="font-display text-void text-[32px] md:text-[48px] mb-[8px]">Watch Our Series</h2>
            <p className="font-accent text-teal/80 text-[24px] italic tracking-wide">Balancing the Act</p>
          </div>

          <div className="rounded-none overflow-hidden shadow-xl border border-void/10 aspect-video mb-[48px]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed?listType=user_uploads&list=BagpackerMe&autoplay=0"
              title="BagpackerMe YouTube Channel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="text-center">
            <a
              href="https://www.youtube.com/@BagpackerMe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[8px] font-display font-bold tracking-widest uppercase text-[12px] text-teal hover:text-void transition-colors group border-b border-teal pb-[4px] hover:border-void"
            >
              Watch on YouTube
              <svg
                className="w-[16px] h-[16px] transition-transform group-hover:translate-x-1"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA ───────────────────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-void relative overflow-hidden">
        {/* Grain overlay for dark section */}
        <div className="grain absolute inset-0 z-0 pointer-events-none" />
        <motion.div
          className="max-w-[800px] mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label justify-center mb-[16px]">✦ READY?</div>
          <h2 className="font-display text-white text-[40px] md:text-[64px] leading-[1.1] mb-[24px]">
            Ready for Your<br />Next Journey?
          </h2>
          <p className="font-body text-white/70 text-[16px] md:text-[18px] mb-[48px] max-w-[600px] mx-auto leading-[1.7]">
            Let us craft a journey that goes beyond the ordinary. Speak directly with Kevin and start planning your perfect India adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center min-w-[200px] px-[32px] py-[16px] bg-lime text-void font-display font-bold text-[12px] tracking-widest uppercase rounded-none hover:bg-white transition-colors"
            >
              Explore Trips
            </Link>
            <a
              href="https://wa.me/919920992026"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[8px] min-w-[200px] px-[32px] py-[16px] border border-white/30 text-white font-display font-bold text-[12px] tracking-widest uppercase rounded-none hover:border-white hover:bg-white/10 transition-colors group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-[#25D366] group-hover:text-[#25D366] transition-colors">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
