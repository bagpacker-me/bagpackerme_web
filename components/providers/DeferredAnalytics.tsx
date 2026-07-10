'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { scheduleIdleTask } from '@/lib/browser-idle';

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

  useEffect(() => scheduleIdleTask(() => setEnabled(true), 3000), []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
