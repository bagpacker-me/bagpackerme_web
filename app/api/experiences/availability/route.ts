import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAvailability } from '@/lib/experiences';
import { clientIpFrom, isRateLimited } from '@/lib/spam-guard';

export const runtime = 'nodejs';

// Proxied rather than called from the browser so the n8n webhook secret stays
// server-side. It also means one place to rate limit: availability is the only
// endpoint here that costs a live Viator call on every request.
const availabilitySchema = z.object({
  productCode: z.string().trim().min(1).max(64),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date first.'),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(20).optional(),
  infants: z.coerce.number().int().min(0).max(20).optional(),
});

export async function POST(request: Request) {
  if (isRateLimited(`availability:${clientIpFrom(request)}`)) {
    return NextResponse.json(
      { error: 'Too many availability checks. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const parsed = availabilitySchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'That request was not valid.' },
        { status: 400 }
      );
    }

    return NextResponse.json(await checkAvailability(parsed.data));
  } catch (error) {
    console.error('Availability check failed:', error);

    return NextResponse.json(
      { error: 'We could not check live availability just now. Please try again.' },
      { status: 502 }
    );
  }
}
