'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Check, Clapperboard, Compass, X } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { cn } from '@/lib/utils';
import {
  CHAPTER_SUBTITLE_TEXT,
  CONTENT_DELIVERABLES,
  CONTENT_TEAM_IMAGE,
  JOURNEY_STEPS,
  TRIP_CREW,
  type ClubTrip,
  type TripAccent,
} from '@/lib/club-trips';

// Both decks are the same document with a different palette and different days,
// so both pages are this component with a different ClubTrip. The accent is the
// only visual variable: lime for Sunsets to Sunrise, cyan for The Wild Side.

const ACCENT: Record<
  TripAccent,
  { text: string; bg: string; border: string; ring: string; dot: string; onAccent: string }
> = {
  lime: {
    text: 'text-lime',
    bg: 'bg-lime',
    border: 'border-lime',
    ring: 'ring-lime',
    dot: 'bg-lime',
    onAccent: 'text-void',
  },
  cyan: {
    text: 'text-cyan',
    bg: 'bg-cyan',
    border: 'border-cyan',
    ring: 'ring-cyan',
    dot: 'bg-cyan',
    onAccent: 'text-void',
  },
};

const CREW_ICONS = [Compass, Camera, Clapperboard] as const;

export default function TripDeck({ trip }: { trip: ClubTrip }) {
  const accent = ACCENT[trip.accent];
  const applyHref = `/curious-club/apply?trip=${trip.slug}`;

  return (
    <main>
      {/* ── Cover ──────────────────────────────────────────────────────────── */}
      <section className="bg-void">
        <div className="mx-auto grid max-w-[1200px] items-stretch gap-0 px-[24px] pt-[64px] md:px-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:pt-[80px]">
          <div className="flex flex-col justify-center py-[24px] lg:pb-[80px] lg:pr-[48px]">
            <span
              className={cn(
                'inline-flex w-fit rounded-full px-[16px] py-[7px] font-display text-[10px] font-bold uppercase tracking-widest',
                accent.bg,
                accent.onAccent
              )}
            >
              {trip.duration}
            </span>

            <h1 className="mt-[28px] font-display text-[clamp(46px,10vw,92px)] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-white">
              Thailand
            </h1>
            <p className={cn('mt-[6px] font-accent text-[clamp(28px,6vw,52px)] italic leading-tight', accent.text)}>
              {trip.subtitle}
            </p>

            <p className="mt-[28px] max-w-[460px] font-body text-[15px] leading-relaxed text-white/70">
              {trip.tagline}
            </p>

            <div className="mt-[36px]">
              <Link
                href={applyHref}
                className={cn(
                  'group inline-flex items-center gap-[10px] rounded-full px-[32px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-[1.03]',
                  accent.bg,
                  accent.onAccent
                )}
              >
                Apply for this departure
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[380px] lg:min-h-[560px]">
            <Image
              src={trip.hero.src}
              alt={trip.hero.alt}
              width={trip.hero.width}
              height={trip.hero.height}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void to-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* Route + price bar */}
        <div className="mx-auto max-w-[1200px] px-[24px] pb-[72px] md:px-[40px]">
          <div className="flex flex-wrap items-end justify-between gap-[24px] rounded-[18px] border border-white/10 bg-white/[0.04] p-[24px] md:p-[28px]">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                {trip.route.join('  →  ')}
              </p>
              <p className="mt-[10px] font-display text-[clamp(28px,5vw,40px)] font-bold leading-none text-white">
                {trip.priceLabel}
              </p>
            </div>
            <p className={cn('font-display text-[11px] font-bold uppercase tracking-[0.12em]', accent.text)}>
              Captain-tested&nbsp;&nbsp;/&nbsp;&nbsp;Content crew included
            </p>
          </div>
        </div>
      </section>

      {/* ── From interest form to inside jokes ─────────────────────────────── */}
      <section className="bg-ice py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <FadeInSection>
            <h2 className="font-display text-[clamp(26px,4.6vw,40px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-void">
              From interest form to inside jokes
            </h2>
            <p className="mt-[10px] font-accent text-[clamp(19px,3vw,26px)] italic text-teal">
              The customer journey is part of the product.
            </p>
            <p className="mt-[24px] max-w-[760px] font-body text-[15px] leading-relaxed text-void/70">
              You are not dropped into a random WhatsApp group. We select for attitude, energy and
              respect, then create the conditions for a real crew to form.
            </p>
          </FadeInSection>

          <ol className="mt-[48px] grid gap-[20px] md:grid-cols-3">
            {JOURNEY_STEPS.map((entry, index) => (
              <li key={entry.number}>
                <FadeInSection delay={index * 0.08}>
                  <div className="h-full rounded-[18px] bg-white p-[28px] shadow-diffuse">
                    <p className={cn('font-display text-[26px] font-bold leading-none', accent.text)}>
                      {entry.number}
                    </p>
                    <p className="mt-[16px] font-display text-[10px] font-bold uppercase tracking-widest text-void/45">
                      {entry.stage}
                    </p>
                    <h3 className="mt-[10px] font-display text-[19px] font-bold text-void">{entry.title}</h3>
                    <p className="mt-[12px] font-body text-[14px] leading-relaxed text-void/65">{entry.body}</p>
                  </div>
                </FadeInSection>
              </li>
            ))}
          </ol>

          {/* Crew */}
          <FadeInSection>
            <div className="mt-[48px] rounded-[22px] bg-void p-[32px] md:p-[44px]">
              <h3 className="font-display text-[clamp(20px,3.4vw,30px)] font-bold uppercase leading-tight text-white">
                Three people working so you can be present
              </h3>
              <p className={cn('mt-[8px] font-accent text-[clamp(17px,2.4vw,22px)] italic', accent.text)}>
                The route is led, the moments are captured, the story is edited.
              </p>

              <ul className="mt-[32px] grid gap-[20px] md:grid-cols-3">
                {TRIP_CREW.map((member, index) => {
                  const Icon = CREW_ICONS[index] ?? Compass;
                  return (
                    <li
                      key={member.role}
                      className="rounded-[16px] border border-white/10 bg-white/[0.04] p-[24px]"
                    >
                      <Icon className={cn('h-[22px] w-[22px]', accent.text)} strokeWidth={1.4} aria-hidden="true" />
                      <h4 className="mt-[16px] font-display text-[12px] font-bold uppercase tracking-[0.1em] text-white">
                        {member.role}
                      </h4>
                      <p className="mt-[12px] font-body text-[13px] leading-relaxed text-white/60">{member.body}</p>
                    </li>
                  );
                })}
              </ul>

              <p className={cn('mt-[28px] font-display text-[11px] font-bold uppercase tracking-[0.1em]', accent.text)}>
                No need to choose between living the moment and recording it.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Chapters ───────────────────────────────────────────────────────── */}
      {trip.chapters.map((chapter) => (
        <section key={chapter.label} className="bg-white py-[72px] md:py-[96px]">
          <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
            <FadeInSection>
              <h2 className="font-display text-[clamp(24px,4.4vw,38px)] font-bold uppercase leading-tight tracking-[-0.01em] text-void">
                {chapter.label} <span className="text-void/25">/</span> {chapter.title}
              </h2>
              <p className="mt-[8px] font-accent text-[clamp(18px,2.6vw,24px)] italic text-teal">
                {CHAPTER_SUBTITLE_TEXT}
              </p>
            </FadeInSection>

            <div
              className={cn(
                'mt-[40px] grid gap-[24px] lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]',
                chapter.imageSide === 'right' && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]'
              )}
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-[18px] border-[3px]',
                  accent.border,
                  chapter.imageSide === 'right' && 'lg:order-2'
                )}
              >
                <Image
                  src={chapter.image.src}
                  alt={chapter.image.alt}
                  width={chapter.image.width}
                  height={chapter.image.height}
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="h-full min-h-[280px] w-full object-cover"
                />
                <span
                  className="pointer-events-none absolute bottom-[20px] right-[14px] hidden font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 lg:block"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  One hero moment. One story worth keeping.
                </span>
              </div>

              <ol className={cn('grid gap-[20px]', chapter.imageSide === 'right' && 'lg:order-1')}>
                {chapter.days.map((day) => (
                  <li key={day.day} className="rounded-[18px] bg-ice/70 p-[26px] md:p-[30px]">
                    <div className="flex items-center justify-between gap-[16px]">
                      <span
                        className={cn(
                          'rounded-full px-[14px] py-[6px] font-display text-[10px] font-bold uppercase tracking-widest',
                          accent.bg,
                          accent.onAccent
                        )}
                      >
                        Day {day.day}
                      </span>
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-teal">
                        {day.place}
                      </span>
                    </div>

                    <h3 className="mt-[18px] font-display text-[clamp(19px,2.6vw,23px)] font-bold uppercase leading-tight text-void">
                      {day.title}
                    </h3>
                    <p className="mt-[14px] font-body text-[14px] leading-relaxed text-void/70">{day.body}</p>

                    <div className="mt-[22px] rounded-[12px] bg-white p-[18px]">
                      <p className={cn('font-display text-[10px] font-bold uppercase tracking-widest', accent.text)}>
                        Hero moment
                      </p>
                      <p className="mt-[6px] font-display text-[15px] font-bold text-void">{day.heroMoment}</p>
                    </div>

                    <p className="mt-[16px] font-body text-[13px] text-void/55">
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-void/40">
                        Why it matters
                      </span>
                      <span className="ml-[10px]">{day.whyItMatters}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ))}

      {/* ── You live it, we capture it ─────────────────────────────────────── */}
      <section className="bg-ice py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <FadeInSection>
            <h2 className="font-display text-[clamp(26px,4.6vw,40px)] font-bold uppercase leading-tight tracking-[-0.01em] text-void">
              You live it. We capture it.
            </h2>
            <p className="mt-[8px] font-accent text-[clamp(19px,3vw,26px)] italic text-teal">
              Your trip should leave you with more than camera-roll clutter.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.08}>
            <div className={cn('relative mt-[36px] overflow-hidden rounded-[18px] border-[3px]', accent.border)}>
              <Image
                src={CONTENT_TEAM_IMAGE.src}
                alt={CONTENT_TEAM_IMAGE.alt}
                width={CONTENT_TEAM_IMAGE.width}
                height={CONTENT_TEAM_IMAGE.height}
                sizes="(max-width: 1200px) 100vw, 1120px"
                className="w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/95 to-transparent p-[24px] pt-[80px] md:p-[32px] md:pt-[110px]">
                <h3 className="font-display text-[clamp(17px,2.6vw,22px)] font-bold uppercase text-white">
                  A content team travels with you
                </h3>
                <p className="mt-[10px] max-w-[560px] font-body text-[13px] leading-relaxed text-white/75">
                  Candid photography, atmosphere-led video and social-ready travel moments — without
                  turning the holiday into a shoot.
                </p>
              </div>
            </div>
          </FadeInSection>

          <ul className="mt-[24px] grid gap-[20px] md:grid-cols-3">
            {CONTENT_DELIVERABLES.map((item, index) => (
              <li key={item.title}>
                <FadeInSection delay={index * 0.06}>
                  <div className="h-full rounded-[18px] bg-white p-[26px] shadow-diffuse">
                    <p className={cn('font-display text-[11px] font-bold uppercase tracking-widest', accent.text)}>
                      {item.title}
                    </p>
                    <p className="mt-[12px] font-body text-[14px] leading-relaxed text-void/65">{item.body}</p>
                  </div>
                </FadeInSection>
              </li>
            ))}
          </ul>

          {/* Day 7 */}
          <FadeInSection>
            <div className="mt-[24px] rounded-[22px] bg-void p-[32px] md:p-[40px]">
              <div className="flex flex-wrap items-center gap-[18px]">
                <span
                  className={cn(
                    'rounded-full px-[16px] py-[7px] font-display text-[10px] font-bold uppercase tracking-widest',
                    accent.bg,
                    accent.onAccent
                  )}
                >
                  Day {trip.finalDay.day}
                </span>
                <h3 className="font-display text-[clamp(19px,3vw,26px)] font-bold uppercase text-white">
                  {trip.finalDay.title}
                </h3>
              </div>

              <div className="mt-[24px] grid gap-[24px] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <p className="font-body text-[14px] leading-relaxed text-white/70">{trip.finalDay.body}</p>
                <div>
                  <p className={cn('font-display text-[10px] font-bold uppercase tracking-widest', accent.text)}>
                    Final hero moment
                  </p>
                  <p className="mt-[8px] font-body text-[14px] text-white/85">{trip.finalDay.heroMoment}</p>
                </div>
              </div>

              <p className="mt-[28px] font-body text-[12px] text-white/40">
                Asset selection, quantity and delivery timeline are confirmed in the booking invite.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── What your trip includes ────────────────────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <FadeInSection>
            <h2 className="font-display text-[clamp(26px,4.6vw,40px)] font-bold uppercase leading-tight tracking-[-0.01em] text-void">
              What your trip includes
            </h2>
            <p className="mt-[8px] font-accent text-[clamp(19px,3vw,26px)] italic text-teal">
              The details are handled. You show up for the story.
            </p>
          </FadeInSection>

          <div className="mt-[40px] grid gap-[20px] md:grid-cols-2">
            <FadeInSection>
              <div className="h-full rounded-[20px] border border-void/8 bg-ice/60 p-[28px] md:p-[32px]">
                <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-void">
                  Included
                </h3>
                <ul className="mt-[22px] space-y-[16px]">
                  {trip.included.map((item) => (
                    <li key={item} className="flex gap-[12px]">
                      <Check
                        className={cn('mt-[2px] h-[16px] w-[16px] shrink-0', accent.text)}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      <span className="font-body text-[14px] leading-relaxed text-void/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.08}>
              <div className="h-full rounded-[20px] border border-void/8 bg-ice/60 p-[28px] md:p-[32px]">
                <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-void">
                  Not included
                </h3>
                <ul className="mt-[22px] space-y-[16px]">
                  {trip.notIncluded.map((item) => (
                    <li key={item} className="flex gap-[12px]">
                      <X className="mt-[2px] h-[16px] w-[16px] shrink-0 text-void/30" strokeWidth={3} aria-hidden="true" />
                      <span className="font-body text-[14px] leading-relaxed text-void/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          </div>

          {/* Price */}
          <FadeInSection>
            <div className="mt-[24px] rounded-[22px] bg-teal p-[32px] md:p-[40px]">
              <p className={cn('font-display text-[10px] font-bold uppercase tracking-widest', accent.text)}>
                Package price per traveller
              </p>
              <p className="mt-[14px] font-display text-[clamp(38px,8vw,64px)] font-bold leading-none text-white">
                {trip.priceLabel}
              </p>
              <p className="mt-[16px] font-body text-[14px] text-white/75">{trip.priceSummary}</p>

              {trip.priceNotes.map((note) => (
                <p key={note} className="mt-[14px] max-w-[720px] font-body text-[12px] leading-relaxed text-white/50">
                  {note}
                </p>
              ))}
            </div>
          </FadeInSection>

          {/* CTA */}
          <FadeInSection delay={0.06}>
            <div className={cn('mt-[20px] rounded-[22px] p-[32px] md:p-[40px]', accent.bg)}>
              <h3 className="font-display text-[clamp(22px,4vw,32px)] font-bold uppercase leading-tight text-void">
                Stop waiting for the group chat.
              </h3>
              <p className="mt-[12px] font-body text-[13px] text-void/70">
                Interest form → vibe call → invitation → your Thailand crew
              </p>

              <div className="mt-[28px] flex flex-wrap items-center gap-[16px]">
                <Link
                  href={applyHref}
                  className="group inline-flex items-center gap-[10px] rounded-full bg-void px-[32px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  Apply for an invite
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/curious-club"
                  className="font-display text-[12px] font-bold uppercase tracking-widest text-void/70 underline underline-offset-4 transition-colors hover:text-void"
                >
                  What is The Curious Club?
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </main>
  );
}
