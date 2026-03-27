'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from '@/types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

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
    <section id="gallery" className="w-full bg-void py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-lime font-display font-bold uppercase tracking-[0.3em] text-sm block mb-4">
            ✦ MEMORIES
          </span>
          <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Photo Gallery
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
          {images.map((src, idx) => (
            <div 
              key={idx} 
              className="relative w-full break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(idx)}
            >
              <Image 
                src={src} 
                alt={`${pkg.title} image ${idx + 1}`}
                width={800}
                height={800}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
              <div className="absolute inset-0 bg-teal/0 group-hover:bg-teal/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Maximize2 size={32} className="text-white drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center overscroll-contain"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={36} />
          </button>
          
          <button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 p-4 rounded-full backdrop-blur-md">
             <ChevronLeft size={32} />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] mx-16" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`Lightbox ${lightboxIndex}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 p-4 rounded-full backdrop-blur-md">
             <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-display uppercase tracking-widest text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
