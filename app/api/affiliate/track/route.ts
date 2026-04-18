import { NextRequest, NextResponse } from 'next/server';
import {
  getAffiliateByCode,
  logAffiliateClick,
  getAffiliateClicksBySession,
  incrementAffiliateClicks,
} from '@/lib/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateCode, pageUrl, packageSlug, sessionId } = body;

    if (!affiliateCode || !sessionId) {
      return NextResponse.json({ error: 'affiliateCode and sessionId are required.' }, { status: 400 });
    }

    // Look up the affiliate
    const affiliate = await getAffiliateByCode(affiliateCode.toUpperCase());
    if (!affiliate || affiliate.status !== 'active') {
      // Silently ignore invalid/inactive codes — don't expose errors to users
      return NextResponse.json({ tracked: false });
    }

    // Deduplicate: don't count the same session+code twice
    const alreadyTracked = await getAffiliateClicksBySession(sessionId, affiliateCode.toUpperCase());
    if (alreadyTracked) {
      return NextResponse.json({ tracked: false, reason: 'duplicate' });
    }

    const now = new Date().toISOString();
    await logAffiliateClick({
      affiliateCode: affiliate.code,
      affiliateId: affiliate.id,
      pageUrl: pageUrl || '',
      packageSlug: packageSlug || '',
      referrer: req.headers.get('referer') || '',
      sessionId,
      convertedToEnquiry: false,
      convertedToBooking: false,
      createdAt: now,
    });

    // Increment the affiliate's totalClicks counter
    await incrementAffiliateClicks(affiliate.id);

    return NextResponse.json({ tracked: true });
  } catch (err) {
    console.error('[affiliate/track]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
