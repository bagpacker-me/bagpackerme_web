import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import { CLUB_TRIPS, buildClubTripSchema, getClubTrip, tripPath } from '@/lib/club-trips';
import TripDeck from '../_components/TripDeck';

type PageProps = { params: { slug: string } };

// Both departures are hard-coded content, so the route is fully static.
export function generateStaticParams() {
  return CLUB_TRIPS.map((trip) => ({ slug: trip.slug }));
}

// An unknown slug must 404 rather than render an empty shell.
export const dynamicParams = false;

export function generateMetadata({ params }: PageProps): Metadata {
  const trip = getClubTrip(params.slug);

  if (!trip) return {};

  return {
    title: trip.metaTitle,
    description: trip.metaDescription,
    alternates: { canonical: tripPath(trip) },
    openGraph: {
      title: trip.metaTitle,
      description: trip.metaDescription,
      url: tripPath(trip),
      type: 'website',
      images: [{ url: trip.hero.src }],
    },
  };
}

export default function TripPage({ params }: PageProps) {
  const trip = getClubTrip(params.slug);

  if (!trip) notFound();

  return (
    <>
      <JsonLd data={buildClubTripSchema(trip)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'The Curious Club', path: '/curious-club' },
          { name: `Thailand: ${trip.subtitle}`, path: tripPath(trip) },
        ])}
      />
      <TripDeck trip={trip} />
    </>
  );
}
