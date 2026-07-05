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
    <section className="w-full py-28 bg-white overflow-hidden">
      {/* Heading - Left Aligned to Break Center Monotony */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl mb-12">
        <div className="max-w-xl">
          <div className="accent-line-cyan" />
          <h2 className="text-4xl md:text-5xl font-bold font-display text-void tracking-tight">
            Glimpses of Incredible India
          </h2>
          <p className="text-base text-void/65 mt-4 font-body leading-relaxed">
            From sacred ghats and marble icons to high-altitude lakes and palm-fringed channels, discover the diverse rhythms of the subcontinent.
          </p>
        </div>
      </div>

      {/* Accordion Gallery */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div 
          className="flex flex-col md:flex-row items-stretch gap-4 h-auto md:h-[480px] w-full"
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
                  "relative rounded-2xl overflow-hidden h-[240px] md:h-auto cursor-pointer origin-center transition-all duration-500 ease-out border border-medium/10",
                  isExpanded 
                    ? "md:flex-[4.5]" 
                    : isAnyHovered 
                      ? "md:flex-[0.6]" 
                      : "md:flex-1"
                )}
                style={{
                  boxShadow: isExpanded ? '0 12px 32px rgba(40,80,86,0.15)' : '0 4px 16px rgba(0,0,0,0.02)'
                }}
              >
                <Image
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx < 2}
                />
                
                {/* Overlay gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent transition-opacity duration-300 pointer-events-none",
                  (isExpanded || !isAnyHovered) ? "opacity-100" : "opacity-30"
                )} />
                
                <div className={cn(
                  "absolute bottom-6 left-6 right-6 transition-all duration-500 pointer-events-none z-10",
                  (isExpanded || !isAnyHovered) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-lime mb-1">
                    {img.title}
                  </p>
                  <div className={cn(
                    "overflow-hidden transition-all duration-500 ease-out",
                    isExpanded ? "max-h-[60px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                  )}>
                    <p className="text-white/80 text-sm font-body leading-relaxed">
                      {img.tagline}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
