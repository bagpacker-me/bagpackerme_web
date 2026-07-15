import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registerAffiliateAdmin } from '@/lib/affiliate-admin';

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
