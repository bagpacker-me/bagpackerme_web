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
    <div className="min-h-screen bg-[#1a2e1e] flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-[#C1EA00]/20 border border-[#C1EA00]/40 flex items-center justify-center mb-8">
        <span className="text-[#C1EA00] font-bold text-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>BP</span>
      </div>

      {/* Error code */}
      <p className="text-[#C1EA00] text-sm font-semibold tracking-widest uppercase mb-3">Something went wrong</p>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Unexpected Error
      </h1>

      {/* Subtitle */}
      <p className="text-white/60 text-base max-w-sm mb-8 leading-relaxed">
        We hit an unexpected bump on the trail. Our team has been notified and we&apos;re working to fix it.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#C1EA00', color: '#1a2e1e' }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
