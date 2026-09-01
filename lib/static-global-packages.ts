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
    heroImageUrl: '/vietnam/da-nang-golden-bridge-cover.png',
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
    id: 'static-global-japan-tokyo-hiroshima-kyoto',
    title: 'Japan from Tokyo to Kyoto via the Inland Sea',
    slug: 'japan-tokyo-hiroshima-kyoto-7-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Tokyo, Hiroshima and Miyajima, Shikoku onsen towns, Mount Koya, and Kyoto.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503640538573-148065ba4904?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 4165,
    destinations: ['Tokyo', 'Hiroshima', 'Miyajima', 'Matsuyama', 'Kobe', 'Mount Koya', 'Kyoto'],
    overviewHtml:
      '<p>A west-running route that leaves the usual Tokyo to Kyoto corridor and crosses the Inland Sea. After two days in Tokyo you take the bullet train to Hiroshima for the Peace Memorial and the floating shrine at Miyajima, then ferry to Shikoku for Dogo Onsen and Matsuyama castle.</p><p>The return leg passes Kotohira shrine, Ritsurin Garden, and the Naruto whirlpool bridge before Kobe, then climbs to the temple settlement of Mount Koya for a night among working monasteries. Kyoto closes the trip. Bullet train and ferry tickets, metro passes, and a professional guide are included throughout.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Tokyo arrival',
        description:
          'Arrive at Narita and transfer to your Tokyo hotel. The rest of the day is free to settle in before touring begins.',
      },
      {
        day: 2,
        location: 'Tokyo city',
        description:
          'Guided tour across Tokyo, ending with an evening transfer to Shinjuku for the neon streets, food alleys, and department store district.',
      },
      {
        day: 3,
        location: 'Tokyo to Hiroshima',
        description:
          'Take the bullet train west to Hiroshima. Visit the Peace Memorial Museum and park, then ferry across to Miyajima for the floating torii gate and Itsukushima shrine.',
      },
      {
        day: 4,
        location: 'Hiroshima to Matsuyama',
        description:
          'Ferry across the Inland Sea to Matsuyama on Shikoku. Visit Ishiteji Temple, ride the funicular up to Matsuyama Castle, and soak at Dogo Onsen, one of the oldest hot springs in Japan.',
      },
      {
        day: 5,
        location: 'Kotohira, Ritsurin and Kobe',
        description:
          'Travel east via the Shinto shrine at Kotohira and the landscaped Ritsurin Garden, then cross the Naruto Bridge over the whirlpool straits and continue to Kobe.',
      },
      {
        day: 6,
        location: 'Kobe to Mount Koya',
        description:
          'Visit the Earthquake Memorial Museum in Kobe, then climb to the monastery settlement of Mount Koya. Walk the Okuno-in mausoleum grounds, visit Kongobuji Temple, and join an Ajikan or Zazen meditation session.',
      },
      {
        day: 7,
        location: 'Mount Koya to Kyoto',
        description:
          'Descend to Kyoto for Fushimi Inari and its gate corridor, the Imperial Palace grounds, and Kinkaku-ji the golden pavilion, with an evening transfer to the traditional quarter of Gion.',
      },
      {
        day: 8,
        location: 'Kyoto departure',
        description:
          'Transfer to Kansai International Airport for your onward flight, with timing set around your departure.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Japan visa fees where applicable',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Temples, onsen, and the Inland Sea',
    locationIdea: 'Honshu, Shikoku, and Mount Koya',
    status: 'published',
    metaTitle: 'Japan Tokyo Hiroshima Kyoto 7 nights package',
    metaDescription:
      'A 7-night Japan package from Tokyo through Hiroshima, Miyajima, Matsuyama, Kobe, and Mount Koya to Kyoto, with bullet train, ferries, and a professional guide.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-japan-tokyo-fuji-kyoto',
    title: 'Japan short break with Mount Fuji',
    slug: 'japan-tokyo-fuji-kyoto-5-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Tokyo, a ryokan night at Lake Kawaguchi under Fuji, and two days in Kyoto.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '6 days / 5 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 3050,
    destinations: ['Tokyo', 'Lake Kawaguchi', 'Mount Fuji', 'Kyoto', 'Arashiyama'],
    overviewHtml:
      '<p>The shortest Japan route that still covers all three things most first-time travellers want: the scale of Tokyo, a proper Mount Fuji view, and the temple quarters of Kyoto. The Fuji night is spent in a ryokan at Lake Kawaguchi rather than a city hotel.</p><p>Metro passes and a professional guide are included, and the pace leaves evenings free in both Tokyo and Kyoto. Cherry blossom and autumn departures book well ahead and are priced separately.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Tokyo arrival',
        description:
          'Arrive in Tokyo and transfer to your hotel, with the rest of the day free to adjust and explore nearby.',
      },
      {
        day: 2,
        location: 'Tokyo city',
        description:
          'Guided tour across Tokyo, finishing with an evening transfer to Shinjuku for the neon district, food alleys, and shopping streets.',
      },
      {
        day: 3,
        location: 'Lake Kawaguchi and Mount Fuji',
        description:
          'Travel to the Fuji Five Lakes. Visit Arakurayama Sengen Park for the pagoda and Fuji view, then the thatched village museum at Iyashi No Sato Nenba. Overnight in a ryokan, a traditional Japanese inn.',
      },
      {
        day: 4,
        location: 'Kawaguchiko to Kyoto',
        description:
          'Stop at the Toyota Museum en route, then continue to Kyoto and check in with the evening at leisure.',
      },
      {
        day: 5,
        location: 'Kyoto temples',
        description:
          'Visit Tenryu-ji Temple and the Arashiyama bamboo forest, then Fushimi Inari, the Imperial Palace grounds, and Kinkaku-ji, with a transfer to Gion in the evening.',
      },
      {
        day: 6,
        location: 'Kyoto departure',
        description:
          'Transfer to Kansai International Airport for your onward flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Japan visa fees where applicable',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Compact first-time Japan',
    locationIdea: 'Tokyo, Fuji Five Lakes, and Kyoto',
    status: 'published',
    metaTitle: 'Japan Tokyo Mount Fuji Kyoto 5 nights package',
    metaDescription:
      'A 5-night Japan package with Tokyo city touring, a ryokan night at Lake Kawaguchi under Mount Fuji, and two days across the Kyoto temple quarters.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-japan-grand-tour',
    title: 'Japan grand tour',
    slug: 'japan-grand-tour-10-nights',
    market: 'global',
    category: 'Spiritual',
    tagline: 'Mount Koya monasteries, Nikko shrines, Nagano snow monkeys, and the Inland Sea.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1503640538573-148065ba4904?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1503640538573-148065ba4904?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '11 days / 10 nights',
    groupSize: 'Private tour for small groups',
    priceInr: null,
    priceUsd: 5065,
    destinations: ['Tokyo', 'Hiroshima', 'Matsuyama', 'Kobe', 'Mount Koya', 'Kyoto', 'Nagano', 'Ikaho', 'Nikko'],
    overviewHtml:
      '<p>The longest of the Japan routes, taking the Inland Sea crossing and then continuing north into the mountains. It adds Matsumoto Castle, the Zenko-ji temple complex at Nagano, a Goma Kuyo fire ceremony, the snow monkeys at Jigokudani, the hot spring town of Ikaho, and the Toshogu shrine complex at Nikko.</p><p>This is a temple-heavy itinerary with a meditation session at Mount Koya and several working shrines along the way, balanced by castle towns, gardens, and onsen. Bullet train and ferry tickets, metro passes, and a professional guide are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Tokyo arrival',
        description:
          'Arrive at Narita and transfer to your Tokyo hotel, with the remainder of the day free.',
      },
      {
        day: 2,
        location: 'Tokyo city',
        description:
          'Guided tour across Tokyo, with an evening transfer to Shinjuku for the neon streets and food alleys.',
      },
      {
        day: 3,
        location: 'Tokyo to Hiroshima',
        description:
          'Bullet train west to Hiroshima for the Peace Memorial Museum, then the ferry to Miyajima for the floating torii gate.',
      },
      {
        day: 4,
        location: 'Hiroshima to Matsuyama',
        description:
          'Ferry across the Inland Sea to Matsuyama. Visit Ishiteji Temple, ride the funicular to Matsuyama Castle, and bathe at Dogo Onsen.',
      },
      {
        day: 5,
        location: 'Kotohira, Ritsurin and Kobe',
        description:
          'Travel via the Shinto shrine at Kotohira and Ritsurin Garden, cross the Naruto Bridge above the whirlpool straits, and continue to Kobe.',
      },
      {
        day: 6,
        location: 'Kobe to Mount Koya',
        description:
          'Visit the Earthquake Memorial Museum, then ascend to Mount Koya for the Okuno-in mausoleum, Kongobuji Temple, and an Ajikan or Zazen meditation session.',
      },
      {
        day: 7,
        location: 'Mount Koya to Kyoto',
        description:
          'Continue to Kyoto for Fushimi Inari, the Imperial Palace grounds, and Kinkaku-ji, with an evening in the Gion quarter.',
      },
      {
        day: 8,
        location: 'Kyoto to Nagano',
        description:
          'Travel north, stopping at Matsumoto Castle, one of the oldest keeps in Japan, then continue to Nagano for the Zenko-ji temple complex and a Goma Kuyo fire ceremony.',
      },
      {
        day: 9,
        location: 'Jigokudani and Ikaho',
        description:
          'Visit Jigokudani Monkey Park, where macaques bathe in the thermal pools, then continue via Kusatsu for a Yumomi hot water performance and on to the spa town of Ikaho.',
      },
      {
        day: 10,
        location: 'Nikko',
        description:
          'Travel to Nikko for the Toshogu Shrine and the Taiyuinbyo Mausoleum set among cedar forest, then continue to Tokyo for the final night.',
      },
      {
        day: 11,
        location: 'Tokyo departure',
        description:
          'Transfer to the airport for your onward flight, with timing set around your departure.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Japan visa fees where applicable',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Temples, shrines, and mountain towns',
    locationIdea: 'Honshu, Shikoku, and the Japan Alps',
    status: 'published',
    metaTitle: 'Japan grand tour 10 nights package',
    metaDescription:
      'A 10-night Japan package covering Tokyo, Hiroshima, Miyajima, Matsuyama, Kobe, Mount Koya, Kyoto, Nagano, Ikaho, and the Nikko shrine complex.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-central-europe-budapest-vienna-prague',
    title: 'Budapest, Vienna and Prague',
    slug: 'central-europe-budapest-vienna-prague-6-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Three Habsburg capitals, two nights each, linked by coach along the Danube.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '7 days / 6 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 2913,
    destinations: ['Budapest', 'Vienna', 'Prague'],
    overviewHtml:
      '<p>Three central European capitals with two nights in each, so every city gets a touring day and an evening rather than a rushed afternoon. Budapest brings the Danube panorama and the thermal bath houses, Vienna the imperial palaces and coffee houses, and Prague its castle district and old town square.</p><p>Intercity legs run by luxury coach, hotels are four-star, and each capital includes a guided city tour. Airport transfers at both ends are arranged.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Budapest arrival',
        description:
          'Arrive in Budapest and transfer to your hotel. The evening is free, with the lit Chain Bridge and riverfront within walking distance of the centre.',
      },
      {
        day: 2,
        location: 'Budapest city tour',
        description:
          'Guided tour across both halves of the city, covering Buda Castle hill, the Fishermen\'s Bastion, Matthias Church, and the Parliament facade from the Pest embankment. The afternoon leaves room for the Szechenyi thermal baths.',
      },
      {
        day: 3,
        location: 'Budapest to Vienna',
        description:
          'Travel by coach to Vienna and check in, with the evening free around the old centre.',
      },
      {
        day: 4,
        location: 'Vienna city tour',
        description:
          'Guided tour taking in the Ringstrasse, the State Opera, St Stephen\'s Cathedral, and the Hofburg quarter, with time left for the museum district or a coffee house afternoon.',
      },
      {
        day: 5,
        location: 'Vienna to Prague',
        description:
          'Continue north by coach to Prague and check in, with the evening open in the Old Town.',
      },
      {
        day: 6,
        location: 'Prague city tour',
        description:
          'Guided tour of Prague Castle and St Vitus Cathedral, across the Charles Bridge, and into the Old Town Square for the astronomical clock and the Jewish quarter.',
      },
      {
        day: 7,
        location: 'Prague departure',
        description:
          'Breakfast and checkout, then an airport transfer for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Entrance fees not named in the inclusions',
      'Thermal bath entry and optional excursions',
      'Meals not specified in the itinerary',
      'Early check-in, late checkout, and seat allocation on flights',
      'Anything not named in the inclusions',
    ],
    vibe: 'Imperial capitals by coach',
    locationIdea: 'Hungary, Austria, and Czechia',
    status: 'published',
    metaTitle: 'Budapest Vienna Prague 6 nights package',
    metaDescription:
      'A 6-night central Europe package with two nights each in Budapest, Vienna, and Prague, guided city tours, four-star hotels, and coach transfers.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-vietnam-hanoi-halong-short',
    title: 'Hanoi and Halong Bay short break',
    slug: 'vietnam-hanoi-halong-4-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Old Quarter streets, a water puppet show, and a night aboard a Halong Bay cruise.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '5 days / 4 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 1606,
    destinations: ['Hanoi', 'Halong Bay', 'Titov Island'],
    overviewHtml:
      '<p>The shortest way to see northern Vietnam properly: three nights in Hanoi wrapped around an overnight cruise through the Halong Bay karsts. It suits travellers with under a week, or anyone adding Vietnam onto a longer regional trip.</p><p>The cruise night is spent on a five-star vessel at anchor among the limestone islands, with meals on board. A water puppet show, professional guide, and airport transfers are included. A full free day in Hanoi can stay open or convert into a guided city tour.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Hanoi arrival',
        description:
          'Arrive at Hanoi International Airport, meet your representative, and transfer to the hotel. The day closes with a one-hour water puppet show, one of the oldest performing arts in Vietnam, followed by dinner.',
      },
      {
        day: 2,
        location: 'Hanoi to Halong Bay',
        description:
          'Transfer to Tuan Chau Island and board your cruise. Lunch is served as you sail, with a visit to the Tung Sau pearl farm and Titov Island, where you can climb the viewpoint or swim from the beach. Dinner and overnight at anchor among the karsts.',
      },
      {
        day: 3,
        location: 'Halong Bay to Hanoi',
        description:
          'Sunrise Tai Chi on the sundeck, then brunch as the vessel cruises slowly back through the rock formations. Disembark and transfer back to Hanoi for the night.',
      },
      {
        day: 4,
        location: 'Hanoi free day',
        description:
          'A full open day at your own pace, or add the optional guided city tour covering Ba Dinh Square, the Ho Chi Minh Mausoleum, the Temple of Literature, Sword Lake, The Huc Bridge, and a cyclo ride through the Old Quarter.',
      },
      {
        day: 5,
        location: 'Hanoi departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your onward flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Vietnam visa or e-visa fees where applicable',
      'Travel insurance',
      'Optional Hanoi city tour and other excursions',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'Short northern Vietnam break',
    locationIdea: 'Hanoi and Halong Bay',
    status: 'published',
    metaTitle: 'Vietnam Hanoi Halong Bay 4 nights package',
    metaDescription:
      'A 4-night northern Vietnam package with three nights in Hanoi, a water puppet show, and an overnight Halong Bay cruise with meals on board.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-vietnam-hanoi-halong-saigon',
    title: 'Vietnam north to south',
    slug: 'vietnam-hanoi-halong-ho-chi-minh-6-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Hanoi, a Halong Bay cruise night, the Cu Chi Tunnels, and a Saigon river dinner.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '7 days / 6 nights',
    groupSize: 'Private tour for couples, families, and small groups',
    priceInr: null,
    priceUsd: 2314,
    destinations: ['Hanoi', 'Halong Bay', 'Ho Chi Minh City', 'Cu Chi'],
    overviewHtml:
      '<p>Both ends of Vietnam in one week, connected by an internal flight. The northern half covers Hanoi and an overnight Halong Bay cruise; the southern half covers Ho Chi Minh City, the Cu Chi tunnel network, and a dinner cruise on the Saigon river.</p><p>Hotels are four-star in both cities with a five-star cruise vessel in the bay. A water puppet show, professional guide, internal flight, and all airport transfers are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Hanoi arrival',
        description:
          'Arrive in Hanoi and transfer to your hotel. The evening brings a water puppet show, followed by dinner and a first walk around Hoan Kiem Lake.',
      },
      {
        day: 2,
        location: 'Hanoi city',
        description:
          'Guided city tour covering Ba Dinh Square, the Ho Chi Minh complex, the Temple of Literature, and the Old Quarter, with the afternoon free among the street food stalls.',
      },
      {
        day: 3,
        location: 'Hanoi to Halong Bay',
        description:
          'Transfer to the bay and board your cruise. Lunch on board as you sail through the limestone islands, with visits and activities during the afternoon, dinner served at anchor, and an overnight among the karsts.',
      },
      {
        day: 4,
        location: 'Halong Bay to Ho Chi Minh City',
        description:
          'Morning cruising and brunch on board, then disembark and return to Hanoi for the internal flight south to Ho Chi Minh City.',
      },
      {
        day: 5,
        location: 'Ho Chi Minh City',
        description:
          'City tour taking in Reunification Palace, Notre Dame Cathedral, and the historic post office, closing with a dinner cruise along the Saigon river.',
      },
      {
        day: 6,
        location: 'Cu Chi Tunnels',
        description:
          'Travel out to the Cu Chi Tunnels for the tunnel sections, historical displays, and wartime remnants, returning to the city with the evening free.',
      },
      {
        day: 7,
        location: 'Saigon departure',
        description:
          'Transfer to Tan Son Nhat International Airport for your onward flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Vietnam visa or e-visa fees where applicable',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Both ends of Vietnam',
    locationIdea: 'Northern and southern Vietnam',
    status: 'published',
    metaTitle: 'Vietnam Hanoi Halong Ho Chi Minh 6 nights package',
    metaDescription:
      'A 6-night Vietnam package with Hanoi city touring, an overnight Halong Bay cruise, the Cu Chi Tunnels, and a Saigon river dinner cruise.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-croatia-zagreb-dubrovnik-tirana',
    title: 'Croatia and Albania, Zagreb to Tirana',
    slug: 'croatia-zagreb-dubrovnik-tirana-8-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Adriatic walled cities, Krka waterfalls, Diocletian\'s Palace, and the Bay of Kotor.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1564679937942-90c22d5a0e6e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1730645612711-1613af3182d5?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '9 days / 8 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 2832,
    destinations: ['Zagreb', 'Zadar', 'Krka', 'Split', 'Dubrovnik', 'Kotor', 'Tirana'],
    overviewHtml:
      '<p>A full run down the Adriatic coast and across two borders, starting in Zagreb and finishing in Tirana. The route takes in the Sea Organ at Zadar, the waterfalls of Krka National Park, the Roman core of Split inside Diocletian\'s Palace, and two nights behind the walls of Dubrovnik.</p><p>The final leg crosses Montenegro with a stop at Kotor before reaching Albania. Hotels are four-star throughout, intercity legs run by luxury coach, and each major stop includes a guided walking tour. A welcome dinner opens the trip and a farewell dinner closes it.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Zagreb arrival',
        description:
          'Arrive in Zagreb and transfer to the hotel. The evening brings a welcome dinner with your tour leader and travelling companions.',
      },
      {
        day: 2,
        location: 'Zagreb',
        description:
          'Guided city tour covering the landmarks of the Lower and medieval Upper Town, including the Parliament, the Stone Gate, the Archbishop\'s Palace, and the cathedral.',
      },
      {
        day: 3,
        location: 'Zagreb to Zadar',
        description:
          'Travel to Zadar for a guided walking tour of the main square and the waterfront, including Nikola Basic\'s Sea Organ and the Greeting to the Sun installation.',
      },
      {
        day: 4,
        location: 'Zadar to Split via Krka',
        description:
          'Continue south with a stop at Krka National Park for the lakes and waterfalls, and a light lunch of local specialities, before arriving in Split.',
      },
      {
        day: 5,
        location: 'Split to Dubrovnik',
        description:
          'Walking tour of Split, including the Lucky Sculpture, the Black Sphinx, and the labyrinth of medieval streets inside Emperor Diocletian\'s Palace, then continue down the coast to Dubrovnik.',
      },
      {
        day: 6,
        location: 'Dubrovnik',
        description:
          'Guided walking tour of the old town covering the Franciscan and Dominican monasteries and the ramparts raised during the Crusades, with the rest of the day free inside the walls.',
      },
      {
        day: 7,
        location: 'Dubrovnik to Tirana via Kotor',
        description:
          'Cross into Montenegro with a stop at Kotor, a walled medieval town of pink-paved streets and Byzantine to Venetian architecture, then continue into Albania and check in at Tirana.',
      },
      {
        day: 8,
        location: 'Tirana',
        description:
          'Guided walking tour of Tirana taking in Bunk\'Art and the main square, with a farewell dinner at a local restaurant in the evening.',
      },
      {
        day: 9,
        location: 'Tirana departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen and Albania visa fees where applicable',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
      'Travel insurance and personal expenses',
      'Anything not named in the inclusions',
    ],
    vibe: 'Adriatic coast overland',
    locationIdea: 'Croatia, Montenegro, and Albania',
    status: 'published',
    metaTitle: 'Croatia Zagreb Dubrovnik Tirana 8 nights package',
    metaDescription:
      'An 8-night Adriatic package from Zagreb through Zadar, Krka National Park, Split, and Dubrovnik to Kotor and Tirana, with guided tours and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-greece-athens',
    title: 'Athens short break',
    slug: 'greece-athens-3-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'The Acropolis, the New Acropolis Museum, and an optional Saronic islands cruise.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '4 days / 3 nights',
    groupSize: 'Daily departures, seat-in-coach touring',
    priceInr: null,
    priceUsd: 1171,
    destinations: ['Athens', 'Acropolis', 'Hydra', 'Poros', 'Aegina'],
    overviewHtml:
      '<p>A short Athens break built around one thorough sightseeing day and one free day. The touring day covers the Panathenaic Stadium, the Temple of Olympian Zeus, Hadrian\'s Arch, and Syntagma before climbing the Acropolis for the Propylaea, the Temple of Athena Nike, the Erechtheion, and the Parthenon, finishing at the New Acropolis Museum.</p><p>The free day can stay open or convert into a full-day cruise to the Saronic Gulf islands of Hydra, Poros, and Aegina. Four-star accommodation, daily breakfast, and airport transfers are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Athens arrival',
        description:
          'Arrive at Athens airport and transfer to your hotel. The evening is free to explore the city at your own pace.',
      },
      {
        day: 2,
        location: 'Athens and the Acropolis',
        description:
          'Guided city tour with a stop at the Panathenaic Stadium, home of the first modern Olympics, passing the Temple of Olympian Zeus, Hadrian\'s Arch, the Parliament, and Syntagma Square. Climb the Acropolis for the Propylaea, the Temple of Athena Nike, the Erechtheion, and the Parthenon, then visit the New Acropolis Museum.',
      },
      {
        day: 3,
        location: 'Athens free day',
        description:
          'A full open day, or add the optional full-day cruise to the Saronic Gulf islands: Hydra with its stone mansions and narrow lanes, the small strait town of Poros, and Aegina, the largest of the three.',
      },
      {
        day: 4,
        location: 'Athens departure',
        description:
          'Breakfast and checkout, then a transfer to Athens airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Optional Saronic islands cruise',
      'Entrance fees not named in the inclusions',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Classical city break',
    locationIdea: 'Athens and the Saronic Gulf',
    status: 'published',
    metaTitle: 'Greece Athens 3 nights package',
    metaDescription:
      'A 3-night Athens package with a guided city tour, the Acropolis and New Acropolis Museum, and an optional cruise to Hydra, Poros, and Aegina.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-baltic-capitals-helsinki',
    title: 'Baltic capitals with Helsinki',
    slug: 'baltic-capitals-helsinki-6-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Riga, Vilnius and Tallinn old towns, Trakai Castle, and a ferry day to Helsinki.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1518975513267-071132b42e06?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518975513267-071132b42e06?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1683730796330-06e60e3438d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1660562278746-72e961bb9644?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '7 days / 6 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 1906,
    destinations: ['Riga', 'Sigulda', 'Rundale', 'Vilnius', 'Trakai', 'Tallinn', 'Helsinki'],
    overviewHtml:
      '<p>Three Baltic capitals with two nights in each, plus a ferry crossing to Helsinki for the day. The route pairs each city with a countryside excursion: Sigulda and the Turaida Museum Reserve from Riga, Rundale Palace and the Hill of Crosses en route to Vilnius, and Trakai Castle on its island in Lithuania.</p><p>Tallinn adds Kadriorg Palace and the medieval old town, and the Helsinki day includes a guided tour and the sea fortress of Suomenlinna. Four-star hotels, coach transfers, and visa assistance are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Riga arrival',
        description:
          'Arrive at Riga Airport and begin with a guided city tour covering the major highlights, then transfer to the hotel and check in with free time to relax.',
      },
      {
        day: 2,
        location: 'Sigulda and Turaida',
        description:
          'Scenic transfer to Sigulda for an orientation tour, then the Turaida Museum Reserve, one of the most important historical sites in Latvia, before returning to Riga.',
      },
      {
        day: 3,
        location: 'Riga to Vilnius',
        description:
          'Travel south with stops at the baroque Rundale Palace and the Hill of Crosses, a pilgrimage site covered in tens of thousands of crosses, then continue to Vilnius.',
      },
      {
        day: 4,
        location: 'Trakai and Vilnius',
        description:
          'Visit Trakai Castle, set on an island in the lakes west of the city, then return for a guided tour of the Vilnius old town and its baroque churches and courtyards.',
      },
      {
        day: 5,
        location: 'Vilnius to Tallinn',
        description:
          'Fly north to Tallinn and begin with a guided city tour, including Kadriorg Palace and its gardens, before transferring to the hotel.',
      },
      {
        day: 6,
        location: 'Helsinki day trip',
        description:
          'Ferry across the Gulf of Finland to Helsinki for a guided city tour, then a second short ferry to the UNESCO-listed sea fortress of Suomenlinna, returning to Tallinn in the evening.',
      },
      {
        day: 7,
        location: 'Tallinn departure',
        description:
          'Breakfast and time at leisure in the old town until your airport transfer for the homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Tips for guides and drivers',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Old towns and castles',
    locationIdea: 'Latvia, Lithuania, Estonia, and Finland',
    status: 'published',
    metaTitle: 'Baltic capitals with Helsinki 6 nights package',
    metaDescription:
      'A 6-night Baltic package covering Riga, Sigulda, Rundale Palace, the Hill of Crosses, Vilnius, Trakai Castle, Tallinn, and a ferry day to Helsinki.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-montenegro-budva',
    title: 'Montenegro from Budva',
    slug: 'montenegro-budva-4-nights',
    market: 'global',
    category: 'Adventure',
    tagline: 'Bay of Kotor, Durmitor National Park, the Tara canyon, and the cliff-set Ostrog Monastery.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1587551323667-d58e6c839b23?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558971067-6edfd413e506?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '5 days / 4 nights',
    groupSize: 'Seat-in-coach excursions from a single base',
    priceInr: null,
    priceUsd: 1497,
    destinations: ['Budva', 'Kotor', 'Perast', 'Durmitor', 'Tara Canyon', 'Zabljak', 'Ostrog'],
    overviewHtml:
      '<p>A single-base holiday on the Montenegrin coast, with four nights in Budva and one big excursion day inland. Two free days sit either side of it, so the trip works as much for beach time as for sightseeing.</p><p>The full-day northern excursion runs along the Bay of Kotor, stops at the baroque town of Perast and the viewpoint over Our Lady of the Rocks, then climbs through the mountains to Durmitor National Park, the Tara River Canyon and its bridge, the mountain town of Zabljak, and Black Lake, finishing at the Ostrog Monastery built into a vertical cliff face.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Budva arrival',
        description:
          'Arrive at Tivat airport, meet your representative, and transfer to your hotel in Budva for check-in and an evening at leisure.',
      },
      {
        day: 2,
        location: 'Budva free day',
        description:
          'A full open day for the old town, the beaches, or the coastal path, with optional excursions available at extra cost.',
      },
      {
        day: 3,
        location: 'Northern Montenegro and Ostrog',
        description:
          'Full-day shared excursion driving the Bay of Kotor, stopping at the baroque town of Perast and the viewpoint over Our Lady of the Rocks and St George Island. Continue through the mountains past the emerald lake near Niksic to Durmitor National Park, the Tara River Canyon and Durdevica bridge, Zabljak, and Black Lake, finishing at the cliff-set Ostrog Monastery.',
      },
      {
        day: 4,
        location: 'Budva free day',
        description:
          'A second open day at your own pace, with optional tours available at extra cost.',
      },
      {
        day: 5,
        location: 'Budva departure',
        description:
          'Breakfast and checkout, then a transfer to Tivat Airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Visa charges where applicable',
      'Travel insurance',
      'Optional excursions including the Tara canyon zipline',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'Coast base with mountain days',
    locationIdea: 'The Montenegrin coast and Durmitor',
    status: 'published',
    metaTitle: 'Montenegro Budva 4 nights package',
    metaDescription:
      'A 4-night Montenegro package based in Budva with a full-day northern excursion to Kotor, Perast, Durmitor National Park, the Tara Canyon, and Ostrog Monastery.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-united-kingdom-london',
    title: 'London short break',
    slug: 'united-kingdom-london-4-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'A guided landmark tour, a Thames cruise, and two free days for Windsor or Harry Potter.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '5 days / 4 nights',
    groupSize: 'Daily departures and private quotes',
    priceInr: null,
    priceUsd: 1497,
    destinations: ['London', 'Westminster', 'Tower Bridge', 'River Thames'],
    overviewHtml:
      '<p>Four nights in a four-star London hotel with one full guided sightseeing day and two open days. The touring day covers Big Ben, Tower Bridge, Westminster Abbey, St Paul\'s Cathedral, Buckingham Palace, and the London Eye, driving through Trafalgar Square, Piccadilly Circus, and the Thames Embankment, and closes with a river cruise.</p><p>The free days suit a Windsor Castle excursion or the Harry Potter studio tour, both available as optional add-ons. Airport transfers and visa assistance are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'London arrival',
        description:
          'Arrive at Gatwick, meet your representative, and transfer to your hotel for check-in and an evening at leisure.',
      },
      {
        day: 2,
        location: 'London landmarks',
        description:
          'Guided tour taking in Big Ben, Tower Bridge, and Buckingham Palace, with photo stops at Westminster Abbey and St Paul\'s Cathedral and drives through Trafalgar Square, Piccadilly Circus, and the Thames Embankment. A photo stop at the London Eye is followed by a River Thames cruise.',
      },
      {
        day: 3,
        location: 'London free day',
        description:
          'An open day at your own pace, or add the optional excursion to Windsor Castle, one of the oldest and largest inhabited castles in the world. Note that Windsor Castle is closed on Tuesdays and Wednesdays.',
      },
      {
        day: 4,
        location: 'London free day',
        description:
          'A second open day for museums, markets, or shopping, or add the optional Harry Potter studio tour.',
      },
      {
        day: 5,
        location: 'London departure',
        description:
          'Breakfast and checkout, then a transfer to Gatwick Airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'UK visa charges and biometric appointment costs',
      'Travel insurance',
      'Optional excursions including Windsor Castle, the London Eye ride, and the Harry Potter studio tour',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'Landmark city break',
    locationIdea: 'Central London',
    status: 'published',
    metaTitle: 'United Kingdom London 4 nights package',
    metaDescription:
      'A 4-night London package with a guided landmark tour, a River Thames cruise, four-star accommodation, and optional Windsor Castle or Harry Potter studio excursions.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-nordic-arctic',
    title: 'Nordic Arctic circuit',
    slug: 'nordic-norway-sweden-finland-8-nights',
    market: 'global',
    category: 'Adventure',
    tagline: 'Northern lights, the Ice Hotel, husky and reindeer sleighs, and the Arctic train to Abisko.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590457686458-ad03f71f3c30?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '9 days / 8 nights',
    groupSize: 'Small group departures with a tour manager',
    priceInr: null,
    priceUsd: 6070,
    destinations: ['Oslo', 'Tromso', 'Narvik', 'Kiruna', 'Abisko', 'Rovaniemi', 'Helsinki'],
    overviewHtml:
      '<p>A crossing of the Arctic through three countries, from Oslo up to Tromso, across northern Sweden, and into Finnish Lapland before finishing in Helsinki. Two separate northern lights attempts are built in, one from Tromso and one by snowmobile from Rovaniemi, which materially improves the odds over a single-night trip.</p><p>The route includes the Fjellheisen cable car, the Narvik War Museum, the Arctic train from Kiruna to Abisko, the Ice Hotel at Jukkasjarvi with lunch, the Santa Village, and husky and reindeer farms with sleigh rides. Internal flights, most lunches and dinners including Indian vegetarian and Jain options, and a tour manager are included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Oslo',
        description:
          'Arrive in Oslo and take a guided city tour including Vigeland Park and its sculpture collection, then check in for the night.',
      },
      {
        day: 2,
        location: 'Oslo to Tromso',
        description:
          'Fly north into the Arctic Circle to Tromso. Guided city tour followed by the Fjellheisen cable car for the view back over the island city and surrounding fjords.',
      },
      {
        day: 3,
        location: 'Tromso and the northern lights',
        description:
          'A day in Tromso with time to explore, then a guided evening northern lights tour chasing clear skies away from the city.',
      },
      {
        day: 4,
        location: 'Tromso to Narvik',
        description:
          'Travel south into Norway proper to Narvik, visiting the War Museum which covers the 1940 campaign and the iron ore railway.',
      },
      {
        day: 5,
        location: 'Narvik to Kiruna',
        description:
          'Cross into Swedish Lapland to Kiruna, riding the Arctic train through the mountains to Abisko, known for some of the clearest aurora skies in the region.',
      },
      {
        day: 6,
        location: 'Jukkasjarvi to Rovaniemi',
        description:
          'Visit the Ice Hotel at Jukkasjarvi, rebuilt from river ice each winter, with lunch on site, then continue into Finland to Rovaniemi.',
      },
      {
        day: 7,
        location: 'Rovaniemi',
        description:
          'Visit the Santa Village on the Arctic Circle, then a husky farm and a reindeer farm, each with a sleigh ride through the forest.',
      },
      {
        day: 8,
        location: 'Rovaniemi to Helsinki',
        description:
          'A second northern lights attempt, this time by snowmobile across the snow fields, before flying south to Helsinki for the final night.',
      },
      {
        day: 9,
        location: 'Helsinki departure',
        description:
          'Guided city tour of Helsinki including the rock-hewn Temppeliaukio Church and the Sibelius Park and Monument, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa assistance and travel insurance charged separately',
      'Mandatory tips to the tour manager, coach driver, and local guides',
      'Government taxes as applicable, and no porterage included',
      'Meals other than those named in the itinerary, and any meals on board flights',
      'Entrance fees and excursions not named in the inclusions',
      'Personal expenses, laundry, minibar, and early check-in or late checkout charges',
    ],
    vibe: 'Arctic winter expedition',
    locationIdea: 'Norway, Sweden, and Finnish Lapland',
    status: 'published',
    metaTitle: 'Nordic Norway Sweden Finland 8 nights package',
    metaDescription:
      'An 8-night Arctic package through Oslo, Tromso, Narvik, Kiruna, Abisko, and Rovaniemi to Helsinki, with two northern lights tours, the Ice Hotel, and husky and reindeer sleighs.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-italy-rome-florence-venice',
    title: 'Italy, Rome to Venice',
    slug: 'italy-rome-florence-venice-6-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Two nights each in Rome, Florence and Venice, with a Pisa stop between them.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528114039593-4366cc08227d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '7 days / 6 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 3104,
    destinations: ['Rome', 'Florence', 'Pisa', 'Venice'],
    overviewHtml:
      '<p>The classic Italian triangle with an even two nights in each city, so none of them is reduced to a half-day stop. Rome covers the ancient core and the Vatican quarter, Florence the Renaissance centre and the Duomo, and Venice the island itself rather than a mainland hotel.</p><p>Intercity legs run by luxury coach with a photo stop at the Leaning Tower of Pisa between Florence and the coast. Hotels are four-star, each city includes a guided tour, and daily breakfast is included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Rome arrival',
        description:
          'Arrive in Rome and transfer to your hotel, with the evening free around the historic centre.',
      },
      {
        day: 2,
        location: 'Rome',
        description:
          'Guided tour of Rome taking in the Colosseum and Roman Forum area, the Pantheon, the Trevi Fountain, and the Vatican quarter, with free time in the afternoon.',
      },
      {
        day: 3,
        location: 'Rome to Florence',
        description:
          'Travel north through Tuscany to Florence and check in, with the evening free along the Arno.',
      },
      {
        day: 4,
        location: 'Florence',
        description:
          'Guided tour of Florence covering the Duomo and its baptistery, the Piazza della Signoria, and the Ponte Vecchio, with the afternoon open for the Uffizi or the leather markets.',
      },
      {
        day: 5,
        location: 'Florence to Venice via Pisa',
        description:
          'Stop at Pisa for a photo halt at the Leaning Tower and the cathedral square, then continue north-east to Venice Island for check-in.',
      },
      {
        day: 6,
        location: 'Venice',
        description:
          'Guided tour of Venice covering St Mark\'s Square and Basilica, the Doge\'s Palace exterior, and the Rialto quarter, with free time for the canals and a gondola or vaporetto ride.',
      },
      {
        day: 7,
        location: 'Venice departure',
        description:
          'Breakfast and checkout, then a transfer for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Entrance fees not named in the inclusions',
      'Gondola rides and optional excursions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
      'Travel insurance and personal expenses',
    ],
    vibe: 'Renaissance city triangle',
    locationIdea: 'Lazio, Tuscany, and the Veneto',
    status: 'published',
    metaTitle: 'Italy Rome Florence Venice 6 nights package',
    metaDescription:
      'A 6-night Italy package with two nights each in Rome, Florence, and Venice Island, guided city tours, a Pisa photo stop, and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-lisbon-to-madrid',
    title: 'Lisbon to Madrid overland',
    slug: 'portugal-spain-lisbon-to-madrid-7-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Lisbon, the Templar town of Tomar, Fatima, Porto, Salamanca, and Madrid.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '8 days / 7 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 3512,
    destinations: ['Lisbon', 'Tomar', 'Fatima', 'Porto', 'Salamanca', 'Madrid'],
    overviewHtml:
      '<p>An Iberian crossing that starts on the Atlantic in Lisbon and finishes inland in Madrid, taking the pilgrimage and university towns most coastal itineraries skip. Tomar brings the Templar Convent of Christ, Fatima the sanctuary, and Salamanca its sandstone university quarter.</p><p>Two nights each in Lisbon, Porto, and Madrid give the three big cities proper time, with one night in Salamanca breaking the long inland leg. Intercity transfers run by luxury coach and every major stop includes a guided tour.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Lisbon arrival',
        description:
          'Arrive in Lisbon and transfer to your hotel, with the evening free in the Baixa or Alfama quarters.',
      },
      {
        day: 2,
        location: 'Lisbon',
        description:
          'Guided tour of Lisbon covering the Belem tower and monastery quarter, the hilltop viewpoints, and the tram routes through the old town.',
      },
      {
        day: 3,
        location: 'Tomar, Fatima and Porto',
        description:
          'Travel north with a visit to the Templar Convent of Christ at Tomar and the sanctuary at Fatima, then continue to Porto for check-in.',
      },
      {
        day: 4,
        location: 'Porto',
        description:
          'Guided tour of Porto covering the Ribeira riverfront, the Dom Luis bridge, and the historic centre, with time for the port lodges across the Douro.',
      },
      {
        day: 5,
        location: 'Porto to Salamanca',
        description:
          'Cross into Spain to Salamanca for a guided tour of its sandstone old town, the Plaza Mayor, and one of the oldest universities in Europe.',
      },
      {
        day: 6,
        location: 'Salamanca to Madrid',
        description:
          'Continue to Madrid and check in, with the evening free around the Puerta del Sol and Gran Via.',
      },
      {
        day: 7,
        location: 'Madrid',
        description:
          'Guided tour of Madrid covering the royal quarter, the Plaza Mayor, and the main boulevards, with the afternoon open for the Prado or the Retiro gardens.',
      },
      {
        day: 8,
        location: 'Madrid departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
      'Travel insurance and personal expenses',
      'Anything not named in the inclusions',
    ],
    vibe: 'Iberian overland route',
    locationIdea: 'Portugal and central Spain',
    status: 'published',
    metaTitle: 'Lisbon to Madrid 7 nights package',
    metaDescription:
      'A 7-night Iberian package from Lisbon through Tomar, Fatima, Porto, and Salamanca to Madrid, with guided city tours and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-portugal-grand-tour',
    title: 'Portugal in depth',
    slug: 'portugal-grand-tour-8-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Lisbon, Nazare and Alcobaca, Coimbra University, Porto, and the walled town of Belmonte.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1536663815808-535e2280d2c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '9 days / 8 nights',
    groupSize: 'Small group departures and private quotes',
    priceInr: null,
    priceUsd: 3077,
    destinations: ['Lisbon', 'Tomar', 'Nazare', 'Alcobaca', 'Coimbra', 'Porto', 'Viseu', 'Belmonte', 'Evora'],
    overviewHtml:
      '<p>A slower, fuller Portugal that goes well beyond Lisbon and Porto. The route takes in the Templar town of Tomar, the Atlantic fishing town of Nazare, the monastery at Alcobaca, the historic university at Coimbra, and the inland towns of Viseu, Belmonte, and Evora.</p><p>Three nights in Lisbon open the trip and two in Porto anchor the north, with single nights inland as the route loops south again. Hotels are four-star, transfers run by luxury coach, and daily breakfast is included.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Lisbon arrival',
        description:
          'Arrive in Lisbon and transfer to your hotel, with the evening free to settle in.',
      },
      {
        day: 2,
        location: 'Lisbon',
        description:
          'Guided tour of Lisbon covering the Belem quarter, the hilltop viewpoints, and the old town lanes and tram routes.',
      },
      {
        day: 3,
        location: 'Lisbon free day',
        description:
          'An open day for the museums and markets, or an independent trip out to the palaces at Sintra.',
      },
      {
        day: 4,
        location: 'Lisbon to Tomar',
        description:
          'Travel north to Tomar and its Convent of Christ, the Templar headquarters that later passed to the Order of Christ, and overnight in the town.',
      },
      {
        day: 5,
        location: 'Nazare, Alcobaca, Coimbra and Porto',
        description:
          'Visit the clifftop fishing town of Nazare and the monastery at Alcobaca, then the historic university at Coimbra with its baroque library, before continuing to Porto.',
      },
      {
        day: 6,
        location: 'Porto',
        description:
          'Guided tour of Porto covering the Ribeira riverfront, the Dom Luis bridge, and the historic centre, with time for the port lodges across the Douro.',
      },
      {
        day: 7,
        location: 'Penafiel and Viseu',
        description:
          'Travel inland via Penafiel and its granite countryside to the cathedral town of Viseu for the night.',
      },
      {
        day: 8,
        location: 'Belmonte and Evora',
        description:
          'Visit the walled hill town of Belmonte, known for its castle and long Jewish history, then continue south to the walled UNESCO town of Evora.',
      },
      {
        day: 9,
        location: 'Evora departure',
        description:
          'Breakfast and checkout, then a transfer for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Early check-in, late checkout, and seat allocation on flights',
      'Travel insurance and personal expenses',
      'Anything not named in the inclusions',
    ],
    vibe: 'Slow Portugal',
    locationIdea: 'Coastal and inland Portugal',
    status: 'published',
    metaTitle: 'Portugal grand tour 8 nights package',
    metaDescription:
      'An 8-night Portugal package covering Lisbon, Tomar, Nazare, Alcobaca, Coimbra, Porto, Viseu, Belmonte, and Evora with guided tours and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-paris-amsterdam-switzerland',
    title: 'Paris, Amsterdam and Switzerland',
    slug: 'paris-amsterdam-switzerland-8-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'The Eiffel Tower, Amsterdam canals, and the Swiss Alps on one fixed departure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '9 days / 8 nights',
    groupSize: 'Fixed departure, small group',
    priceInr: null,
    priceUsd: 2451,
    destinations: ['Paris', 'Amsterdam', 'Zurich', 'Lucerne', 'Interlaken'],
    overviewHtml:
      '<p>Three of the most requested European destinations on one run: the City of Light, the Amsterdam canal ring, and the Swiss Alps. Paris opens the trip with its landmarks and river, Amsterdam adds the canals and windmills, and Switzerland closes it with mountain days.</p><p>This is a fixed departure with a set date, so the itinerary is not amendable once confirmed. Intercity legs run by coach and rail, hotels are four-star, and airport transfers are included at both ends.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Paris arrival',
        description:
          'Arrive in Paris and transfer to your hotel, with the evening free in your neighbourhood.',
      },
      {
        day: 2,
        location: 'Paris landmarks',
        description:
          'Guided city tour through central Paris, with a visit to the Eiffel Tower and time around the Louvre quarter and the Champs-Elysees.',
      },
      {
        day: 3,
        location: 'Paris free day',
        description:
          'An open day for museums and neighbourhoods, with an evening Seine cruise past the illuminated riverfront.',
      },
      {
        day: 4,
        location: 'Paris to Amsterdam',
        description:
          'Travel north to Amsterdam and check in, with the evening free around the canal ring.',
      },
      {
        day: 5,
        location: 'Amsterdam',
        description:
          'Canal cruise through the historic ring, followed by the windmills and wooden houses at Zaanse Schans outside the city.',
      },
      {
        day: 6,
        location: 'Amsterdam to Switzerland',
        description:
          'Travel south into Switzerland and check in around Zurich, with the evening at leisure.',
      },
      {
        day: 7,
        location: 'Mount Titlis and Lucerne',
        description:
          'Ascend Mount Titlis by revolving cable car for the glacier and summit views, then an orientation walk through medieval Lucerne on the lake.',
      },
      {
        day: 8,
        location: 'Interlaken',
        description:
          'Day trip to Interlaken between Lake Thun and Lake Brienz, free to explore at your own pace or add a Jungfrau railway excursion at extra cost.',
      },
      {
        day: 9,
        location: 'Departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Optional excursions including the Jungfrau railway',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'Three-country highlights',
    locationIdea: 'France, the Netherlands, and Switzerland',
    status: 'published',
    metaTitle: 'Paris Amsterdam Switzerland 8 nights package',
    metaDescription:
      'An 8-night European package covering Paris, Amsterdam canals and windmills, and the Swiss Alps with Mount Titlis, Lucerne, and Interlaken.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-scandinavia-five-countries',
    title: 'Scandinavia and the Baltic',
    slug: 'scandinavia-five-countries-9-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Helsinki, Tallinn, Stockholm, Oslo, the Geilo mountains, and Copenhagen.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1445168580797-f946f0688547?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1445168580797-f946f0688547?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1508189860359-777d945909ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1433757741270-94a3bcadc2f3?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '10 days / 9 nights',
    groupSize: 'Fixed departure, small group',
    priceInr: null,
    priceUsd: 3267,
    destinations: ['Helsinki', 'Tallinn', 'Stockholm', 'Oslo', 'Geilo', 'Copenhagen'],
    overviewHtml:
      '<p>Five countries across the Nordic and Baltic region, moving west from Helsinki to Copenhagen with a ferry day to Tallinn and a mountain leg through Geilo. The route is built around short hops so most days are spent in a city rather than between them.</p><p>Each capital includes guided sightseeing, and the Norwegian leg swaps city time for the fjord and mountain scenery around Geilo. This is a fixed departure with set dates and four-star central hotels throughout.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Helsinki arrival',
        description:
          'Arrive in Helsinki and transfer to your hotel, with the evening free around the harbour and market square.',
      },
      {
        day: 2,
        location: 'Helsinki and Tallinn',
        description:
          'Guided tour of Helsinki including the cathedral and the rock-hewn Temppeliaukio Church, then a ferry across the gulf for an afternoon in the medieval old town of Tallinn, returning in the evening.',
      },
      {
        day: 3,
        location: 'Helsinki to Stockholm',
        description:
          'Cross the Baltic to Stockholm and check in, with the evening free around the waterfront.',
      },
      {
        day: 4,
        location: 'Stockholm',
        description:
          'Guided tour of Stockholm covering the Gamla Stan old town, the royal palace quarter, and the island waterfronts, with free time in the afternoon.',
      },
      {
        day: 5,
        location: 'Stockholm to Oslo',
        description:
          'Travel west across Sweden into Norway, arriving in Oslo for check-in and an evening at leisure.',
      },
      {
        day: 6,
        location: 'Oslo',
        description:
          'Guided tour of Oslo including Vigeland Park and its sculpture collection, the harbour front, and the city centre.',
      },
      {
        day: 7,
        location: 'Oslo to Geilo',
        description:
          'Travel up into the mountains to Geilo, following the scenic route through the Norwegian highlands, with the evening in the resort town.',
      },
      {
        day: 8,
        location: 'Geilo to Copenhagen',
        description:
          'Continue south and cross to Denmark, arriving in Copenhagen for check-in.',
      },
      {
        day: 9,
        location: 'Copenhagen',
        description:
          'Guided tour of Copenhagen covering the Nyhavn harbour houses, the palace quarter, and the Little Mermaid, with free time in the afternoon.',
      },
      {
        day: 10,
        location: 'Copenhagen departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers',
      'Early check-in, late checkout, and seat allocation on flights',
    ],
    vibe: 'Nordic capitals circuit',
    locationIdea: 'Finland, Estonia, Sweden, Norway, and Denmark',
    status: 'published',
    metaTitle: 'Scandinavia five countries 9 nights package',
    metaDescription:
      'A 9-night Scandinavian package covering Helsinki, Tallinn, Stockholm, Oslo, Geilo, and Copenhagen with guided city tours and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-eastern-europe-four-countries',
    title: 'Eastern Europe, Munich to Prague',
    slug: 'eastern-europe-munich-vienna-budapest-prague-9-nights',
    market: 'global',
    category: 'Heritage',
    tagline: 'Bavaria, Salzburg, Vienna, Budapest and Prague across four countries.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '10 days / 9 nights',
    groupSize: 'Fixed departure, small group',
    priceInr: null,
    priceUsd: 2451,
    destinations: ['Munich', 'Salzburg', 'Vienna', 'Budapest', 'Prague'],
    overviewHtml:
      '<p>A four-country run across central Europe, from Bavaria through Austria and Hungary to Czechia. The route pairs the big imperial capitals with a Salzburg stop for the baroque old town and the Alpine setting.</p><p>Each city gets a guided touring day and an evening, with the coach legs kept short enough that no day is lost entirely to travel. This is a fixed departure with set dates and four-star hotels throughout.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Munich arrival',
        description:
          'Arrive in Munich and transfer to your hotel, with the evening free around the old town.',
      },
      {
        day: 2,
        location: 'Munich',
        description:
          'Guided tour of Munich covering the Marienplatz and its glockenspiel, the royal residence quarter, and the city gates and markets.',
      },
      {
        day: 3,
        location: 'Munich to Salzburg',
        description:
          'Travel into Austria to Salzburg, the birthplace of Mozart, with its UNESCO-listed baroque old town below the Hohensalzburg fortress.',
      },
      {
        day: 4,
        location: 'Salzburg to Vienna',
        description:
          'Continue east through the Austrian countryside to Vienna and check in, with the evening free in the centre.',
      },
      {
        day: 5,
        location: 'Vienna',
        description:
          'Guided tour taking in Schonbrunn Palace and its gardens, the Ringstrasse, the State Opera, and St Stephen\'s Cathedral, with a coffee house afternoon.',
      },
      {
        day: 6,
        location: 'Vienna to Budapest',
        description:
          'Travel down the Danube to Budapest and check in, with the evening free along the illuminated riverfront.',
      },
      {
        day: 7,
        location: 'Budapest',
        description:
          'Guided tour across both halves of the city covering Buda Castle hill, the Fishermen\'s Bastion, Matthias Church, and the Parliament facade, with time for the thermal baths.',
      },
      {
        day: 8,
        location: 'Budapest to Prague',
        description:
          'Travel north into Czechia to Prague, arriving for check-in and an evening in the Old Town.',
      },
      {
        day: 9,
        location: 'Prague',
        description:
          'Guided tour of Prague Castle and St Vitus Cathedral, across the Charles Bridge, and into the Old Town Square for the astronomical clock and the Jewish quarter.',
      },
      {
        day: 10,
        location: 'Prague departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Thermal bath entry and optional excursions',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'Four countries by coach',
    locationIdea: 'Germany, Austria, Hungary, and Czechia',
    status: 'published',
    metaTitle: 'Eastern Europe Munich Vienna Budapest Prague 9 nights',
    metaDescription:
      'A 9-night central Europe package from Munich through Salzburg, Vienna, and Budapest to Prague, with guided city tours and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-switzerland-paris-italy',
    title: 'Switzerland, Paris and Italy',
    slug: 'switzerland-paris-italy-11-nights',
    market: 'global',
    category: 'Adventure',
    tagline: 'The Alps, Paris landmarks, and the Italian triangle on one long fixed departure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '12 days / 11 nights',
    groupSize: 'Fixed departure, small group',
    priceInr: null,
    priceUsd: 3186,
    destinations: ['Zurich', 'Mount Titlis', 'Lucerne', 'Interlaken', 'Paris', 'Venice', 'Florence', 'Rome'],
    overviewHtml:
      '<p>The longest of the European fixed departures, combining the Swiss alpine days and Paris with a full Italian leg through Venice, Florence, and Rome. It suits travellers making one long trip rather than several short ones.</p><p>Switzerland opens with Rhine Falls, Mount Titlis, Lucerne, and Interlaken, Paris covers the landmarks and the river, and Italy closes with the canal city, the Renaissance centre, and the ancient capital. Intercity legs run by coach and rail with four-star hotels throughout.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Zurich arrival',
        description:
          'Arrive at Zurich Airport and transfer to your hotel, with the rest of the day free to settle in.',
      },
      {
        day: 2,
        location: 'Zurich and Rhine Falls',
        description:
          'City tour of Zurich including Bahnhofstrasse and the lakefront, then out to Rhine Falls for a boat ride beneath the largest waterfall in Europe.',
      },
      {
        day: 3,
        location: 'Mount Titlis and Lucerne',
        description:
          'Ascend Mount Titlis by revolving cable car for glacier and summit views, then an orientation walk through medieval Lucerne on the lake.',
      },
      {
        day: 4,
        location: 'Interlaken',
        description:
          'Day trip to Interlaken between Lake Thun and Lake Brienz, free to explore or add the Jungfrau railway excursion at extra cost.',
      },
      {
        day: 5,
        location: 'Switzerland to Paris',
        description:
          'Travel to Paris and check in, with the evening free in your neighbourhood.',
      },
      {
        day: 6,
        location: 'Paris landmarks',
        description:
          'Guided city tour through central Paris with a visit to the Eiffel Tower, followed by an evening Seine cruise past the illuminated riverfront.',
      },
      {
        day: 7,
        location: 'Paris free day',
        description:
          'An open day for museums, markets, and neighbourhoods, or an optional Disneyland Paris excursion at extra cost.',
      },
      {
        day: 8,
        location: 'Paris to Venice',
        description:
          'Travel south-east into Italy and check in on Venice Island, with the evening free along the canals.',
      },
      {
        day: 9,
        location: 'Venice to Florence',
        description:
          'Guided tour of Venice covering St Mark\'s Square and Basilica and the Rialto quarter, then continue to Florence for the night.',
      },
      {
        day: 10,
        location: 'Florence',
        description:
          'Guided tour of Florence covering the Duomo, the Piazza della Signoria, and the Ponte Vecchio, with free time for the Uffizi or the markets.',
      },
      {
        day: 11,
        location: 'Florence to Rome',
        description:
          'Travel south to Rome with a guided tour of the ancient core, the Pantheon, the Trevi Fountain, and the Vatican quarter.',
      },
      {
        day: 12,
        location: 'Rome departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Optional excursions including the Jungfrau railway and Disneyland Paris',
      'Entrance fees not named in the inclusions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers, and early check-in or late checkout charges',
    ],
    vibe: 'The long European run',
    locationIdea: 'Switzerland, France, and Italy',
    status: 'published',
    metaTitle: 'Switzerland Paris Italy 11 nights package',
    metaDescription:
      'An 11-night European package covering the Swiss Alps, Paris, Venice, Florence, and Rome with guided touring and four-star hotels.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-germany-metzingen-baden-baden',
    title: 'Metzingen, Baden-Baden and Stuttgart',
    slug: 'germany-metzingen-baden-baden-stuttgart-5-nights',
    market: 'global',
    category: 'Wellness',
    tagline: 'Europe\'s largest outlet city, thermal spa days, and the Black Forest edge.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '6 days / 5 nights',
    groupSize: 'Private quotes for couples, families, and small groups',
    priceInr: null,
    priceUsd: 2478,
    destinations: ['Stuttgart', 'Metzingen', 'Baden-Baden', 'Black Forest'],
    overviewHtml:
      '<p>A shopping and spa holiday in south-west Germany, built around Outletcity Metzingen, the largest outlet in Europe with more than 170 premium and luxury brands and tax-free shopping for international visitors. It sits half an hour from Stuttgart Airport.</p><p>Baden-Baden supplies the counterweight: thermal bath houses, an elegant old town, and the Black Forest and Rhine Valley vineyards on either side. Stuttgart adds the Mercedes-Benz and Porsche museums and the Konigstrasse shopping street.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Stuttgart arrival',
        description:
          'Arrive at Stuttgart Airport and transfer to your hotel, with the evening free in the city centre.',
      },
      {
        day: 2,
        location: 'Outletcity Metzingen',
        description:
          'A full day at Outletcity Metzingen with more than 170 premium and luxury brands, including the largest Hugo Boss outlet in the world. Hands-free shopping, a VIP lounge, and a prayer room are available to international guests.',
      },
      {
        day: 3,
        location: 'Baden-Baden',
        description:
          'Travel to the spa town of Baden-Baden for the Caracalla Spa or the historic Friedrichsbad, followed by the elegant old town, the casino quarter, and the tree-lined Lichtentaler Allee.',
      },
      {
        day: 4,
        location: 'Black Forest',
        description:
          'A scenic day through the Black Forest and the Rhine Valley vineyards, with village stops for the region\'s clock workshops and cake houses.',
      },
      {
        day: 5,
        location: 'Stuttgart',
        description:
          'Explore Stuttgart with the Mercedes-Benz and Porsche museums, the Konigstrasse shopping street, and the palace gardens and vineyards around the centre.',
      },
      {
        day: 6,
        location: 'Stuttgart departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Spa and thermal bath entry, museum entry, and casino charges',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers',
      'Early check-in, late checkout, and personal expenses',
    ],
    vibe: 'Shopping and spa days',
    locationIdea: 'Baden-Wurttemberg',
    status: 'published',
    metaTitle: 'Germany Metzingen Baden-Baden Stuttgart 5 nights',
    metaDescription:
      'A 5-night Germany package with Outletcity Metzingen shopping, Baden-Baden thermal spas, the Black Forest, and the Stuttgart car museums.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'static-global-germany-metzingen-munich-salzburg',
    title: 'Metzingen, Munich and Salzburg',
    slug: 'germany-metzingen-munich-salzburg-5-nights',
    market: 'global',
    category: 'Culture',
    tagline: 'Outlet shopping in Swabia, Bavarian old town days, and a Salzburg excursion.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&q=80&w=1600',
    galleryUrls: [
      'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1572084351678-32fd2740fa53?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200',
    ],
    duration: '6 days / 5 nights',
    groupSize: 'Private quotes for couples, families, and small groups',
    priceInr: null,
    priceUsd: 2695,
    destinations: ['Stuttgart', 'Metzingen', 'Munich', 'Salzburg'],
    overviewHtml:
      '<p>The same Outletcity Metzingen shopping day as the Baden-Baden route, but heading east into Bavaria and across the border to Austria instead. Munich supplies the beer halls, markets, and the Marienplatz glockenspiel; Salzburg supplies the baroque old town, the Mozart houses, and the Hohensalzburg fortress.</p><p>It works well for travellers who want a short European break with one serious shopping day and two proper city days rather than a full touring itinerary.</p>',
    itinerary: [
      {
        day: 1,
        location: 'Stuttgart arrival',
        description:
          'Arrive at Stuttgart Airport and transfer to your hotel, with the evening free.',
      },
      {
        day: 2,
        location: 'Outletcity Metzingen',
        description:
          'A full day at Outletcity Metzingen with more than 170 premium and luxury brands and tax-free shopping, including the largest Hugo Boss outlet in the world.',
      },
      {
        day: 3,
        location: 'Stuttgart to Munich',
        description:
          'Travel east into Bavaria to Munich and check in, with an orientation walk through the Marienplatz and the old town gates.',
      },
      {
        day: 4,
        location: 'Munich',
        description:
          'A full day in Munich covering the royal residence quarter, the Viktualienmarkt, the beer hall district, and the English Garden.',
      },
      {
        day: 5,
        location: 'Salzburg',
        description:
          'Cross into Austria for a day in Salzburg, with its UNESCO-listed baroque old town, the Mozart birthplace, the Mirabell gardens, and the Hohensalzburg fortress above the river.',
      },
      {
        day: 6,
        location: 'Munich departure',
        description:
          'Breakfast and checkout, then a transfer to the airport for your homebound flight.',
      },
    ],
    inclusions: { ...yes, flights: true },
    exclusions: [
      'Schengen visa fees and any consular charges',
      'Travel insurance',
      'Museum and fortress entry, and optional excursions',
      'Meals not specified in the itinerary, and any meals on board flights',
      'Tips for guides and drivers',
      'Early check-in, late checkout, and personal expenses',
    ],
    vibe: 'Shopping with Bavarian city days',
    locationIdea: 'Swabia, Bavaria, and Salzburg',
    status: 'published',
    metaTitle: 'Germany Metzingen Munich Salzburg 5 nights',
    metaDescription:
      'A 5-night package with Outletcity Metzingen shopping, Munich old town and beer halls, and a Salzburg day across the Austrian border.',
    createdAt: '2026-07-20T00:00:00.000Z',
  },
];
