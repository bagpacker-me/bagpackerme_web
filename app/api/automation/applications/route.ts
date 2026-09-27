import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth, parseLimit, parseSince } from '@/lib/automation-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLLECTIONS = {
  club: 'club_applications',
  careers: 'job_applications',
} as const;

type ApplicationType = keyof typeof COLLECTIONS;

/**
 * GET /api/automation/applications?type=club|careers&status=new&since=<iso>
 *
 * Feeds the daily review digest, whose job is to make sure nothing sits
 * unanswered. Candidate and applicant PII is returned, which is why this route
 * is bearer-guarded and why the CV is deliberately absent — see below.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type')?.trim() as ApplicationType | undefined;

    if (!type || !(type in COLLECTIONS)) {
      return NextResponse.json(
        { error: "type must be 'club' or 'careers'." },
        { status: 400 }
      );
    }

    const status = url.searchParams.get('status')?.trim();
    const since = parseSince(url.searchParams.get('since'));
    const limit = parseLimit(url.searchParams.get('limit'));

    let query = adminDb().collection(COLLECTIONS[type]).orderBy('createdAt', 'desc');

    if (status) query = query.where('status', '==', status);
    if (since) query = query.where('createdAt', '>=', since);

    const snapshot = await query.limit(limit).get();

    const data = snapshot.docs.map((doc) => {
      const raw = doc.data();

      const shared = {
        id: doc.id,
        email: raw.email ?? '',
        phone: raw.phone ?? '',
        status: raw.status ?? 'new',
        createdAt: raw.createdAt ?? null,
      };

      if (type === 'club') {
        return {
          ...shared,
          fullName: raw.fullName ?? '',
          city: raw.city ?? null,
          gender: raw.gender ?? null,
          dateOfBirth: raw.dateOfBirth ?? null,
          discoverySource: raw.discoverySource ?? null,
          trip: raw.trip || null,
          personality: raw.personality ?? null,
        };
      }

      return {
        ...shared,
        fullName: raw.fullName ?? '',
        jobTitle: raw.jobTitle ?? 'Unknown role',
        jobSlug: raw.jobSlug ?? '',
        yearsExperience: raw.yearsExperience ?? null,
        noticePeriod: raw.noticePeriod ?? null,
        linkedinUrl: raw.linkedinUrl ?? null,
        portfolioUrl: raw.portfolioUrl ?? null,
        // The CV itself is never exposed here. storage.rules denies it to
        // everyone and it is streamed only by the admin-cookie-gated route
        // app/api/admin/applications/[id]/cv, so the digest links to the panel.
        hasCv: Boolean(raw.cvPath),
        cvFilename: raw.cvFilename ?? null,
      };
    });

    return NextResponse.json({ type, count: data.length, data });
  } catch (error) {
    console.error('[automation/applications]', error);
    return NextResponse.json({ error: 'Could not read applications.' }, { status: 500 });
  }
}
