/**
 * Seasonality layer for the homepage Season Explorer.
 *
 * `months` are travel-quality months — when a place is genuinely at its best
 * (weather, light, wildlife, festivals), not when we happen to have inventory.
 * Adding an entry here does NOT create a bookable product; it only puts a pin
 * on the map. `packageSlug` is the bridge to something we actually sell, and
 * anything without one routes to the planning enquiry instead.
 *
 * Coordinates are the region we'd actually route through, not always the
 * capital — Rajasthan sits over Jodhpur, not Delhi.
 */

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export type Month = (typeof MONTHS)[number];

export const MONTH_LABELS: Record<Month, string> = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
};

export interface SeasonDestination {
  id: string;
  name: string;
  /** Display-only grouping, shown as an eyebrow above the name. */
  region: string;
  lat: number;
  lng: number;
  /** One line, sentence case, no trailing period. */
  blurb: string;
  months: Month[];
  /** Set only where a published global package covers this destination. */
  packageSlug?: string;
}

export const SEASON_DESTINATIONS: SeasonDestination[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    region: 'India',
    lat: 26.9,
    lng: 73.8,
    blurb: 'Palace courtyards, desert light and evenings cool enough to linger outside',
    months: ['Jan', 'Feb', 'Oct', 'Nov', 'Dec'],
  },
  {
    id: 'japan',
    name: 'Japan',
    region: 'Asia',
    lat: 36.2,
    lng: 138.2,
    blurb: 'Blossom in spring, maple fire in autumn, and cities that reward slow walking',
    months: ['Mar', 'Apr', 'Oct', 'Nov'],
    packageSlug: 'japan-tokyo-kyoto-osaka-7-nights',
  },
  {
    id: 'kenya',
    name: 'Kenya',
    region: 'East Africa',
    lat: -1.3,
    lng: 36.8,
    blurb: 'Dry plains, clear game-viewing days and the migration at full volume',
    months: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep'],
    packageSlug: 'kenya-amboseli-naivasha-masai-mara-9-nights',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    region: 'Indian Ocean',
    lat: 3.2,
    lng: 73.2,
    blurb: 'The driest, stillest stretch of the year on a private-island atoll',
    months: ['Jan', 'Feb', 'Mar', 'Dec'],
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    region: 'Asia',
    lat: 7.9,
    lng: 80.8,
    blurb: 'Tea country in the hills, dry-season coast in the south',
    months: ['Jan', 'Feb', 'Mar'],
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    region: 'Southeast Asia',
    lat: 16.0,
    lng: 107.5,
    blurb: 'A long, graceful run from northern limestone bays to the Mekong delta',
    months: ['Feb', 'Mar', 'Apr', 'Jul', 'Nov', 'Dec'],
    packageSlug: 'vietnam-phu-quoc-hanoi-halong-7-nights',
  },
  {
    id: 'bhutan',
    name: 'Bhutan',
    region: 'Himalaya',
    lat: 27.5,
    lng: 90.4,
    blurb: 'Cliff monasteries, mountain festivals and air you can see for miles through',
    months: ['Mar', 'Apr', 'Sep', 'Oct'],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    region: 'India',
    lat: 10.0,
    lng: 76.3,
    blurb: 'Backwaters, hill estates and the green that only the rains leave behind',
    months: ['Jan', 'Mar', 'Aug', 'Sep', 'Nov', 'Dec'],
  },
  {
    id: 'spain',
    name: 'Spain',
    region: 'Europe',
    lat: 40.2,
    lng: -3.7,
    blurb: 'Long light over Andalusia, art cities and the coast before it fills up',
    months: ['Apr', 'May', 'Sep', 'Oct'],
    packageSlug: 'spain-madrid-andalusia-barcelona-8-nights',
  },
  {
    id: 'turkey',
    name: 'Türkiye',
    region: 'Europe & Asia',
    lat: 39.0,
    lng: 35.2,
    blurb: 'Istanbul at its most walkable, Cappadocia at its most photographed',
    months: ['Apr', 'May', 'Sep', 'Oct'],
  },
  {
    id: 'greece',
    name: 'Greece',
    region: 'Europe',
    lat: 37.6,
    lng: 24.0,
    blurb: 'Island light and open tavernas in the weeks either side of peak summer',
    months: ['May', 'Jun', 'Sep'],
  },
  {
    id: 'bali',
    name: 'Bali',
    region: 'Indonesia',
    lat: -8.4,
    lng: 115.1,
    blurb: 'Dry-season mornings, rice-terrace walks and villas with nobody else in them',
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    region: 'Europe',
    lat: 46.8,
    lng: 8.2,
    blurb: 'Alpine rail, lake towns and meadows a few weeks past the snowmelt',
    months: ['Jun', 'Jul', 'Aug', 'Sep'],
    packageSlug: 'switzerland-paris-7-nights',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    region: 'India',
    lat: 34.2,
    lng: 77.6,
    blurb: 'High passes open, monasteries reachable and skies that go on forever',
    months: ['Jun', 'Jul', 'Aug', 'Sep'],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    region: 'Nordics',
    lat: 64.9,
    lng: -19.0,
    blurb: 'Midnight sun over the highlands, or aurora season once the dark returns',
    months: ['Jun', 'Jul', 'Aug', 'Sep', 'Feb'],
  },
  {
    id: 'norway',
    name: 'Norway',
    region: 'Nordics',
    lat: 62.0,
    lng: 9.0,
    blurb: 'Fjord water like glass and daylight that refuses to end',
    months: ['Jun', 'Jul', 'Aug'],
  },
  {
    id: 'central-europe',
    name: 'Central Europe',
    region: 'Europe',
    lat: 48.5,
    lng: 17.5,
    blurb: 'Budapest, Vienna and Prague strung together by river and rail',
    months: ['May', 'Jun', 'Sep', 'Oct'],
    packageSlug: 'central-europe-budapest-vienna-prague-7-nights',
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    region: 'Asia',
    lat: 36.5,
    lng: 127.9,
    blurb: 'Design-led cities, mountain temples and a very short, very good spring',
    months: ['Apr', 'May', 'Oct'],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    region: 'Southeast Asia',
    lat: 13.0,
    lng: 101.0,
    blurb: 'Island weather at its most reliable and Bangkok at its least humid',
    months: ['Jan', 'Feb', 'Nov', 'Dec'],
    packageSlug: 'pattaya-thailand-3-nights',
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    region: 'Africa',
    lat: -30.6,
    lng: 22.9,
    blurb: 'Winelands, the Cape coast and private reserves in the same fortnight',
    months: ['Nov', 'Dec', 'Mar', 'Apr'],
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    region: 'East Africa',
    lat: -6.4,
    lng: 34.9,
    blurb: 'Serengeti calving season, then Zanzibar to slow the pace down',
    months: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'Middle East',
    lat: 25.2,
    lng: 55.3,
    blurb: 'Outdoor season returns — desert nights, rooftop everything',
    months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  },
  {
    id: 'jordan',
    name: 'Jordan',
    region: 'Middle East',
    lat: 31.0,
    lng: 36.2,
    blurb: 'Petra without the heat haze, and a night in the Wadi Rum silence',
    months: ['Mar', 'Apr', 'Oct', 'Nov'],
  },
  {
    id: 'peru',
    name: 'Peru',
    region: 'South America',
    lat: -12.0,
    lng: -75.0,
    blurb: 'Dry-season trails to Machu Picchu and clear Andean mornings',
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    region: 'Oceania',
    lat: -42.5,
    lng: 172.5,
    blurb: 'Southern summer — long days, empty roads and the whole South Island open',
    months: ['Dec', 'Jan', 'Feb', 'Mar'],
  },
  {
    id: 'egypt',
    name: 'Egypt',
    region: 'North Africa',
    lat: 26.0,
    lng: 31.5,
    blurb: 'The Nile in cool weather, when the temples are bearable at midday',
    months: ['Nov', 'Dec', 'Jan', 'Feb'],
  },
];

/**
 * Most months qualify 8-12 destinations, which crowds the map and collides the
 * pin labels around Europe and South Asia. Capping keeps it readable; the
 * curated array order decides who makes the cut.
 */
export const MAX_PINS_PER_MONTH = 8;

/** Destinations at their best in the given month, in curated order. */
export function getDestinationsForMonth(month: Month): SeasonDestination[] {
  return SEASON_DESTINATIONS
    .filter((destination) => destination.months.includes(month))
    .slice(0, MAX_PINS_PER_MONTH);
}

/** The visitor's current month, so the section opens on something relevant. */
export function getCurrentMonth(): Month {
  return MONTHS[new Date().getMonth()];
}
