import type { Package } from '@/types';

const yes = {
  accommodation: true,
  meals: true,
  transfers: true,
  guides: true,
  flights: false,
  activities: true,
};

export const STATIC_GLOBAL_PACKAGES: Package[] = [
  {
    id: 'static-global-thailand-pattaya',
    title: 'Pattaya beach break',
    slug: 'pattaya-thailand-3-nights',
    market: 'global',
    category: 'Beach',
    tagline: 'A short Thailand escape with island waters, cabaret lights, and tropical gardens.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '4 days / 3 nights',
    groupSize: 'Private groups from 4 travelers',
    priceInr: 56400,
    priceUsd: 680,
    destinations: ['Bangkok', 'Pattaya', 'Coral Island', 'Nong Nooch'],
    overviewHtml:
      '<p>Begin in Bangkok and settle into Pattaya for a compact coastal holiday built around easy transfers, island time, and classic Thailand experiences. This route is ideal for families, friends, and first-time Thailand travelers who want a short, fully arranged getaway.</p><p>The package can be quoted with flight, insurance, and visa support where applicable, or kept land-only for travelers arranging their own flights.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Bangkok to Pattaya',
        description:
          'Arrive at Suvarnabhumi International Airport, meet the local representative, and transfer by private van to Pattaya. Check in and keep the rest of the day relaxed for beach time, nearby markets, or hotel downtime.',
      },
      {
        day: 2,
        location: 'Coral Island and Alcazar',
        description:
          'Take a shared speedboat excursion to Coral Island for white sand, clear water, and optional water sports. Return to Pattaya for an evening transfer to the Alcazar Cabaret Show.',
      },
      {
        day: 3,
        location: 'Nong Nooch Tropical Garden',
        description:
          'Visit Nong Nooch Tropical Garden for landscaped gardens, Thai cultural performances, a sightseeing bus tour, and lunch. The evening is open for shopping or a relaxed coastal dinner.',
      },
      {
        day: 4,
        location: 'Pattaya to Bangkok',
        description:
          'Check out after breakfast. Depending on your flight time, add last-minute shopping or optional activities before the private transfer to Bangkok airport.',
      },
    ],
    inclusions: { ...yes, flights: false },
    exclusions: [
      'International or domestic airfare unless selected in the final quote',
      'Optional water sports and activities not listed in the itinerary',
      'Meals other than those specified',
      'Personal expenses, tips, porterage, laundry, and beverages',
      'Applicable taxes, visa changes, or currency fluctuations at confirmation',
    ],
    vibe: 'Easy beach holiday',
    locationIdea: 'Pattaya, Thailand',
    status: 'published',
    metaTitle: 'Pattaya Thailand 3 nights package',
    metaDescription:
      'A 3-night Pattaya package with Coral Island, Alcazar Cabaret, Nong Nooch Tropical Garden, transfers, hotel stay, and optional flight or visa support.',
    createdAt: '2026-07-10T00:00:00.000Z',
  },
  {
    id: 'static-global-vietnam-danang-ho-chi-minh',
    title: 'Da Nang to Ho Chi Minh discovery',
    slug: 'vietnam-da-nang-ho-chi-minh-6-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Golden Bridge, Hoi An lanterns, Saigon landmarks, and the Cu Chi tunnel network.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '7 days / 6 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 915,
    destinations: ['Da Nang', 'Ba Na Hills', 'Hoi An', 'Ho Chi Minh City', 'Cu Chi'],
    overviewHtml:
      '<p>This Vietnam route balances coastal central Vietnam with the energy of Ho Chi Minh City. Start with Da Nang markets, Marble Mountain, Ba Na Hills, the Golden Bridge, and Hoi An, then continue south for Saigon city icons and the Cu Chi Tunnels.</p><p>Hotel category can be tuned from superior to premium stays, with private touring on key sightseeing days and flexible leisure time built in.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Da Nang arrival',
        description:
          'Arrive in Da Nang and transfer to your hotel. Begin with Han Market, the riverfront, Cham Museum, Marble Mountain, and a drive by the Dragon Bridge.',
      },
      {
        day: 2,
        location: 'Ba Na Hills and Golden Bridge',
        description:
          'Ride the cable car to Ba Na Hills for the Golden Bridge, gardens, pagoda, theme park areas, and French Village. Lunch is included before returning to Da Nang.',
      },
      {
        day: 3,
        location: 'Coconut Jungle and Hoi An',
        description:
          'Visit Cam Thanh water coconut village, try a bamboo basket boat ride, then explore Hoi An Old Town with the Japanese Bridge, assembly halls, local market, and lantern release experience.',
      },
      {
        day: 4,
        location: 'Da Nang to Ho Chi Minh City',
        description:
          'Fly to Ho Chi Minh City and take a half-day city tour covering Reunification Palace, central Saigon landmarks, Notre Dame Cathedral exterior, and the historic post office.',
      },
      {
        day: 5,
        location: 'Cu Chi Tunnels',
        description:
          'Travel outside Saigon to visit a rice paper family workshop and the Cu Chi Tunnels, including tunnel sections, historical displays, and wartime remnants.',
      },
      {
        day: 6,
        location: 'Ho Chi Minh City leisure day',
        description:
          'Keep the day open for shopping, cafes, optional food tours, museums, or a slower local exploration at your own pace.',
      },
      {
        day: 7,
        location: 'Saigon departure',
        description:
          'Transfer to Tan Son Nhat International Airport for your onward flight, with timing adjusted around your departure.',
      },
    ],
    inclusions: { ...yes, flights: false },
    exclusions: [
      'International airfare and travel insurance unless added to the quote',
      'Meals not mentioned in the program',
      'Tips to drivers and guides',
      'Drinks, personal expenses, optional excursions, early check-in, and late checkout',
      'Taxes, visa changes, and destination fee changes at confirmation',
    ],
    vibe: 'Culture, coast, and city',
    locationIdea: 'Central and southern Vietnam',
    status: 'published',
    metaTitle: 'Vietnam Da Nang to Ho Chi Minh 6 nights package',
    metaDescription:
      'A 6-night Vietnam itinerary covering Da Nang, Ba Na Hills, Golden Bridge, Hoi An, Ho Chi Minh City, and Cu Chi Tunnels.',
    createdAt: '2026-07-10T00:00:00.000Z',
  },
  {
    id: 'static-global-vietnam-phu-quoc-hanoi-halong',
    title: 'Phu Quoc, Hanoi and Halong Bay',
    slug: 'vietnam-phu-quoc-hanoi-halong-7-nights',
    market: 'global',
    category: 'Beach',
    tagline: 'Island snorkeling, Hanoi old quarter, Halong Bay cruising, and Ninh Binh limestone landscapes.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Private and small-group touring blend',
    priceInr: null,
    priceUsd: 650,
    destinations: ['Phu Quoc', 'Hanoi', 'Halong Bay', 'Ninh Binh', 'Trang An'],
    overviewHtml:
      '<p>A fuller Vietnam holiday that starts on Phu Quoc island before moving north to Hanoi, Halong Bay, and Ninh Binh. It blends beach time, snorkeling, city highlights, an overnight bay cruise, and Trang An by boat.</p><p>This package works especially well for travelers who want one itinerary with both island downtime and northern Vietnam scenery.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Phu Quoc arrival',
        description:
          'Arrive in Phu Quoc, meet your guide, and transfer to the hotel. Settle into the island pace with the rest of the day at leisure.',
      },
      {
        day: 2,
        location: 'Four islands and cable car',
        description:
          'Join a guided island tour by speedboat with snorkeling, beach time, lunch, Aquatopia Water Park, and the cable car ride back with panoramic island views.',
      },
      {
        day: 3,
        location: 'Phu Quoc leisure day',
        description:
          'Keep the day free for the beach, resort time, optional sea walker experiences, cafes, or sunset exploration.',
      },
      {
        day: 4,
        location: 'Phu Quoc to Hanoi',
        description:
          'Fly to Hanoi and take a half-day city highlights tour covering Ba Dinh Square, Ho Chi Minh complex exterior, One Pillar Pagoda, Tran Quoc Pagoda, Hoan Kiem Lake, and the Old Quarter.',
      },
      {
        day: 5,
        location: 'Hanoi to Halong Bay',
        description:
          'Drive to Halong Bay and board an overnight cruise through limestone seascapes. Enjoy lunch, relaxation, possible cave or village visits, kayaking opportunities, and dinner on board.',
      },
      {
        day: 6,
        location: 'Halong Bay to Hanoi',
        description:
          'Start with optional Tai Chi and morning cruising, then brunch on board before returning to Hanoi. Evening shopping or local market exploration can be added with a guide.',
      },
      {
        day: 7,
        location: 'Ninh Binh and Trang An',
        description:
          'Drive south to Hoa Lu and Trang An for temples, river landscapes, caves, and limestone mountains, then return to Hanoi.',
      },
      {
        day: 8,
        location: 'Hanoi departure',
        description:
          'Enjoy free time until your transfer to Noi Bai International Airport for your onward flight.',
      },
    ],
    inclusions: { ...yes, flights: false },
    exclusions: [
      'International and domestic airfare unless added to the quote',
      'Travel insurance',
      'Tips, drinks, personal expenses, and optional excursions',
      'Meals not mentioned in the itinerary',
      'Taxes, visa changes, and destination fee changes at confirmation',
    ],
    vibe: 'Island to limestone landscapes',
    locationIdea: 'Southern island and northern Vietnam',
    status: 'published',
    metaTitle: 'Vietnam Phu Quoc Hanoi Halong Bay 7 nights package',
    metaDescription:
      'An 8-day Vietnam package covering Phu Quoc, Hanoi, Halong Bay, Ninh Binh, Trang An, island touring, and an overnight cruise.',
    createdAt: '2026-07-10T00:00:00.000Z',
  },
  {
    id: 'static-global-kenya-safari',
    title: 'Kenya safari circuit',
    slug: 'kenya-amboseli-naivasha-masai-mara-9-nights',
    market: 'global',
    category: 'Safari',
    tagline: 'Amboseli elephants, Lake Naivasha, Hell\'s Gate, and extended Masai Mara game drives.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '10 days / 9 nights',
    groupSize: 'Private safari quote for small groups',
    priceInr: null,
    priceUsd: 5387,
    destinations: ['Nairobi', 'Amboseli', 'Lake Naivasha', 'Hell\'s Gate', 'Masai Mara'],
    overviewHtml:
      '<p>This Kenya safari route is built for serious wildlife time, moving from Amboseli and Mount Kilimanjaro views to Lake Naivasha, Hell\'s Gate, and a long Masai Mara stay. The pace gives travelers repeated morning and afternoon game drive windows rather than rushing between reserves.</p><p>Accommodation is lodge-based with full-board safari days, private transfers, and safari-sector game drives in a 4x4 Land Cruiser with a pop-up roof or lodge vehicle depending on the confirmed setup.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Nairobi to Amboseli',
        description:
          'Arrive at Jomo Kenyatta International Airport, meet the team, and drive south to Amboseli. After lunch, head out for an afternoon game drive.',
      },
      {
        day: 2,
        location: 'Amboseli National Park',
        description:
          'Take morning and afternoon game drives with chances to see elephants, lions, giraffes, zebras, birdlife, and Mount Kilimanjaro views when skies are clear.',
      },
      {
        day: 3,
        location: 'Amboseli to Lake Naivasha',
        description:
          'Depart Amboseli after breakfast, travel via Nairobi and the Rift Valley, then arrive at Lake Naivasha for a boat ride and lodge stay.',
      },
      {
        day: 4,
        location: 'Hell\'s Gate National Park',
        description:
          'Visit Hell\'s Gate National Park, known for dramatic gorges, rock towers, geothermal activity, and varied wildlife. Return to Naivasha for lunch and leisure time.',
      },
      {
        day: 5,
        location: 'Lake Naivasha to Masai Mara',
        description:
          'Travel through Kenya\'s open plains and Maasai land to reach the Mara around midday. After lunch, enjoy your first Mara game drive.',
      },
      {
        day: 6,
        location: 'Masai Mara National Reserve',
        description:
          'Begin the first of several full safari days with morning and afternoon drives across the Mara ecosystem, known for predators, elephants, buffalo, and seasonal migration drama.',
      },
      {
        day: 7,
        location: 'Masai Mara National Reserve',
        description:
          'Continue game drives through grasslands, river areas, and acacia-dotted plains, with time between drives for lunch and rest at the lodge.',
      },
      {
        day: 8,
        location: 'Masai Mara National Reserve',
        description:
          'Use another full day in the Mara to search different wildlife zones and build in optional experiences such as a village visit or balloon safari when available.',
      },
      {
        day: 9,
        location: 'Masai Mara National Reserve',
        description:
          'Spend a final full day on safari, giving the route more chances for Big Five sightings, river crossings in season, and sunset scenes.',
      },
      {
        day: 10,
        location: 'Masai Mara to Nairobi',
        description:
          'Depart after breakfast and drive back through Narok and the Rift Valley toward Nairobi for lunch or airport drop-off based on your onward plans.',
      },
    ],
    inclusions: { ...yes, flights: false },
    exclusions: [
      'International airfare unless added to the final quote',
      'Kenya ETA or visa costs where applicable',
      'Travel, baggage, and medical insurance',
      'Driver-guide gratuities, drinks, tips, porterage, laundry, and personal expenses',
      'Optional Masai village visit, hot air balloon safari, and services not listed',
    ],
    vibe: 'Wildlife-forward safari',
    locationIdea: 'Amboseli, Naivasha, and Masai Mara',
    status: 'published',
    metaTitle: 'Kenya Amboseli Naivasha Masai Mara safari package',
    metaDescription:
      'A 9-night Kenya safari package through Amboseli, Lake Naivasha, Hell\'s Gate, and Masai Mara with game drives, lodge stays, transfers, and full-board safari days.',
    createdAt: '2026-07-10T00:00:00.000Z',
  },
];
