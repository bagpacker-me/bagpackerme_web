import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { clubApplicationSchema, personalityFor } from '@/lib/club-application';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';
import { notifyAutomation } from '@/lib/automation-notify';

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

    // Scored here, not in the browser. The reveal screen shows whatever this
    // returns, so a payload claiming "The Architect" without the answers to
    // back it up gets the type its answers actually earned.
    const personality = personalityFor(parsed.data);

    // Not deliverEnquiry: this is an application to review, not a lead to chase.
    // A failed write must surface as an error rather than a silent 200 — the
    // applicant is told their application was received, so it has to exist.
    const applicationRef = await adminDb()
      .collection('club_applications')
      .add({
        ...parsed.data,
        personality,
        status: 'new',
        notes: '',
        source: 'curious-club',
        createdAt: now,
        updatedAt: now,
      });

    // Acknowledgement, not a sales chase — this is still an application to
    // review. The workflow on the other end sends the applicant a receipt keyed
    // to their personality type and tells the team someone is waiting on a
    // decision; it does not pitch a trip. Cannot fail the submission.
    await notifyAutomation('club.applied', {
      applicationId: applicationRef.id,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      gender: parsed.data.gender,
      dateOfBirth: parsed.data.dateOfBirth,
      discoverySource: parsed.data.discoverySource,
      // Zod defaults this to '', so `|| null` rather than `??` — the workflow
      // branches on "did a trip page send them here", and '' is not that.
      trip: parsed.data.trip || null,
      quizAnswers: parsed.data.quizAnswers,
      personality,
      submittedAt: now,
    });

    // The applicant needs this back to see their result.
    return NextResponse.json({ success: true, personality });
  } catch (error) {
    console.error('Curious Club application failed:', error);

    return NextResponse.json(
      { error: 'We could not submit your application right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
