'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from '@/types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';

export default function PackageGallery({ pkg }: { pkg: Package }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!pkg.galleryUrls || pkg.galleryUrls.length === 0) return null;
  const images = pkg.galleryUrls;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <section id="gallery" className="w-full bg-white py-[64px] md:py-[96px] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <FadeInSection className="mb-[48px] md:mb-[64px] flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[20px]">
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Memories</span>
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
          </div>
          <h2 className="text-[#221E2A] font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            Photo Gallery
          </h2>
        </FadeInSection>

        {/* Masonry Grid */}
        <FadeInSection delay={0.1}>
          <div className="columns-2 md:columns-3 gap-[10px] space-y-[10px]">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative w-full break-inside-avoid overflow-hidden cursor-crosshair group"
                onClick={() => openLightbox(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${pkg.title} image ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-auto transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-[#221E2A]/25 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                   <Maximize2 size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(34,30,42,0.96)] flex items-center justify-center overscroll-contain"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-[24px] right-[24px] text-white hover:text-white/70 transition-colors z-[110]">
            <X size={24} />
          </button>

          <button onClick={prevImage} className="absolute left-[16px] md:left-[32px] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2">
             <ChevronLeft size={28} />
          </button>

          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`Lightbox ${lightboxIndex}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button onClick={nextImage} className="absolute right-[16px] md:right-[32px] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2">
             <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 text-white/60 font-body text-[12px] bg-white/10 px-3 py-1">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
