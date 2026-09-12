import type { Package } from '@/types';

/**
 * Local editorial image sets for packages whose supplied CMS images have been
 * replaced with commissioned BagPackerMe artwork. Applying these as packages
 * are read keeps the page, cards, metadata, and structured data in sync while
 * preserving all of the itinerary and booking data in Firestore.
 */
const PACKAGE_IMAGE_OVERRIDES: Record<
  string,
  Pick<Package, 'heroImageUrl' | 'heroImageAlt' | 'galleryUrls' | 'galleryImageAlts'>
> = {
  'kanha-beyond-the-safari': {
    heroImageUrl: '/images/packages/kanha/kanha-beyond-safari-cover.webp',
    galleryUrls: ['/images/packages/kanha/kanha-beyond-safari-cover.webp'],
  },
  'kerala-wellness-retreat': {
    heroImageUrl: '/images/packages/kerala/kerala-wellness-backwaters-cover.webp',
    galleryUrls: ['/images/packages/kerala/kerala-wellness-backwaters-cover.webp'],
  },
  'goan-experiential-and-wellness': {
    heroImageUrl: '/images/packages/goa/goan-experiential-wellness-cover.webp',
    galleryUrls: ['/images/packages/goa/goan-experiential-wellness-cover.webp'],
  },
  'wellness-and-tranquillity-a-holistic-retreat-in-gokarna': {
    heroImageUrl: '/images/packages/gokarna/gokarna-wellness-tranquillity-cover.webp',
    galleryUrls: ['/images/packages/gokarna/gokarna-wellness-tranquillity-cover.webp'],
  },
  'soul-by-the-sea-a-wellness-escape-in-kovalam': {
    heroImageUrl: '/images/packages/kovalam/kovalam-soul-by-the-sea-cover.webp',
    galleryUrls: ['/images/packages/kovalam/kovalam-soul-by-the-sea-cover.webp'],
  },
  'satpura-wildscape-jeep-trails-and-riverside-serenity': {
    heroImageUrl: '/images/packages/satpura/satpura-jeep-trails-cover.webp',
    galleryUrls: [
      '/images/packages/satpura/satpura-backwaters-boat.webp',
      '/images/packages/satpura/satpura-serpent-eagle.webp',
      '/images/packages/satpura/satpura-riverside-lodge.webp',
    ],
  },
  'enchanting-kashmir-sojourn': {
    heroImageUrl: '/images/packages/kashmir/kashmir-dal-lake-shikara-hero.png',
    heroImageAlt:
      'Traditional shikaras resting on Dal Lake beneath the snow-capped Kashmir Himalayas at sunrise',
    galleryUrls: [
      '/images/packages/kashmir/kashmir-gulmarg-meadow.png',
      '/images/packages/kashmir/kashmir-pahalgam-river.png',
    ],
    galleryImageAlts: [
      'A wildflower meadow and traditional mountain cottages below the snow-capped Gulmarg range',
      'A clear mountain river flowing through the cedar forests and peaks of Pahalgam',
    ],
  },
  'essence-of-goa': {
    heroImageUrl: '/images/packages/goa/goa-coast-sunrise-hero.png',
    heroImageAlt:
      'Traditional wooden fishing boats resting on a palm-lined Goa beach at sunrise',
    galleryUrls: [
      '/images/packages/goa/goa-portuguese-heritage-street.png',
      '/images/packages/goa/goa-chorao-mangroves.png',
    ],
    galleryImageAlts: [
      'A quiet Portuguese-influenced Goa heritage street with a whitewashed chapel and bougainvillea',
      'An empty wooden kayak on Chorao Island mangrove backwaters at sunrise',
    ],
  },
  'enchanting-wilderness-getaway-corbett-romance': {
    heroImageUrl: '/images/packages/corbett/corbett-tiger-sal-forest-hero.png',
    heroImageAlt:
      'A Bengal tiger walking along a misty sal forest track in Jim Corbett at dawn',
    galleryUrls: [
      '/images/packages/corbett/corbett-forest-lodge-firepit.png',
      '/images/packages/corbett/corbett-safari-jeep-forest.png',
    ],
    galleryImageAlts: [
      'An empty wooden forest lodge deck beside a glowing fire bowl at blue hour',
      'An empty open-top safari jeep on a sunlit sal forest track in Jim Corbett',
    ],
  },
  'coorgs-enchanted-getaway': {
    heroImageUrl: '/images/packages/coorg/coorg-coffee-estate-dawn-hero.png',
    heroImageAlt:
      'A misty coffee estate stretching across the Coorg hills at dawn',
    galleryUrls: [
      '/images/packages/coorg/coorg-coffee-cherry-walk.png',
      '/images/packages/coorg/coorg-lakeside-dinner.png',
    ],
    galleryImageAlts: [
      'A quiet walking path through a Coorg coffee estate with ripe coffee cherries',
      'A lantern-lit dinner setting beside a misty Coorg plantation lake at blue hour',
    ],
  },
};

export function withPackageImageOverrides(pkg: Package): Package {
  const override = PACKAGE_IMAGE_OVERRIDES[pkg.slug];
  return override ? { ...pkg, ...override } : pkg;
}
