"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

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
  return (
    <section className="w-full flex flex-col items-center justify-start py-16 bg-surface-lowest">
      {/* Heading */}
      <div className="max-w-3xl text-center px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime-500 font-display mb-2">
          Visual Stories
        </p>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white">
          Glimpses of Incredible India
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-body">
          From sacred cities and marble icons to high-altitude lakes and
          palm-lined shores, each frame reveals a different rhythm of India.
        </p>
      </div>

      {/* Accordion Gallery */}
      <div className="flex items-center gap-2 h-[420px] w-full max-w-6xl mt-10 px-4">
        {GALLERY_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={cn(
              "relative group flex-grow transition-all w-20 rounded-xl overflow-hidden h-[420px]",
              "duration-500 ease-in-out hover:w-full"
            )}
          >
            <Image
              className="h-full w-full object-cover object-center"
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 16vw"
            />
            {/* Overlay label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 opacity-100 md:opacity-0 transition-all duration-300 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <p className="text-[11px] font-display font-semibold uppercase tracking-[0.24em] text-white/70">
                {img.title}
              </p>
              <p className="mt-1 text-white text-sm font-body font-medium leading-snug">
                {img.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
