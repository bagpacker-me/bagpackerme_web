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
      // REST rather than the Firebase SDK. This provider wraps every public
      // route, so importing lib/firestore here loaded the whole SDK (and its
      // auth iframe) sitewide just to re-read one settings document that the
      // server already rendered into `initialSettings`.
      const { fetchSiteSettingsRest } = await import('@/lib/public-reads-rest');
      const data = await fetchSiteSettingsRest();
      if (isMounted && data) setSettings(resolveSiteSettings(data));
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
