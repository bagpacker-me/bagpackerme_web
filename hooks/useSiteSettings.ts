'use client';

import { useContext } from 'react';
import { SiteSettingsContext } from '@/components/providers/SiteSettingsProvider';

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
