import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth, parseLimit, parseSince } from '@/lib/automation-auth';

// Admin SDK.
export const runtime = 'nodejs';
// Never cache: the follow-up and digest workflows read this to decide who has
// been contacted, so a stale response means a traveller gets chased twice.
export const dynamic = 'force-dynamic';

/**
 * GET /api/automation/enquiries?status=new&since=<iso>&limit=100
 *
 * Feeds the daily lead digest and the stale-lead follow-up sequence.
 *
 * `status` and `since` map onto the composite index that already exists for
 * (status, createdAt) — see firestore.indexes.json — so filtering on both is a
 * single indexed query rather than a scan.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status')?.trim();
    const since = parseSince(url.searchParams.get('since'));
    const limit = parseLimit(url.searchParams.get('limit'));

    let query = adminDb().collection('enquiries').orderBy('createdAt', 'desc');

    if (status) query = query.where('status', '==', status);
    if (since) query = query.where('createdAt', '>=', since);

    const snapshot = await query.limit(limit).get();

    const data = snapshot.docs.map((doc) => {
      const raw = doc.data();

      return {
        id: doc.id,
        name: raw.name ?? '',
        email: raw.email ?? '',
        phone: raw.phone ?? '',
        inquiryType: raw.inquiryType ?? '',
        status: raw.status ?? 'new',
        source: raw.source ?? null,
        submittedVia: raw.submittedVia ?? null,
        formVariant: raw.formVariant ?? null,
        packageSlug: raw.packageSlug ?? null,
        groupSize: raw.groupSize ?? null,
        travelDate: raw.travelDate ?? null,
        message: raw.message ?? '',
        formData: raw.formData ?? null,
        affiliateCode: raw.affiliateCode ?? null,
        createdAt: raw.createdAt ?? null,
        // Written back by the follow-up workflow so a re-run cannot double-nudge.
        lastNudgedAt: raw.lastNudgedAt ?? null,
        nudgeCount: raw.nudgeCount ?? 0,
      };
    });

    return NextResponse.json({ count: data.length, data });
  } catch (error) {
    console.error('[automation/enquiries]', error);
    return NextResponse.json({ error: 'Could not read enquiries.' }, { status: 500 });
  }
}
