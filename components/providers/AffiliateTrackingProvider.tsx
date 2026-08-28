'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { scheduleIdleTask } from '@/lib/browser-idle';

const AffiliateTracker = dynamic(() => import('./AffiliateTracker'), { ssr: false });

/**
 * Attribution does not affect first paint or interaction. Loading its
 * useSearchParams hook after the page is idle keeps it out of the landing
 * route's critical client bundle while retaining the same session behaviour.
 */
export function AffiliateTrackingProvider() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => scheduleIdleTask(() => setEnabled(true), 2500), []);

  return enabled ? <AffiliateTracker /> : null;
}
