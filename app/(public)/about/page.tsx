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
import VideoPlayer from '@/components/ui/video-player';

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  useGrouping = true,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  useGrouping?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();
  const isDecimal = target % 1 !== 0;
  const formatValue = (value: number) =>
    isDecimal
      ? value.toFixed(1)
      : new Intl.NumberFormat('en-US', {
          useGrouping,
          maximumFractionDigits: 0,
        }).format(Math.round(value));

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 100, damping: 30 });
  const displayVal = useTransform(springVal, formatValue);

  useEffect(() => {
    if (inView && !shouldReduceMotion) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span ref={ref}>
        {prefix}{formatValue(target)}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {prefix}<motion.span>{displayVal}</motion.span>{suffix}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-white">
      {/* ── Section 1: Hero Header ───────────────────────────────────────────── */}
      <div className="relative bg-teal pt-[160px] md:pt-[200px] pb-[160px] md:pb-[240px] overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative text-center max-w-[800px] mx-auto px-[24px]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
              About Us
            </div>
            <h1 className="font-display text-white text-[44px] md:text-[72px] font-bold leading-[1.1] mb-6">
              We Are Bagpackerme
            </h1>
            <p className="font-body text-white/80 text-[16px] md:text-[20px] leading-relaxed max-w-[600px] mx-auto">
              A travel community built on real journeys, authentic connections, and a deep love for India.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Section 2: Hero Image Banner ─────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-[24px] pb-[80px] md:pb-[120px] -mt-[100px] md:-mt-[160px] relative z-10">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-void rounded-3xl md:rounded-[40px] overflow-hidden relative aspect-[4/3] md:aspect-[16/7] w-full shadow-2xl"
        >
          <Image 
            src="/web_photos/about_us.webp" 
            alt="About BagpackerMe" 
            fill 
            priority
            className="object-cover object-bottom opacity-90 z-0 scale-105 hover:scale-100 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>
      </div>

      {/* ── Section 3: Our Story ─────────────────────────────────────────────── */}
      <section className="bg-[#fafafa] py-[80px] md:py-[120px] px-[24px] border-y border-void/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[80px] items-center">
          
          <FadeInSection className="relative group p-[20px] md:p-[24px] bg-white rounded-[32px] border border-void/5 shadow-sm transition-shadow hover:shadow-xl hover:-translate-y-1">
            <div className="grid grid-cols-2 gap-[12px] md:gap-[16px]">
              <div className="col-span-2 overflow-hidden relative h-[240px] md:h-[340px] rounded-2xl">
                <Image
                  src="/web_photos/about_1.webp"
                  alt="India travel"
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="overflow-hidden relative h-[160px] md:h-[220px] rounded-2xl">
                <Image
                  src="/web_photos/about_2.webp"
                  alt="India journey"
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="overflow-hidden relative h-[160px] md:h-[220px] rounded-2xl">
                <Image
                  src="/web_photos/about_3.webp"
                  alt="India group"
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className="absolute -bottom-[16px] -right-[16px] sm:-bottom-[24px] sm:-right-[24px] bg-lime text-void font-display text-[14px] font-bold tracking-widest px-[32px] py-[16px] rounded-full uppercase z-10 shadow-lg select-none">
              EST. 2020
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="section-label text-teal before:bg-teal mb-[16px]">
               ✦ Our Story
            </div>
            <h2 className="font-display text-void text-[32px] md:text-[48px] leading-[1.1] mb-[32px] font-bold">
              Born from a passion for exploration
            </h2>
            <div className="flex flex-col gap-[20px] font-body text-void/70 text-[16px] md:text-[18px] leading-relaxed">
              <p>
                BagpackerMe was founded in 2020 as a small community of curious travellers who believed
                India deserved to be explored deeply — not just ticked off a bucket list. What started
                as a WhatsApp group grew into a movement.
              </p>
              <p>
                Today we have guided <strong className="text-teal font-bold bg-teal/5 px-2 py-0.5 rounded-lg">1,200+ travellers</strong> across{' '}
                <strong className="text-teal font-bold bg-teal/5 px-2 py-0.5 rounded-lg">25+ destinations</strong> — from the ghats of
                Varanasi to the valleys of Spiti, from the backwaters of Kerala to the deserts of Rajasthan.
              </p>
            </div>
            
            <div className="mt-[48px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { emoji: '🤝', label: 'Community' },
                { emoji: '🌿', label: 'Responsible' },
                { emoji: '💡', label: 'Founder-Led' },
              ].map((v) => (
                <div key={v.label} className="bg-white rounded-3xl p-[24px] border border-void/5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-teal/10 group">
                  <div className="w-[56px] h-[56px] rounded-full bg-ice flex items-center justify-center text-[24px] mb-[16px] transition-transform duration-300 group-hover:scale-110 group-hover:bg-lime/20">
                    {v.emoji}
                  </div>
                  <span className="font-display text-[14px] font-bold text-void">{v.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Section 4: By the Numbers ────────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[64px]">
            <div className="section-label justify-center text-teal before:bg-teal mb-[16px]">
               ✦ Impact
            </div>
            <h2 className="font-display text-void text-[32px] md:text-[48px] font-bold">By the Numbers</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
            {[
              { target: 1200, suffix: '+', label: 'Travellers' },
              { target: 25, suffix: '+', label: 'Destinations' },
              { isStatic: true, display: '4.7', suffix: '★', label: 'Avg Rating' },
              { target: 2020, label: 'Founded', useGrouping: false },
            ].map((stat, i) => (
              <FadeInSection
                key={stat.label}
                delay={i * 0.1}
                className="p-[32px] md:p-[48px] text-center flex flex-col items-center justify-center border border-void/5 rounded-3xl bg-[#fafafa] transition-all hover:bg-white hover:shadow-xl hover:border-teal/10 hover:-translate-y-1"
              >
                <div className="font-display text-teal text-[40px] md:text-[56px] font-bold leading-none mb-[12px]">
                  {stat.isStatic ? (
                    <span className="flex items-center gap-1">
                      {stat.display}<span className="text-lime text-[32px] md:text-[40px]">{stat.suffix}</span>
                    </span>
                  ) : (
                    <AnimatedCounter
                      target={stat.target!}
                      suffix={stat.suffix}
                      useGrouping={stat.useGrouping}
                    />
                  )}
                </div>
                <div className="font-body font-bold text-void/60 text-[13px] md:text-[14px] tracking-widest uppercase">{stat.label}</div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Founder Editorial ─────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-[#fafafa] border-y border-void/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-[32px] border border-void/10 overflow-hidden shadow-xl md:shadow-2xl flex flex-col lg:flex-row">
            
            {/* Image Side */}
            <div className="lg:w-2/5 relative h-[400px] lg:h-auto">
              <Image
                src="/web_photos/about_kevin.webp"
                alt="Kevin — Founder of BagpackerMe"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute bottom-[24px] left-[24px] lg:bottom-[32px] lg:left-[32px] flex items-center gap-[12px]">
                <div className="bg-lime text-void text-[12px] font-bold font-display tracking-[0.1em] px-[20px] py-[8px] rounded-full uppercase">
                  Kevin
                </div>
                <div className="bg-white/90 backdrop-blur-sm text-void text-[12px] font-bold font-display tracking-[0.1em] px-[20px] py-[8px] rounded-full uppercase">
                  Founder
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-3/5 p-[32px] md:p-[64px] flex flex-col justify-center bg-white relative">
              <div className="absolute top-0 right-[40px] w-px h-[60px] bg-teal/10" />
              <div className="absolute bottom-0 right-[80px] w-px h-[40px] bg-teal/10" />
              
              <div className="section-label mb-[16px] text-teal before:bg-teal">
                 ✦ Meet the Founder
              </div>
              <h2 className="font-display text-void text-[32px] md:text-[44px] mb-[24px] font-bold leading-tight">
                Crafting trips from authentic connections.
              </h2>
              
              <p className="font-body text-void/70 leading-relaxed text-[16px] md:text-[18px] mb-[32px] font-light">
                Kevin built BagpackerMe from the ground up — designing every itinerary, walking every
                trail, and ensuring every traveller returns with stories worth telling. With over a decade
                of travelling across India, he brings not just routes but real insight, cultural context,
                and genuine care for each guest&apos;s experience.
              </p>
              
              <blockquote className="border-l-4 border-lime pl-[24px] py-[8px] text-teal font-display text-[20px] md:text-[24px] leading-snug mb-[48px] italic">
                &ldquo;You speak directly with the founder — not a call centre. Real expertise, real accountability.&rdquo;
              </blockquote>

              {/* Socials */}
              <div className="flex gap-[16px]">
                <a
                  href="https://www.instagram.com/bagpackerme/"
                  target="_blank" rel="noopener noreferrer"
                  className="w-[48px] h-[48px] rounded-full border border-void/10 bg-[#fafafa] flex items-center justify-center text-[20px] text-teal hover:border-lime hover:bg-lime hover:text-void hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] flex-shrink-0">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@BagpackerMe"
                  target="_blank" rel="noopener noreferrer"
                  className="w-[48px] h-[48px] rounded-full border border-void/10 bg-[#fafafa] flex items-center justify-center text-[20px] text-teal hover:border-lime hover:bg-lime hover:text-void hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] flex-shrink-0">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/919920992026"
                  target="_blank" rel="noopener noreferrer"
                  className="w-[48px] h-[48px] rounded-full border border-void/10 bg-[#fafafa] flex items-center justify-center text-[20px] text-teal hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 6: Media / YouTube ───────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-[48px]">
            <div className="section-label text-teal before:bg-teal justify-center mb-[16px]">
               ✦ How We Help
            </div>
            <h2 className="font-display text-void text-[32px] md:text-[48px] mb-[8px] font-bold">See How BagpackerMe Can Help</h2>
            <p className="font-accent text-teal/80 text-[24px] italic tracking-wide">From planning support to the journey itself</p>
          </div>

          <div className="mb-[48px]">
            <VideoPlayer
              src="/web_photos/about_video.webm"
              poster="/web_photos/about_us.webp"
            />
          </div>


        </div>
      </section>

      {/* ── Section 7: CTA ───────────────────────────────────────────────────── */}
      <section className="py-[80px] md:py-[120px] px-[24px] bg-[#fafafa] border-t border-void/5 relative overflow-hidden">
        {/* Subtle Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime/10 rounded-full blur-[80px] pointer-events-none" />

        <FadeInSection className="max-w-[800px] mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-[80px] h-[80px] rounded-full bg-white shadow-xl flex items-center justify-center mb-[32px] text-teal">
            <svg width="32" height="32" className="w-[32px] h-[32px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-display text-void text-[40px] md:text-[56px] leading-[1.05] mb-[24px] font-bold tracking-tight">
            Ready for Your<br />Next Journey?
          </h2>
          <p className="font-body text-void/60 text-[16px] md:text-[20px] font-light mb-[48px] max-w-[500px] leading-[1.7]">
            Let us craft a journey that goes beyond the ordinary. Speak directly with our experts step-by-step.
          </p>
          <div className="flex flex-row gap-[12px] justify-center items-center">
            <Link
              href="/packages"
              className="px-[24px] py-[10px] bg-teal text-white font-display text-[14px] font-medium rounded-full hover:bg-teal/90 transition-colors flex items-center gap-[8px] shadow-md shadow-teal/20 hover:shadow-teal/40"
            >
              Explore Trips
            </Link>
            <a
              href="https://wa.me/919920992026"
              target="_blank" rel="noopener noreferrer"
              className="px-[24px] py-[10px] bg-white border border-void/10 text-void font-display text-[14px] font-medium rounded-full hover:border-[#25D366] hover:text-[#25D366] transition-colors flex items-center gap-[8px]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </FadeInSection>
      </section>
    </main>
  );
}
