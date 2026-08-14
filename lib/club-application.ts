import { z } from 'zod';
import {
  EMAIL_PATTERN,
  hasValue,
  phoneLooksValid,
  requireField,
  type FormErrors,
} from '@/lib/form-validation';
import type { InquiryOption } from '@/lib/inquiry-form';
import type { ClubApplicationStatus } from '@/types';

// The Curious Club membership application.
//
// One source of truth for all 19 questions: the public flow renders from
// CLUB_QUESTIONS, the client validator walks it, the server schema re-derives
// its shape from it, and the admin panel labels answers from it. Adding a
// question means editing this file and nothing else.

export type ClubQuestionId =
  | 'fullName'
  | 'ageBand'
  | 'city'
  | 'work'
  | 'instagram'
  | 'linkedin'
  | 'curiousAbout'
  | 'travelFor'
  | 'sixHours'
  | 'travelStyle'
  | 'meetPreferences'
  | 'experiences'
  | 'holidayBudget'
  | 'bookTomorrow'
  | 'bringToCommunity'
  | 'whyInvite'
  | 'discoverySource'
  | 'phone'
  | 'email';

export interface ClubApplicationAnswers {
  fullName: string;
  ageBand: string;
  city: string;
  work: string;
  instagram: string;
  linkedin: string;
  curiousAbout: string;
  travelFor: string[];
  sixHours: string;
  travelStyle: string;
  meetPreferences: string[];
  experiences: string[];
  holidayBudget: string;
  bookTomorrow: string;
  bringToCommunity: string;
  whyInvite: string;
  discoverySource: string;
  phone: string;
  email: string;
  consent: boolean;
}

type ClubQuestionBase = {
  id: ClubQuestionId;
  /** Shown as the question itself. */
  prompt: string;
  /** Smaller line under the prompt. */
  help?: string;
  placeholder?: string;
  optional?: boolean;
};

export type ClubQuestion =
  | (ClubQuestionBase & { type: 'short-text'; inputMode?: 'tel' | 'email' })
  | (ClubQuestionBase & { type: 'long-text' })
  | (ClubQuestionBase & { type: 'single-choice'; options: InquiryOption[] })
  | (ClubQuestionBase & { type: 'multi-choice'; options: InquiryOption[]; max?: number });

const option = (label: string): InquiryOption => ({ label, value: label });

export const AGE_BAND_OPTIONS: InquiryOption[] = [
  '18–24',
  '25–30',
  '31–35',
  '36–45',
  '46+',
].map(option);

export const TRAVEL_FOR_OPTIONS: InquiryOption[] = [
  'Food',
  'Music',
  'Nightlife',
  'Art',
  'Culture',
  'Photography',
  'Adventure',
  'Nature',
  'Wellness',
  'Fitness',
  'Spirituality',
  'History',
  'Cinema',
  'Books',
  'Entrepreneurship',
  'Technology',
  'Learning something new',
  'Meeting interesting people',
].map(option);

export const TRAVEL_STYLE_OPTIONS: InquiryOption[] = [
  'Give me a great itinerary and I’ll follow it',
  'Give me the important bits and I’ll improvise',
  'Introduce me to interesting people and let’s see what happens',
  'I research everything and plan the trip myself',
].map(option);

export const MEET_PREFERENCE_OPTIONS: InquiryOption[] = [
  'Travellers',
  'Founders & entrepreneurs',
  'Creators',
  'Artists & musicians',
  'Interesting professionals',
  'Food lovers',
  'Adventure seekers',
  'People with completely different lives from mine',
].map(option);

export const EXPERIENCE_OPTIONS: InquiryOption[] = [
  'Secret dinners',
  'Mumbai experiences',
  'Weekend escapes',
  'India group trips',
  'International group trips',
  'Food trips',
  'Music / nightlife trips',
  'Wellness retreats',
  'Adventure trips',
  'Culture-led journeys',
  'Workshops / learning experiences',
].map(option);

export const HOLIDAY_BUDGET_OPTIONS: InquiryOption[] = [
  'Under ₹30,000',
  '₹30,000–₹50,000',
  '₹50,000–₹1 lakh',
  '₹1–2 lakh',
  '₹2–5 lakh',
  '₹5 lakh+',
].map(option);

export const DISCOVERY_SOURCE_OPTIONS: InquiryOption[] = [
  'Instagram',
  'Facebook',
  'BagpackerMe',
  'Friend',
  'Existing member',
  'Event',
  'Other',
].map(option);

export const TRAVEL_FOR_MAX = 5;
export const MEET_PREFERENCE_MAX = 3;

export const CONSENT_TEXT =
  'I understand that The Curious Club is a curated community. If I voluntarily provide my Instagram or LinkedIn profile, I consent to the team reviewing publicly available information on those profiles for community-fit purposes.';

// Order matters — this is the order applicants see. Instagram and LinkedIn sit
// at 5 and 6 on purpose: four easy questions first, so handing over a profile
// reads as part of an application rather than the price of entry.
export const CLUB_QUESTIONS: ClubQuestion[] = [
  {
    id: 'fullName',
    type: 'short-text',
    prompt: 'What’s your full name?',
    placeholder: 'Priya Nair',
  },
  {
    id: 'ageBand',
    type: 'single-choice',
    prompt: 'How old are you?',
    options: AGE_BAND_OPTIONS,
  },
  {
    id: 'city',
    type: 'short-text',
    prompt: 'Which city are you based in?',
    placeholder: 'Mumbai',
  },
  {
    id: 'work',
    type: 'short-text',
    prompt: 'What do you do?',
    help: 'Tell us your profession, business, creative pursuit or what currently keeps you busy.',
    placeholder: 'Product designer, running my own studio',
  },
  {
    id: 'instagram',
    type: 'short-text',
    prompt: 'Drop your Instagram profile',
    help: 'Optional — @username or link.',
    placeholder: '@username',
    optional: true,
  },
  {
    id: 'linkedin',
    type: 'short-text',
    prompt: 'Drop your LinkedIn profile',
    help: 'Optional.',
    placeholder: 'linkedin.com/in/…',
    optional: true,
  },
  {
    id: 'curiousAbout',
    type: 'long-text',
    prompt: 'What are you unusually curious about?',
    help: 'Could be anything — underground music, architecture, street food, startups, wildlife, coffee, history…',
  },
  {
    id: 'travelFor',
    type: 'multi-choice',
    prompt: 'Pick up to 5 things you’d travel for.',
    options: TRAVEL_FOR_OPTIONS,
    max: TRAVEL_FOR_MAX,
  },
  {
    id: 'sixHours',
    type: 'long-text',
    prompt: 'You land in a city you’ve never visited before. You have 6 hours and no plans. What do you do?',
  },
  {
    id: 'travelStyle',
    type: 'single-choice',
    prompt: 'Which sounds most like you when you travel?',
    options: TRAVEL_STYLE_OPTIONS,
  },
  {
    id: 'meetPreferences',
    type: 'multi-choice',
    prompt: 'Who would you most like to meet through the club?',
    help: 'Choose up to 3.',
    options: MEET_PREFERENCE_OPTIONS,
    max: MEET_PREFERENCE_MAX,
  },
  {
    id: 'experiences',
    type: 'multi-choice',
    prompt: 'Which experiences would you actually join?',
    help: 'Select all that apply.',
    options: EXPERIENCE_OPTIONS,
  },
  {
    id: 'holidayBudget',
    type: 'single-choice',
    prompt: 'What would you normally spend on a great 5–7 day holiday?',
    options: HOLIDAY_BUDGET_OPTIONS,
  },
  {
    id: 'bookTomorrow',
    type: 'long-text',
    prompt: 'What is one trip or experience you’d book tomorrow if the right people were going?',
  },
  {
    id: 'bringToCommunity',
    type: 'long-text',
    prompt: 'What would you bring to this community?',
    help: 'Stories? Expertise? Energy? Recommendations? Connections? A weird obsession we should know about?',
  },
  {
    id: 'whyInvite',
    type: 'long-text',
    prompt: 'Final one: why should we invite you?',
  },
  {
    id: 'discoverySource',
    type: 'single-choice',
    prompt: 'How did you find The Curious Club?',
    options: DISCOVERY_SOURCE_OPTIONS,
  },
  {
    id: 'phone',
    type: 'short-text',
    prompt: 'Mobile / WhatsApp number',
    inputMode: 'tel',
    placeholder: '+91 98765 43210',
  },
  {
    id: 'email',
    type: 'short-text',
    prompt: 'Email address',
    inputMode: 'email',
    placeholder: 'you@example.com',
  },
];

// Labels for the admin panel and the CSV export, in question order.
export const CLUB_QUESTION_LABELS: Record<ClubQuestionId, string> = {
  fullName: 'Full name',
  ageBand: 'Age',
  city: 'City',
  work: 'What they do',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  curiousAbout: 'Unusually curious about',
  travelFor: 'Would travel for',
  sixHours: 'Six free hours in a new city',
  travelStyle: 'Travel style',
  meetPreferences: 'Wants to meet',
  experiences: 'Would join',
  holidayBudget: 'Typical holiday spend',
  bookTomorrow: 'Would book tomorrow',
  bringToCommunity: 'Would bring to the community',
  whyInvite: 'Why invite them',
  discoverySource: 'Found us via',
  phone: 'Phone / WhatsApp',
  email: 'Email',
};

// Review pipeline. Deliberately not the careers wording: nobody is "hired" into
// a community, and "declined" is the honest end state for an application we
// reviewed and passed on.
export const CLUB_STATUS_ORDER: ClubApplicationStatus[] = [
  'new',
  'shortlisted',
  'invited',
  'declined',
];

export const CLUB_STATUS_LABELS: Record<ClubApplicationStatus, string> = {
  new: 'New',
  shortlisted: 'Shortlisted',
  invited: 'Invited',
  declined: 'Declined',
};

export const initialClubAnswers: ClubApplicationAnswers = {
  fullName: '',
  ageBand: '',
  city: '',
  work: '',
  instagram: '',
  linkedin: '',
  curiousAbout: '',
  travelFor: [],
  sixHours: '',
  travelStyle: '',
  meetPreferences: [],
  experiences: [],
  holidayBudget: '',
  bookTomorrow: '',
  bringToCommunity: '',
  whyInvite: '',
  discoverySource: '',
  phone: '',
  email: '',
  consent: false,
};

function missingMessage(question: ClubQuestion) {
  switch (question.type) {
    case 'single-choice':
      return 'Pick one to continue';
    case 'multi-choice':
      return 'Pick at least one to continue';
    case 'long-text':
      return 'Take a line or two — this one matters';
    default:
      return 'This one is required';
  }
}

/** Validates a single question. Returns null when the answer is acceptable. */
export function validateClubQuestion(
  question: ClubQuestion,
  answers: ClubApplicationAnswers
): string | null {
  const value = answers[question.id];

  if (!hasValue(value)) {
    return question.optional ? null : missingMessage(question);
  }

  if (question.type === 'multi-choice' && question.max) {
    const selected = value as string[];
    if (selected.length > question.max) {
      return `Choose up to ${question.max}`;
    }
  }

  if (question.id === 'email' && !EMAIL_PATTERN.test((value as string).trim())) {
    return 'Enter a valid email address';
  }

  if (question.id === 'phone' && !phoneLooksValid(value as string)) {
    return 'Enter a valid mobile / WhatsApp number';
  }

  return null;
}

export function validateClubApplication(
  answers: ClubApplicationAnswers
): FormErrors<ClubApplicationAnswers> {
  const errors: FormErrors<ClubApplicationAnswers> = {};

  for (const question of CLUB_QUESTIONS) {
    const error = validateClubQuestion(question, answers);
    if (error) errors[question.id] = error;
  }

  requireField(errors, 'consent', answers.consent, 'Please confirm this to submit your application');

  return errors;
}

// ─── Server schema ────────────────────────────────────────────────────────────
// Re-validates everything the browser checked. The caps on travelFor and
// meetPreferences are enforced here as well as in the UI — a curl ignores the UI.

const shortText = z.string().trim().min(1).max(200);
const optionalShortText = z.string().trim().max(200).optional().default('');
const longText = z.string().trim().min(1).max(2000);

const valuesOf = (options: InquiryOption[]) => options.map((o) => o.value) as [string, ...string[]];

const oneOf = (options: InquiryOption[]) => z.enum(valuesOf(options));

const someOf = (options: InquiryOption[], max?: number) => {
  const base = z.array(z.enum(valuesOf(options))).min(1);
  return max ? base.max(max) : base;
};

export const clubApplicationSchema = z.object({
  fullName: shortText,
  ageBand: oneOf(AGE_BAND_OPTIONS),
  city: shortText,
  work: shortText,
  instagram: optionalShortText,
  linkedin: optionalShortText,
  curiousAbout: longText,
  travelFor: someOf(TRAVEL_FOR_OPTIONS, TRAVEL_FOR_MAX),
  sixHours: longText,
  travelStyle: oneOf(TRAVEL_STYLE_OPTIONS),
  meetPreferences: someOf(MEET_PREFERENCE_OPTIONS, MEET_PREFERENCE_MAX),
  experiences: someOf(EXPERIENCE_OPTIONS),
  holidayBudget: oneOf(HOLIDAY_BUDGET_OPTIONS),
  bookTomorrow: longText,
  bringToCommunity: longText,
  whyInvite: longText,
  discoverySource: oneOf(DISCOVERY_SOURCE_OPTIONS),
  phone: z.string().trim().min(8).max(30).refine(phoneLooksValid, 'Enter a valid number'),
  email: z.string().trim().email().max(254),
  // Literal true, not boolean: the consent is the whole legal basis for the
  // Instagram/LinkedIn review, so "false" must fail rather than store as false.
  consent: z.literal(true),
  // Which trip page sent them here, if any. Free-form and short — it is a
  // breadcrumb for the admin, never used to look anything up.
  trip: z.string().trim().max(80).optional().default(''),
});

export type ClubApplicationInput = z.infer<typeof clubApplicationSchema>;

/** Normalises an Instagram answer into a URL, or null if it isn't usable. */
export function instagramUrl(value: string | null | undefined): string | null {
  const raw = (value ?? '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, '').replace(/^instagram\.com\//i, '').split(/[/?]/)[0];
  return handle ? `https://instagram.com/${handle}` : null;
}

/** Normalises a LinkedIn answer into a URL, or null if it isn't usable. */
export function linkedinUrl(value: string | null | undefined): string | null {
  const raw = (value ?? '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^(www\.)?linkedin\.com\//i.test(raw)) return `https://${raw.replace(/^www\./i, '')}`;
  const handle = raw.replace(/^@/, '').split(/[/?]/)[0];
  return handle ? `https://linkedin.com/in/${handle}` : null;
}
