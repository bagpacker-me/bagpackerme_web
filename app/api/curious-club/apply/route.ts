import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { clubApplicationSchema } from '@/lib/club-application';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';

// Admin SDK.
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bots autofill the hidden field. Return success so they get no signal that
    // they were caught, and drop the payload on the floor.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(`club-apply:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many applications from this connection. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = clubApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check your answers and try again.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Not deliverEnquiry: this is an application to review, not a lead to chase.
    // A failed write must surface as an error rather than a silent 200 — the
    // applicant is told their application was received, so it has to exist.
    await adminDb()
      .collection('club_applications')
      .add({
        ...parsed.data,
        status: 'new',
        notes: '',
        source: 'curious-club',
        createdAt: now,
        updatedAt: now,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Curious Club application failed:', error);

    return NextResponse.json(
      { error: 'We could not submit your application right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
