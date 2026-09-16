'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_SITE_SETTINGS,
  resolveSiteSettings,
  type ResolvedSiteSettings,
} from '@/lib/site-settings';

export const SiteSettingsContext = createContext<ResolvedSiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  // Seeded with the public shell values so contact details render correctly on
  // first paint instead of waiting for a remote settings request.
  initialSettings?: ResolvedSiteSettings;
}) {
  const [settings, setSettings] = useState<ResolvedSiteSettings>(
    initialSettings ?? DEFAULT_SITE_SETTINGS
  );

  useEffect(() => {
    let isMounted = true;
    let hasRefreshed = false;

    const refreshAfterIntent = async () => {
      if (hasRefreshed) return;
      hasRefreshed = true;

      // The initial values are already correct for the public shell. A
      // Firestore refresh is useful only after a real visitor interaction;
      // running it during first paint creates a third-party request that can
      // lengthen the mobile critical path for no visible benefit.
      const { fetchSiteSettingsRest } = await import('@/lib/public-reads-rest');
      const data = await fetchSiteSettingsRest();
      if (isMounted && data) setSettings(resolveSiteSettings(data));
    };

    window.addEventListener('pointerdown', refreshAfterIntent, {
      once: true,
      passive: true,
    });
    window.addEventListener('keydown', refreshAfterIntent, { once: true });

    return () => {
      isMounted = false;
      window.removeEventListener('pointerdown', refreshAfterIntent);
      window.removeEventListener('keydown', refreshAfterIntent);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
