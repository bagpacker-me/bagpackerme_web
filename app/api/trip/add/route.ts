import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addTripItem } from '@/lib/experiences';
import { clientIpFrom, isRateLimited } from '@/lib/spam-guard';
import { readTripId, writeTripId } from '@/lib/trip-session';

export const runtime = 'nodejs';

const addSchema = z.object({
  productCode: z.string().trim().min(1).max(64),
  title: z.string().trim().min(1).max(200),
  destinationSlug: z.string().trim().max(80).default(''),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date first.'),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(20).optional(),
  infants: z.coerce.number().int().min(0).max(20).optional(),
  productOptionCode: z.string().trim().max(64).optional(),
  startTime: z.string().trim().max(16).optional(),
  priceInr: z.coerce.number().min(0).max(10_000_000),
});

export async function POST(request: Request) {
  if (isRateLimited(`trip-add:${clientIpFrom(request)}`)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const parsed = addSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'That request was not valid.' },
        { status: 400 }
      );
    }

    // An absent cookie means this is the first thing saved; n8n mints the id.
    const existingTripId = readTripId();
    const result = await addTripItem({
      ...parsed.data,
      ...(existingTripId ? { tripId: existingTripId } : {}),
    });

    const response = NextResponse.json(result, { status: 201 });

    if (result.tripId && result.tripId !== existingTripId) {
      writeTripId(response, result.tripId);
    }

    return response;
  } catch (error) {
    console.error('Trip add failed:', error);

    return NextResponse.json(
      { error: 'We could not add that to your trip. Please try again.' },
      { status: 502 }
    );
  }
}
