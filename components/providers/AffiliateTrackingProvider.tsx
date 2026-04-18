'use client';

import { Suspense } from 'react';
import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';

function AffiliateTracker() {
  useAffiliateTracking();
  return null;
}

/**
 * Wraps the tracking hook in a Suspense boundary because useSearchParams()
 * requires one when used in a client component inside a Server Component layout.
 */
export function AffiliateTrackingProvider() {
  return (
    <Suspense fallback={null}>
      <AffiliateTracker />
    </Suspense>
  );
}
