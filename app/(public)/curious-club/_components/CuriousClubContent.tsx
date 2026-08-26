'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Binoculars, Camera, Compass, Eye, Globe, Key, Lightbulb, Lock, Mail, MapPin, Music, Sparkles, Users, Utensils } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { CLUB_TRIPS, tripPath } from '@/lib/club-trips';

const APPLY_HREF = '/curious-club/apply';

// ─── Section 2: who this is for ──────────────────────────────────────────────
const TRAITS = [
  { icon: Globe, title: 'Curious', body: 'You seek more than the obvious.' },
  { icon: Users, title: 'People first', body: 'You travel to meet interesting people.' },
  { icon: Camera, title: 'Experiences', body: 'You collect stories, not things.' },
  { icon: MapPin, title: 'Open-minded', body: 'You love new cultures, ideas and perspectives.' },
  { icon: Binoculars, title: 'Explorative', body: 'You prefer offbeat over ordinary.' },
];

// ─── Section 3: the strip ────────────────────────────────────────────────────
// Labels follow the photograph, not the other way round — a "Great Food" tile
// with a temple on it would be the first thing a curious person noticed.
const STRIP = [
  {
    label: 'Hidden places',
    src: '/web_photos/gallery_3.webp',
    width: 2005,
    height: 1333,
    alt: 'Boats moored along the Varanasi ghats at sunrise',
  },
  {
    label: 'Great escapes',
    src: '/thailand/railay-longtail-boats.webp',
    width: 1800,
    height: 1246,
    alt: 'Long-tail boats on Railay beach in Thailand',
  },
  {
    label: 'Music & nightlife',
    src: '/thailand/beach-party-sunset.webp',
    width: 1024,
    height: 1536,
    alt: 'A group dancing on a Thai beach as the sun sets',
  },
  {
    label: 'Culture',
    src: '/web_photos/gallery_2.webp',
    width: 1200,
    height: 700,
    alt: 'The Golden Temple in Amritsar reflected in the surrounding water',
  },
  {
    label: 'Unexpected experiences',
    src: '/thailand/railay-climbing.webp',
    width: 1024,
    height: 1536,
    alt: 'A climber on a limestone wall above the sea in Railay',
  },
  {
    label: 'Open roads',
    src: '/web_photos/gallery_5.webp',
    width: 1100,
    height: 730,
    alt: 'Pangong lake in Ladakh under bare mountains',
  },
];

// ─── Section 4: what happens inside ──────────────────────────────────────────
const INSIDE = [
  { icon: Compass, title: 'Curated trips', body: 'Small groups built around shared interests.' },
  { icon: Utensils, title: 'Members-only experiences', body: 'Dinners, walks, parties and unique city experiences.' },
  { icon: Sparkles, title: 'Travel drops', body: 'Limited departures released to the community first.' },
  { icon: Users, title: 'Interesting people', body: 'Meet creators, founders, professionals and passionate travellers.' },
  { icon: Eye, title: 'Hidden finds', body: 'Places, experiences and ideas worth travelling for.' },
  { icon: Music, title: 'Member led', body: 'Members can suggest, plan and lead experiences.' },
];

const IMAGINE = [
  { when: 'Thursday', what: '8 strangers meet at a secret Mumbai dinner.' },
  { when: 'Three weeks later', what: '12 members spend a weekend exploring Goa differently.' },
  { when: 'Two months later', what: '20 members fly to Thailand together.' },
  { when: 'A year later', what: 'Someone you met through the club becomes your travel partner for Japan.' },
];

// ─── Section 5: how membership works ─────────────────────────────────────────
const STEPS = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Apply',
    body: 'Tell us a little about yourself and how you love to travel.',
  },
  {
    number: '02',
    icon: Users,
    title: 'We get to know you',
    body: 'Share your Instagram or LinkedIn (optional) so we understand your interests and fit.',
  },
  {
    number: '03',
    icon: Mail,
    title: 'Invitation',
    body: 'Applications are reviewed individually.',
  },
  {
    number: '04',
    icon: Key,
    title: 'Enter the club',
    body: 'Accepted members get access to private experiences, trips and community drops.',
  },
];

// ─── Section 6: the application teaser ───────────────────────────────────────
const SAMPLE_QUESTIONS = [
  'It’s your first morning in a brand-new destination. What’s step one?',
  'What role do you play in the pre-trip group chat?',
  'You stumble on a surprise street festival. What’s your move?',
  'What’s the ultimate souvenir you want to bring home?',
];

// ─── Layout system ───────────────────────────────────────────────────────────
// One spine for the whole page. Every band shares the same container, the same
// vertical rhythm and the same 12-column grid, so headings and content columns
// line up from the hero to the footer instead of each section inventing its own
// ratio. Repeated item rows hang off a shared hairline rather than floating.

const SECTION = 'py-[88px] md:py-[128px]';
const GRID = 'grid grid-cols-1 gap-y-[40px] lg:grid-cols-12 lg:gap-x-[48px]';

/** Heading and its supporting text share a baseline at the bottom of the row. */
const HEADER_ROW = `${GRID} lg:items-end`;

const H2_LIGHT =
  'font-display text-[clamp(30px,5vw,44px)] font-bold uppercase leading-[1.02] tracking-[-0.025em] text-void text-balance';
const H2_DARK =
  'font-display text-[clamp(30px,5vw,44px)] font-bold uppercase leading-[1.02] tracking-[-0.025em] text-white text-balance';

/** Micro-caps label used by every hairline item row on the page. */
const ITEM_LABEL = 'font-display text-[12px] font-bold uppercase leading-[1.3] tracking-[0.1em]';

function Shell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-[24px] md:px-[40px] ${className}`}>{children}</div>
  );
}

function ApplyButton({
  children = 'Apply for an invite',
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={APPLY_HREF}
      className={`group inline-flex items-center gap-[10px] whitespace-nowrap rounded-full bg-lime px-[30px] py-[16px] font-display text-[12px] font-bold uppercase leading-none tracking-[0.16em] text-void transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-glow-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

function SectionEyebrow({ children, tone = 'lime' }: { children: React.ReactNode; tone?: 'lime' | 'teal' }) {
  return (
    <span
      className={`block font-display text-[11px] font-bold uppercase leading-none tracking-widest ${
        tone === 'lime' ? 'text-lime' : 'text-teal'
      }`}
    >
      {children}
    </span>
  );
}

export default function CuriousClubContent() {
  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-void">
        <Image
          src="/thailand/crew-golden-hour.webp"
          alt="A group of travellers laughing together on a Thai beach at golden hour"
          width={1672}
          height={941}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.55]"
        />
        {/* Two overlays: a left-weighted one so the copy column always has
            contrast, and a bottom fade into the next section. */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/25" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-void to-transparent" aria-hidden="true" />

        <Shell className="relative flex min-h-[92svh] flex-col justify-center py-[120px]">
          <div className="max-w-[680px]">
            <SectionEyebrow>
              <span className="text-white/55">Membership by invite only</span>
            </SectionEyebrow>

            <h1 className="mt-[28px] font-display text-[clamp(48px,10.5vw,124px)] font-bold uppercase leading-[0.9] tracking-[-0.035em] text-white">
              The
              <br />
              Curious
              <br />
              Club
            </h1>

            <p className="mt-[30px] font-display text-[clamp(15px,2.2vw,19px)] font-semibold uppercase leading-[1.45] tracking-[0.03em] text-lime text-pretty">
              <span className="block">You don’t need more travel options.</span>
              <span className="block">You need better people to discover them with.</span>
            </p>

            <p className="mt-[22px] max-w-[46ch] font-body text-[15px] leading-relaxed text-white/70 text-pretty">
              An invite-only community for curious Indians who travel for stories, people, culture and
              experiences.
            </p>

            <div className="mt-[36px]">
              <ApplyButton />
            </div>

            <div className="mt-[40px] flex flex-wrap items-baseline gap-x-[20px] gap-y-[6px] border-t border-white/15 pt-[20px]">
              <p className={`${ITEM_LABEL} text-white/70`}>Mumbai · India · Beyond</p>
              <p className="font-body text-[13px] leading-relaxed text-white/50">
                Membership applications reviewed individually.
              </p>
            </div>
          </div>
        </Shell>
      </section>

      {/* ── This isn't for everyone ────────────────────────────────────────── */}
      <section className={`bg-ice ${SECTION}`}>
        <Shell>
          <FadeInSection>
            <div className={HEADER_ROW}>
              <h2 className={`${H2_LIGHT} lg:col-span-5`}>
                This isn’t
                <br />
                for everyone.
              </h2>

              <div className="lg:col-span-6 lg:col-start-7">
                <p className="max-w-[62ch] font-body text-[15px] leading-relaxed text-void/70 text-pretty">
                  We’re building a small community of people who are curious, open-minded and{' '}
                  <strong className="font-semibold text-void">love discovering the world differently.</strong>
                </p>
                <p className="mt-[16px] max-w-[62ch] font-body text-[15px] leading-relaxed text-void/70 text-pretty">
                  People who would rather find a{' '}
                  <strong className="font-semibold text-void">hidden bar in Bangkok</strong> than spend three
                  hours shopping for souvenirs.
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* The traits hang off one continuous hairline across the full spine
              rather than floating in a column beside the heading. */}
          <FadeInSection delay={0.1}>
            <ul className="mt-[64px] grid grid-cols-2 gap-x-[24px] gap-y-[32px] sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-[20px]">
              {TRAITS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="border-t border-void/20 pt-[20px]">
                  <Icon className="h-[20px] w-[20px] text-teal" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className={`${ITEM_LABEL} mt-[16px] text-void`}>{title}</h3>
                  <p className="mt-[10px] font-body text-[13px] leading-relaxed text-void/60 text-pretty">{body}</p>
                </li>
              ))}
            </ul>
          </FadeInSection>
        </Shell>
      </section>

      {/* ── Image strip ────────────────────────────────────────────────────── */}
      <section aria-label="What the club is drawn to" className="bg-void">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {STRIP.map((tile) => (
            <li
              key={tile.label}
              className="group relative aspect-[3/4] overflow-hidden md:aspect-[4/5] lg:aspect-[3/4]"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                width={tile.width}
                height={tile.height}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              {/* Deep enough that a white label stays legible over the brightest
                  tiles (the Golden Temple, the Pangong water). */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent"
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-[18px]">
                <span aria-hidden="true" className="mb-[12px] block h-px w-[24px] bg-lime" />
                <span className={`${ITEM_LABEL} block text-white`}>{tile.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What happens inside ────────────────────────────────────────────── */}
      <section className={`bg-void ${SECTION}`}>
        <Shell>
          <FadeInSection>
            <h2 className={`${H2_DARK} max-w-[16ch]`}>What happens inside?</h2>
          </FadeInSection>

          <div className={`${GRID} mt-[56px]`}>
            <FadeInSection className="lg:col-span-7">
              <ul className="grid gap-x-[32px] gap-y-[32px] sm:grid-cols-2">
                {INSIDE.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="border-t border-white/15 pt-[20px]">
                    <Icon className="h-[20px] w-[20px] text-lime" strokeWidth={1.4} aria-hidden="true" />
                    <h3 className={`${ITEM_LABEL} mt-[16px] text-white`}>{title}</h3>
                    <p className="mt-[10px] font-body text-[13px] leading-relaxed text-white/60 text-pretty">
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-white/15 pt-[20px]">
                <SectionEyebrow>Imagine this</SectionEyebrow>

                <ol className="mt-[28px]">
                  {IMAGINE.map((moment, index) => (
                    <li key={moment.when} className="relative pb-[26px] pl-[28px] last:pb-0">
                      {index < IMAGINE.length - 1 && (
                        <span
                          className="absolute left-0 top-[11px] h-full w-px bg-white/20"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="absolute left-0 top-[7px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-lime"
                        aria-hidden="true"
                      />
                      <p className={`${ITEM_LABEL} text-lime`}>{moment.when}</p>
                      <p className="mt-[8px] font-body text-[14px] leading-relaxed text-white/75 text-pretty">
                        {moment.what}
                      </p>
                    </li>
                  ))}
                </ol>

                <p className="mt-[36px] font-accent text-[clamp(21px,2.6vw,27px)] italic leading-[1.3] text-lime text-balance">
                  Travel creates better stories when the people are right.
                </p>
              </div>
            </FadeInSection>
          </div>
        </Shell>
      </section>

      {/* ── How membership works ───────────────────────────────────────────── */}
      <section className={`bg-ice ${SECTION}`}>
        <Shell>
          <FadeInSection>
            <div>
              <h2 className={H2_LIGHT}>How membership works</h2>
              <span className="mt-[20px] block h-[3px] w-[48px] bg-lime" aria-hidden="true" />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <ol className="mt-[56px] grid gap-x-[24px] gap-y-[36px] sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ number, icon: Icon, title, body }) => (
                <li key={number} className="border-t border-void/20 pt-[20px]">
                  <div className="flex items-center gap-[12px]">
                    {/* Teal, not lime — acid lime on the ice band reads at
                        roughly 1.6:1 and disappears. */}
                    <span className="font-display text-[13px] font-bold tracking-[0.1em] text-teal">{number}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-void/15" />
                    <Icon className="h-[20px] w-[20px] shrink-0 text-teal" strokeWidth={1.4} aria-hidden="true" />
                  </div>
                  <h3 className={`${ITEM_LABEL} mt-[18px] text-void`}>{title}</h3>
                  <p className="mt-[10px] font-body text-[13px] leading-relaxed text-void/60 text-pretty">{body}</p>
                </li>
              ))}
            </ol>

            {/* The ask comes after the explanation at every viewport — a
                side-by-side header would put the button above the steps on
                a phone. */}
            <div className="mt-[48px] flex flex-wrap items-center gap-x-[24px] gap-y-[16px] border-t border-void/20 pt-[32px]">
              <ApplyButton>Apply now</ApplyButton>
              <p className="font-body text-[13px] text-void/55">It takes under a minute.</p>
            </div>
          </FadeInSection>
        </Shell>
      </section>

      {/* ── Not looking for followers ──────────────────────────────────────── */}
      <section className={`bg-void ${SECTION}`}>
        <Shell>
          <div className={GRID}>
            <FadeInSection className="lg:col-span-7">
              <h2 className={`${H2_DARK} max-w-[20ch]`}>Your application takes under a minute.</h2>

              <p className="mt-[24px] font-body text-[14px] text-white/55">A few details, then six questions like these:</p>

              {/* A hairline index, not four tinted boxes — the questions align on
                  one left edge and read as a single list. */}
              <ul className="mt-[20px] border-t border-white/15">
                {SAMPLE_QUESTIONS.map((question) => (
                  <li key={question} className="flex items-start gap-[16px] border-b border-white/15 py-[16px]">
                    <span aria-hidden="true" className="mt-[10px] h-px w-[18px] shrink-0 bg-lime" />
                    <p className="font-body text-[14px] leading-relaxed text-white/75 text-pretty">{question}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-[32px] flex flex-wrap items-center gap-x-[24px] gap-y-[16px]">
                <ApplyButton />
                <p className="font-accent text-[20px] italic leading-none text-lime">
                  You’ll get your traveller type at the end.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <div className="flex h-full flex-col rounded-[20px] border border-white/12 bg-white/[0.035] p-[28px] md:p-[32px]">
                <span aria-hidden="true" className="block h-[3px] w-[40px] bg-lime" />
                <Sparkles className="mt-[24px] h-[24px] w-[24px] text-lime" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-[20px] font-display text-[clamp(20px,2.6vw,26px)] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-white text-balance">
                  We’re not looking for followers.
                </h3>
                <p className="mb-[28px] mt-[18px] font-body text-[14px] leading-relaxed text-white/70 text-pretty">
                  You don’t need 50K followers. You don’t need to be an influencer. We’re looking for
                  curiosity, good energy and openness to new experiences.
                </p>
                {/* mt-auto keeps the lock line pinned to the foot of the panel
                    so the h-full stretch never leaves a hollow bottom. */}
                <p
                  className={`${ITEM_LABEL} mt-auto flex items-center gap-[8px] border-t border-white/12 pt-[20px] text-white/65`}
                >
                  <Lock className="h-[13px] w-[13px] shrink-0" strokeWidth={2} aria-hidden="true" />
                  Private &amp; invite-only
                </p>
              </div>
            </FadeInSection>
          </div>
        </Shell>
      </section>

      {/* ── Where the club is going next ───────────────────────────────────── */}
      <section className={`bg-ice ${SECTION}`}>
        <Shell>
          <FadeInSection>
            <div className={HEADER_ROW}>
              <div className="lg:col-span-6">
                <SectionEyebrow tone="teal">First departures</SectionEyebrow>
                <h2 className={`${H2_LIGHT} mt-[14px]`}>Thailand, twice over.</h2>
              </div>

              <p className="max-w-[58ch] font-body text-[15px] leading-relaxed text-void/65 text-pretty lg:col-span-5 lg:col-start-8">
                Same route, two completely different weeks. Both are captain-tested, both travel with a
                content crew, and both are filled from the applications we receive.
              </p>
            </div>
          </FadeInSection>

          <ul className="mt-[56px] grid gap-[24px] md:grid-cols-2">
            {CLUB_TRIPS.map((trip, index) => (
              <li key={trip.slug}>
                <FadeInSection delay={0.08 * index}>
                  <Link
                    href={tripPath(trip)}
                    className="group relative block overflow-hidden rounded-[20px] bg-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
                  >
                    <Image
                      src={trip.hero.src}
                      alt={trip.hero.alt}
                      width={trip.hero.width}
                      height={trip.hero.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="aspect-[4/3] w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-85"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-[24px] md:p-[28px]">
                      <span
                        className={`${ITEM_LABEL} block ${trip.accent === 'lime' ? 'text-lime' : 'text-cyan'}`}
                      >
                        {trip.duration} · {trip.route.join(' → ')}
                      </span>
                      <h3 className="mt-[12px] font-display text-[26px] font-bold uppercase leading-none tracking-[-0.02em] text-white">
                        Thailand
                      </h3>
                      <p className="mt-[2px] font-accent text-[24px] italic leading-tight text-white/85">
                        {trip.subtitle}
                      </p>
                      <p className="mt-[16px] flex items-center gap-[8px] border-t border-white/20 pt-[14px] font-display text-[13px] font-bold tracking-[0.04em] text-white">
                        {trip.priceLabel}
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </p>
                    </div>
                  </Link>
                </FadeInSection>
              </li>
            ))}
          </ul>
        </Shell>
      </section>

      {/* ── Closing ────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-void">
        <Image
          src="/web_photos/gallery_6.webp"
          alt=""
          aria-hidden="true"
          width={2000}
          height={800}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-void/70" aria-hidden="true" />

        <Shell className="relative py-[100px] text-center md:py-[136px]">
          <FadeInSection>
            {/* One scale for both lines — the previous 44px/40px pairing read as
                a mistake rather than a decision. */}
            <h2 className="mx-auto max-w-[19ch] font-display text-[clamp(30px,5.4vw,52px)] font-bold uppercase leading-[1.06] tracking-[-0.025em] text-white text-balance">
              The world is already interesting.
              <span className="mt-[14px] block text-lime">You just need to find your people in it.</span>
            </h2>

            <p className={`${ITEM_LABEL} mt-[36px] text-white/55`}>The Curious Club</p>

            <div className="mt-[24px]">
              <ApplyButton>Request an invitation</ApplyButton>
            </div>

            <p className="mt-[44px] font-body text-[13px] text-white/45">
              Powered by <span className="text-lime">BagpackerMe</span>
            </p>
          </FadeInSection>
        </Shell>
      </section>
    </main>
  );
}
