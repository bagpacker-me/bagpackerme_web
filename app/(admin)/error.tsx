'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminError({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#120F1C] px-6">
      <div className="bg-white dark:bg-[#1A1625] w-full max-w-[440px] rounded-2xl shadow-lg border border-gray-100 dark:border-[rgba(255,255,255,0.06)] p-10 text-center">
        <h1 className="text-2xl font-bold mb-2 text-teal-900 dark:text-white font-heading">
          Something went wrong
        </h1>
        <p className="text-gray-400 dark:text-[rgba(255,255,255,0.6)] text-sm mb-8">
          This admin page failed to load. The error has been logged to the console.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-300 dark:text-gray-600 font-mono mb-6 break-all">
            Ref: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-teal-900 dark:bg-[#C1EA00] text-white dark:text-[#120F1C] text-sm font-medium transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/admin/dashboard"
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-gray-600 dark:text-[rgba(255,255,255,0.7)] text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.03)]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
