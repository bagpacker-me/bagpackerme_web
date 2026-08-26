'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, Loader2, MessageCircle } from 'lucide-react';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';
import {
  CLUB_QUESTIONS,
  CLUB_TOTAL_QUESTIONS,
  earliestAllowedDob,
  initialClubAnswers,
  latestAllowedDob,
  validateClubApplication,
  validateClubQuestion,
  type ClubApplicationAnswers,
  type ClubQuestion,
} from '@/lib/club-application';
import {
  QUIZ_CHOICES,
  personalityType,
  pickQuizQuestions,
  type PersonalityType,
  type QuizAnswer,
  type QuizChoice,
  type QuizQuestion,
} from '@/lib/personality-quiz';

// One question per screen. The profile half (CLUB_QUESTIONS) runs first, then
// six of the ten vibe-match questions, picked at random per applicant. Answers
// stay in React state until the final submit — nothing is written anywhere
// until someone actually finishes.

type Step =
  | { kind: 'profile'; question: ClubQuestion }
  | { kind: 'quiz'; question: QuizQuestion };

// A…D for the vibe match, A…E for the longest profile choice list, so a
// keyboard user can pick an option without leaving the home row.
const OPTION_KEYS = 'ABCDEFGHIJ'.split('');

// ─── Option button ───────────────────────────────────────────────────────────

function OptionButton({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-[14px] rounded-[14px] border px-[18px] py-[15px] text-left transition-all duration-200',
        selected
          ? 'border-lime bg-lime/15 text-white'
          : 'border-white/15 bg-white/[0.04] text-white/85 hover:border-lime/50 hover:bg-white/[0.07]'
      )}
    >
      <span
        className={cn(
          'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border font-display text-[11px] font-bold transition-colors',
          selected ? 'border-lime bg-lime text-void' : 'border-white/25 text-white/55'
        )}
        aria-hidden="true"
      >
        {selected ? <Check className="h-[14px] w-[14px]" strokeWidth={3} /> : hint}
      </span>
      <span className="font-body text-[15px] leading-snug">{label}</span>
    </button>
  );
}

// ─── Reveal ──────────────────────────────────────────────────────────────────

function PersonalityReveal({ type, firstName }: { type: PersonalityType; firstName: string }) {
  const { whatsappNumber } = useSiteSettings();

  const message = encodeURIComponent(
    `Hi! I just applied to The Curious Club${firstName ? ` — I’m ${firstName}` : ''}. ` +
      `My traveller type came out as ${type.name}. I’d love to schedule a call.`
  );

  return (
    <main className="bg-void">
      <div className="mx-auto flex min-h-[78svh] max-w-[680px] flex-col justify-center px-[24px] pb-[80px] pt-[124px] md:px-[40px]">
        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-lime">
          Application received — your traveller type
        </p>

        <h1 className="mt-[16px] font-display text-[clamp(34px,7vw,60px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-white">
          {type.name}
        </h1>

        <p className="mt-[18px] font-accent text-[clamp(20px,3.4vw,26px)] italic leading-snug text-lime">
          {type.tagline}
        </p>

        {/* The film only appears once a path is set in lib/personality-quiz.ts.
            Until then the card carries the reveal on its own rather than
            leaving a broken player on the page. */}
        {type.video && (
          <div className="mt-[32px] overflow-hidden rounded-[20px] border border-white/12 bg-white/[0.03]">
            <video
              key={type.video}
              className="aspect-video w-full"
              src={type.video}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
            />
          </div>
        )}

        <p className="mt-[28px] font-body text-[16px] leading-relaxed text-white/70">{type.blurb}</p>

        <div className="mt-[36px] rounded-[20px] border border-white/12 bg-white/[0.035] p-[24px] md:p-[28px]">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-white/45">
            What happens next
          </p>
          <p className="mt-[14px] font-body text-[15px] leading-relaxed text-white/70">
            We review every application individually. If it feels like a fit, you’ll receive your
            invitation directly — or skip the queue and talk to us now.
          </p>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-[22px] inline-flex w-fit items-center gap-[10px] rounded-full bg-lime px-[28px] py-[15px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Schedule a call
          </a>
        </div>

        <p className="mt-[36px] font-display text-[11px] font-bold uppercase tracking-widest text-white/45">
          The Curious Club
        </p>
        <p className="mt-[8px] font-body text-[13px] text-white/35">
          Powered by <span className="text-lime">BagpackerMe</span>
        </p>

        <Link
          href="/curious-club"
          className="mt-[36px] inline-flex w-fit items-center gap-[8px] font-display text-[12px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-lime"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the club
        </Link>
      </div>
    </main>
  );
}

// ─── Flow ────────────────────────────────────────────────────────────────────

export default function ClubApplicationFlow() {
  const searchParams = useSearchParams();
  const trip = searchParams.get('trip') ?? '';

  const honeypotRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const controlRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const [steps, setSteps] = useState<Step[] | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ClubApplicationAnswers>(initialClubAnswers);
  const [quiz, setQuiz] = useState<Record<string, QuizChoice>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ personality: PersonalityType | null } | null>(null);

  const current = steps?.[step];
  const isLast = Boolean(steps) && step === (steps?.length ?? 0) - 1;
  const progress = Math.round(((step + (result ? 1 : 0)) / CLUB_TOTAL_QUESTIONS) * 100);

  // Date bounds are computed once per mount rather than inline, so the input
  // does not get a fresh `max` string on every keystroke.
  const dobBounds = useMemo(
    () => ({ min: earliestAllowedDob(), max: latestAllowedDob() }),
    []
  );

  // The random six are drawn here, in a click handler — drawing them during
  // render would make the server and client HTML disagree and break hydration.
  const start = useCallback(() => {
    const quizSteps: Step[] = pickQuizQuestions().map((question) => ({ kind: 'quiz', question }));
    setSteps([...CLUB_QUESTIONS.map((question) => ({ kind: 'profile' as const, question })), ...quizSteps]);
    setStep(0);
  }, []);

  // Move focus to the new question so a screen reader announces it, and put the
  // caret in the text control so typing just works.
  useEffect(() => {
    if (!steps || result) return;
    const control = controlRef.current;
    if (control) {
      control.focus();
      return;
    }
    headingRef.current?.focus();
  }, [step, steps, result]);

  useEffect(() => {
    setError(null);
  }, [step]);

  const setAnswer = useCallback(
    <K extends keyof ClubApplicationAnswers>(key: K, value: ClubApplicationAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  /** The six answers in the order they were served — scoring reads that order. */
  const quizAnswersFrom = useCallback(
    (list: Step[], picked: Record<string, QuizChoice>): QuizAnswer[] =>
      list
        .filter((entry): entry is Extract<Step, { kind: 'quiz' }> => entry.kind === 'quiz')
        .filter((entry) => picked[entry.question.id])
        .map((entry) => ({ questionId: entry.question.id, choice: picked[entry.question.id] })),
    []
  );

  const submit = useCallback(
    async (finalAnswers: ClubApplicationAnswers, picked: Record<string, QuizChoice>) => {
      if (!steps) return;

      const quizAnswers = quizAnswersFrom(steps, picked);
      const errors = validateClubApplication(finalAnswers, quizAnswers);

      const firstBad = steps.findIndex((entry) =>
        entry.kind === 'profile'
          ? Boolean(errors[entry.question.id])
          : !picked[entry.question.id]
      );

      if (firstBad !== -1) {
        // Shouldn't happen — every step validates on the way through — but if a
        // question somehow slipped past, land on it rather than failing blankly.
        const bad = steps[firstBad];
        setStep(firstBad);
        setError(
          bad.kind === 'profile'
            ? errors[bad.question.id] ?? 'Please check this answer.'
            : 'Pick one to continue'
        );
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch('/api/curious-club/apply', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...finalAnswers,
            quizAnswers,
            trip,
            [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.error || 'Something went wrong. Please try again.');
        }

        // The type is whatever the server scored, not what the browser guessed.
        setResult({ personality: personalityType(payload?.personality) });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [quizAnswersFrom, steps, trip]
  );

  const goNext = useCallback(() => {
    if (!current) return;

    if (current.kind === 'profile') {
      const problem = validateClubQuestion(current.question, answers);
      if (problem) {
        setError(problem);
        // Send focus back to the answer, not the button that just refused.
        (controlRef.current ?? headingRef.current)?.focus();
        return;
      }
    } else if (!quiz[current.question.id]) {
      setError('Pick one to continue');
      headingRef.current?.focus();
      return;
    }

    if (isLast) {
      void submit(answers, quiz);
      return;
    }

    setStep((prev) => prev + 1);
  }, [answers, current, isLast, quiz, submit]);

  const chooseQuiz = useCallback((questionId: string, choice: QuizChoice) => {
    setQuiz((prev) => ({ ...prev, [questionId]: choice }));
    setError(null);
  }, []);

  // Letter shortcuts for choice questions, and Enter to advance everywhere.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (submitting) return;

      const target = event.target as HTMLElement;

      if (event.key === 'Enter') {
        event.preventDefault();
        goNext();
        return;
      }

      if (!current || target.tagName === 'INPUT' || target.tagName === 'SELECT') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const index = OPTION_KEYS.indexOf(event.key.toUpperCase());
      if (index === -1) return;

      if (current.kind === 'quiz') {
        const choice = QUIZ_CHOICES[index];
        if (!choice) return;
        event.preventDefault();
        chooseQuiz(current.question.id, choice);
        return;
      }

      const question = current.question;
      if (question.type !== 'single-choice') return;
      const chosen = question.options[index];
      if (!chosen) return;

      event.preventDefault();
      setAnswer(question.id, chosen.value);
    },
    [chooseQuiz, current, goNext, setAnswer, submitting]
  );

  // ── Reveal ────────────────────────────────────────────────────────────────
  if (result) {
    const firstName = answers.fullName.trim().split(/\s+/)[0] ?? '';

    // personality is null only if the API answered without one (the honeypot
    // path does). Show the plain receipt rather than an empty reveal.
    if (!result.personality) {
      return (
        <main className="bg-void">
          <div className="mx-auto flex min-h-[78svh] max-w-[680px] flex-col justify-center px-[24px] pb-[80px] pt-[124px] md:px-[40px]">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-lime">
              <Check className="h-7 w-7 text-void" strokeWidth={3} aria-hidden="true" />
            </div>
            <h1 className="mt-[28px] font-display text-[clamp(30px,6vw,48px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white">
              Application received.
            </h1>
            <p className="mt-[24px] font-body text-[16px] leading-relaxed text-white/70">
              We review every application individually. If it feels like a fit, you’ll receive your
              invitation directly.
            </p>
            <p className="mt-[32px] font-accent text-[26px] italic text-lime">Until then — stay curious.</p>
            <Link
              href="/curious-club"
              className="mt-[36px] inline-flex w-fit items-center gap-[8px] font-display text-[12px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-lime"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the club
            </Link>
          </div>
        </main>
      );
    }

    return <PersonalityReveal type={result.personality} firstName={firstName} />;
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (!steps) {
    return (
      <main className="bg-void">
        <div className="mx-auto flex min-h-[78svh] max-w-[680px] flex-col justify-center px-[24px] pb-[80px] pt-[124px] md:px-[40px]">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-lime">
            The Curious Club
          </p>

          <h1 className="mt-[16px] font-display text-[clamp(30px,6vw,50px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white">
            Membership application
          </h1>

          <p className="mt-[28px] font-body text-[17px] leading-relaxed text-white/75">
            This isn’t a mailing list.
          </p>
          <p className="mt-[12px] font-body text-[17px] leading-relaxed text-white/75">
            It’s an application to join a curated community of curious people, travellers and
            explorers — plus a short vibe match that tells you what kind of traveller you are.
          </p>

          <p className="mt-[24px] font-body text-[15px] text-white/50">It takes under a minute.</p>

          <button
            type="button"
            onClick={start}
            className="group mt-[36px] inline-flex w-fit items-center gap-[10px] rounded-full bg-lime px-[32px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            Start application
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>

          <p className="mt-[20px] font-body text-[13px] text-white/35">
            {CLUB_TOTAL_QUESTIONS} questions, one at a time.
          </p>
        </div>
      </main>
    );
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  const profileQuestion = current?.kind === 'profile' ? current.question : null;
  const quizQuestion = current?.kind === 'quiz' ? current.question : null;

  return (
    <main className="bg-void">
      {/* Progress */}
      <div className="sticky top-0 z-10 h-[3px] w-full bg-white/10">
        <div
          className="h-full bg-lime transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={CLUB_TOTAL_QUESTIONS}
          aria-label="Application progress"
        />
      </div>

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions --
          the handler is a keyboard *shortcut* layer over already-focusable
          controls, not the only way to answer anything. */}
      <div
        onKeyDown={handleKeyDown}
        // pt clears the floating navbar: a long choice question overflows the
        // centred box and starts at the top, where it would sit under the pill.
        className="mx-auto flex min-h-[78svh] max-w-[680px] flex-col justify-center px-[24px] pb-[72px] pt-[124px] md:px-[40px] md:pt-[140px]"
      >
        <HoneypotField inputRef={honeypotRef} />

        <p className="font-display text-[12px] font-bold uppercase tracking-widest text-lime">
          {quizQuestion ? 'Vibe match · ' : ''}
          {step + 1}
          <span className="text-white/30"> / {steps.length}</span>
        </p>

        <h2
          ref={headingRef}
          tabIndex={-1}
          // Focused programmatically so a screen reader announces the new
          // question. The ring is suppressed because nothing here is
          // interactive — a box around the heading only reads as a glitch.
          className="mt-[14px] font-display text-[clamp(22px,4.2vw,32px)] font-bold leading-[1.25] text-white outline-none focus:outline-none focus-visible:outline-none"
        >
          {current?.question.prompt}
        </h2>

        {profileQuestion?.help && (
          <p className="mt-[14px] font-body text-[14px] leading-relaxed text-white/50">
            {profileQuestion.help}
          </p>
        )}

        <div className="mt-[32px]">
          {profileQuestion?.type === 'short-text' && (
            <input
              ref={controlRef as React.RefObject<HTMLInputElement>}
              type={
                profileQuestion.inputMode === 'email'
                  ? 'email'
                  : profileQuestion.inputMode === 'tel'
                    ? 'tel'
                    : 'text'
              }
              inputMode={profileQuestion.inputMode === 'tel' ? 'tel' : undefined}
              autoComplete={
                profileQuestion.id === 'fullName'
                  ? 'name'
                  : profileQuestion.id === 'email'
                    ? 'email'
                    : profileQuestion.id === 'phone'
                      ? 'tel'
                      : 'off'
              }
              value={answers[profileQuestion.id]}
              onChange={(event) => setAnswer(profileQuestion.id, event.target.value)}
              placeholder={profileQuestion.placeholder}
              aria-invalid={Boolean(error)}
              className="w-full border-0 border-b border-white/25 bg-transparent pb-[12px] font-display text-[clamp(20px,3.6vw,28px)] text-white placeholder-white/25 outline-none transition-colors focus:border-lime"
            />
          )}

          {profileQuestion?.type === 'date' && (
            <input
              ref={controlRef as React.RefObject<HTMLInputElement>}
              type="date"
              autoComplete="bday"
              min={dobBounds.min}
              max={dobBounds.max}
              value={answers.dateOfBirth}
              onChange={(event) => setAnswer('dateOfBirth', event.target.value)}
              aria-invalid={Boolean(error)}
              // color-scheme:dark keeps the native picker glyph visible on the
              // void background; without it Safari draws a black-on-black icon.
              style={{ colorScheme: 'dark' }}
              className="w-full border-0 border-b border-white/25 bg-transparent pb-[12px] font-display text-[clamp(20px,3.6vw,28px)] text-white outline-none transition-colors focus:border-lime"
            />
          )}

          {profileQuestion?.type === 'dropdown' && (
            <select
              ref={controlRef as React.RefObject<HTMLSelectElement>}
              value={answers[profileQuestion.id]}
              onChange={(event) => setAnswer(profileQuestion.id, event.target.value)}
              aria-invalid={Boolean(error)}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-[14px] border border-white/25 bg-white/[0.04] px-[18px] py-[16px] font-display text-[clamp(18px,3vw,24px)] text-white outline-none transition-colors focus:border-lime"
            >
              <option value="" disabled>
                {profileQuestion.placeholder ?? 'Select one'}
              </option>
              {profileQuestion.options.map((choice) => (
                <option key={choice.value} value={choice.value} className="bg-void text-white">
                  {choice.label}
                </option>
              ))}
            </select>
          )}

          {profileQuestion?.type === 'single-choice' && (
            <ul className="grid gap-[10px] sm:grid-cols-2">
              {profileQuestion.options.map((choice, index) => (
                <li key={choice.value}>
                  <OptionButton
                    label={choice.label}
                    hint={OPTION_KEYS[index] ?? '•'}
                    selected={answers[profileQuestion.id] === choice.value}
                    onClick={() => setAnswer(profileQuestion.id, choice.value)}
                  />
                </li>
              ))}
            </ul>
          )}

          {quizQuestion && (
            // One column: the vibe-match options are full sentences, and two
            // columns of them wrap into an unreadable brick on a laptop.
            <ul className="grid gap-[10px]">
              {QUIZ_CHOICES.map((letter) => (
                <li key={letter}>
                  <OptionButton
                    label={quizQuestion.options[letter]}
                    hint={letter}
                    selected={quiz[quizQuestion.id] === letter}
                    onClick={() => chooseQuiz(quizQuestion.id, letter)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-[20px] font-body text-[14px] text-[#ff9a8b]">
            {error}
          </p>
        )}

        {/* Controls */}
        <div className="mt-[36px] flex flex-wrap items-center gap-[16px]">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="inline-flex items-center gap-[8px] rounded-full border border-white/20 px-[20px] py-[13px] font-display text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="group inline-flex items-center gap-[10px] rounded-full bg-lime px-[30px] py-[15px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {submitting ? 'Sending…' : isLast ? 'Reveal my traveller type' : 'Next'}
            {!submitting && (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            )}
          </button>

          <p className="hidden items-center gap-[6px] font-body text-[12px] text-white/35 sm:flex">
            press
            <kbd className="rounded-[5px] border border-white/20 px-[6px] py-[2px] font-display text-[10px] text-white/60">
              <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
            </kbd>
            to continue
          </p>
        </div>

        {isLast && (
          <p className="mt-[24px] font-body text-[12px] leading-relaxed text-white/35">
            By submitting you agree to us contacting you about The Curious Club. See our{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white/60">
              privacy policy
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
}
