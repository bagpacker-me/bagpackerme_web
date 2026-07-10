'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PackageMarket } from '@/types';

const indiaDestinations = [
  {
    id: 'delhi',
    title: 'DELHI',
    stateName: 'DELHI',
    location: 'New Delhi',
    description: 'A bustling metropolis where ancient history intertwines with vibrant modernity.',
    image: '/web_photos/hero_1.webp',
  },
  {
    id: 'agra',
    title: 'AGRA',
    stateName: 'UTTAR PRADESH',
    location: 'Agra, Uttar Pradesh',
    description: 'Home to the iconic Taj Mahal, a timeless symbol of love and Mughal artistry.',
    image: '/web_photos/hero_2.webp',
  },
  {
    id: 'jaipur',
    title: 'JAIPUR',
    stateName: 'RAJASTHAN',
    location: 'Jaipur, Rajasthan',
    description: 'Majestic forts, opulent palaces, and the vibrant colors of the Pink City.',
    image: '/web_photos/hero_3.webp',
  },
  {
    id: 'varanasi',
    title: 'VARANASI',
    stateName: 'UTTAR PRADESH',
    location: 'Varanasi, Uttar Pradesh',
    description: 'The spiritual soul of India. Ancient ghats along the sacred Ganges.',
    image: '/web_photos/hero_4.webp',
  },
  {
    id: 'goa',
    title: 'GOA',
    stateName: 'GOA',
    location: 'Goa',
    description: 'Pristine beaches, Portuguese heritage, and golden coastal sunsets.',
    image: '/web_photos/hero_5.webp',
  }
];

const globalDestinations = [
  {
    id: 'thailand',
    title: 'THAILAND',
    stateName: 'PATTAYA',
    location: 'Pattaya, Thailand',
    description: 'Island waters, tropical gardens, private transfers, and a short coastal reset.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'vietnam',
    title: 'VIETNAM',
    stateName: 'DA NANG',
    location: 'Da Nang and Hoi An',
    description: 'Golden Bridge views, lantern-lit streets, coastal days, and layered city history.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'halong',
    title: 'HALONG',
    stateName: 'HANOI',
    location: 'Hanoi and Halong Bay',
    description: 'Old Quarter walks, limestone cruises, island time, and northern Vietnam scenery.',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'kenya',
    title: 'KENYA',
    stateName: 'MASAI MARA',
    location: 'Amboseli and Masai Mara',
    description: 'Elephant country, Rift Valley lakes, big-cat plains, and slow safari days.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600',
  },
];

export default function HeroInteractive({ market = 'global' }: { market?: PackageMarket }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const INTERVAL_MS = 6000;
  const destinations = market === 'india' ? indiaDestinations : globalDestinations;
  const packagesHref = market === 'india' ? '/in/packages' : '/packages';

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalSlides = destinations.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgressKey(k => k + 1);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % totalSlides);
      setProgressKey(k => k + 1);
    }, INTERVAL_MS);
  }, [totalSlides]);

  useEffect(() => {
    if (!isClient) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isClient, resetTimer]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    resetTimer();
  }, [totalSlides, resetTimer]);

  if (!isClient) {
    return <div className="min-h-[100dvh] w-screen bg-void" />;
  }

  const activeDest = destinations[currentIndex];
  const stringIndex = String(currentIndex + 1).padStart(2, '0');
  const stringTotal = String(totalSlides).padStart(2, '0');
  
  const upcomingSlides = [
    destinations[(currentIndex + 1) % totalSlides],
    destinations[(currentIndex + 2) % totalSlides],
  ];

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-void font-sans text-white">
      {/* Background Images Crossfade */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeDest.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image 
            src={activeDest.image} 
            alt={activeDest.title}
            fill
            className="object-cover"
            priority
          />
          {/* Layered gradient scrims for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/20" />
        </motion.div>
      </AnimatePresence>

      {/* Grain overlay for texture */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Main Content Area */}
      <div className="absolute inset-y-0 left-0 z-40 flex flex-col justify-center w-full md:w-[55%] px-6 md:px-12 lg:px-16 pointer-events-none">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={activeDest.id}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="pointer-events-auto"
          >
            {/* Location tag */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-lime" />
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
                {activeDest.location}
              </span>
            </div>

            <h1 className="font-display text-[clamp(56px,10vw,120px)] font-extrabold uppercase tracking-[-0.03em] leading-[0.88] mb-5">
              {activeDest.title}
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-md text-white/75 leading-relaxed font-body">
              {activeDest.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?intent=trip"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-void transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98] active:translate-y-0"
              >
                Book now
                <ArrowRight strokeWidth={2} className="h-4 w-4" />
              </Link>
              <Link
                href={packagesHref}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-7 py-4 font-display text-[12px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
              >
                Explore trips
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card Carousel (Right Side — Desktop Only) */}
      <div className="absolute top-[18%] bottom-[18%] right-[4vw] w-[38vw] z-40 hidden lg:flex items-center">
        <div className="relative w-full h-full flex items-center">
          <AnimatePresence mode="popLayout">
            {upcomingSlides.map((slide, i) => {
              const xOffset = i * 260; 
              const scale = 1 - (i * 0.08);
              const opacity = 1 - (i * 0.25);
              const zIndex = 30 - i;

              return (
                <motion.div
                  key={`${slide.id}-${currentIndex}`}
                  initial={{ x: xOffset + 80, opacity: 0 }}
                  animate={{ x: xOffset, scale, opacity }}
                  exit={{ x: -80, opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute w-[220px] h-[330px] rounded-[20px] overflow-hidden cursor-pointer glass-card-dark"
                  style={{ zIndex, transformOrigin: 'left center' }}
                  onClick={handleNext}
                >
                  <Image 
                    src={slide.image} 
                    alt={slide.location}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
                  
                  {/* Card label */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 block mb-1">
                      Next
                    </span>
                    <h3 className="font-display font-bold text-lg leading-tight text-white">{slide.location}</h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-between px-6 md:px-12 lg:px-16 pb-8">
        {/* Watermark */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeDest.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-[clamp(48px,7vw,96px)] font-display font-extrabold uppercase text-white/[0.04] whitespace-nowrap pointer-events-none tracking-tighter leading-none"
            >
              {activeDest.stateName}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Pagination + Auto-Progress */}
        <div className="flex items-center gap-3 text-sm font-medium tracking-widest font-display">
          <span className="text-white">{stringIndex}</span>
          <div className="relative w-16 h-[2px] bg-white/15 overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
            />
            <div
              key={progressKey}
              className="absolute top-0 left-0 h-full bg-lime hero-progress-bar"
            />
          </div>
          <span className="text-white/40">{stringTotal}</span>
        </div>
      </div>
    </section>
  );
}
