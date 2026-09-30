/**
 * The destinations Things To Do is open in, as the site presents them.
 *
 * Deliberately a repo file rather than a read off `viator_destinations`. Viator's
 * taxonomy knows a destination's name and coordinates; it does not know how
 * BagpackerMe wants to describe it, which country heading it sits under, or
 * whether it is ready to show. Editorial copy belongs in the repo where it is
 * reviewed like any other change.
 *
 * `slug` MUST match the slug the n8n Viator Destination Sync writes, which is
 * the Viator destination name lowercased with non-alphanumerics collapsed to
 * hyphens — "Ho Chi Minh City" becomes "ho-chi-minh-city". A slug listed here
 * with no matching row in `viator_destinations` simply renders an empty grid,
 * so adding a destination is a two-step change: add it to `WANTED` in the n8n
 * workflow, then add it here.
 */

export interface ExperienceDestination {
  slug: string;
  name: string;
  country: string;
  /** One line, sentence case, no trailing period. */
  blurb: string;
}

export const EXPERIENCE_DESTINATIONS: ExperienceDestination[] = [
  // Japan
  { slug: 'tokyo', name: 'Tokyo', country: 'Japan', blurb: 'Neon districts, quiet shrines and the best food city on earth' },
  { slug: 'kyoto', name: 'Kyoto', country: 'Japan', blurb: 'Temple gardens, bamboo light and tea houses that still keep hours' },
  { slug: 'osaka', name: 'Osaka', country: 'Japan', blurb: 'Street food after dark and the friendliest city in the country' },

  // Thailand
  { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', blurb: 'River temples, night markets and a rooftop for every mood' },
  { slug: 'phuket', name: 'Phuket', country: 'Thailand', blurb: 'Limestone bays, long-tail boats and islands an hour offshore' },
  { slug: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', blurb: 'Old-city walls, mountain roads and ethical elephant sanctuaries' },
  { slug: 'krabi', name: 'Krabi', country: 'Thailand', blurb: 'Climbing cliffs straight out of the Andaman Sea' },

  // Greece
  { slug: 'athens', name: 'Athens', country: 'Greece', blurb: 'Marble ruins above a city that eats late and well' },
  { slug: 'santorini', name: 'Santorini', country: 'Greece', blurb: 'Caldera light, volcanic beaches and the sunset everybody comes for' },
  { slug: 'crete', name: 'Crete', country: 'Greece', blurb: 'Gorges, Minoan palaces and coastline you need a week for' },

  // India
  { slug: 'new-delhi', name: 'Delhi', country: 'India', blurb: 'Mughal forts, Old Delhi lanes and food worth the crowds' },
  { slug: 'jaipur', name: 'Jaipur', country: 'India', blurb: 'Pink sandstone, stepwells and palace courtyards at golden hour' },
  { slug: 'goa', name: 'Goa', country: 'India', blurb: 'Portuguese churches, river cruises and beaches with proper shade' },
  { slug: 'udaipur', name: 'Udaipur', country: 'India', blurb: 'Lake palaces, rooftop dinners and the gentlest city in Rajasthan' },
  { slug: 'leh', name: 'Leh', country: 'India', blurb: 'High-altitude monasteries and passes that open for half the year' },

  // South Korea
  { slug: 'seoul', name: 'Seoul', country: 'South Korea', blurb: 'Palaces beside skyscrapers, and a food scene that never closes' },
  { slug: 'busan', name: 'Busan', country: 'South Korea', blurb: 'Coastal temples, fish markets and hillside colour' },

  // Vietnam
  { slug: 'hanoi', name: 'Hanoi', country: 'Vietnam', blurb: 'Old Quarter mornings and the best coffee ritual in Asia' },
  { slug: 'ho-chi-minh-city', name: 'Ho Chi Minh City', country: 'Vietnam', blurb: 'War history, Mekong day trips and relentless street food' },
  { slug: 'da-nang', name: 'Da Nang', country: 'Vietnam', blurb: 'Marble mountains, a long beach and Hoi An half an hour away' },

  // Indonesia
  { slug: 'bali', name: 'Bali', country: 'Indonesia', blurb: 'Rice terraces, water temples and surf for every level' },
  { slug: 'ubud', name: 'Ubud', country: 'Indonesia', blurb: 'Jungle valleys, craft villages and the island at its quietest' },

  // United Arab Emirates
  { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', blurb: 'Desert dunes, observation decks and dinner on the creek' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi', country: 'United Arab Emirates', blurb: 'The Grand Mosque, island beaches and a calmer Gulf city' },

  // Singapore
  { slug: 'singapore', name: 'Singapore', country: 'Singapore', blurb: 'Hawker centres, garden domes and a skyline built to be looked at' },

  // Turkey
  { slug: 'istanbul', name: 'Istanbul', country: 'Turkey', blurb: 'Two continents, Byzantine domes and a ferry for every errand' },
  { slug: 'cappadocia', name: 'Cappadocia', country: 'Turkey', blurb: 'Balloons at dawn over rock valleys and cave hotels' },
];

const BY_SLUG = new Map(EXPERIENCE_DESTINATIONS.map((d) => [d.slug, d]));

export function findDestination(slug: string): ExperienceDestination | undefined {
  return BY_SLUG.get(slug);
}

export interface DestinationCountryGroup {
  country: string;
  destinations: ExperienceDestination[];
}

/** Grouped for the /destinations index, in the order the array declares them. */
export function destinationsByCountry(): DestinationCountryGroup[] {
  const groups: DestinationCountryGroup[] = [];

  for (const destination of EXPERIENCE_DESTINATIONS) {
    const existing = groups.find((g) => g.country === destination.country);

    if (existing) {
      existing.destinations.push(destination);
    } else {
      groups.push({ country: destination.country, destinations: [destination] });
    }
  }

  return groups;
}
