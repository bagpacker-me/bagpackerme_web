'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { scheduleIdleTask } from '@/lib/browser-idle';
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
  // Seeded server-side from getSiteSettingsServer so contact details render
  // correctly on first paint instead of showing defaults then swapping.
  initialSettings?: ResolvedSiteSettings;
}) {
  const [settings, setSettings] = useState<ResolvedSiteSettings>(
    initialSettings ?? DEFAULT_SITE_SETTINGS
  );

  useEffect(() => {
    let isMounted = true;

    const cancel = scheduleIdleTask(async () => {
      try {
        const { getSiteSettings } = await import('@/lib/firestore');
        const data = await getSiteSettings();
        if (isMounted) {
          setSettings(resolveSiteSettings(data));
        }
      } catch (error) {
        console.error('Error fetching site settings', error);
      }
    }, 3000);

    return () => {
      isMounted = false;
      cancel();
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
