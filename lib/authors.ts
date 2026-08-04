// Author registry backing both the blog byline card and BlogPosting.author
// Person schema. Keyed by the `author` string stored on each blog document.
//
// Everything in here is a public claim about a real person, so only put in
// facts you can stand behind. An invented job title or a sameAs pointing at a
// profile that isn't theirs is worse than no author entity at all: it is the
// exact "fabricated credential" pattern the Search Quality Rater Guidelines
// treat as a trust failure. Unknown author -> findAuthor returns undefined and
// both the card and the schema fall back to a plain name byline.

export interface Author {
  /** Stable slug for the Person @id. Never change it once published. */
  slug: string;
  /** Must match BlogPost.author exactly. */
  name: string;
  jobTitle?: string;
  /** 2-3 sentences, first person plural or third person. Shown on the card. */
  bio: string;
  /** Topics this person has actually written about. Drives Person.knowsAbout. */
  knowsAbout: string[];
  /** Real, working profile URLs only. Empty array is correct when there are none. */
  sameAs: string[];
}

export const AUTHORS: readonly Author[] = [
  {
    slug: 'kevin',
    name: 'Kevin',
    // jobTitle intentionally omitted until confirmed — see note above.
    bio: 'Kevin writes the BagPackerMe journal, covering India travel in depth: heritage architecture, wildlife safari timing, slow-travel routes, and the small logistics that decide whether a trip works. He plans the itineraries he writes about.',
    // Derived from the categories and subjects of his published posts, so this
    // is a description of demonstrated coverage rather than a claim of expertise.
    knowsAbout: [
      'India travel',
      'Heritage architecture',
      'Wildlife safari',
      'Luxury retreats',
      'Slow travel',
      'Itinerary planning',
    ],
    sameAs: [],
  },
];

/** Look up an author by the exact byline stored on the post. */
export function findAuthor(name: string | undefined): Author | undefined {
  if (!name) return undefined;
  const needle = name.trim().toLowerCase();
  return AUTHORS.find((a) => a.name.toLowerCase() === needle);
}
