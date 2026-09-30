import { NextResponse } from 'next/server';
import { z } from 'zod';
import { removeTripItem } from '@/lib/experiences';
import { readTripId } from '@/lib/trip-session';

export const runtime = 'nodejs';

const removeSchema = z.object({ itemId: z.string().trim().min(1).max(80) });

export async function POST(request: Request) {
  const tripId = readTripId();

  if (!tripId) {
    return NextResponse.json({ error: 'There is no trip to change.' }, { status: 400 });
  }

  try {
    const parsed = removeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'That request was not valid.' }, { status: 400 });
    }

    // tripId comes from the cookie, never the body: otherwise anyone could
    // strip items out of somebody else's trip by guessing an id.
    return NextResponse.json(await removeTripItem(tripId, parsed.data.itemId));
  } catch (error) {
    console.error('Trip remove failed:', error);

    return NextResponse.json(
      { error: 'We could not update your trip. Please try again.' },
      { status: 502 }
    );
  }
}
