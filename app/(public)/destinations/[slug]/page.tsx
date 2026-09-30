import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { EXPERIENCE_DESTINATIONS, findDestination } from '@/lib/experience-destinations';
import { fetchExperienceCards } from '@/lib/experiences';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

// The catalogue refreshes at 03:00 daily, so hourly revalidation is plenty and
// keeps the grid on static-render speed for almost every visitor.
export const revalidate = 3600;

export function generateStaticParams() {
  return EXPERIENCE_DESTINATIONS.map((destination) => ({ slug: destination.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const destination = findDestination(params.slug);

  if (!destination) return { title: 'Destination not found' };

  return {
    title: `Things to do in ${destination.name}`,
    description: `Curated tours, activities and day trips in ${destination.name}, ${destination.country} — rated 4.0 and above, priced in rupees, bookable instantly or built into a full trip.`,
    alternates: { canonical: `/destinations/${destination.slug}` },
  };
}

export default async function ThingsToDoPage({ params }: { params: { slug: string } }) {
  const destination = findDestination(params.slug);

  if (!destination) notFound();

  const experiences = await fetchExperienceCards(destination.slug, { limit: 48 });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
          { name: destination.name, path: `/destinations/${destination.slug}` },
        ])}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <nav className="text-sm text-muted-foreground">
          <Link href="/destinations" className="hover:text-foreground hover:underline">
            Destinations
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-foreground">{destination.name}</span>
        </nav>

        <header className="mt-6 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {destination.country}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Things to do in {destination.name}
          </h1>
          <p className="mt-4 text-muted-foreground">{destination.blurb}.</p>
        </header>

        {experiences.length > 0 ? (
          <>
            <p className="mt-8 text-sm text-muted-foreground">
              {experiences.length} curated {experiences.length === 1 ? 'experience' : 'experiences'}
            </p>

            <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((experience) => (
                <li key={experience.productCode} className="flex">
                  <ExperienceCard experience={experience} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          // An empty grid is either a destination we have not synced yet or a
          // catalogue outage. Either way the planning route still works, so the
          // page offers it rather than dead-ending.
          <div className="mt-10 rounded-xl border border-border bg-muted/40 p-8 text-center">
            <h2 className="font-semibold">We are still curating {destination.name}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Nothing here has cleared our bar yet. Tell us what you want out of the trip and we
              will put the plan together by hand instead.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Plan {destination.name} with us
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
