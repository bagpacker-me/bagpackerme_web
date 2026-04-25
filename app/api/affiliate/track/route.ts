import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliatePublicClick } from '@/lib/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateCode, pageUrl, packageSlug, sessionId } = body;

    if (!affiliateCode || !sessionId) {
      return NextResponse.json({ error: 'affiliateCode and sessionId are required.' }, { status: 400 });
    }

    const result = await trackAffiliatePublicClick({
      affiliateCode,
      pageUrl: pageUrl || '',
      packageSlug: packageSlug || '',
      referrer: req.headers.get('referer') || '',
      sessionId,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[affiliate/track]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
