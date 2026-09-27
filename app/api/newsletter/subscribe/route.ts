import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';
import { notifyAutomation } from '@/lib/automation-notify';

// Admin SDK.
export const runtime = 'nodejs';

// Newsletter signup used to be a client-side addDoc straight from the browser
// (lib/firestore.ts subscribeToNewsletter), which meant three things: no
// honeypot, no rate limit, and — the reason this route exists — no server-side
// hook point, so a signup could not trigger a welcome email. Routing it through
// the Admin SDK matches how every other public write on this site already works
// and lets firestore.rules deny `subscribers` create to browsers outright.
const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bots autofill the hidden field. Return success so they get no signal that
    // they were caught, and drop the payload on the floor.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(`newsletter:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const subscribers = adminDb().collection('subscribers');

    // Re-subscribing is not an error the visitor should see — the old
    // client-side path happily created duplicate documents, which then became
    // duplicate sends. Treat an existing address as success and skip the write.
    const existing = await subscribers.where('email', '==', email).limit(1).get();

    if (!existing.empty) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    const createdAt = new Date().toISOString();
    const ref = await subscribers.add({ email, createdAt });

    // Best-effort: the address is stored, so a down n8n must not read as a
    // failed signup. The double-opt-in confirmation is sent by the workflow.
    await notifyAutomation('newsletter.subscribed', {
      subscriberId: ref.id,
      email,
      createdAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);

    return NextResponse.json(
      { error: 'We could not sign you up right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
