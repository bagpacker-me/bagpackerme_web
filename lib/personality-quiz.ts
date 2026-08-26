// The Traveler Vibe Match Quiz.
//
// Ten questions live here; each applicant is served a random six of them
// (QUIZ_QUESTION_COUNT). Every option maps to one of four letters, the letters
// tally into a personality type, and that type is what the applicant sees on
// the reveal screen after they submit.
//
// Scoring runs on the server — lib/club-application.ts re-derives it from the
// stored answers — so a tampered payload cannot hand someone a type they did
// not answer their way into.

export type QuizChoice = 'A' | 'B' | 'C' | 'D';

export const QUIZ_CHOICES: QuizChoice[] = ['A', 'B', 'C', 'D'];

export type PersonalityKey = 'spark' | 'magnet' | 'anchor' | 'architect';

export interface QuizQuestion {
  /** Stable id — stored on the application, so never renumber these. */
  id: string;
  prompt: string;
  options: Record<QuizChoice, string>;
}

export interface PersonalityType {
  key: PersonalityKey;
  /** The letter that scores towards this type. */
  choice: QuizChoice;
  name: string;
  /** One line, straight from the scoring key. */
  tagline: string;
  /** Two or three sentences for the reveal screen. */
  blurb: string;
  /**
   * Reveal video. Empty string until the films exist — the reveal screen falls
   * back to a static card, so shipping without them is not a broken page. Drop
   * a file in /public and put its path here (e.g. '/web_photos/spark.webm') to
   * turn the video on; no other file needs to change.
   */
  video: string;
}

// ─── Questions ───────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'It’s your first morning in a brand-new destination. What’s your ideal step one?',
    options: {
      A: 'Walk out the front door, turn off your GPS, and see where the streets take you.',
      B: 'Send a group text: “Who’s up for a massive breakfast feast?”',
      C: 'Grab a quiet coffee, find a sunny bench, and take in the morning city rhythms.',
      D: 'Head straight to the morning market slot you flagged on your map last week.',
    },
  },
  {
    id: 'q2',
    prompt: 'What’s your absolute favorite way to discover a local neighborhood?',
    options: {
      A: 'Spotting a lively alleyway and following the sound of music or laughter.',
      B: 'Asking a group of locals at a cafe where they’re hanging out later.',
      C: 'Renting a bicycle for a peaceful loop through the residential side streets.',
      D: 'Booking a curated walking tour led by a local design or history expert.',
    },
  },
  {
    id: 'q3',
    prompt: 'What does your ideal evening abroad look like?',
    options: {
      A: 'Ending up at a hidden rooftop bar after following a tip from a street vendor.',
      B: 'A long, family-style dinner with shared dishes, continuous toasts, and nonstop stories.',
      C: 'A scenic sunset walk, followed by room service and a great movie or book.',
      D: 'Sitting at the chef’s counter at the restaurant you reserved three weeks ago.',
    },
  },
  {
    id: 'q4',
    prompt: 'What’s your packing style when preparing for an exciting getaway?',
    options: {
      A: 'Ultra-light carry-on — you prefer leaving room to buy cool local outfits there.',
      B: 'Packed with party games, a portable speaker, and plenty of snacks to share.',
      C: 'Packed with ultimate comfort items: cozy layers, your favorite tea, and a plush eye mask.',
      D: 'Outfits planned per day, organized in labeled, color-coded packing cubes.',
    },
  },
  {
    id: 'q5',
    prompt: 'You’ve got a completely free afternoon with zero commitments. What sounds best?',
    options: {
      A: 'Hopping on a local ferry or tram to the last stop just to see what’s there.',
      B: 'Gathering the crew for a sunny afternoon picnic at the most popular park.',
      C: 'Spending three uninterrupted hours browsing a vintage bookstore or garden.',
      D: 'Visiting the top-rated art gallery or architectural landmark on your list.',
    },
  },
  {
    id: 'q6',
    prompt: 'What role do you naturally play in the pre-trip group chat?',
    options: {
      A: 'Sending wild photo inspiration and hyping up the spontaneous side trips.',
      B: 'Creating polls, making playlist suggestions, and building the group excitement.',
      C: 'Dropping warm, enthusiastic emojis while letting others handle the details.',
      D: 'Sharing the organized Google Drive with map pins, tickets, and weather forecasts.',
    },
  },
  {
    id: 'q7',
    prompt: 'How do you prefer to handle meals during a trip?',
    options: {
      A: 'Following your nose to whatever street food vendor has the longest line.',
      B: 'Booking big communal tables where everyone can try a little bit of everything.',
      C: 'Finding quiet, cozy bistros with relaxing vibes and plenty of space to chat.',
      D: 'Researching neighborhood culinary specialties and seeking out the top-reviewed spots.',
    },
  },
  {
    id: 'q8',
    prompt: 'You stumble upon a surprise street festival or parade. What’s your move?',
    options: {
      A: 'Jump right into the center of the crowd without hesitation.',
      B: 'Grab everyone by the arm and lead a group dance into the festivities.',
      C: 'Watch comfortably from the edges, enjoying the vibrant atmosphere.',
      D: 'Take a quick photo, then check how it aligns with your afternoon timeline.',
    },
  },
  {
    id: 'q9',
    prompt: 'What makes an accommodation feel like the perfect home base?',
    options: {
      A: 'An eccentric boutique stay located in the absolute heart of the nightlife action.',
      B: 'A vibrant social space — like a hostel rooftop or hotel lounge built for meeting people.',
      C: 'A tranquil sanctuary with a plush bed, quiet surroundings, and great views.',
      D: 'A beautifully designed architectural gem with rich history and pristine reviews.',
    },
  },
  {
    id: 'q10',
    prompt: 'What’s the ultimate souvenir you want to bring home?',
    options: {
      A: 'An unbelievable story about an unexpected adventure you stumbled into.',
      B: 'A group photo with great friends — both old and newly made on the trip.',
      C: 'A sense of deep refreshment, calm, and a small token to remember the peace.',
      D: 'A carefully chosen piece of authentic local craft, art, or design.',
    },
  },
];

/** How many of the ten each applicant answers. */
export const QUIZ_QUESTION_COUNT = 6;

export const QUIZ_QUESTION_IDS = QUIZ_QUESTIONS.map((question) => question.id) as [
  string,
  ...string[],
];

const QUIZ_BY_ID = new Map(QUIZ_QUESTIONS.map((question) => [question.id, question]));

export function getQuizQuestion(id: string): QuizQuestion | undefined {
  return QUIZ_BY_ID.get(id);
}

// ─── Personality types ───────────────────────────────────────────────────────

export const PERSONALITY_TYPES: Record<PersonalityKey, PersonalityType> = {
  spark: {
    key: 'spark',
    choice: 'A',
    name: 'The Spark',
    tagline: 'High energy, spontaneous, and thrives on discovery.',
    blurb:
      'You don’t travel to tick things off — you travel to be surprised. Plans are a starting point, the last stop on the tram is a destination, and the best night of the trip is the one nobody scheduled.',
    video: '',
  },
  magnet: {
    key: 'magnet',
    choice: 'B',
    name: 'The Magnet',
    tagline: 'Social connector, group energizer, and heart of the party.',
    blurb:
      'Wherever you land, a table fills up. You collect people the way others collect fridge magnets, and the trip everyone remembers is usually the one you talked them into.',
    video: '',
  },
  anchor: {
    key: 'anchor',
    choice: 'C',
    name: 'The Anchor',
    tagline: 'Grounded seeker, peaceful explorer, and master of slow travel.',
    blurb:
      'You’d rather know one neighbourhood properly than six of them in passing. Long mornings, quiet corners, and the kind of calm that makes everyone else on the trip slow down too.',
    video: '',
  },
  architect: {
    key: 'architect',
    choice: 'D',
    name: 'The Architect',
    tagline: 'Strategic planner, design enthusiast, and curator of great experiences.',
    blurb:
      'You build trips the way other people build collections — deliberately. The reservation was made weeks ago, the route makes sense, and everything on it earned its place.',
    video: '',
  },
};

export const PERSONALITY_ORDER: PersonalityKey[] = ['spark', 'magnet', 'anchor', 'architect'];

const KEY_BY_CHOICE = Object.fromEntries(
  PERSONALITY_ORDER.map((key) => [PERSONALITY_TYPES[key].choice, key])
) as Record<QuizChoice, PersonalityKey>;

// ─── Selection & scoring ─────────────────────────────────────────────────────

export interface QuizAnswer {
  questionId: string;
  choice: QuizChoice;
}

/**
 * A random `count` of the ten, returned in their original order so the set
 * still reads as a sequence rather than a shuffle.
 *
 * Called from a click handler rather than during render — picking at render
 * time would make the server and client HTML disagree and blow up hydration.
 */
export function pickQuizQuestions(count = QUIZ_QUESTION_COUNT): QuizQuestion[] {
  const pool = [...QUIZ_QUESTIONS];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked = new Set(pool.slice(0, Math.min(count, pool.length)).map((q) => q.id));

  return QUIZ_QUESTIONS.filter((question) => picked.has(question.id));
}

/**
 * Tallies the letters and returns the winning type.
 *
 * Six answers across four letters tie often (3–3, or 2–2–1–1), so the tiebreak
 * has to be defined rather than left to whatever Object.entries feels like:
 * among the joint leaders, the letter the applicant used *first* wins. Their
 * opening instinct beats a later coin-flip.
 */
export function scorePersonality(answers: QuizAnswer[]): PersonalityKey {
  const tally: Record<QuizChoice, number> = { A: 0, B: 0, C: 0, D: 0 };
  const firstUsedAt: Partial<Record<QuizChoice, number>> = {};

  answers.forEach((answer, index) => {
    tally[answer.choice] += 1;
    if (firstUsedAt[answer.choice] === undefined) firstUsedAt[answer.choice] = index;
  });

  const best = QUIZ_CHOICES.reduce((winner, choice) => {
    if (tally[choice] > tally[winner]) return choice;
    if (tally[choice] < tally[winner]) return winner;
    return (firstUsedAt[choice] ?? Infinity) < (firstUsedAt[winner] ?? Infinity) ? choice : winner;
  }, QUIZ_CHOICES[0]);

  return KEY_BY_CHOICE[best];
}

export function personalityType(key: string | null | undefined): PersonalityType | null {
  if (!key) return null;
  return PERSONALITY_TYPES[key as PersonalityKey] ?? null;
}
