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
      <section className="relative flex items-center justify-center rounded-b-[40px] shadow-sm z-20 overflow-hidden" style={{ height: '70vh' }}>
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-void/70" />
        <GrainOverlay />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal opacity-30 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-[16px] mb-[28px] bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
             <div className="h-[4px] w-[4px] bg-cyan rounded-full animate-pulse" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-cyan">About Us</span>
             <div className="h-[4px] w-[4px] bg-cyan rounded-full" />
          </div>
          <h1
            className="font-display text-white leading-[1.05] drop-shadow-lg mb-[24px]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            We Are Bagpackerme
          </h1>
          <p className="font-body text-white/80 text-[16px] md:text-[20px] max-w-[600px] mx-auto leading-relaxed font-light">
            A travel community built on real journeys, authentic connections, and a deep love for India.
          </p>
        </motion.div>
      </section>

      {/* ── Section 2: Our Story ─────────────────────────────────────────────── */}
      <section className="bg-[#F7F9FA] py-[80px] md:py-[120px] px-[24px]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[80px] items-center">
          <FadeInSection className="relative group">
            <div className="grid grid-cols-2 gap-3 md:gap-4 p-2 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
              <div className="col-span-2 overflow-hidden bg-white relative h-[240px] md:h-[340px] rounded-t-[2rem] rounded-b-xl">
                <Image
                  src="https://images.unsplash.com/photo-1477587458883-47145ed31f2f?auto=format&fit=crop&w=600&q=80"
                  alt="India travel"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="overflow-hidden bg-white relative h-[160px] md:h-[220px] rounded-bl-[2rem] rounded-tr-xl">
                <Image
                  src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=400&q=80"
                  alt="India stairs"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="overflow-hidden bg-white relative h-[160px] md:h-[220px] rounded-br-[2rem] rounded-tl-xl">
                <Image
                  src="https://images.unsplash.com/photo-1506461883276-594a12b5bca4?auto=format&fit=crop&w=400&q=80"
                  alt="India group"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
            <div className="absolute -bottom-[16px] -right-[16px] md:-right-[24px] bg-lime text-void font-display text-[12px] font-extrabold tracking-widest px-[24px] py-[16px] rounded-full uppercase z-10 shadow-lg shadow-lime/20 border border-white">
              EST. 2020
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="flex items-center gap-[16px] mb-[16px]">
               <div className="h-[2px] w-[24px] bg-teal" />
               <span className="font-display font-bold uppercase text-[12px] tracking-[0.2em] text-teal">Our Story</span>
            </div>
            <h2 className="font-display text-void text-[36px] md:text-[48px] leading-[1.15] mb-[32px] font-bold">
              Born from a passion for exploration
            </h2>
            <div className="flex flex-col gap-[20px] font-body text-gray-600 text-[16px] leading-[1.8]">
              <p>
                BagpackerMe was founded in 2020 as a small community of curious travellers who believed
                India deserved to be explored deeply — not just ticked off a bucket list. What started
                as a WhatsApp group grew into a movement.
              </p>
              <p>
                Today we have guided <strong className="text-teal font-bold bg-teal/5 px-2 py-0.5 rounded-md">1,200+ travellers</strong> across{' '}
                <strong className="text-teal font-bold bg-teal/5 px-2 py-0.5 rounded-md">25+ destinations</strong> — from the ghats of
                Varanasi to the valleys of Spiti, from the backwaters of Kerala to the deserts of Rajasthan.
              </p>
            </div>
            <div className="mt-[48px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { emoji: '🤝', label: 'Community' },
                { emoji: '🌿', label: 'Responsible' },
                { emoji: '👤', label: 'Founder-Led' },
              ].map((v) => (
                <div key={v.label} className="flex flex-col items-center justify-center p-[24px] bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1 duration-300 group/feature">
                  <div className="w-12 h-12 rounded-full bg-ice flex items-center justify-center text-[20px] mb-[12px] group-hover/feature:bg-lime/20 transition-colors">
                    {v.emoji}
                  </div>
                  <span className="font-display text-[12px] font-bold tracking-widest uppercase text-void text-center">{v.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Section 3: Founder ───────────────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-void relative overflow-hidden">
        {/* Grain overlay for dark section */}
        <div className="grain absolute inset-0 z-0 pointer-events-none opacity-50" />
        
        {/* Subtle glow effect behind founder box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal opacity-20 blur-[120px] rounded-[100px] pointer-events-none" />

        <div className="max-w-[1024px] mx-auto relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 group/founderBox">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 flex items-center justify-center p-[40px] bg-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent opacity-50 backdrop-blur-sm" />
                <div className="relative z-10">
                  <div className="w-[200px] h-[200px] lg:w-[280px] lg:h-[320px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgb(0,0,0,0.5)] group relative">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Kevin — Founder of BagpackerMe"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover/founderBox:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 bg-lime text-void text-[10px] sm:text-[11px] font-bold font-display tracking-[0.2em] px-[20px] py-[8px] rounded-full whitespace-nowrap uppercase shadow-lg shadow-lime/20 border border-white/20">
                    Founder
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-[32px] md:p-[48px] flex flex-col justify-center">
                <div className="flex items-center gap-[12px] mb-[12px]">
                   <div className="h-[2px] w-[16px] bg-cyan/50" />
                   <span className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-cyan/90">
                     Meet the Founder
                   </span>
                </div>
                <h2 className="font-display text-white text-[36px] md:text-[44px] mb-[4px] font-bold leading-none">Kevin</h2>
                <p className="text-white/60 font-body text-[13px] mb-[32px] uppercase tracking-wider font-semibold">
                  Founder, BAGPACKERME
                </p>
                <p className="font-body text-white/80 leading-[1.8] text-[15px] md:text-[16px] mb-[32px] font-light">
                  Kevin built BagpackerMe from the ground up — designing every itinerary, walking every
                  trail, and ensuring every traveller returns with stories worth telling. With over a decade
                  of travelling across India, he brings not just routes but real insight, cultural context,
                  and genuine care for each guest&apos;s experience.
                </p>
                <blockquote className="border-l-2 border-lime pl-[24px] py-[4px] text-white/90 font-accent text-[22px] md:text-[24px] leading-snug mb-[40px] bg-gradient-to-r from-white/5 to-transparent pr-4">
                  <span className="text-lime text-2xl mr-1">&ldquo;</span>
                  <span className="italic">You speak directly with the founder — not a call centre. Real expertise, real accountability.</span>
                  <span className="text-lime text-2xl ml-1">&rdquo;</span>
                </blockquote>
                <div className="flex gap-[12px]">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/bagpackerme/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-[44px] h-[44px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[18px] text-white/70 hover:border-lime hover:bg-lime hover:text-void hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(193,234,0,0.2)] transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@BagpackerMe"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-[44px] h-[44px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[18px] text-white/70 hover:border-lime hover:bg-lime hover:text-void hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(193,234,0,0.2)] transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919920992026"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-[44px] h-[44px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[18px] text-white/70 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(37,211,102,0.2)] transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
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
      <section className="bg-teal py-[80px] md:py-[120px] px-[24px] relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85')] bg-cover bg-center mix-blend-overlay" />
        
        <div className="max-w-[1024px] mx-auto text-center mb-[48px] md:mb-[64px] relative z-10">
          <div className="flex items-center justify-center gap-[16px] mb-[16px]">
             <div className="h-[2px] w-[24px] bg-white/50" />
             <span className="font-display font-bold uppercase text-[12px] tracking-[0.2em] text-white">Impact</span>
             <div className="h-[2px] w-[24px] bg-white/50" />
          </div>
          <h2 className="font-display text-white text-[36px] md:text-[48px] font-bold">By the Numbers</h2>
        </div>
        <div className="max-w-[1024px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px] relative z-10">
          {[
            { target: 1200, suffix: '+', label: 'Travellers' },
            { target: 25, suffix: '+', label: 'Destinations' },
            { isStatic: true, display: '4.5★', label: 'Avg Rating' },
            { target: 2020, suffix: '', label: 'Founded' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-3xl p-[32px] text-center flex flex-col items-center gap-[8px] border border-white/10 shadow-lg backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-white text-[32px] md:text-[48px] font-bold drop-shadow-md">
                {stat.isStatic ? (
                  <span>{stat.display}</span>
                ) : (
                  <AnimatedCounter target={stat.target!} suffix={stat.suffix} />
                )}
              </div>
              <div className="font-body font-bold text-white/70 text-[12px] tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Media / YouTube ───────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-ice">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-[48px]">
            <div className="flex items-center justify-center gap-[16px] mb-[16px]">
               <div className="h-[2px] w-[24px] bg-teal" />
               <span className="font-display font-bold uppercase text-[12px] tracking-[0.2em] text-teal">Our Series</span>
               <div className="h-[2px] w-[24px] bg-teal" />
            </div>
            <h2 className="font-display text-void text-[36px] md:text-[48px] mb-[8px] font-bold">Watch Our Series</h2>
            <p className="font-accent text-teal/80 text-[24px] italic tracking-wide">Balancing the Act</p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-void/10 aspect-video mb-[48px] bg-void/5">
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
        <div className="grain absolute inset-0 z-0 pointer-events-none opacity-50" />
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime opacity-10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div
          className="max-w-[800px] mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-[16px] mb-[24px]">
             <div className="h-[4px] w-[4px] bg-lime rounded-full animate-pulse" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-lime">Ready?</span>
             <div className="h-[4px] w-[4px] bg-lime rounded-full" />
          </div>
          <h2 className="font-display text-white text-[44px] md:text-[64px] leading-[1.05] mb-[24px] font-bold">
            Ready for Your<br />Next Journey?
          </h2>
          <p className="font-body text-white/70 text-[16px] md:text-[20px] font-light mb-[48px] max-w-[600px] mx-auto leading-[1.7]">
            Let us craft a journey that goes beyond the ordinary. Speak directly with Kevin and start planning your perfect India adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center min-w-[200px] px-[32px] py-[16px] bg-lime text-void font-display font-bold text-[13px] tracking-widest uppercase rounded-full hover:bg-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(193,234,0,0.4)]"
            >
              Explore Trips
            </Link>
            <a
              href="https://wa.me/919920992026"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[8px] min-w-[200px] px-[32px] py-[16px] border border-white/20 text-white font-display font-bold text-[13px] tracking-widest uppercase rounded-full hover:border-white hover:bg-white/5 transition-all hover:scale-105 group backdrop-blur-sm"
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
