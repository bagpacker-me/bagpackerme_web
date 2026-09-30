import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enquireTrip } from '@/lib/experiences';
import { isHoneypotTripped, clientIpFrom, isRateLimited } from '@/lib/spam-guard';
import { readTripId } from '@/lib/trip-session';

export const runtime = 'nodejs';

const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
});

/** BUILD MY TRIP. The itinerary becomes a BagpackerMe lead instead of a Viator sale. */
export async function POST(request: Request) {
  const tripId = readTripId();

  if (!tripId) {
    return NextResponse.json(
      { error: 'Your trip is empty. Add an experience first.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(`trip-enquiry:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(await enquireTrip({ tripId, ...parsed.data }), { status: 201 });
  } catch (error) {
    console.error('Trip enquiry failed:', error);

    return NextResponse.json(
      { error: 'We could not send your itinerary. Please try again in a moment.' },
      { status: 502 }
    );
  }
}
