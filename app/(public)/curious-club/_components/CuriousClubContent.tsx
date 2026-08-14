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
  'You land in Bangkok with six free hours. What do you do?',
  'What’s something you’re unusually curious about?',
  'Who would you most like to meet through the club?',
  'What’s a trip you’d book tomorrow if the right people were going?',
];

// ─── Shared bits ─────────────────────────────────────────────────────────────

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
      className={`group inline-flex items-center gap-[10px] rounded-full bg-lime px-[32px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[11px] font-bold uppercase tracking-widest text-lime">
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

        <div className="relative mx-auto flex min-h-[92svh] max-w-[1200px] flex-col justify-center px-[24px] py-[120px] md:px-[40px]">
          <p className="mb-[28px] font-display text-[10px] font-bold uppercase tracking-widest text-white/55">
            Membership by invite only
          </p>

          <h1 className="font-display text-[clamp(46px,11vw,116px)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-white">
            The
            <br />
            Curious
            <br />
            Club
          </h1>

          <p className="mt-[28px] max-w-[520px] font-display text-[clamp(15px,2.4vw,19px)] font-semibold uppercase leading-[1.5] tracking-[0.04em] text-lime">
            You don’t need more travel options.
            <br />
            You need better people to discover them with.
          </p>

          <p className="mt-[22px] max-w-[440px] font-body text-[15px] leading-relaxed text-white/70">
            An invite-only community for curious Indians who travel for stories, people, culture and
            experiences.
          </p>

          <div className="mt-[36px]">
            <ApplyButton />
          </div>

          <p className="mt-[28px] font-body text-[13px] leading-relaxed text-white/50">
            Mumbai · India · Beyond
            <br />
            Membership applications reviewed individually.
          </p>
        </div>
      </section>

      {/* ── This isn't for everyone ────────────────────────────────────────── */}
      <section className="bg-ice py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <div className="grid gap-[56px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[72px]">
            <FadeInSection>
              <h2 className="font-display text-[clamp(28px,5vw,42px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-void">
                This isn’t
                <br />
                for everyone.
              </h2>
              <p className="mt-[24px] font-body text-[15px] leading-relaxed text-void/70">
                We’re building a small community of people who are curious, open-minded and{' '}
                <strong className="font-semibold text-void">love discovering the world differently.</strong>
              </p>
              <p className="mt-[16px] font-body text-[15px] leading-relaxed text-void/70">
                People who would rather find a <strong className="font-semibold text-void">hidden bar in Bangkok</strong>{' '}
                than spend three hours shopping for souvenirs.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <ul className="grid grid-cols-2 gap-x-[24px] gap-y-[40px] sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-[16px]">
                {TRAITS.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="text-center">
                    <Icon className="mx-auto h-[26px] w-[26px] text-teal" strokeWidth={1.3} aria-hidden="true" />
                    <h3 className="mt-[16px] font-display text-[14px] font-bold text-void">{title}</h3>
                    <p className="mt-[8px] font-body text-[13px] leading-relaxed text-void/60">{body}</p>
                  </li>
                ))}
              </ul>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Image strip ────────────────────────────────────────────────────── */}
      <section aria-label="What the club is drawn to" className="bg-void">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {STRIP.map((tile) => (
            <li key={tile.label} className="relative aspect-[3/4] overflow-hidden md:aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src={tile.src}
                alt={tile.alt}
                width={tile.width}
                height={tile.height}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-[16px] font-display text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-white">
                {tile.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What happens inside ────────────────────────────────────────────── */}
      <section className="bg-void py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <div className="grid gap-[64px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-[80px]">
            <FadeInSection>
              <h2 className="font-display text-[clamp(26px,4.5vw,38px)] font-bold uppercase tracking-[-0.01em] text-white">
                What happens inside?
              </h2>

              <ul className="mt-[40px] grid gap-x-[32px] gap-y-[36px] sm:grid-cols-2">
                {INSIDE.map(({ icon: Icon, title, body }) => (
                  <li key={title}>
                    <Icon className="h-[22px] w-[22px] text-lime" strokeWidth={1.4} aria-hidden="true" />
                    <h3 className="mt-[14px] font-display text-[15px] font-bold text-white">{title}</h3>
                    <p className="mt-[8px] font-body text-[13px] leading-relaxed text-white/55">{body}</p>
                  </li>
                ))}
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <SectionEyebrow>Imagine this</SectionEyebrow>

              <ol className="relative mt-[28px] space-y-[28px] border-l border-white/15 pl-[28px]">
                {IMAGINE.map((moment) => (
                  <li key={moment.when} className="relative">
                    <span
                      className="absolute -left-[34px] top-[6px] h-[9px] w-[9px] rounded-full bg-lime"
                      aria-hidden="true"
                    />
                    <p className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-lime">
                      {moment.when}
                    </p>
                    <p className="mt-[6px] font-body text-[14px] leading-relaxed text-white/75">{moment.what}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-[36px] font-accent text-[clamp(20px,3vw,26px)] italic leading-snug text-lime">
                Travel creates better stories when the people are right.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── How membership works ───────────────────────────────────────────── */}
      <section className="bg-ice py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <div className="grid gap-[48px] lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2.4fr)] lg:gap-[64px]">
            <FadeInSection>
              <h2 className="font-display text-[clamp(26px,4.5vw,38px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-void">
                How
                <br />
                membership
                <br />
                works
              </h2>
              <span className="mt-[20px] block h-[3px] w-[48px] bg-lime" aria-hidden="true" />
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <ol className="grid gap-[36px] sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map(({ number, icon: Icon, title, body }) => (
                  <li key={number}>
                    <p className="font-display text-[22px] font-bold text-lime">{number}</p>
                    <Icon className="mt-[16px] h-[24px] w-[24px] text-teal" strokeWidth={1.3} aria-hidden="true" />
                    <h3 className="mt-[16px] font-display text-[12px] font-bold uppercase tracking-[0.1em] text-void">
                      {title}
                    </h3>
                    <p className="mt-[8px] font-body text-[13px] leading-relaxed text-void/60">{body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-[44px] flex flex-wrap items-center gap-[20px]">
                <ApplyButton>Apply now</ApplyButton>
                <p className="font-body text-[13px] text-void/50">It takes about 2 minutes.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Not looking for followers ──────────────────────────────────────── */}
      <section className="bg-void py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <div className="grid gap-[48px] lg:grid-cols-2 lg:gap-[72px]">
            <FadeInSection>
              <h2 className="font-display text-[clamp(24px,4vw,34px)] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white">
                Your application takes about 2 minutes.
              </h2>
              <p className="mt-[20px] font-body text-[14px] text-white/55">We might ask you things like:</p>

              <ul className="mt-[20px] grid gap-[12px] sm:grid-cols-2">
                {SAMPLE_QUESTIONS.map((question) => (
                  <li
                    key={question}
                    className="rounded-[14px] border border-white/10 bg-white/[0.04] p-[16px] font-body text-[13px] leading-relaxed text-white/75"
                  >
                    {question}
                  </li>
                ))}
              </ul>

              <div className="mt-[32px] flex flex-wrap items-center gap-[20px]">
                <ApplyButton />
                <p className="font-accent text-[19px] italic text-lime">Can’t wait to read your answers!</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="rounded-[20px] border border-lime/25 bg-lime/[0.06] p-[32px] md:p-[40px]">
                <Sparkles className="h-[26px] w-[26px] text-lime" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-[20px] font-display text-[clamp(20px,3vw,26px)] font-bold uppercase leading-[1.15] text-white">
                  We’re not looking for followers.
                </h3>
                <p className="mt-[18px] font-body text-[14px] leading-relaxed text-white/65">
                  You don’t need 50K followers. You don’t need to be an influencer. We’re looking for
                  curiosity, good energy and openness to new experiences.
                </p>
                <p className="mt-[20px] flex items-center gap-[8px] font-display text-[11px] font-bold uppercase tracking-widest text-white/45">
                  <Lock className="h-[13px] w-[13px]" strokeWidth={2} aria-hidden="true" />
                  Private & invite-only
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Where the club is going next ───────────────────────────────────── */}
      <section className="bg-ice py-[80px] md:py-[110px]">
        <div className="mx-auto max-w-[1200px] px-[24px] md:px-[40px]">
          <FadeInSection>
            <span className="font-display text-[11px] font-bold uppercase tracking-widest text-teal">
              First departures
            </span>
            <h2 className="mt-[12px] font-display text-[clamp(26px,4.5vw,38px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-void">
              Thailand, twice over.
            </h2>
            <p className="mt-[16px] max-w-[560px] font-body text-[15px] leading-relaxed text-void/65">
              Same route, two completely different weeks. Both are captain-tested, both travel with a
              content crew, and both are filled from the applications we receive.
            </p>
          </FadeInSection>

          <ul className="mt-[40px] grid gap-[24px] md:grid-cols-2">
            {CLUB_TRIPS.map((trip, index) => (
              <li key={trip.slug}>
                <FadeInSection delay={0.08 * index}>
                  <Link
                    href={tripPath(trip)}
                    className="group relative block overflow-hidden rounded-[20px] bg-void"
                  >
                    <Image
                      src={trip.hero.src}
                      alt={trip.hero.alt}
                      width={trip.hero.width}
                      height={trip.hero.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="aspect-[4/3] w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-[24px] md:p-[28px]">
                      <span
                        className={`font-display text-[10px] font-bold uppercase tracking-widest ${
                          trip.accent === 'lime' ? 'text-lime' : 'text-cyan'
                        }`}
                      >
                        {trip.duration} · {trip.route.join(' → ')}
                      </span>
                      <h3 className="mt-[10px] font-display text-[24px] font-bold uppercase leading-none text-white">
                        Thailand
                      </h3>
                      <p className="font-accent text-[24px] italic leading-tight text-white/85">
                        {trip.subtitle}
                      </p>
                      <p className="mt-[14px] flex items-center gap-[8px] font-display text-[13px] font-bold text-white">
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
        </div>
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

        <div className="relative mx-auto max-w-[860px] px-[24px] py-[100px] text-center md:px-[40px] md:py-[130px]">
          <FadeInSection>
            <h2 className="font-display text-[clamp(26px,5vw,44px)] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white">
              The world is already interesting.
            </h2>
            <p className="mt-[10px] font-display text-[clamp(22px,4.4vw,40px)] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-lime">
              You just need to find your people in it.
            </p>

            <p className="mt-[32px] font-display text-[11px] font-bold uppercase tracking-widest text-white/45">
              The Curious Club
            </p>

            <div className="mt-[24px]">
              <ApplyButton>Request an invitation</ApplyButton>
            </div>

            <p className="mt-[40px] font-body text-[13px] text-white/40">
              Powered by <span className="text-lime">BagpackerMe</span>
            </p>
          </FadeInSection>
        </div>
      </section>
    </main>
  );
}
