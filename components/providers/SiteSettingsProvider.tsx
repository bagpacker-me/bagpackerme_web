'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { getSiteSettings } from '@/lib/firestore';
import {
  DEFAULT_SITE_SETTINGS,
  resolveSiteSettings,
  type ResolvedSiteSettings,
} from '@/lib/site-settings';

export const SiteSettingsContext = createContext<ResolvedSiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ResolvedSiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        if (isMounted) {
          setSettings(resolveSiteSettings(data));
        }
      } catch (error) {
        console.error('Error fetching site settings', error);
      }
    }

    void fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
