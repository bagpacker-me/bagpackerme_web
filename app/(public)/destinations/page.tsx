import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { destinationsByCountry } from '@/lib/experience-destinations';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Pick a destination and see the tours, activities and day trips we would actually put in your trip — curated from thousands, priced in rupees.',
  alternates: { canonical: '/destinations' },
};

export default function DestinationsPage() {
  const groups = destinationsByCountry();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
        ])}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Things to do
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Where are you going?
          </h1>
          <p className="mt-4 text-muted-foreground">
            Every destination below is curated, not scraped. We only list experiences rated 4.0 and
            above with enough reviews to mean something — then you can book one instantly or hand us
            the whole itinerary to quote.
          </p>
        </header>

        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <section key={group.country}>
              <h2 className="text-xl font-semibold tracking-tight">{group.country}</h2>

              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.destinations.map((destination) => (
                  <li key={destination.slug}>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="font-semibold">{destination.name}</span>
                      <span className="mt-1 text-sm text-muted-foreground">{destination.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
