'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center grain-overlay" style={{ background: 'var(--color-surface-dark)' }}>
      {/* Logo */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8" style={{ background: 'rgba(193, 234, 0, 0.2)', border: '1px solid rgba(193, 234, 0, 0.4)' }}>
        <span className="font-bold text-xl" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>BP</span>
      </div>

      {/* Error code */}
      <p className="text-sm font-semibold tracking-widest uppercase mb-3 section-label" style={{ color: 'var(--color-accent)' }}>Something went wrong</p>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4 font-display" style={{ color: 'var(--color-text-inverse)' }}>
        Unexpected Error
      </h1>

      {/* Subtitle */}
      <p className="text-base max-w-sm mb-8 leading-relaxed font-body" style={{ color: 'var(--color-text-inverse-dim)' }}>
        We hit an unexpected bump on the trail. Our team has been notified and we&apos;re working to fix it.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="btn-ghost"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
