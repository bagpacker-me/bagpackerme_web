import type { SiteSettings } from '@/types';

type SiteSettingsDefaults = Required<
  Pick<
    SiteSettings,
    | 'contactEmail'
    | 'contactPhone'
    | 'whatsappNumber'
    | 'address'
    | 'workingHours'
    | 'instagramUrl'
    | 'facebookUrl'
    | 'twitterUrl'
    | 'youtubeUrl'
  >
>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsDefaults = {
  contactEmail: 'bagpackerme.world@gmail.com',
  contactPhone: '+91 9920992026',
  whatsappNumber: '919920992026',
  workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM (IST)',
  address: 'Mumbai, India',
  instagramUrl: 'https://instagram.com/bagpackerme',
  facebookUrl: 'https://facebook.com/bagpackerme',
  twitterUrl: 'https://twitter.com/bagpackerme',
  youtubeUrl: 'https://youtube.com/@bagpackerme',
};

export type ResolvedSiteSettings = SiteSettings & SiteSettingsDefaults;

export function resolveSiteSettings(settings?: SiteSettings | null): ResolvedSiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...settings,
  };
}
