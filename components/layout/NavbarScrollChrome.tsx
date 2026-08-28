'use client';

import { useEffect } from 'react';

/** Adds the compact background after scrolling without making the navigation client-rendered. */
export function NavbarScrollChrome() {
  useEffect(() => {
    const surface = document.querySelector<HTMLElement>('[data-nav-surface]');
    if (!surface) return;

    let queued = false;
    const update = () => {
      queued = false;
      surface.dataset.scrolled = String(window.scrollY > 50);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
