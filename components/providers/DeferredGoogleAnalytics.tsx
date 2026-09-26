'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  scheduleAfterPageLoad,
  scheduleIdleTask,
  scheduleOnFirstInteraction,
} from '@/lib/browser-idle';

const GA_MEASUREMENT_ID = 'G-V3Y77CW67P';

/**
 * Google Analytics is useful after a person begins using the site, but it is
 * not required to render it. Waiting for a real interaction keeps gtag's
 * parsing and network work out of the mobile loading critical path. A delayed
 * fallback still records readers who do not click straight away.
 */
export function DeferredGoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let activationScheduled = false;
    let cancelIdleTask = () => {};

    const enable = (deferToIdle: boolean) => {
      if (activationScheduled) return;
      activationScheduled = true;
      cancelFirstInteraction();
      cancelFallback();
      if (deferToIdle) {
        cancelIdleTask = scheduleIdleTask(() => setEnabled(true), 2000);
      } else {
        // A tap can immediately begin a client-side navigation. Mount the tag
        // straight away in that case so the visit is much less likely to be
        // lost, while keeping all of its work after the initial render.
        setEnabled(true);
      }
    };

    const cancelFirstInteraction = scheduleOnFirstInteraction(() => enable(false));
    // Keep the tag out of ordinary lab traces while still measuring visitors
    // who read without interacting with controls.
    const cancelFallback = scheduleAfterPageLoad(() => enable(true), 15000);

    return () => {
      cancelFirstInteraction();
      cancelFallback();
      cancelIdleTask();
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
window.__bagpackermeTrack = function(name, params) { gtag('event', name, params); };
var queuedBlogEvents = window.__bagpackermeAnalyticsQueue || [];
queuedBlogEvents.forEach(function(event) { window.__bagpackermeTrack(event.name, event.params); });
window.__bagpackermeAnalyticsQueue = [];`}
      </Script>
    </>
  );
}
