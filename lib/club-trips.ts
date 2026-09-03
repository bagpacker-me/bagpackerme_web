import { absoluteUrl } from '@/lib/site-url';
import { ORG_ID, type JsonLdDocument } from '@/lib/structured-data';

// The two launch departures, transcribed from the BagPackerMe Thailand decks.
// Copy lives here rather than in JSX so the apostrophes and en-dashes survive
// untouched — no escaping, no lint fights — and both trip pages render from one
// shared component.

export interface TripDay {
  day: number;
  place: string;
  title: string;
  body: string;
  heroMoment: string;
  whyItMatters: string;
}

export interface TripChapter {
  label: string;
  title: string;
  days: TripDay[];
  /** Which side the chapter photo sits on at desktop widths. */
  imageSide: 'left' | 'right';
  image: { src: string; width: number; height: number; alt: string };
}

export type TripAccent = 'lime' | 'cyan';

export interface ClubTrip {
  slug: string;
  /** Short name used in nav, cards and the ?trip= breadcrumb. */
  name: string;
  subtitle: string;
  tagline: string;
  duration: string;
  route: string[];
  priceInr: number;
  priceLabel: string;
  accent: TripAccent;
  hero: { src: string; width: number; height: number; alt: string };
  chapters: TripChapter[];
  finalDay: { day: number; title: string; body: string; heroMoment: string };
  included: string[];
  notIncluded: string[];
  priceSummary: string;
  priceNotes: string[];
  metaTitle: string;
  metaDescription: string;
}

// ─── Shared across both departures ───────────────────────────────────────────

export const JOURNEY_STEPS = [
  {
    number: '01',
    stage: 'Before',
    title: 'Choose your trip',
    body: 'Take the vibe quiz, complete the interest form and join a short fit call before receiving an invite.',
  },
  {
    number: '02',
    stage: 'In Thailand',
    title: 'Live the story',
    body: 'Your captain manages the route and group rhythm. Every day builds toward one clear hero moment.',
  },
  {
    number: '03',
    stage: 'After',
    title: 'Keep the proof',
    body: 'Receive selected edited photos and travel clips, then stay connected through the BagPackerMe community.',
  },
] as const;

export const TRIP_CREW = [
  {
    role: 'Trip Captain',
    body: 'Has done the route already. Manages timings, operators, decisions and the social energy of the group.',
  },
  {
    role: 'Photographer',
    body: 'Captures candid travel moments, clean portraits and the group frames nobody wants to miss.',
  },
  {
    role: 'Cinematographer',
    body: 'Films movement, atmosphere and vertical travel footage while you stay inside the experience.',
  },
] as const;

export const CONTENT_DELIVERABLES = [
  { title: 'Edited photos', body: 'Selected candid, portrait and group images.' },
  { title: 'Vertical clips', body: 'Short-form moments designed for social posting.' },
  { title: 'Trip story', body: 'A cinematic recap that brings the week back.' },
] as const;

const CHAPTER_SUBTITLE = 'Every day earns its place in the story.';
export const CHAPTER_SUBTITLE_TEXT = CHAPTER_SUBTITLE;

const LONGTAIL_IMAGE = {
  src: '/thailand/railay-longtail-boats.webp',
  width: 1800,
  height: 1246,
  alt: 'Long-tail boats moored on Railay beach beneath a limestone karst',
};

const CREW_IMAGE = {
  src: '/thailand/crew-golden-hour.webp',
  width: 1672,
  height: 941,
  alt: 'A BagPackerMe photographer and cinematographer filming the group walking along a Thai beach at golden hour',
};

export const CONTENT_TEAM_IMAGE = CREW_IMAGE;

const SHARED_NOT_INCLUDED_TAIL = 'Costs caused by weather, delays or personal changes';

// ─── Sunsets to Sunrise ──────────────────────────────────────────────────────

const SUNSETS_TO_SUNRISE: ClubTrip = {
  slug: 'thailand-sunsets-to-sunrise',
  name: 'Sunsets to Sunrise',
  subtitle: 'Sunsets to Sunrise',
  tagline: 'For travellers who want island days, magnetic nights and a crew that feels right.',
  duration: '7 days / 6 nights',
  route: ['Phuket', 'Phi Phi', 'Krabi'],
  priceInr: 50000,
  priceLabel: 'INR 50,000',
  accent: 'lime',
  hero: {
    src: '/thailand/beach-party-sunset.webp',
    width: 1024,
    height: 1536,
    alt: 'A group dancing on a Thai beach at sunset with long-tail boats and limestone cliffs behind them',
  },
  chapters: [
    {
      label: 'Chapter One',
      title: 'The crew forms',
      imageSide: 'left',
      image: {
        src: '/thailand/beach-party-sunset.webp',
        width: 1024,
        height: 1536,
        alt: 'Travellers dancing together on the sand as the sun goes down over Phuket',
      },
      days: [
        {
          day: 1,
          place: 'Phuket',
          title: 'The group chat becomes real',
          body: 'You land with names from a WhatsApp group. By dinner, the awkwardness has disappeared. Your captain sets the tone, introduces the crew and leads the first night into a curated Phuket pub crawl.',
          heroMoment: 'Welcome dinner → Phuket pub crawl',
          whyItMatters: 'Your people and the plan are already waiting.',
        },
        {
          day: 2,
          place: 'Phuket',
          title: 'Cook together. Slow down together.',
          body: 'After a late breakfast, the crew learns Thai flavours around one cooking table. The shared meal turns early conversations into easy friendships, followed by beach time and a foot massage.',
          heroMoment: 'Hands-on Thai cooking table',
          whyItMatters: 'Shared creation builds connection without forcing it.',
        },
      ],
    },
    {
      label: 'Chapter Two',
      title: 'The trip peaks',
      imageSide: 'right',
      image: LONGTAIL_IMAGE,
      days: [
        {
          day: 3,
          place: 'Phi Phi',
          title: 'Chase sunset into sunrise',
          body: 'The ferry opens into Phi Phi’s island energy. Settle in, reach the viewpoint for golden hour, watch the fire show and follow the music for the trip’s biggest night — all the way to sunrise if you want it.',
          heroMoment: 'Phi Phi fire show + sunrise party',
          whyItMatters: 'This is the night that turns the group into a crew.',
        },
        {
          day: 4,
          place: 'Phi Phi',
          title: 'Swim inside the postcard',
          body: 'A slow morning protects the mood. At 1 PM, the boat leaves for Maya Bay, Pileh Lagoon and Monkey Beach, with snorkelling, blue water and the best light of the day stretching toward sunset.',
          heroMoment: 'Maya Bay + Pileh Lagoon',
          whyItMatters: 'Careful timing makes an iconic day feel spacious.',
        },
      ],
    },
    {
      label: 'Chapter Three',
      title: 'The finale',
      imageSide: 'left',
      image: CREW_IMAGE,
      days: [
        {
          day: 5,
          place: 'Krabi',
          title: 'Change islands. Keep the rhythm.',
          body: 'Move to Krabi without rushing the transition. Reset at the hotel, meet again for Ao Nang sunset and follow your captain through a night-market trail of street food, colour and easy conversation.',
          heroMoment: 'Ao Nang sunset + night-market trail',
          whyItMatters: 'A softer day keeps the crew fresh for the finale.',
        },
        {
          day: 6,
          place: 'Krabi',
          title: 'One last perfect island day',
          body: 'A long-tail boat takes the crew to Railay. Swim, slow down and let the content team capture the final beach story. Return for a full-body massage, farewell dinner and one last night together.',
          heroMoment: 'Railay by long-tail boat',
          whyItMatters: 'The finale feels complete, not exhausting.',
        },
      ],
    },
  ],
  finalDay: {
    day: 7,
    title: 'Take the crew home with you',
    body: 'Breakfast, check-out and airport transfers close the route. The final group frame is captured before everyone leaves, while edited travel content follows after the trip.',
    heroMoment: 'Final crew portrait + first content drop',
  },
  included: [
    '6 nights shared hotel accommodation',
    'Phuket–Phi Phi–Krabi ferries and listed local transfers',
    'Welcome dinner and Phuket pub crawl',
    'Thai cooking class and two massage experiences',
    'Phi Phi boat tour, snorkelling and park allowance',
    'Railay long-tail boat day and farewell experience',
    'Route-tested BagPackerMe trip captain',
    'On-trip photographer, cinematographer and edited content pack',
  ],
  notIncluded: [
    'International and domestic flights',
    'Visa, passport and travel insurance',
    'Meals and drinks not listed as included',
    'Personal shopping and optional nightlife spend',
    'Room upgrades, early check-in or late check-out',
    SHARED_NOT_INCLUDED_TAIL,
  ],
  priceSummary: 'Shared hotel accommodation / Route-tested captain / Content team',
  priceNotes: [
    'Final invoice will show applicable statutory taxes and TCS. Visuals are representative.',
    'Launch-departure price includes on-trip content production. Final dates, deliverables and payment schedule are confirmed in the booking invite.',
  ],
  metaTitle: 'Thailand: Sunsets to Sunrise — 7-day trip',
  metaDescription:
    'A 7-day Phuket, Phi Phi and Krabi departure for The Curious Club — island days, magnetic nights, a route-tested captain and a content crew that travels with you. INR 50,000.',
};

// ─── The Wild Side ───────────────────────────────────────────────────────────

const THE_WILD_SIDE: ClubTrip = {
  slug: 'thailand-the-wild-side',
  name: 'The Wild Side',
  subtitle: 'The Wild Side',
  tagline: 'For travellers who want to move, learn, climb and earn every sunset together.',
  duration: '7 days / 6 nights',
  route: ['Phuket', 'Phi Phi', 'Krabi'],
  priceInr: 58999,
  priceLabel: 'INR 58,999',
  accent: 'cyan',
  hero: {
    src: '/thailand/railay-climbing.webp',
    width: 1024,
    height: 1536,
    alt: 'A climber on a limestone wall in Railay while the rest of the group belays and watches from below',
  },
  chapters: [
    {
      label: 'Chapter One',
      title: 'The crew forms',
      imageSide: 'left',
      image: {
        src: '/thailand/railay-climbing.webp',
        width: 1024,
        height: 1536,
        alt: 'A traveller climbing a limestone route above the sea, supported by the rest of the group',
      },
      days: [
        {
          day: 1,
          place: 'Phuket',
          title: 'Meet the people behind the week',
          body: 'You arrive, reset and meet the crew over dinner. Your captain has already travelled the route, so the briefing is practical: how the week flows, how the group moves and how to take on each challenge safely.',
          heroMoment: 'Welcome table + route briefing',
          whyItMatters: 'Confidence begins before the first activity.',
        },
        {
          day: 2,
          place: 'Phuket',
          title: 'Get your first adrenaline hit',
          body: 'The first full day moves fast: ATV trails, a zipline above tropical green and the excitement of trying it together. Later, the crew cooks Thai food, eats together and recovers with a foot massage.',
          heroMoment: 'ATV trail + zipline flight',
          whyItMatters: 'A shared first challenge breaks every social barrier.',
        },
      ],
    },
    {
      label: 'Chapter Two',
      title: 'The trip peaks',
      imageSide: 'right',
      image: LONGTAIL_IMAGE,
      days: [
        {
          day: 3,
          place: 'Phi Phi',
          title: 'Earn the view',
          body: 'Ferry into Phi Phi, drop the bags and climb toward the island viewpoint. The photographer captures the effort and the reveal; the reward is a swim, a relaxed evening and a crew already moving as one.',
          heroMoment: 'Phi Phi viewpoint reveal',
          whyItMatters: 'The view matters more when the group earns it together.',
        },
        {
          day: 4,
          place: 'Phi Phi',
          title: 'Build confidence in open water',
          body: 'Maya Bay and Pileh Lagoon become the backdrop for snorkelling, swimming and kayaking where conditions allow. Guides manage safety while the content team captures the scale of the day.',
          heroMoment: 'Pileh Lagoon ocean circuit',
          whyItMatters: 'Challenge becomes confidence when support is close.',
        },
      ],
    },
    {
      label: 'Chapter Three',
      title: 'The finale',
      imageSide: 'left',
      image: CREW_IMAGE,
      days: [
        {
          day: 5,
          place: 'Krabi',
          title: 'Train like you mean it',
          body: 'After the ferry to Krabi, step into a coached Muay Thai session designed for beginners. Learn the stance, pads and rhythm, then refuel together through Ao Nang’s night market.',
          heroMoment: 'First Muay Thai pad round',
          whyItMatters: 'You leave with a skill, not just another attraction.',
        },
        {
          day: 6,
          place: 'Railay',
          title: 'Climb the limestone wall',
          body: 'Railay’s cliffs become the trip’s final test. Local guides handle ropes and technique while the crew supports from below. Recover afterward with a massage and celebrate over the farewell dinner.',
          heroMoment: 'Your first Railay rock-climbing route',
          whyItMatters: 'The summit moment becomes the week’s personal proof.',
        },
      ],
    },
  ],
  finalDay: {
    day: 7,
    title: 'Leave with proof you did it',
    body: 'Breakfast, check-out and airport transfers close the route. One final crew frame marks the week, while selected photos, vertical clips and the trip story are prepared after departure.',
    heroMoment: 'Final crew portrait + first content drop',
  },
  included: [
    '6 nights shared hotel accommodation',
    'Phuket–Phi Phi–Krabi ferries and listed local transfers',
    'Welcome dinner, cooking class and foot massage',
    'ATV and zipline adventure allowance',
    'Phi Phi ocean tour, snorkelling and park allowance',
    'Muay Thai class and beginner Railay rock climbing',
    'Recovery massage and route-tested BagPackerMe trip captain',
    'On-trip photographer, cinematographer and edited content pack',
  ],
  notIncluded: [
    'International and domestic flights',
    'Visa, passport and suitable travel insurance',
    'Meals and drinks not listed as included',
    'Optional activities, equipment upgrades or photos',
    'Medical costs and personal purchases',
    SHARED_NOT_INCLUDED_TAIL,
  ],
  priceSummary: 'Shared hotel accommodation / Route-tested captain / Content team',
  priceNotes: [
    'Final invoice will show applicable statutory taxes and TCS. Visuals are representative.',
    'Launch price includes on-trip content production. Activities depend on weather, fitness declarations and operator availability; safety-led substitutions may apply.',
  ],
  metaTitle: 'Thailand: The Wild Side — 7-day trip',
  metaDescription:
    'A 7-day Phuket, Phi Phi and Krabi departure for The Curious Club — ATV trails, island climbs, Muay Thai and Railay rock climbing, with a route-tested captain and an on-trip content crew. INR 58,999.',
};

export const CLUB_TRIPS: ClubTrip[] = [SUNSETS_TO_SUNRISE, THE_WILD_SIDE];

export function getClubTrip(slug: string): ClubTrip | undefined {
  return CLUB_TRIPS.find((trip) => trip.slug === slug);
}

export function tripPath(trip: Pick<ClubTrip, 'slug'>) {
  return `/trips/${trip.slug}`;
}

/** Every day across the chapters plus the closing day, in order. */
export function allTripDays(trip: ClubTrip): TripDay[] {
  return trip.chapters.flatMap((chapter) => chapter.days);
}

export function buildClubTripSchema(trip: ClubTrip): JsonLdDocument {
  const url = absoluteUrl(tripPath(trip));

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: `Thailand: ${trip.subtitle}`,
    description: trip.metaDescription,
    image: absoluteUrl(trip.hero.src),
    url,
    touristType: 'Small group',
    provider: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      price: trip.priceInr,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url,
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: allTripDays(trip).length + 1,
      itemListElement: [
        ...allTripDays(trip).map((day) => ({
          '@type': 'ListItem',
          position: day.day,
          item: { '@type': 'Place', name: day.place, description: day.title },
        })),
        {
          '@type': 'ListItem',
          position: trip.finalDay.day,
          item: {
            '@type': 'Place',
            name: trip.route[trip.route.length - 1],
            description: trip.finalDay.title,
          },
        },
      ],
    },
  };
}
