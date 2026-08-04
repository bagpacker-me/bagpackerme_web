'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Package } from '@/types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';

export default function PackageGallery({ pkg }: { pkg: Package }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Element that opened the lightbox, so focus can be restored on close.
  const triggerRef = useRef<HTMLElement | null>(null);

  const images = pkg.galleryUrls ?? [];
  const isOpen = lightboxIndex !== null;

  const openLightbox = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setLightboxIndex(index);
  };
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);
  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped within the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Move focus into the dialog, and lock background scroll.
    closeButtonRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      // Restore focus to whatever opened the lightbox.
      triggerRef.current?.focus();
    };
  }, [isOpen, closeLightbox, goPrev, goNext]);

  if (images.length === 0) return null;

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
              <button
                key={idx}
                type="button"
                className="relative block w-full break-inside-avoid overflow-hidden cursor-crosshair group bg-void/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                onClick={(e) => openLightbox(idx, e)}
                aria-label={`Open image ${idx + 1} of ${images.length} for ${pkg.title}`}
              >
                {/* Was a bare <img> with no dimensions: it shipped the full
                    Firebase original to a 170px-wide phone column, and until it
                    loaded the cell measured 0px tall, so the whole masonry
                    collapsed and then shoved the page down image by image.
                    next/image gives it an AVIF/WebP srcset and a reserved box.
                    The 4:3 hint is only that — `h-auto` hands the final ratio
                    back to the real file, so the masonry keeps its varied
                    heights. */}
                <Image
                  src={src}
                  alt=""
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={65}
                  className="w-full h-auto transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-[#221E2A]/25 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                   <Maximize2 size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </button>
            ))}
          </div>
        </FadeInSection>

      </div>

      {/* Lightbox */}
      {isOpen && lightboxIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${pkg.title} gallery, image ${lightboxIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] bg-[rgba(34,30,42,0.96)] flex items-center justify-center overscroll-contain"
          onClick={closeLightbox}
        >
          <button ref={closeButtonRef} onClick={closeLightbox} aria-label="Close gallery" className="absolute top-[24px] right-[24px] text-white hover:text-white/70 transition-colors z-[110] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <X size={24} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous image" className="absolute left-[16px] md:left-[32px] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
             <ChevronLeft size={28} />
          </button>

          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`${pkg.title} — image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next image" className="absolute right-[16px] md:right-[32px] top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
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
