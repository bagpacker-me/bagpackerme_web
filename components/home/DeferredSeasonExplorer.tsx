'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const SeasonExplorer = dynamic(() => import('./SeasonExplorer'), {
  ssr: false,
});

/**
 * The interactive map sits after the hero and discovery rail. Loading its
 * client code only when a visitor approaches it prevents its map geometry,
 * buttons, and state handlers from delaying the home page's LCP. The small
 * marker retains the document position so the section is ready shortly before
 * it scrolls into view.
 */
export default function DeferredSeasonExplorer() {
  const markerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (!('IntersectionObserver' in window)) {
      setEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEnabled(true);
        observer.disconnect();
      },
      { rootMargin: '480px 0px' }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={markerRef} className="min-h-px" data-home-deferred-section="season-explorer">
      {enabled ? <SeasonExplorer /> : null}
    </div>
  );
}
