'use client';

/**
 * Lightweight CSS page entry animation. Keeping this shell free of Framer Motion
 * prevents the animation library from becoming part of every public route.
 */

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition-shell">
      {children}
    </div>
  );
}
