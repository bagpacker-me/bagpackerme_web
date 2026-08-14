'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, Loader2 } from 'lucide-react';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { cn } from '@/lib/utils';
import {
  CLUB_QUESTIONS,
  CONSENT_TEXT,
  initialClubAnswers,
  validateClubApplication,
  validateClubQuestion,
  type ClubApplicationAnswers,
  type ClubQuestion,
} from '@/lib/club-application';

// One question per screen. Steps run: 0…n-1 questions, then the consent step,
// then the received screen. Answers stay in React state until the final submit —
// nothing is written anywhere until someone actually finishes.

const CONSENT_STEP = CLUB_QUESTIONS.length;
const TOTAL_STEPS = CLUB_QUESTIONS.length + 1;

// A…R, so a keyboard user can pick an option without leaving the home row.
const OPTION_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');

function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);
  return isMac;
}

// ─── Option button ───────────────────────────────────────────────────────────

function OptionButton({
  label,
  hint,
  selected,
  multi,
  disabled,
  onClick,
}: {
  label: string;
  hint: string;
  selected: boolean;
  multi: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multi ? selected : undefined}
      // Not `disabled`: a capped-out option still has to be reachable so it can
      // be read, and clicking it should explain rather than do nothing at all.
      className={cn(
        'group flex w-full items-center gap-[14px] rounded-[14px] border px-[18px] py-[15px] text-left transition-all duration-200',
        selected
          ? 'border-lime bg-lime/15 text-white'
          : disabled
            ? 'border-white/10 bg-white/[0.02] text-white/35'
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

// ─── Flow ────────────────────────────────────────────────────────────────────

export default function ClubApplicationFlow() {
  const searchParams = useSearchParams();
  const trip = searchParams.get('trip') ?? '';
  const isMac = useIsMac();

  const honeypotRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const controlRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ClubApplicationAnswers>(initialClubAnswers);
  const [error, setError] = useState<string | null>(null);
  const [capNotice, setCapNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question: ClubQuestion | undefined = CLUB_QUESTIONS[step];
  const onConsentStep = step === CONSENT_STEP;
  const progress = Math.round(((step + (submitted ? 1 : 0)) / TOTAL_STEPS) * 100);

  // Move focus to the new question so a screen reader announces it, and put the
  // caret in the text control so typing just works.
  useEffect(() => {
    if (!started || submitted) return;
    const control = controlRef.current;
    if (control) {
      control.focus();
      return;
    }
    headingRef.current?.focus();
  }, [step, started, submitted]);

  useEffect(() => {
    setError(null);
    setCapNotice(null);
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

  const submit = useCallback(
    async (finalAnswers: ClubApplicationAnswers) => {
      const errors = validateClubApplication(finalAnswers);
      const firstBadIndex = CLUB_QUESTIONS.findIndex((q) => errors[q.id]);

      if (firstBadIndex !== -1) {
        // Shouldn't happen — every step validates on the way through — but if a
        // question somehow slipped past, land on it rather than failing blankly.
        setStep(firstBadIndex);
        setError(errors[CLUB_QUESTIONS[firstBadIndex].id] ?? 'Please check this answer.');
        return;
      }

      if (errors.consent) {
        setError(errors.consent);
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
            trip,
            [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.error || 'Something went wrong. Please try again.');
        }

        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [trip]
  );

  const goNext = useCallback(() => {
    if (onConsentStep) {
      void submit(answers);
      return;
    }

    if (!question) return;

    const problem = validateClubQuestion(question, answers);
    if (problem) {
      setError(problem);
      // Send focus back to the answer, not the button that just refused. Without
      // this a keyboard user is left on "Next" with no obvious way back to the
      // field they still have to fill in.
      (controlRef.current ?? headingRef.current)?.focus();
      return;
    }

    setStep((prev) => prev + 1);
  }, [answers, onConsentStep, question, submit]);

  const toggleMulti = useCallback(
    (value: string, max: number | undefined, key: keyof ClubApplicationAnswers) => {
      setAnswers((prev) => {
        const current = prev[key] as string[];
        const isSelected = current.includes(value);

        if (!isSelected && max && current.length >= max) {
          setCapNotice(`That’s ${max} already — unpick one to swap it out.`);
          return prev;
        }

        setCapNotice(null);
        setError(null);
        return {
          ...prev,
          [key]: isSelected ? current.filter((item) => item !== value) : [...current, value],
        };
      });
    },
    []
  );

  // Letter shortcuts for choice questions, and Enter to advance everywhere.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (submitting) return;

      const target = event.target as HTMLElement;
      const inTextarea = target.tagName === 'TEXTAREA';

      if (event.key === 'Enter') {
        // In a textarea Enter is a newline; Cmd/Ctrl+Enter is "done".
        if (inTextarea && !(event.metaKey || event.ctrlKey)) return;
        event.preventDefault();
        goNext();
        return;
      }

      if (!question || target.tagName === 'INPUT' || inTextarea) return;
      if (question.type !== 'single-choice' && question.type !== 'multi-choice') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const index = OPTION_KEYS.indexOf(event.key.toUpperCase());
      const chosen = index === -1 ? undefined : question.options[index];
      if (!chosen) return;

      event.preventDefault();

      if (question.type === 'single-choice') {
        setAnswer(question.id, chosen.value);
        return;
      }

      toggleMulti(chosen.value, question.max, question.id);
    },
    [goNext, question, setAnswer, submitting, toggleMulti]
  );

  const selectedCount = useMemo(() => {
    if (!question || question.type !== 'multi-choice') return 0;
    return (answers[question.id] as string[]).length;
  }, [answers, question]);

  // ── Received ──────────────────────────────────────────────────────────────
  if (submitted) {
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
            We review every application individually.
          </p>
          <p className="mt-[12px] font-body text-[16px] leading-relaxed text-white/70">
            If it feels like a fit, you’ll receive your invitation directly.
          </p>

          <p className="mt-[32px] font-accent text-[26px] italic text-lime">Until then — stay curious.</p>

          <p className="mt-[40px] font-display text-[11px] font-bold uppercase tracking-widest text-white/45">
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

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (!started) {
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
            explorers.
          </p>

          <p className="mt-[24px] font-body text-[15px] text-white/50">It should take about 2–3 minutes.</p>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group mt-[36px] inline-flex w-fit items-center gap-[10px] rounded-full bg-lime px-[32px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            Start application
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>

          <p className="mt-[20px] font-body text-[13px] text-white/35">
            {CLUB_QUESTIONS.length} questions, one at a time.
          </p>
        </div>
      </main>
    );
  }

  // ── Questions ─────────────────────────────────────────────────────────────
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
          aria-valuemax={TOTAL_STEPS}
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

        {onConsentStep ? (
          <>
            <p className="font-display text-[12px] font-bold uppercase tracking-widest text-lime">
              Last step
            </p>

            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-[14px] font-display text-[clamp(22px,4.2vw,32px)] font-bold leading-[1.2] text-white outline-none focus:outline-none focus-visible:outline-none"
            >
              Before you send it in
            </h2>

            <label className="mt-[28px] flex cursor-pointer items-start gap-[14px] rounded-[16px] border border-white/15 bg-white/[0.04] p-[20px] transition-colors hover:border-lime/40">
              <input
                type="checkbox"
                checked={answers.consent}
                onChange={(event) => setAnswer('consent', event.target.checked)}
                className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-lime"
              />
              <span className="font-body text-[14px] leading-relaxed text-white/75">{CONSENT_TEXT}</span>
            </label>
          </>
        ) : question ? (
          <>
            <p className="font-display text-[12px] font-bold uppercase tracking-widest text-lime">
              {step + 1}
              <span className="text-white/30"> / {CLUB_QUESTIONS.length}</span>
            </p>

            <h2
              ref={headingRef}
              tabIndex={-1}
              // Focused programmatically so a screen reader announces the new
              // question. The ring is suppressed because nothing here is
              // interactive — a box around the heading only reads as a glitch.
              className="mt-[14px] font-display text-[clamp(22px,4.2vw,32px)] font-bold leading-[1.25] text-white outline-none focus:outline-none focus-visible:outline-none"
            >
              {question.prompt}
              {question.optional && <span className="ml-[10px] font-body text-[14px] font-normal text-white/40">Optional</span>}
            </h2>

            {question.help && (
              <p className="mt-[14px] font-body text-[14px] leading-relaxed text-white/50">{question.help}</p>
            )}

            <div className="mt-[32px]">
              {question.type === 'short-text' && (
                <input
                  ref={controlRef as React.RefObject<HTMLInputElement>}
                  type={question.inputMode === 'email' ? 'email' : question.inputMode === 'tel' ? 'tel' : 'text'}
                  inputMode={question.inputMode === 'tel' ? 'tel' : undefined}
                  autoComplete={
                    question.id === 'fullName'
                      ? 'name'
                      : question.id === 'email'
                        ? 'email'
                        : question.id === 'phone'
                          ? 'tel'
                          : 'off'
                  }
                  value={answers[question.id] as string}
                  onChange={(event) => setAnswer(question.id, event.target.value)}
                  placeholder={question.placeholder}
                  aria-invalid={Boolean(error)}
                  className="w-full border-0 border-b border-white/25 bg-transparent pb-[12px] font-display text-[clamp(20px,3.6vw,28px)] text-white placeholder-white/25 outline-none transition-colors focus:border-lime"
                />
              )}

              {question.type === 'long-text' && (
                <textarea
                  ref={controlRef as React.RefObject<HTMLTextAreaElement>}
                  rows={5}
                  value={answers[question.id] as string}
                  onChange={(event) => setAnswer(question.id, event.target.value)}
                  placeholder="Take your time…"
                  aria-invalid={Boolean(error)}
                  className="w-full resize-y rounded-[16px] border border-white/20 bg-white/[0.04] p-[18px] font-body text-[16px] leading-relaxed text-white placeholder-white/25 outline-none transition-colors focus:border-lime"
                />
              )}

              {(question.type === 'single-choice' || question.type === 'multi-choice') && (
                <>
                  {question.type === 'multi-choice' && question.max && (
                    <p className="mb-[14px] font-body text-[13px] text-white/45">
                      {selectedCount} of {question.max} picked
                    </p>
                  )}

                  <ul className="grid gap-[10px] sm:grid-cols-2">
                    {question.options.map((choice, index) => {
                      const selected =
                        question.type === 'single-choice'
                          ? answers[question.id] === choice.value
                          : (answers[question.id] as string[]).includes(choice.value);

                      const cappedOut =
                        question.type === 'multi-choice' &&
                        Boolean(question.max) &&
                        !selected &&
                        selectedCount >= (question.max ?? 0);

                      return (
                        <li key={choice.value}>
                          <OptionButton
                            label={choice.label}
                            hint={OPTION_KEYS[index] ?? '•'}
                            selected={selected}
                            multi={question.type === 'multi-choice'}
                            disabled={cappedOut}
                            onClick={() => {
                              if (question.type === 'single-choice') {
                                setAnswer(question.id, choice.value);
                                return;
                              }
                              toggleMulti(choice.value, question.max, question.id);
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>

                  {capNotice && (
                    <p className="mt-[14px] font-body text-[13px] text-white/50" aria-live="polite">
                      {capNotice}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        ) : null}

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
            {submitting
              ? 'Sending…'
              : onConsentStep
                ? 'Submit application'
                : question?.optional && !answers[question.id]
                  ? 'Skip'
                  : 'Next'}
            {!submitting && (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            )}
          </button>

          <p className="hidden items-center gap-[6px] font-body text-[12px] text-white/35 sm:flex">
            press
            <kbd className="rounded-[5px] border border-white/20 px-[6px] py-[2px] font-display text-[10px] text-white/60">
              {question?.type === 'long-text' ? `${isMac ? '⌘' : 'Ctrl'} + ↵` : <CornerDownLeft className="h-3 w-3" aria-hidden="true" />}
            </kbd>
            to continue
          </p>
        </div>
      </div>
    </main>
  );
}
