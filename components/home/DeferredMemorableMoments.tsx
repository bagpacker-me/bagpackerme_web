'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { PackageMarket } from '@/types';

const MemorableMoments = dynamic(() => import('./MemorableMoments'), {
  ssr: false,
});

/**
 * Testimonials have no server-rendered content: the component only renders
 * after an intent-triggered public read. Keep its code out of the home-page
 * bootstrap as well, then start it before the visitor reaches this position.
 */
export default function DeferredMemorableMoments({ market }: { market: PackageMarket }) {
  const [enabled, setEnabled] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const browserWindow = window as Window & {
      IntersectionObserver?: typeof IntersectionObserver;
    };

    if (!browserWindow.IntersectionObserver) {
      const enableOnScroll = () => {
        setEnabled(true);
        window.removeEventListener('scroll', enableOnScroll);
      };
      window.addEventListener('scroll', enableOnScroll, { passive: true });
      return () => window.removeEventListener('scroll', enableOnScroll);
    }

    const observer = new browserWindow.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEnabled(true);
        observer.disconnect();
      },
      { rootMargin: '1200px 0px' }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return <div ref={markerRef}>{enabled ? <MemorableMoments market={market} /> : null}</div>;
}
