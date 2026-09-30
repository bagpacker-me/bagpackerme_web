import { NextResponse } from 'next/server';
import { fetchTrip } from '@/lib/experiences';
import { readTripId } from '@/lib/trip-session';

export const runtime = 'nodejs';

/** The current trip, or an empty one. Never 404s — no trip yet is not an error. */
export async function GET() {
  const tripId = readTripId();

  if (!tripId) {
    return NextResponse.json({ tripId: '', itemCount: 0, totalInr: 0, destinations: [], items: [] });
  }

  try {
    return NextResponse.json(await fetchTrip(tripId));
  } catch (error) {
    console.error('Trip read failed:', error);

    return NextResponse.json(
      { error: 'We could not load your trip just now. Please refresh in a moment.' },
      { status: 502 }
    );
  }
}
