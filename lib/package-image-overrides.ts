import type { Package } from '@/types';

/**
 * Local editorial image sets for packages whose supplied CMS images have been
 * replaced with commissioned BagPackerMe artwork. Applying these as packages
 * are read keeps the page, cards, metadata, and structured data in sync while
 * preserving all of the itinerary and booking data in Firestore.
 */
const PACKAGE_IMAGE_OVERRIDES: Record<string, Pick<Package, 'heroImageUrl' | 'galleryUrls'>> = {
  'satpura-wildscape-jeep-trails-and-riverside-serenity': {
    heroImageUrl: '/images/packages/satpura/satpura-jeep-trails-cover.png',
    galleryUrls: [
      '/images/packages/satpura/satpura-backwaters-boat.png',
      '/images/packages/satpura/satpura-serpent-eagle.png',
      '/images/packages/satpura/satpura-riverside-lodge.png',
    ],
  },
};

export function withPackageImageOverrides(pkg: Package): Package {
  const override = PACKAGE_IMAGE_OVERRIDES[pkg.slug];
  return override ? { ...pkg, ...override } : pkg;
}
