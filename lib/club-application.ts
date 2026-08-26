import { z } from 'zod';
import {
  EMAIL_PATTERN,
  hasValue,
  phoneLooksValid,
  type FormErrors,
} from '@/lib/form-validation';
import type { InquiryOption } from '@/lib/inquiry-form';
import {
  QUIZ_QUESTION_COUNT,
  QUIZ_QUESTION_IDS,
  scorePersonality,
  type QuizAnswer,
} from '@/lib/personality-quiz';
import type { ClubApplicationStatus } from '@/types';

// The Curious Club membership application.
//
// Two halves: seven profile questions defined here, then a random six of the
// ten questions in lib/personality-quiz.ts. This file stays the one source of
// truth for the profile half — the public flow renders from CLUB_QUESTIONS, the
// client validator walks it, the server schema re-derives its shape from it,
// and the admin panel labels answers from it.

export type ClubQuestionId =
  | 'fullName'
  | 'dateOfBirth'
  | 'gender'
  | 'city'
  | 'phone'
  | 'email'
  | 'discoverySource';

export interface ClubApplicationAnswers {
  fullName: string;
  /** ISO yyyy-mm-dd, straight off a native date input. */
  dateOfBirth: string;
  gender: string;
  city: string;
  phone: string;
  email: string;
  discoverySource: string;
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
  | (ClubQuestionBase & { type: 'date' })
  | (ClubQuestionBase & { type: 'single-choice'; options: InquiryOption[] })
  | (ClubQuestionBase & { type: 'dropdown'; options: InquiryOption[] });

const option = (label: string): InquiryOption => ({ label, value: label });

// Every option, per the brief. "Prefer not to say" is a real answer, not a
// dropout — it stores as itself rather than as an empty field.
export const GENDER_OPTIONS: InquiryOption[] = [
  'Male',
  'Female',
  'Non-binary',
  'Other',
  'Prefer not to say',
].map(option);

// The fifteen cities the club actually draws from, plus a way out for everyone
// else. Edit this list freely — it is only ever compared against itself.
export const CITY_OPTIONS: InquiryOption[] = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
  'Indore',
  'Kochi',
  'Goa',
  'Surat',
  'Other',
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

/** Nobody under this age can join. Enforced on both sides of the wire. */
export const MIN_AGE = 18;
const MAX_AGE = 100;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Whole years between `dob` and `today`, or null if the date is unusable. */
export function ageFromDob(dob: string, today = new Date()): number | null {
  if (!ISO_DATE.test(dob)) return null;

  const [year, month, day] = dob.split('-').map(Number);
  // Round-trip through UTC to catch 2026-02-30 and friends, which Date happily
  // rolls forward into March rather than rejecting.
  const born = new Date(Date.UTC(year, month - 1, day));
  if (
    born.getUTCFullYear() !== year ||
    born.getUTCMonth() !== month - 1 ||
    born.getUTCDate() !== day
  ) {
    return null;
  }

  let age = today.getFullYear() - year;
  const hasHadBirthday =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);
  if (!hasHadBirthday) age -= 1;

  return age;
}

function dobProblem(dob: string): string | null {
  const age = ageFromDob(dob);
  if (age === null) return 'Enter your date of birth as a real date';
  if (age < MIN_AGE) return `You need to be ${MIN_AGE} or over to join`;
  if (age > MAX_AGE) return 'Please check the year';
  return null;
}

// Formatted from the local calendar fields, not toISOString(). A local-midnight
// Date serialises to the *previous* day anywhere east of UTC, which in IST made
// `max` land one day early and locked an applicant out on their 18th birthday.
function localIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `max` for the native date input, so the picker cannot offer under-18 dates. */
export function latestAllowedDob(today = new Date()): string {
  return localIsoDate(new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate()));
}

export function earliestAllowedDob(today = new Date()): string {
  return localIsoDate(new Date(today.getFullYear() - MAX_AGE, today.getMonth(), today.getDate()));
}

// Order matters — this is the order applicants see. Contact details sit last:
// the name and the quiz are the interesting part, and a phone number asked up
// front reads like a sales form.
export const CLUB_QUESTIONS: ClubQuestion[] = [
  {
    id: 'fullName',
    type: 'short-text',
    prompt: 'What’s your name?',
    placeholder: 'Priya Nair',
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    prompt: 'When were you born?',
    help: 'The club is 18+.',
  },
  {
    id: 'gender',
    type: 'single-choice',
    prompt: 'How do you identify?',
    options: GENDER_OPTIONS,
  },
  {
    id: 'city',
    type: 'dropdown',
    prompt: 'Where are you based?',
    placeholder: 'Select your city',
    options: CITY_OPTIONS,
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
  {
    id: 'discoverySource',
    type: 'single-choice',
    prompt: 'How did you find The Curious Club?',
    options: DISCOVERY_SOURCE_OPTIONS,
  },
];

/** Total screens an applicant answers: the profile half plus the quiz half. */
export const CLUB_TOTAL_QUESTIONS = CLUB_QUESTIONS.length + QUIZ_QUESTION_COUNT;

// Labels for the admin panel and the CSV export, in question order.
export const CLUB_QUESTION_LABELS: Record<ClubQuestionId, string> = {
  fullName: 'Full name',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  city: 'City',
  phone: 'Phone / WhatsApp',
  email: 'Email',
  discoverySource: 'Found us via',
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
  dateOfBirth: '',
  gender: '',
  city: '',
  phone: '',
  email: '',
  discoverySource: '',
};

function missingMessage(question: ClubQuestion) {
  switch (question.type) {
    case 'single-choice':
      return 'Pick one to continue';
    case 'dropdown':
      return 'Choose your city to continue';
    case 'date':
      return 'We need your date of birth';
    default:
      return 'This one is required';
  }
}

/** Validates a single profile question. Returns null when the answer is fine. */
export function validateClubQuestion(
  question: ClubQuestion,
  answers: ClubApplicationAnswers
): string | null {
  const value = answers[question.id];

  if (!hasValue(value)) {
    return question.optional ? null : missingMessage(question);
  }

  if (question.id === 'dateOfBirth') {
    return dobProblem(value.trim());
  }

  if (question.id === 'email' && !EMAIL_PATTERN.test(value.trim())) {
    return 'Enter a valid email address';
  }

  if (question.id === 'phone' && !phoneLooksValid(value)) {
    return 'Enter a valid mobile / WhatsApp number';
  }

  return null;
}

export function validateClubApplication(
  answers: ClubApplicationAnswers,
  quizAnswers: QuizAnswer[]
): FormErrors<ClubApplicationAnswers> & { quizAnswers?: string } {
  const errors: FormErrors<ClubApplicationAnswers> & { quizAnswers?: string } = {};

  for (const question of CLUB_QUESTIONS) {
    const error = validateClubQuestion(question, answers);
    if (error) errors[question.id] = error;
  }

  if (quizAnswers.length !== QUIZ_QUESTION_COUNT) {
    errors.quizAnswers = 'Please answer every question in the vibe match.';
  }

  return errors;
}

// ─── Server schema ────────────────────────────────────────────────────────────
// Re-validates everything the browser checked. A curl ignores the UI, so the
// 18+ cut-off and the "exactly six distinct quiz questions" rule are enforced
// here as well as on the client.

const shortText = z.string().trim().min(1).max(200);

const valuesOf = (options: InquiryOption[]) => options.map((o) => o.value) as [string, ...string[]];

const oneOf = (options: InquiryOption[]) => z.enum(valuesOf(options));

export const clubApplicationSchema = z.object({
  fullName: shortText,
  dateOfBirth: z
    .string()
    .trim()
    .refine((value) => dobProblem(value) === null, `Must be a real date, ${MIN_AGE}+`),
  gender: oneOf(GENDER_OPTIONS),
  city: oneOf(CITY_OPTIONS),
  phone: z.string().trim().min(8).max(30).refine(phoneLooksValid, 'Enter a valid number'),
  email: z.string().trim().email().max(254),
  discoverySource: oneOf(DISCOVERY_SOURCE_OPTIONS),
  // Six of the ten, chosen at random per applicant — so the set varies but the
  // count and the ids do not. Duplicates are rejected: six copies of one answer
  // would otherwise score a personality type off a single click.
  quizAnswers: z
    .array(
      z.object({
        questionId: z.enum(QUIZ_QUESTION_IDS),
        choice: z.enum(['A', 'B', 'C', 'D']),
      })
    )
    .length(QUIZ_QUESTION_COUNT)
    .refine(
      (answers) => new Set(answers.map((a) => a.questionId)).size === answers.length,
      'Each question may be answered once'
    ),
  // Which trip page sent them here, if any. Free-form and short — it is a
  // breadcrumb for the admin, never used to look anything up.
  trip: z.string().trim().max(80).optional().default(''),
});

export type ClubApplicationInput = z.infer<typeof clubApplicationSchema>;

/** The personality type a submitted application scores. Server-side authority. */
export function personalityFor(input: Pick<ClubApplicationInput, 'quizAnswers'>) {
  return scorePersonality(input.quizAnswers as QuizAnswer[]);
}
