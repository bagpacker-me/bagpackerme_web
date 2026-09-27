import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth, parseLimit, parseSince } from '@/lib/automation-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/automation/subscribers?since=<iso>&limit=500
 *
 * Feeds the monthly newsletter digest and the subscriber-growth line of the
 * weekly business report. Confirmation state lives in n8n's own data table
 * rather than here, so the digest workflow intersects this list with its
 * confirmed set instead of trusting either alone.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const since = parseSince(url.searchParams.get('since'));
    const limit = parseLimit(url.searchParams.get('limit'), 500);

    let query = adminDb().collection('subscribers').orderBy('createdAt', 'desc');
    if (since) query = query.where('createdAt', '>=', since);

    const snapshot = await query.limit(limit).get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email ?? '',
      createdAt: doc.data().createdAt ?? null,
    }));

    return NextResponse.json({ count: data.length, data });
  } catch (error) {
    console.error('[automation/subscribers]', error);
    return NextResponse.json({ error: 'Could not read subscribers.' }, { status: 500 });
  }
}
