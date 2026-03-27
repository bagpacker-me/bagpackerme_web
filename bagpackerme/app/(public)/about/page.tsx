'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = duration / 60;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
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
          <p className="font-display tracking-widest text-sm uppercase text-cyan mb-4">About Us</p>
          <h1
            className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            We Are Bagpackerme
          </h1>
          <p className="font-body text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A travel community built on real journeys, authentic connections, and a deep love for India.
          </p>
        </motion.div>
      </section>

      {/* ── Section 2: Our Story ─────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1477587458883-47145ed31f2f?auto=format&fit=crop&w=600&q=80"
                alt="India travel"
                className="rounded-2xl w-full h-48 object-cover col-span-2"
              />
              <img
                src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=400&q=80"
                alt="India stairs"
                className="rounded-2xl w-full h-44 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b5bca4?auto=format&fit=crop&w=400&q=80"
                alt="India group"
                className="rounded-2xl w-full h-44 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-lime text-void font-display text-xs tracking-widest px-4 py-3 rounded-xl shadow-lg">
              Since 2020
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-teal font-display tracking-widest text-sm uppercase mb-3">Our Story</p>
            <h2 className="font-display text-void text-4xl md:text-5xl leading-tight mb-6">
              Born from a passion for exploration
            </h2>
            <div className="space-y-4 font-body text-void/70 text-base leading-relaxed">
              <p>
                BagpackerMe was founded in 2020 as a small community of curious travellers who believed
                India deserved to be explored deeply — not just ticked off a bucket list. What started
                as a WhatsApp group grew into a movement.
              </p>
              <p>
                Today we have guided <strong className="text-void">1,200+ travellers</strong> across{' '}
                <strong className="text-void">25+ handpicked destinations</strong> — from the ghats of
                Varanasi to the valleys of Spiti, from the backwaters of Kerala to the deserts of Rajasthan.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '🤝', label: 'Community-First' },
                { emoji: '🌿', label: 'Responsible Tourism' },
                { emoji: '👤', label: 'Founder-Led' },
              ].map((v) => (
                <div key={v.label} className="flex items-center gap-3 bg-ice rounded-xl px-4 py-3">
                  <span className="text-2xl">{v.emoji}</span>
                  <span className="font-body text-sm font-medium text-teal">{v.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Founder ───────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#221E2A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 flex items-center justify-center p-10 bg-white/5">
                <div className="relative">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-cyan shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Kevin — Founder of BagpackerMe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-lime text-void text-xs font-display tracking-widest px-4 py-2 rounded-full whitespace-nowrap">
                    Founder
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-cyan font-display tracking-widest text-sm uppercase mb-2">Meet the founder</p>
                <h2 className="font-display text-white text-4xl mb-1">Kevin</h2>
                <p className="text-white/50 font-body text-sm mb-6 tracking-wider uppercase">
                  Founder, BAGPACKERME
                </p>
                <p className="font-body text-white/75 leading-relaxed mb-6">
                  Kevin built BagpackerMe from the ground up — designing every itinerary, walking every
                  trail, and ensuring every traveller returns with stories worth telling. With over a decade
                  of travelling across India, he brings not just routes but real insight, cultural context,
                  and genuine care for each guest&apos;s experience.
                </p>
                <blockquote className="border-l-4 border-cyan pl-5 italic text-white/80 font-accent text-lg leading-snug mb-6">
                  &ldquo;You speak directly with the founder — not a call centre. Real expertise, real accountability.&rdquo;
                </blockquote>
                <div className="flex gap-4">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/bagpackerme/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-cyan hover:text-cyan transition-colors"
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
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-cyan hover:text-cyan transition-colors"
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
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-green-400 hover:text-green-400 transition-colors"
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
      <section className="bg-teal py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="font-display tracking-widest text-sm uppercase text-cyan mb-3">Impact</p>
          <h2 className="font-display text-white text-4xl md:text-5xl">By the Numbers</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { target: 1200, suffix: '+', label: 'Travellers' },
            { target: 25, suffix: '+', label: 'Destinations' },
            { isStatic: true, display: '4.5★', label: 'Avg Rating' },
            { target: 2020, suffix: '', label: 'Founded' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl p-6 text-center flex flex-col items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-white text-4xl md:text-5xl font-bold">
                {stat.isStatic ? (
                  <span>{stat.display}</span>
                ) : (
                  <AnimatedCounter target={stat.target!} suffix={stat.suffix} />
                )}
              </div>
              <div className="font-body text-white/60 text-sm tracking-wider uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Media / YouTube ───────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#F7F9FA' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-display tracking-widest text-sm uppercase text-teal mb-2">Our Series</p>
            <h2 className="font-display text-void text-4xl md:text-5xl mb-2">Watch Our Series</h2>
            <p className="font-accent text-teal/80 text-2xl italic tracking-wide">Balancing the Act</p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl aspect-video mb-8">
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
              className="inline-flex items-center gap-2 font-body font-semibold text-teal hover:text-void transition-colors group"
            >
              Watch on YouTube
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#221E2A' }}>
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-display tracking-widest text-sm uppercase text-cyan mb-4">Ready?</p>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-tight mb-6">
            Ready for Your<br />Next Journey?
          </h2>
          <p className="font-body text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Let us craft a journey that goes beyond the ordinary. Speak directly with Kevin and start planning your perfect India adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-lime text-void font-display text-sm tracking-widest uppercase rounded-full hover:scale-105 transition-transform"
            >
              Explore Trips
            </Link>
            <a
              href="https://wa.me/919920992026"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-display text-sm tracking-widest uppercase rounded-full hover:border-white hover:bg-white/10 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400">
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
