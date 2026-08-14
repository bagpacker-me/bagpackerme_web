import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClubApplicationFlow from './_components/ClubApplicationFlow';

// noindex: a form has no search value, and the club's story lives on
// /curious-club. robots.ts disallows the path too, which saves the crawl.
export const metadata: Metadata = {
  title: 'Apply — The Curious Club',
  description:
    'Apply to join The Curious Club. Nineteen questions, about two to three minutes, reviewed individually.',
  alternates: { canonical: '/curious-club/apply' },
  robots: { index: false, follow: true },
};

export default function CuriousClubApplyPage() {
  // useSearchParams (for ?trip=) needs a Suspense boundary, or the whole route
  // opts into a client-side bailout during the build.
  return (
    <Suspense
      fallback={
        <main className="bg-void">
          <div className="mx-auto min-h-[78svh] max-w-[680px] px-[24px] py-[80px] font-body text-[14px] text-white/40">
            Loading the application…
          </div>
        </main>
      }
    >
      <ClubApplicationFlow />
    </Suspense>
  );
}
