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
  {
    id: 'static-global-switzerland-paris',
    title: 'Switzerland and Paris',
    slug: 'switzerland-paris-7-nights',
    market: 'global',
    category: 'Adventure',
    tagline: 'Alpine summits, Rhine Falls, and Paris landmarks on one flight-inclusive route.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 2450,
    destinations: ['Zurich', 'Rhine Falls', 'Black Forest', 'Mt Titlis', 'Lucerne', 'Interlaken', 'Paris'],
    overviewHtml:
      '<p>Four nights across Zurich and central Switzerland followed by three nights in Paris, built so the alpine half and the city half each get room to breathe. The Swiss days cover Rhine Falls by boat, a crossing into Germany\'s Black Forest, the revolving cable car to Mt Titlis, and a lakeside afternoon in Lucerne.</p><p>Paris is handled with a guided landmark tour, the Eiffel Tower second level, and a Seine cruise, with a full free day that can stay open or convert into a Disneyland Paris excursion. Rail, coach, and airport transfers are arranged end to end.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Zurich arrival',
        description:
          'Land at Zurich Airport, meet your representative, and transfer to the hotel. The rest of the day stays open to settle in and adjust before touring begins.',
      },
      {
        day: 2,
        location: 'Zurich, Rhine Falls, and the Black Forest',
        description:
          'Tour Zurich including Bahnhofstrasse and the lakefront, then visit the Lindt chocolate factory. Continue to Rhine Falls for a boat ride beneath Europe\'s largest waterfall, and cross into Germany\'s Black Forest for its handcrafted cuckoo clock workshops.',
      },
      {
        day: 3,
        location: 'Mt Titlis and Lucerne',
        description:
          'Travel to the mountain village of Engelberg and ascend Mt Titlis by revolving cable car for 360-degree summit views, with the Ice Flyer chairlift over the glacier when weather allows. Finish with an orientation walk through medieval Lucerne.',
      },
      {
        day: 4,
        location: 'Interlaken',
        description:
          'Day trip to Interlaken, set between Lake Thun and Lake Brienz below the Jungfrau massif. The day is free to explore at your own pace, or you can add the Jungfrau railway excursion to Europe\'s highest station at extra cost.',
      },
      {
        day: 5,
        location: 'Switzerland to Paris',
        description:
          'Check out and travel onward to Paris, arriving in time to check in and take the evening at leisure in your neighbourhood.',
      },
      {
        day: 6,
        location: 'Paris landmarks',
        description:
          'Guided city tour through central Paris, an afternoon visit to the Eiffel Tower second level, and an evening Seine cruise past the illuminated riverfront.',
      },
      {
        day: 7,
        location: 'Paris free day',
        description:
          'A full open day for museums, markets, or neighbourhood wandering. Disneyland Paris with one-park access can be added as an optional excursion.',
      },
      {
        day: 8,
        location: 'Paris departure',
        description:
          'Breakfast and checkout, with time at leisure until your airport transfer for the homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Optional excursions including Jungfrau and Disneyland Paris',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and entrance fees not listed',
    ],
    vibe: 'Alps and city in one route',
    locationIdea: 'Central Switzerland and Paris',
    status: 'published',
    metaTitle: 'Switzerland and Paris 7 nights package',
    metaDescription:
      'A 7-night Switzerland and Paris package with Zurich, Rhine Falls, Black Forest, Mt Titlis, Lucerne, Interlaken, the Eiffel Tower, and a Seine cruise.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-spain-grand-tour',
    title: 'Spain from Madrid to Barcelona',
    slug: 'spain-madrid-andalusia-barcelona-8-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Toledo, the Mezquita, the Alhambra, and the Mediterranean coast on one overland route.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '9 days / 8 nights',
    groupSize: 'Fixed departures and private group quotes',
    priceInr: null,
    priceUsd: 2940,
    destinations: ['Madrid', 'Toledo', 'Cordoba', 'Seville', 'Granada', 'Guadix', 'Valencia', 'Barcelona'],
    overviewHtml:
      '<p>A full crossing of Spain that starts in Madrid, drops south through Andalusia for the Mezquita and the Alhambra, then follows the Mediterranean coast north to Barcelona. Nights are split two in Madrid, two in Seville, one in Granada, one in Valencia, and two in Barcelona, so the long driving days are balanced against real time in each city.</p><p>Accommodation is four-star throughout, with daily breakfast, airport transfers, and guided city touring at the major stops. Entry to the headline monuments is arranged in advance rather than left to the day.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Madrid arrival',
        description:
          'Arrive in Madrid, transfer to the hotel, and take the evening at leisure around Gran Via or the Plaza Mayor quarter.',
      },
      {
        day: 2,
        location: 'Madrid and Toledo',
        description:
          'Morning city tour of Madrid covering the royal quarter, Puerta del Sol, and the main boulevards, then an afternoon excursion to the walled hill city of Toledo.',
      },
      {
        day: 3,
        location: 'Madrid to Cordoba and Seville',
        description:
          'Travel south to Cordoba to visit the Mezquita, the great mosque-cathedral at the heart of the old town, then continue to Seville for check-in.',
      },
      {
        day: 4,
        location: 'Seville',
        description:
          'Explore Seville including the cathedral quarter, the Alcazar gardens, and the Plaza de Espana. The evening brings a traditional Andalusian dinner hosted by a local family.',
      },
      {
        day: 5,
        location: 'Seville to Granada',
        description:
          'Drive east to Granada and visit the Alhambra, the Nasrid palace and fortress complex above the city, with its palaces, courtyards, and Generalife gardens.',
      },
      {
        day: 6,
        location: 'Granada to Guadix and Valencia',
        description:
          'Stop at Guadix to see its cave dwelling quarter carved into the hillsides, then continue to Valencia for the night.',
      },
      {
        day: 7,
        location: 'Valencia to Barcelona',
        description:
          'Morning in Valencia around the old town and the City of Arts and Sciences, then travel up the coast to Barcelona.',
      },
      {
        day: 8,
        location: 'Barcelona',
        description:
          'City tour taking in the Sagrada Familia, the Gothic Quarter, Passeig de Gracia, and the Montjuic viewpoints, with free time in the afternoon.',
      },
      {
        day: 9,
        location: 'Barcelona departure',
        description:
          'Breakfast and checkout, followed by an airport transfer timed to your return flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Gratuities and any meals taken on board flights',
      'Entrance fees for sites not listed in the itinerary',
      'Early check-in and late checkout charges',
      'Personal expenses and anything not named in the inclusions',
    ],
    vibe: 'Overland heritage route',
    locationIdea: 'Central Spain, Andalusia, and Catalonia',
    status: 'published',
    metaTitle: 'Spain Madrid Andalusia Barcelona 8 nights package',
    metaDescription:
      'An 8-night Spain package from Madrid through Toledo, Cordoba, Seville, Granada, Guadix, and Valencia to Barcelona, with the Mezquita and Alhambra included.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-japan-tokyo-kyoto-osaka',
    title: 'Japan from Tokyo to Osaka',
    slug: 'japan-tokyo-kyoto-osaka-7-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Tokyo neon, Mount Fuji, Kyoto temples, Nara deer parks, and Osaka street food.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 4165,
    destinations: ['Tokyo', 'Hakone', 'Mount Fuji', 'Kyoto', 'Nara', 'Osaka'],
    overviewHtml:
      '<p>A south-running route through Japan\'s three anchor cities, moving Tokyo to Kyoto to Osaka by shinkansen with a Fuji day in between. Tokyo covers both the old city around Asakusa and the contemporary districts, Kyoto handles the temple and geisha quarters, and Osaka closes the trip on food and day trips.</p><p>Rail passes, luggage forwarding between cities, and English-speaking guides on the touring days are arranged as part of the package. Cherry blossom and autumn colour departures book well ahead and are priced separately.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Tokyo arrival',
        description:
          'Arrive at Narita or Haneda and transfer to your Tokyo hotel. The rest of the day stays free to adjust and explore the immediate neighbourhood.',
      },
      {
        day: 2,
        location: 'Tokyo city',
        description:
          'Full day across Tokyo covering Senso-ji temple and the Asakusa lanes, the Meiji shrine grounds, Shibuya crossing, and the electronics and anime district of Akihabara.',
      },
      {
        day: 3,
        location: 'Hakone and Mount Fuji',
        description:
          'Day trip toward Mount Fuji via the Hakone region, with the ropeway over the volcanic valley, a Lake Ashi cruise, and Fuji viewpoints when skies are clear.',
      },
      {
        day: 4,
        location: 'Tokyo to Kyoto',
        description:
          'Board the shinkansen to Kyoto. On arrival, begin with Fushimi Inari and its corridor of vermilion gates, then walk the preserved streets of Higashiyama.',
      },
      {
        day: 5,
        location: 'Kyoto temples',
        description:
          'Visit Kinkaku-ji the golden pavilion, the Arashiyama bamboo grove, and Kiyomizu-dera, with time in the Gion district in the evening.',
      },
      {
        day: 6,
        location: 'Nara and on to Osaka',
        description:
          'Excursion to Nara for Todai-ji and its great bronze Buddha, the free-roaming deer of the park, and Kasuga shrine, then continue to Osaka for check-in.',
      },
      {
        day: 7,
        location: 'Osaka',
        description:
          'Explore Osaka Castle and its grounds, then Dotonbori and Kuromon market for the street food the city is known for. The afternoon is free for shopping or an optional Universal Studios add-on.',
      },
      {
        day: 8,
        location: 'Osaka departure',
        description:
          'Transfer to Kansai International Airport for your onward flight, with timing set around your departure.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Japan visa fees where applicable',
      'Travel insurance',
      'Optional excursions including Universal Studios Japan',
      'Meals not specified in the itinerary',
      'Personal expenses, laundry, and beverages',
      'Peak season surcharges during cherry blossom and autumn colour dates',
    ],
    vibe: 'Cities, temples, and mountain days',
    locationIdea: 'Honshu from Tokyo to Osaka',
    status: 'published',
    metaTitle: 'Japan Tokyo Kyoto Osaka 7 nights package',
    metaDescription:
      'A 7-night Japan package covering Tokyo, Hakone and Mount Fuji, Kyoto temples, Nara, and Osaka, with shinkansen travel and guided touring days.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-central-europe-budapest-vienna-prague',
    title: 'Budapest, Vienna and Prague',
    slug: 'central-europe-budapest-vienna-prague-7-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Three Habsburg capitals along the Danube, connected by rail and river.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 2915,
    destinations: ['Budapest', 'Vienna', 'Cesky Krumlov', 'Prague'],
    overviewHtml:
      '<p>Three central European capitals in one line, running Budapest to Vienna to Prague with a stop at Cesky Krumlov on the way north. The route trades long-haul distance for short hops, so most days are spent in a city rather than between them.</p><p>Budapest brings the thermal bath houses and the Danube panorama, Vienna the imperial palaces and coffee houses, and Prague its castle district and old town. Intercity rail, four-star central hotels, and guided walking tours in each capital are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Budapest arrival',
        description:
          'Arrive in Budapest and transfer to your hotel. The evening is free, with the lit-up Chain Bridge and riverfront within easy reach.',
      },
      {
        day: 2,
        location: 'Budapest',
        description:
          'Walking tour across both halves of the city, covering Buda Castle hill, the Fishermen\'s Bastion, Matthias Church, and the Parliament facade from the Pest embankment. The afternoon leaves time for the Szechenyi thermal baths.',
      },
      {
        day: 3,
        location: 'Budapest to Vienna',
        description:
          'Rail to Vienna and check in, then begin with the Ringstrasse, the State Opera, and St Stephen\'s Cathedral in the old centre.',
      },
      {
        day: 4,
        location: 'Vienna',
        description:
          'Visit Schonbrunn Palace and its gardens, then the Hofburg quarter and the museum district, with an afternoon left open for the city\'s coffee houses.',
      },
      {
        day: 5,
        location: 'Vienna to Cesky Krumlov and Prague',
        description:
          'Travel north with a stop at Cesky Krumlov, a preserved medieval town wrapped in a bend of the Vltava, then continue to Prague.',
      },
      {
        day: 6,
        location: 'Prague',
        description:
          'Guided tour of Prague Castle and St Vitus Cathedral, across the Charles Bridge, and into the Old Town Square for the astronomical clock and the Jewish quarter.',
      },
      {
        day: 7,
        location: 'Prague free day',
        description:
          'An open day for the Lesser Town lanes, Petrin hill, river cruises, or a slower return to whichever quarter you want more of.',
      },
      {
        day: 8,
        location: 'Prague departure',
        description:
          'Breakfast and checkout, then an airport transfer for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Thermal bath entry and optional excursions',
      'Entrance fees for sites not listed in the itinerary',
      'Meals not specified, and any meals on board flights',
      'Tips for guides and drivers',
    ],
    vibe: 'Imperial capitals by rail',
    locationIdea: 'Hungary, Austria, and Czechia',
    status: 'published',
    metaTitle: 'Budapest Vienna Prague 7 nights package',
    metaDescription:
      'A 7-night central Europe package linking Budapest, Vienna, Cesky Krumlov, and Prague by rail, with guided city tours and four-star central hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-vietnam-hanoi-halong-short',
    title: 'Hanoi and Halong Bay short break',
    slug: 'vietnam-hanoi-halong-4-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'A compact northern Vietnam trip built around the Old Quarter and an overnight bay cruise.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '5 days / 4 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 1605,
    destinations: ['Hanoi', 'Halong Bay', 'Ninh Binh'],
    overviewHtml:
      '<p>The shortest way to see northern Vietnam properly: two nights in Hanoi either side of an overnight Halong Bay cruise, with a Ninh Binh day for the limestone river landscapes inland. It suits travellers with a week or less, or anyone adding Vietnam onto a longer regional trip.</p><p>For a fuller version of this region paired with beach time, the Phu Quoc, Hanoi and Halong Bay itinerary covers the same north with an island opening.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Hanoi arrival',
        description:
          'Arrive at Noi Bai International Airport and transfer into the city. The evening is free around Hoan Kiem Lake and the Old Quarter street food stalls.',
      },
      {
        day: 2,
        location: 'Hanoi city',
        description:
          'Half-day tour covering Ba Dinh Square, the Ho Chi Minh complex exterior, the One Pillar Pagoda, the Temple of Literature, and Tran Quoc Pagoda, with the afternoon free in the Old Quarter.',
      },
      {
        day: 3,
        location: 'Hanoi to Halong Bay',
        description:
          'Drive to Halong Bay and board an overnight cruise through the limestone karsts, with lunch on board, a cave or floating village visit, kayaking where conditions allow, and dinner at anchor.',
      },
      {
        day: 4,
        location: 'Halong Bay to Ninh Binh',
        description:
          'Morning cruising and brunch on board before disembarking, then continue to Ninh Binh for Hoa Lu and a Trang An sampan ride through the river caves. Return to Hanoi for the night.',
      },
      {
        day: 5,
        location: 'Hanoi departure',
        description:
          'Free time for last-minute shopping before your airport transfer and onward flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Vietnam visa or e-visa fees where applicable',
      'Travel insurance',
      'Meals not mentioned in the programme',
      'Tips, drinks, personal expenses, and optional excursions',
      'Early check-in, late checkout, and surcharges at confirmation',
    ],
    vibe: 'Short northern Vietnam break',
    locationIdea: 'Hanoi, Halong Bay, and Ninh Binh',
    status: 'published',
    metaTitle: 'Vietnam Hanoi Halong Bay 4 nights package',
    metaDescription:
      'A 4-night northern Vietnam package with Hanoi city touring, an overnight Halong Bay cruise, and a Ninh Binh day trip to Hoa Lu and Trang An.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
];
