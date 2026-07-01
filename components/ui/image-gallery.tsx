"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const GALLERY_IMAGES = [
  {
    src: "/web_photos/gallery_1.webp",
    alt: "A traditional houseboat gliding through Kerala backwaters beneath coconut palms",
    title: "Kerala Backwaters",
    tagline: "Drift through quiet canals framed by swaying palms.",
  },
  {
    src: "/web_photos/gallery_2.webp",
    alt: "The Golden Temple in Amritsar reflected in the sacred pool",
    title: "Golden Temple",
    tagline: "Find stillness where gold, water, and prayer meet.",
  },
  {
    src: "/web_photos/gallery_3.webp",
    alt: "Boats resting along the Varanasi ghats at sunset",
    title: "Varanasi Ghats",
    tagline: "Follow the river into a city that never loses its soul.",
  },
  {
    src: "/web_photos/gallery_4.webp",
    alt: "The Taj Mahal glowing above its reflection at dusk",
    title: "Taj Mahal",
    tagline: "Stand before India's timeless ode to love and symmetry.",
  },
  {
    src: "/web_photos/gallery_5.webp",
    alt: "Pangong Lake beneath dramatic mountain peaks in Ladakh",
    title: "Ladakh Highlands",
    tagline: "Chase thin-air horizons and impossible shades of blue.",
  },
  {
    src: "/web_photos/gallery_6.webp",
    alt: "Fishing boats floating off the palm-lined shore of Lakshadweep",
    title: "Lakshadweep",
    tagline: "Slip into slow coastal mornings and crystal-clear water.",
  },
];

export default function ImageGallery() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full flex flex-col items-center justify-start py-24 bg-surface-lowest">
      {/* Heading */}
      <div className="max-w-3xl text-center px-4 mb-10">
        <h2 className="text-3xl md:text-5xl font-bold font-display text-gray-900 dark:text-white tracking-tight">
          Glimpses of Incredible India
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-4 font-body leading-relaxed max-w-2xl mx-auto">
          From sacred cities and marble icons to high-altitude lakes and
          palm-lined shores, each frame reveals a different rhythm of India.
        </p>
      </div>

      {/* Accordion Gallery */}
      <div 
        className="flex items-center gap-3 h-[450px] w-full max-w-6xl px-4"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {GALLERY_IMAGES.map((img, idx) => {
          const isExpanded = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          
          return (
            <motion.div
              key={idx}
              layout={shouldReduceMotion ? false : "size"}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              className={cn(
                "relative rounded-2xl overflow-hidden h-[450px] cursor-pointer origin-center flex-grow transition-all duration-300",
                isExpanded 
                  ? "flex-[4.5]" 
                  : isAnyHovered 
                    ? "flex-[0.6]" 
                    : "flex-1"
              )}
            >
              <Image
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={idx < 2}
              />
              
              {/* Overlay label */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 pointer-events-none",
                (isExpanded || !isAnyHovered) ? "opacity-100" : "opacity-0"
              )} />
              
              <div className={cn(
                "absolute bottom-6 left-6 right-6 transition-all duration-500 pointer-events-none",
                (isExpanded || !isAnyHovered) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <p className="text-[11px] font-display font-semibold uppercase tracking-[0.24em] text-white/80">
                  {img.title}
                </p>
                <div className={cn(
                  "overflow-hidden transition-all duration-500 ease-out",
                  isExpanded ? "max-h-[60px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                )}>
                  <p className="text-white text-sm font-body font-medium leading-snug">
                    {img.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
