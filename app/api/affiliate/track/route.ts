import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackAffiliateClickAdmin } from '@/lib/affiliate-admin';

export const runtime = 'nodejs';

const trackSchema = z.object({
  affiliateCode: z.string().trim().min(1, 'affiliateCode is required.').max(64),
  sessionId: z.string().trim().min(1, 'sessionId is required.').max(128),
  pageUrl: z.string().trim().max(2048).optional().default(''),
  packageSlug: z.string().trim().max(200).optional().default(''),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      );
    }

    const result = await trackAffiliateClickAdmin({
      ...parsed.data,
      referrer: req.headers.get('referer')?.slice(0, 2048) || '',
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[affiliate/track]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
