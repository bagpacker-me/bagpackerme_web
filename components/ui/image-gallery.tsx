"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Taj Mahal at sunrise",
  },
  {
    src: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Varanasi ghats on the Ganges",
  },
  {
    src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Kerala backwaters at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Rajasthan desert dunes",
  },
  {
    src: "https://images.unsplash.com/photo-1598043596592-1a3d1e52d2c0?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Himalayan mountain village",
  },
  {
    src: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Colourful spice market in India",
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
          Every frame tells a story — mountains, rivers, temples, and the
          vibrant people who make India truly unforgettable.
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              {img.alt}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
