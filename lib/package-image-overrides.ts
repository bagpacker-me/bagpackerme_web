import type { Package } from '@/types';

/**
 * Local editorial image and SEO sets for packages whose supplied CMS fields
 * are incomplete. Applying these as packages are read keeps the page, cards,
 * metadata, and structured data in sync while preserving the itinerary and
 * booking data in Firestore.
 */
type PackageEditorialOverride = Partial<
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
    | 'groupSize'
    | 'destinations'
  >
> & {
  /**
   * CMS entries from the original import often carry good day descriptions but
   * no location headings. Overlay only the headings so the rendered itinerary
   * and TouristTrip schema stay informative without rewriting editorial copy.
   */
  itineraryLocations?: string[];
};

const PACKAGE_IMAGE_OVERRIDES: Record<
  string,
  PackageEditorialOverride
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
  'ahmedabad-heritage-handcraft-and-history': {
    heroImageUrl: '/images/packages/ahmedabad/ahmedabad-old-city-hero.png',
    heroImageAlt:
      'Carved wooden façades and a heritage rickshaw in Ahmedabad’s historic old city at golden hour',
    galleryUrls: [
      '/images/packages/ahmedabad/ahmedabad-adalaj-stepwell.png',
      '/images/packages/ahmedabad/ahmedabad-block-printing.png',
    ],
    galleryImageAlts: [
      'Sandstone tiers and geometric carvings inside Adalaj Stepwell near Ahmedabad',
      'Wooden blocks and hand-printed textiles in an Ahmedabad craft workshop',
    ],
    metaTitle: 'Ahmedabad Heritage & Handcraft Tour',
    metaDescription:
      'Explore Ahmedabad’s old-city pols, Adalaj Stepwell, Sabarmati Ashram and block-printing traditions on a private five-day heritage journey.',
    tagline: 'A five-day private journey through Ahmedabad’s living heritage, craft and conscience.',
    overviewHtml:
      '<p>Trace Ahmedabad’s living heritage over five days: stay in the old city, explore UNESCO-listed pols, Adalaj Stepwell and Sabarmati Ashram, and meet local block-printing artisans. This private journey blends architecture, Gujarati food and craft with thoughtful local storytelling.</p>',
    duration: '5 Days / 4 Nights',
    groupSize: 'Private journey',
    destinations: ['Ahmedabad', 'Adalaj'],
    itineraryLocations: ['Ahmedabad', 'Ahmedabad', 'Adalaj', 'Ahmedabad', 'Ahmedabad'],
  },
  'golden-triangle-and-sacred-varanasi': {
    heroImageUrl:
      '/images/packages/golden-triangle-varanasi/golden-triangle-varanasi-ghats-hero.png',
    heroImageAlt:
      'Sunrise over the Ganges and historic Varanasi ghats with a traditional wooden boat',
    galleryUrls: [
      '/images/packages/golden-triangle-varanasi/golden-triangle-amer-fort.png',
      '/images/packages/golden-triangle-varanasi/golden-triangle-banarasi-silk.png',
    ],
    galleryImageAlts: [
      'Amer Fort courtyard in Jaipur illuminated by early morning light',
      'Banarasi silk being woven on a traditional handloom in Varanasi',
    ],
    metaTitle: 'Golden Triangle & Varanasi Tour',
    metaDescription:
      'Travel Delhi, Jaipur, Agra and Varanasi on a nine-day private journey of forts, the Taj Mahal, Ganga Aarti, river dawns and Banarasi crafts.',
    tagline: 'Nine days through Delhi, Jaipur, Agra and Varanasi—heritage, sacred river life and craft.',
    overviewHtml:
      '<p>Travel through Delhi, Jaipur, Agra and Varanasi on a nine-day private journey shaped around storytelling, architecture and living traditions. Walk Old Delhi, watch sunset from Nahargarh, see the Taj at dawn, join a Ganga Aarti and meet Banarasi silk weavers.</p>',
    duration: '9 Days / 8 Nights',
    groupSize: 'Private journey',
    destinations: ['Delhi', 'Jaipur', 'Agra', 'Varanasi'],
    itineraryLocations: ['Delhi', 'Delhi', 'Jaipur', 'Jaipur', 'Agra', 'Agra', 'Varanasi', 'Varanasi', 'Varanasi'],
  },
  'the-sacred-flames-of-kerala-theyyam-hills-and-coast': {
    heroImageUrl: '/images/packages/kerala-theyyam/kerala-theyyam-hero.png',
    heroImageAlt:
      'A flame-lit Theyyam ritual in a Kerala temple courtyard at night',
    galleryUrls: [
      '/images/packages/kerala-theyyam/kerala-wayanad-tea-estate.png',
      '/images/packages/kerala-theyyam/kerala-bekal-fort.png',
    ],
    galleryImageAlts: [
      'Tea estate terraces beneath misty Wayanad hills in Kerala',
      'Bekal Fort rising above Kerala’s Arabian Sea coast at sunset',
    ],
    metaTitle: 'Kerala Theyyam, Wayanad & Bekal Tour',
    metaDescription:
      'Experience Kerala’s living Theyyam traditions, Wayanad tea estates, Edakkal Caves and Bekal Fort on a seven-day private cultural journey.',
    tagline: 'A seven-day Kerala journey of Theyyam ritual, Wayanad hills and the Bekal coast.',
    overviewHtml:
      '<p>Move from Kerala’s living Theyyam traditions in Neeleshwar to Wayanad’s forests, tea estates and Edakkal Caves, then slow down along the Bekal coast. This seven-day private route brings together ritual, regional food, hill-country nature and quiet heritage.</p>',
    duration: '7 Days / 6 Nights',
    groupSize: 'Private journey',
    destinations: ['Kannur', 'Neeleshwar', 'Wayanad', 'Bekal'],
    itineraryLocations: ['Neeleshwar', 'Neeleshwar', 'Wayanad', 'Wayanad', 'Bekal', 'Bekal', 'Kannur'],
  },
  'wild-trails-and-royal-tales': {
    heroImageUrl:
      '/images/packages/rajasthan-jawai/rajasthan-jawai-leopard-hero.png',
    heroImageAlt:
      'An Indian leopard on granite boulders in Jawai, Rajasthan at dawn',
    galleryUrls: [
      '/images/packages/rajasthan-jawai/rajasthan-mehrangarh-fort.png',
      '/images/packages/rajasthan-jawai/rajasthan-lake-pichola-boat.png',
    ],
    galleryImageAlts: [
      'Mehrangarh Fort above Jodhpur at blue hour',
      'A heritage boat on Lake Pichola facing Udaipur City Palace at sunset',
    ],
    metaTitle: 'Rajasthan Heritage & Jawai Leopard Tour',
    metaDescription:
      'Travel Rajasthan from Jodhpur’s forts and Rajput kitchens to Jawai leopard country, Ranakpur temples and Lake Pichola in Udaipur.',
    tagline: 'Eight days of fort cities, leopard country, royal kitchens and lakeside Udaipur.',
    overviewHtml:
      '<p>Follow a private Rajasthan route from Jodhpur’s forts and Rajput kitchens to Jawai’s granite leopard country, the marble temples of Ranakpur and Lake Pichola in Udaipur. It balances wildlife, royal history, rural life and time to linger.</p>',
    duration: '8 Days / 7 Nights',
    groupSize: 'Private journey',
    destinations: ['Jodhpur', 'Jawai', 'Ranakpur', 'Udaipur'],
    itineraryLocations: ['Jodhpur', 'Jodhpur', 'Jawai', 'Jawai', 'Udaipur via Ranakpur', 'Udaipur', 'Udaipur', 'Udaipur'],
  },
  'tales-and-trails-of-golden-triangle': {
    heroImageUrl:
      '/images/packages/golden-triangle/golden-triangle-taj-hero.png',
    heroImageAlt:
      'The Taj Mahal at sunrise above soft Yamuna River mist in Agra',
    galleryUrls: [
      '/images/packages/golden-triangle/golden-triangle-jaipur-block-printing.png',
      '/images/packages/golden-triangle/golden-triangle-old-delhi-lane.png',
    ],
    galleryImageAlts: [
      'Indigo block-printing in a Jaipur artisan workshop',
      'A cycle rickshaw in a historic Old Delhi market lane at dawn',
    ],
    metaTitle: 'Golden Triangle: Delhi, Jaipur & Agra',
    metaDescription:
      'Explore Delhi, Jaipur and Agra through street food, crafts, stepwells, forts and a sunrise Taj Mahal visit on this ten-day cultural tour.',
    tagline: 'Ten days of Delhi stories, Jaipur craft and Agra’s Mughal artistry.',
    overviewHtml:
      '<p>Explore Delhi, Jaipur and Agra through Old Delhi stories and food, Abhaneri’s stepwell, Amer Fort, block printing and blue pottery. Continue via Fatehpur Sikri for a sunrise Taj Mahal visit, marble inlay and zardosi workshops.</p>',
    duration: '10 Days / 9 Nights',
    groupSize: 'Private journey',
    destinations: ['Delhi', 'Jaipur', 'Agra'],
    itineraryLocations: ['Delhi', 'Delhi', 'Delhi', 'Jaipur via Abhaneri', 'Jaipur', 'Jaipur', 'Agra via Fatehpur Sikri', 'Agra', 'Agra', 'Delhi'],
  },
  'hornbill-festival': {
    heroImageUrl: '/images/packages/hornbill/hornbill-kisama-hero.png',
    heroImageAlt:
      'Kisama Heritage Village in the Naga Hills of Nagaland in the early morning',
    galleryUrls: [
      '/images/packages/hornbill/hornbill-khonoma-terraces.png',
      '/images/packages/hornbill/hornbill-kaziranga-rhino.png',
    ],
    galleryImageAlts: [
      'Terraced fields and village homes in Khonoma, Nagaland',
      'A one-horned rhinoceros in Kaziranga grassland at dawn',
    ],
    metaTitle: 'Hornbill Festival Tour: Nagaland',
    metaDescription:
      'Experience Nagaland’s Hornbill Festival, Khonoma village and a Kaziranga safari on a six-day culture and wildlife journey.',
    tagline: 'Six days of Nagaland culture, Khonoma village life and Kaziranga wildlife.',
    overviewHtml:
      '<p>Experience Nagaland’s Hornbill Festival through Kisama Heritage Village, Dimapur and the green village of Khonoma, then continue to Kaziranga for a wildlife finale. This six-day route combines regional culture, food, landscapes and a one-horned rhino safari.</p>',
    duration: '6 Days / 5 Nights',
    groupSize: 'Private journey',
    destinations: ['Dimapur', 'Kohima', 'Khonoma', 'Kaziranga'],
    itineraryLocations: ['Dimapur', 'Kohima', 'Kohima', 'Khonoma', 'Kaziranga', 'Guwahati'],
  },
  'the-royal-rath-yatra-chronicles': {
    heroImageUrl: '/images/packages/rath-yatra/baripada-rath-yatra-hero.png',
    heroImageAlt:
      'The ceremonial Rath Yatra route near Baripada Jagannath Temple in Odisha at early light',
    galleryUrls: [
      '/images/packages/rath-yatra/baripada-heritage-courtyard.png',
      '/images/packages/rath-yatra/odisha-chhau-craft.png',
    ],
    galleryImageAlts: [
      'A tranquil heritage courtyard in Baripada, Odisha',
      'Traditional Odisha Chhau dance masks and craft details',
    ],
    metaTitle: 'Baripada Rath Yatra Tour, Odisha',
    metaDescription:
      'Experience Baripada’s Rath Yatra with temple rituals, Chhau dance, Odia feasts and heritage-palace hospitality on a five-day Odisha journey.',
    tagline: 'Five days of Baripada ritual, Chhau artistry, Odia food and heritage hospitality.',
    overviewHtml:
      '<p>Experience Baripada’s distinctive Rath Yatra through temple rituals, Chhau dance, Odia feasts and heritage-palace hospitality. This five-day Odisha journey is timed around the festival calendar, with travel dates confirmed before booking.</p>',
    duration: '5 Days / 4 Nights',
    groupSize: 'Private journey',
    destinations: ['Baripada', 'Odisha'],
    itineraryLocations: ['Baripada', 'Baripada', 'Baripada', 'Baripada', 'Baripada'],
  },
  'timeless-textile-traditions-of-gujarat': {
    heroImageUrl:
      '/images/packages/gujarat-textiles/gujarat-textile-workshop-hero.webp',
    heroImageAlt:
      'An artisan hand block-printing indigo and madder-red cloth in a traditional Kutch workshop',
    galleryUrls: [
      '/images/packages/gujarat-textiles/gujarat-patola-loom.webp',
      '/images/packages/gujarat-textiles/gujarat-little-rann-wild-ass.webp',
    ],
    galleryImageAlts: [
      'A Patola artisan weaving colourful double-ikat silk on a traditional loom in Patan, Gujarat',
      'Indian wild asses crossing the salt flats of the Little Rann of Kutch at sunrise',
    ],
    metaTitle: 'Gujarat Textile & Craft Tour',
    metaDescription:
      'Follow Gujarat’s textile traditions from Ahmedabad and Patan to the Little Rann and Kutch, with block printing, Patola weaving, village craft and wildlife.',
    tagline:
      'Ten days through Gujarat’s textile workshops, heritage cities, salt desert and craft villages.',
    overviewHtml:
      '<p>Follow Gujarat’s living textile traditions from Ahmedabad’s old city and Calico Museum to Pethapur block printing, Patan’s Patola weaving and the artisan villages of Kutch. Over ten days, heritage architecture, natural dyes, embroidery and a Little Rann wildlife safari reveal the landscape behind the craft.</p>',
    duration: '10 Days / 9 Nights',
    groupSize: 'Private journey',
    destinations: ['Ahmedabad', 'Patan', 'Little Rann of Kutch', 'Bhuj', 'Gondal'],
    itineraryLocations: [
      'Ahmedabad',
      'Ahmedabad',
      'Pethapur & Ahmedabad',
      'Patan & Little Rann of Kutch',
      'Little Rann of Kutch',
      'Ajrakhpur & Bhuj',
      'Kutch craft villages',
      'Gondal',
      'Ahmedabad',
      'Ahmedabad',
    ],
  },
  'sacred-sands-and-spiritual-cities-a-journey-through-north-india': {
    heroImageUrl:
      '/images/packages/north-india-spiritual/varanasi-ghats-hero.webp',
    heroImageAlt:
      'A traditional wooden boat on the Ganges facing Varanasi’s historic ghats at sunrise',
    galleryUrls: [
      '/images/packages/north-india-spiritual/bodh-gaya-mahabodhi-temple.webp',
      '/images/packages/north-india-spiritual/prayagraj-triveni-sangam.webp',
    ],
    galleryImageAlts: [
      'Mahabodhi Temple and the sacred Bodhi tree in Bodh Gaya during quiet morning light',
      'Wooden boats and flower offerings on the Triveni Sangam at Prayagraj at sunrise',
    ],
    metaTitle: 'North India Spiritual Cities Tour',
    metaDescription:
      'Journey through Varanasi, Bodh Gaya, Prayagraj, Chitrakoot, Ayodhya and Lucknow on an eight-day private pilgrimage and cultural tour.',
    tagline:
      'Eight days along North India’s sacred rivers, Buddhist heritage and pilgrimage cities.',
    overviewHtml:
      '<p>Journey through North India’s sacred geography over eight days, from Ganga Aarti and a sunrise boat ride in Varanasi to Sarnath, Bodh Gaya, Prayagraj, Chitrakoot and Ayodhya. Continue through Naimisharanya to Lucknow on a private route shaped around living traditions, history and time for reflection.</p>',
    duration: '8 Days / 7 Nights',
    groupSize: 'Private journey',
    destinations: ['Varanasi', 'Bodh Gaya', 'Prayagraj', 'Chitrakoot', 'Ayodhya', 'Lucknow'],
    itineraryLocations: [
      'Varanasi',
      'Varanasi, Sarnath & Bodh Gaya',
      'Bodh Gaya, Gaya & Varanasi',
      'Prayagraj',
      'Chitrakoot & Prayagraj',
      'Ayodhya',
      'Naimisharanya & Lucknow',
      'Lucknow',
    ],
  },
  'heritage-havens-golden-triangle-with-jodhpur': {
    heroImageUrl:
      '/images/packages/golden-triangle-jodhpur/jodhpur-mehrangarh-hero.webp',
    heroImageAlt:
      'Mehrangarh Fort rising above Jodhpur’s blue old city in warm sunrise light',
    galleryUrls: [
      '/images/packages/golden-triangle-jodhpur/agra-taj-mahal-dawn.webp',
      '/images/packages/golden-triangle-jodhpur/jaipur-amer-fort.webp',
    ],
    galleryImageAlts: [
      'The Taj Mahal reflected in its central garden pool at dawn in Agra',
      'A sunlit arcade opening onto a quiet courtyard at Amer Fort in Jaipur',
    ],
    metaTitle: 'Golden Triangle & Jodhpur Tour',
    metaDescription:
      'Explore Delhi, Agra, Jaipur and Jodhpur on a nine-day private heritage journey with Old Delhi food, Taj Mahal sunrise, Amer Fort and Mehrangarh Fort.',
    tagline:
      'Nine days from Delhi and the Taj to Jaipur’s palaces and Jodhpur’s blue old city.',
    overviewHtml:
      '<p>Travel beyond the classic Golden Triangle on a nine-day private journey through Delhi, Agra, Jaipur and Jodhpur. Pair Old Delhi food and storytelling with the Taj Mahal at sunrise, Jaipur’s forts and stepwells, and walks through the blue old city beneath Mehrangarh Fort.</p>',
    duration: '9 Days / 8 Nights',
    groupSize: 'Private journey',
    destinations: ['Delhi', 'Agra', 'Jaipur', 'Jodhpur'],
    itineraryLocations: [
      'Delhi',
      'Old Delhi',
      'Agra',
      'Agra',
      'Jaipur',
      'Jaipur',
      'Jodhpur',
      'Jodhpur & Delhi',
      'Delhi',
    ],
  },
};

export function withPackageImageOverrides(pkg: Package): Package {
  const override = PACKAGE_IMAGE_OVERRIDES[pkg.slug];
  if (!override) return pkg;

  const { itineraryLocations, ...fields } = override;
  const itinerary = itineraryLocations
    ? pkg.itinerary.map((day, index) => ({
        ...day,
        location: itineraryLocations[index] || day.location,
      }))
    : pkg.itinerary;

  return { ...pkg, ...fields, itinerary };
}
