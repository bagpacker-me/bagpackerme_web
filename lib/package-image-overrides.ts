import type { Package } from '@/types';

/**
 * Local editorial image and SEO sets for packages whose supplied CMS fields
 * are incomplete. Applying these as packages are read keeps the page, cards,
 * metadata, and structured data in sync while preserving the itinerary and
 * booking data in Firestore.
 */
const PACKAGE_IMAGE_OVERRIDES: Record<
  string,
  Partial<
    Pick<
    Package,
    | 'heroImageUrl'
    | 'heroImageAlt'
    | 'galleryUrls'
    | 'galleryImageAlts'
    | 'metaTitle'
    | 'metaDescription'
    | 'tagline'
    | 'overviewHtml'
    | 'duration'
    >
  >
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
  'just-us-by-the-sea-at-xandari-pearl-marari-kerala': {
    heroImageUrl: '/images/packages/marari/marari-beach-coconut-hero.png',
    heroImageAlt:
      'A traditional Kerala fishing boat on the palm-lined Marari Beach at sunrise',
    galleryUrls: [
      '/images/packages/marari/marari-backwater-canoe.png',
      '/images/packages/marari/marari-beach-dinner.png',
    ],
    galleryImageAlts: [
      'An empty traditional canoe on a calm Kerala backwater lined with coconut palms',
      'An intimate lantern-lit dinner setting on quiet Marari Beach at dusk',
    ],
  },
  'nature-nurture-babymoon-at-oleander-farms-karjat': {
    heroImageUrl: '/images/packages/karjat/karjat-vineyard-estate-hero.png',
    heroImageAlt:
      'A lush Karjat country estate and vineyard beneath misty Western Ghats hills',
    galleryUrls: [
      '/images/packages/karjat/karjat-garden-potting.png',
      '/images/packages/karjat/karjat-vineyard-dinner.png',
    ],
    galleryImageAlts: [
      'A terracotta potting bench surrounded by young herbs in a shaded Karjat garden',
      'An intimate two-place dinner setting overlooking a Karjat vineyard at golden hour',
    ],
  },
  'nature-nurture-babymoon-at-shreyas-retreat-bangalore': {
    heroImageUrl:
      '/images/packages/bangalore/bangalore-wellness-pavilion-hero.png',
    heroImageAlt:
      'An open-sided yoga pavilion in a tranquil Bengaluru wellness garden at dawn',
    galleryUrls: [
      '/images/packages/bangalore/bangalore-ayurvedic-pavilion.png',
      '/images/packages/bangalore/bangalore-organic-garden-dining.png',
    ],
    galleryImageAlts: [
      'An Ayurvedic garden treatment pavilion with linen, brass oil bowl, and herbs',
      'An empty farm-to-table dining setting in an organic Bengaluru retreat garden',
    ],
  },
  'cultural-soulscapes-babymoon-at-anopura-jaipur': {
    heroImageUrl: '/images/packages/jaipur/jaipur-aravalli-villa-hero.png',
    heroImageAlt:
      'A secluded sandstone villa courtyard and private pool in the Aravalli hills near Jaipur',
    galleryUrls: [
      '/images/packages/jaipur/jaipur-pottery-studio.png',
      '/images/packages/jaipur/jaipur-lantern-courtyard-dinner.png',
    ],
    galleryImageAlts: [
      'An open-air Rajasthan pottery studio framed by sandstone walls and the Aravalli hills',
      'A lantern-lit two-place dinner beneath a native tree in a Jaipur heritage courtyard',
    ],
  },
  'cultural-soulscapes-babymoon-at-jagat-niwas-udaipur': {
    heroImageUrl:
      '/images/packages/udaipur/udaipur-lake-pichola-haveli-hero.png',
    heroImageAlt:
      'A white heritage haveli terrace overlooking Lake Pichola in Udaipur at sunrise',
    galleryUrls: [
      '/images/packages/udaipur/udaipur-yoga-terrace.png',
      '/images/packages/udaipur/udaipur-lake-high-tea-boat.png',
    ],
    galleryImageAlts: [
      'A quiet Udaipur heritage rooftop with yoga mats overlooking Lake Pichola',
      'An empty high-tea setting aboard a traditional wooden boat on Lake Pichola',
    ],
    metaTitle: 'Udaipur Babymoon at Jagat Niwas',
    metaDescription:
      'Plan a 4-day Udaipur babymoon at Jagat Niwas on Lake Pichola, with lakeside yoga, spa rituals, sunset high tea and a private boat experience.',
    tagline: 'Lake Pichola wellness, heritage stays and private high tea.',
  },
  'timeless-wonders-of-maharashtra': {
    heroImageUrl:
      '/images/packages/maharashtra/maharashtra-ellora-kailasa-hero.png',
    heroImageAlt:
      'The monolithic Kailasa Temple at Ellora Caves in Maharashtra at sunrise',
    galleryUrls: [
      '/images/packages/maharashtra/maharashtra-elephanta-ferry.png',
      '/images/packages/maharashtra/maharashtra-ajanta-gorge.png',
    ],
    galleryImageAlts: [
      'An empty ferry crossing Mumbai Harbour toward Elephanta Island at sunrise',
      'Ancient Ajanta Cave façades above the green Waghora gorge in Maharashtra',
    ],
    metaTitle: 'Maharashtra Heritage Tour: Mumbai & Ajanta',
    metaDescription:
      'Explore Maharashtra’s heritage, from Mumbai’s Fort precinct and Elephanta Caves to Ajanta and Ellora, with village life, yoga and pottery near Aurangabad.',
    tagline: 'Mumbai, Elephanta, Ajanta and Ellora at an unhurried pace.',
    overviewHtml:
      '<p>Follow an eight-day Maharashtra heritage journey from Mumbai’s Fort precinct and Elephanta Caves to Ajanta and Ellora. Balance monumental history with an Aurangabad farmstay, village life, yoga and pottery for a slower, more connected route.</p>',
    duration: '8 Days / 7 Nights',
  },
  'just-us-by-the-sea-babymoon-at-ahilya-by-the-sea-goa': {
    heroImageUrl:
      '/images/packages/ahilya-goa/ahilya-goa-heritage-villa-hero.png',
    heroImageAlt:
      'A quiet Indo-Portuguese coastal villa terrace overlooking the Arabian Sea in Goa',
    galleryUrls: [
      '/images/packages/ahilya-goa/ahilya-goa-infinity-pool.png',
      '/images/packages/ahilya-goa/ahilya-goa-courtyard-dinner.png',
    ],
    galleryImageAlts: [
      'An empty infinity plunge pool in a lush Goa coastal garden at sunset',
      'An intimate candlelit Goan dinner setting in an open-air heritage courtyard',
    ],
    metaTitle: 'Goa Babymoon at Ahilya by the Sea',
    metaDescription:
      'Plan a restorative Goa babymoon at Ahilya by the Sea with private yoga, spa time, sunset beach walks, a cooking class and candlelit dining.',
    tagline: 'A restorative Goa babymoon of coastal calm, wellness and romance.',
    overviewHtml:
      '<p>Slow down with a four-day Goa babymoon at Ahilya by the Sea. Private yoga, spa time, sunset beach walks, a hands-on cooking experience and candlelit dining make space for rest, connection and unhurried coastal days.</p>',
    duration: '4 Days / 3 Nights',
  },
  'culinary-and-cultural-delights-of-kolkata': {
    heroImageUrl: '/images/packages/kolkata/kolkata-hooghly-howrah-hero.png',
    heroImageAlt:
      'Sunrise over Kolkata’s Hooghly River and Howrah Bridge',
    galleryUrls: [
      '/images/packages/kolkata/kolkata-bengali-thali.png',
      '/images/packages/kolkata/kolkata-coffeehouse.png',
    ],
    galleryImageAlts: [
      'A traditional Bengali thali with regional dishes in a warm Kolkata home',
      'An empty vintage Kolkata coffeehouse with high ceilings and timber tables',
    ],
    metaTitle: 'Kolkata Food & Culture Tour',
    metaDescription:
      'Explore Kolkata through Bengali thalis, home cooking, Indian Coffee House and a guided street-food tour on this four-day culinary escape.',
    tagline: 'A four-day Kolkata journey of Bengali food, heritage, coffee and street-food culture.',
    overviewHtml:
      '<p>Discover Kolkata through its food and layered cultural life. This four-day culinary escape brings together Bengali thalis, host-home cooking, Indian Coffee House, heritage streets and a guided street-food walk.</p>',
    duration: '4 Days / 3 Nights',
  },
  'flavours-of-himachal-an-immersive-culinary-experience': {
    heroImageUrl:
      '/images/packages/himachal/himachal-palampur-tea-estate-hero.png',
    heroImageAlt:
      'Palampur tea estate beneath the Dhauladhar range in Himachal Pradesh',
    galleryUrls: [
      '/images/packages/himachal/himachal-kangra-tea-blending.png',
      '/images/packages/himachal/himachal-woodfired-kitchen.png',
    ],
    galleryImageAlts: [
      'Kangra tea blending on a veranda overlooking a Himachal tea estate',
      'Wood-fired Himachali cooking in a mountain homestay kitchen',
    ],
    metaTitle: 'Himachal Culinary Tour: Kangra & Palampur',
    metaDescription:
      'Experience Himachal food in Kangra and Palampur: tea blending, Kangri Dham, Tibetan momos, wood-fired pizza and organic-herb cooking.',
    tagline: 'A four-day Kangra and Palampur journey of tea, Kangri Dham and mountain cooking.',
    overviewHtml:
      '<p>Experience Himachal through Kangra and Palampur’s food traditions. Blend tea at an estate, cook Kangri Dham over wood fire, taste Tibetan momos and thukpa, and finish with organic herbs and mountain-homestay baking.</p>',
    duration: '4 Days / 3 Nights',
  },
};

export function withPackageImageOverrides(pkg: Package): Package {
  const override = PACKAGE_IMAGE_OVERRIDES[pkg.slug];
  return override ? { ...pkg, ...override } : pkg;
}
