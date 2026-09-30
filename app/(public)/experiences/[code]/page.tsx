import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, MapPin, Star } from 'lucide-react';
import { AvailabilityPanel } from '@/components/experiences/AvailabilityPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import { findDestination } from '@/lib/experience-destinations';
import { fetchExperienceDetail } from '@/lib/experiences';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const experience = await fetchExperienceDetail(decodeURIComponent(params.code));

  if (!experience) return { title: 'Experience not found' };

  return {
    title: experience.title,
    description: experience.description.slice(0, 160),
    alternates: { canonical: `/experiences/${experience.productCode}` },
  };
}

export default async function ExperienceDetailPage({ params }: { params: { code: string } }) {
  const experience = await fetchExperienceDetail(decodeURIComponent(params.code));

  // n8n returns 404 for any product code that curation never approved, so this
  // is the same promise the catalogue makes: we only have pages for what we sell.
  if (!experience) notFound();

  const destination = findDestination(experience.destinationSlug);
  const [cover, ...gallery] = experience.photos;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
          ...(destination
            ? [{ name: destination.name, path: `/destinations/${destination.slug}` }]
            : []),
          { name: experience.title, path: `/experiences/${experience.productCode}` },
        ])}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {destination ? (
          <nav className="text-sm text-muted-foreground">
            <Link href="/destinations" className="hover:text-foreground hover:underline">
              Destinations
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link
              href={`/destinations/${destination.slug}`}
              className="hover:text-foreground hover:underline"
            >
              {destination.name}
            </Link>
          </nav>
        ) : null}

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{experience.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {experience.rating > 0 ? (
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden />
                <span className="font-medium text-foreground">{experience.rating.toFixed(1)}</span>
                <span>({experience.reviewCount.toLocaleString('en-IN')} reviews)</span>
              </span>
            ) : null}
            <span>{experience.durationLabel}</span>
            {experience.confirmationType === 'INSTANT' ? <span>Instant confirmation</span> : null}
          </div>
        </header>

        {cover ? (
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted md:col-span-2">
              <Image
                src={cover.url}
                alt={cover.caption || experience.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
              {gallery.slice(0, 3).map((photo) => (
                <div
                  key={photo.url}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || experience.title}
                    fill
                    sizes="(max-width: 768px) 33vw, 22vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {experience.description ? (
              <section>
                <h2 className="text-xl font-semibold">About this experience</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                  {experience.description}
                </p>
              </section>
            ) : null}

            {experience.highlights.length > 0 ? (
              <section>
                <h2 className="text-xl font-semibold">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {experience.included.length > 0 ? (
              <section>
                <h2 className="text-xl font-semibold">What&rsquo;s included</h2>
                <ul className="mt-3 space-y-2">
                  {experience.included.map((item) => (
                    <li key={item} className="flex gap-2.5 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {experience.excluded.length > 0 ? (
                  <>
                    <h3 className="mt-6 font-medium">Not included</h3>
                    <ul className="mt-2 space-y-1.5 text-muted-foreground">
                      {experience.excluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {experience.meetingPoint ? (
              <section>
                <h2 className="text-xl font-semibold">Meeting point</h2>
                <p className="mt-3 flex gap-2.5 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{experience.meetingPoint}</span>
                </p>
              </section>
            ) : null}

            {experience.cancellationPolicy ? (
              <section>
                <h2 className="text-xl font-semibold">Cancellation policy</h2>
                <p className="mt-3 text-muted-foreground">{experience.cancellationPolicy}</p>
              </section>
            ) : null}
          </div>

          <AvailabilityPanel experience={experience} />
        </div>
      </div>
    </>
  );
}
