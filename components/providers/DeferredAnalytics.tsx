'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { scheduleAfterPageLoad } from '@/lib/browser-idle';

const Analytics = dynamic(
  () => import('@vercel/analytics/next').then((mod) => mod.Analytics),
  { ssr: false }
);

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  { ssr: false }
);

export function DeferredAnalytics() {
  const [enabled, setEnabled] = useState(false);

  // Vercel's optional analytics and vitals collection should never compete
  // with the hero, CSS, or first interaction on a mobile visit. GA itself is
  // likewise deferred in DeferredGoogleAnalytics.
  useEffect(() => scheduleAfterPageLoad(() => setEnabled(true), 5000), []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
