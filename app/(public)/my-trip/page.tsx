import type { Metadata } from 'next';
import { TripView } from '@/components/experiences/TripView';
import { fetchTrip } from '@/lib/experiences';
import { readTripId } from '@/lib/trip-session';
import type { TripSummary } from '@/types/experiences';

// Reads a cookie, so it can never be static.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My trip',
  description: 'The experiences you have saved — book one instantly, or send us the whole itinerary to quote.',
  robots: { index: false, follow: false },
};

const EMPTY_TRIP: TripSummary = {
  tripId: '',
  itemCount: 0,
  totalInr: 0,
  destinations: [],
  items: [],
};

export default async function MyTripPage() {
  const tripId = readTripId();

  let trip = EMPTY_TRIP;

  if (tripId) {
    try {
      trip = await fetchTrip(tripId);
    } catch (error) {
      // A trip we cannot load renders as empty rather than as an error page:
      // the recovery from both is the same, and one of them reads like a bug.
      console.error('[my-trip] trip read failed:', error);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My trip</h1>
        <p className="mt-4 text-muted-foreground">
          Nothing here is booked yet. Book any single experience instantly through Viator, or send
          us the whole itinerary and we will quote it as one trip.
        </p>
      </header>

      <div className="mt-10">
        <TripView trip={trip} />
      </div>
    </div>
  );
}
