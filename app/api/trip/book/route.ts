import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bookTripItem } from '@/lib/experiences';
import { readTripId } from '@/lib/trip-session';

export const runtime = 'nodejs';

const bookSchema = z.object({ itemId: z.string().trim().min(1).max(80) });

/**
 * BOOK ACTIVITY. Returns the tracked Viator URL for the client to send the
 * traveller to. The redirect is not issued here because the affiliate link has
 * to be a top-level navigation the traveller can see, not a fetch hop.
 */
export async function POST(request: Request) {
  const tripId = readTripId();

  if (!tripId) {
    return NextResponse.json({ error: 'There is no trip to book from.' }, { status: 400 });
  }

  try {
    const parsed = bookSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'That request was not valid.' }, { status: 400 });
    }

    return NextResponse.json(await bookTripItem(tripId, parsed.data.itemId));
  } catch (error) {
    console.error('Trip book failed:', error);

    return NextResponse.json(
      { error: 'We could not open the booking just now. Please try again.' },
      { status: 502 }
    );
  }
}
