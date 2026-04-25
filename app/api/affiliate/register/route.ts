import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createAffiliateWithPublicRecords, getAffiliatePublic, getAffiliateRegistrationIndex } from '@/lib/firestore';
import { normalizeAffiliateCode } from '@/lib/affiliate';

/** Generates a unique affiliate code like BP-JOHN42 */
function generateCode(name: string): string {
  const prefix = name.trim().split(' ')[0].toUpperCase().slice(0, 6).replace(/[^A-Z]/g, '');
  const suffix = Math.floor(10 + Math.random() * 90).toString();
  return `BP-${prefix}${suffix}`;
}

function hashAffiliateEmail(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, socialHandle } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = hashAffiliateEmail(normalizedEmail);
    const registrationIndexSnap = await getAffiliateRegistrationIndex(emailHash);
    if (registrationIndexSnap.exists()) {
      return NextResponse.json(
        { error: 'An affiliate account with this email already exists.' },
        { status: 409 }
      );
    }

    // Generate a unique code (retry up to 5 times)
    let code = normalizeAffiliateCode(generateCode(name));
    for (let i = 0; i < 5; i++) {
      const codeExists = await getAffiliatePublic(code);
      if (!codeExists.exists()) break;
      code = normalizeAffiliateCode(generateCode(name));
    }

    const finalCodeCheck = await getAffiliatePublic(code);
    if (finalCodeCheck.exists()) {
      return NextResponse.json(
        { error: 'Could not generate a unique affiliate code. Please try again.' },
        { status: 500 }
      );
    }

    const now = new Date().toISOString();
    const affiliateData = {
      name: name.trim(),
      email: normalizedEmail,
      emailHash,
      phone: phone?.trim() || '',
      socialHandle: socialHandle?.trim() || '',
      code,
      status: 'pending' as const,
      commissionRate: 10,
      totalClicks: 0,
      totalLeads: 0,
      totalBookings: 0,
      notes: '',
      createdAt: now,
      updatedAt: now,
    };

    const ref = await createAffiliateWithPublicRecords(affiliateData);

    return NextResponse.json({
      success: true,
      affiliateId: ref.id,
      code,
      message: 'Your affiliate application has been received! We will review it within 24 hours.',
    });
  } catch (err) {
    console.error('[affiliate/register]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
