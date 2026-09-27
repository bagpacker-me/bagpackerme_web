import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registerAffiliateAdmin } from '@/lib/affiliate-admin';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';
import { notifyAutomation } from '@/lib/automation-notify';

export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address.').max(254),
  phone: z.string().trim().max(30).optional().default(''),
  socialHandle: z.string().trim().max(100).optional().default(''),
});

function hashAffiliateEmail(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // This route was the only public POST without either guard, while every
    // sibling has both — and it permanently claims an email in
    // affiliate_registration_index, so a flood here is not merely noisy.
    // Mirrors the real success shape, message included, so a bot gets no signal
    // that it was caught — a bare {success:true} here would be a tell, since the
    // genuine response always carries a message.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({
        success: true,
        message: 'Your affiliate application has been received! We will review it within 24 hours.',
      });
    }

    if (isRateLimited(`affiliate-register:${clientIpFrom(req)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      );
    }

    const { name, email, phone, socialHandle } = parsed.data;

    const result = await registerAffiliateAdmin({
      name,
      email,
      emailHash: hashAffiliateEmail(email),
      phone,
      socialHandle,
    });

    if (!result.ok) {
      if (result.reason === 'duplicate_email') {
        return NextResponse.json(
          { error: 'An affiliate account with this email already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Could not generate a unique affiliate code. Please try again.' },
        { status: 503 }
      );
    }

    // The partner is told "we will review within 24 hours" below, so somebody has
    // to actually be told. Best-effort: the affiliate and their code already
    // exist, so this must not be able to fail the registration.
    await notifyAutomation('affiliate.registered', {
      affiliateId: result.affiliateId,
      code: result.code,
      name,
      email,
      phone: phone || null,
      socialHandle: socialHandle || null,
      registeredAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      affiliateId: result.affiliateId,
      code: result.code,
      message: 'Your affiliate application has been received! We will review it within 24 hours.',
    });
  } catch (err) {
    console.error('[affiliate/register]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
