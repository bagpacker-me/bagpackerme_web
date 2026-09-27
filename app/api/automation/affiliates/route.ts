import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth } from '@/lib/automation-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_AFFILIATES = 200;

/** `?month=YYYY-MM`, defaulting to the month just gone — what a statement covers. */
function monthWindow(value: string | null): { month: string; start: string; end: string } | null {
  let year: number;
  let monthIndex: number;

  if (value && /^\d{4}-\d{2}$/.test(value.trim())) {
    const [y, m] = value.trim().split('-').map(Number);
    if (m < 1 || m > 12) return null;
    year = y;
    monthIndex = m - 1;
  } else if (value) {
    return null;
  } else {
    const now = new Date();
    year = now.getUTCFullYear();
    monthIndex = now.getUTCMonth() - 1;
  }

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 1));
  const label = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`;

  return { month: label, start: start.toISOString(), end: end.toISOString() };
}

/**
 * GET /api/automation/affiliates?month=YYYY-MM
 *
 * Feeds the monthly affiliate statement and the funnel section of the weekly
 * business report.
 *
 * Lifetime totals come off the affiliate document, but a statement needs the
 * month in isolation, and those counters are cumulative — so click and
 * conversion counts for the window are recomputed from the per-session events,
 * and commission from the bookings actually created in that month.
 *
 * Deliberately not a collectionGroup query over events: that would need an extra
 * composite index, and per-affiliate subcollection reads stay inside the
 * single-field indexes Firestore maintains on its own.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const window = monthWindow(url.searchParams.get('month'));

    if (!window) {
      return NextResponse.json({ error: 'month must be YYYY-MM.' }, { status: 400 });
    }

    const db = adminDb();
    const affiliateSnapshot = await db.collection('affiliates').limit(MAX_AFFILIATES).get();

    // One pass over the month's bookings, grouped in memory. Filtering by
    // createdAt alone keeps this on the automatic single-field index; adding
    // affiliateCode to the query would demand a composite one per lookup.
    const bookingSnapshot = await db
      .collection('bookings')
      .where('createdAt', '>=', window.start)
      .where('createdAt', '<', window.end)
      .get();

    const bookingsByCode = new Map<string, { count: number; revenue: number }>();

    bookingSnapshot.docs.forEach((doc) => {
      const raw = doc.data();
      const code = typeof raw.affiliateCode === 'string' ? raw.affiliateCode : '';
      if (!code) return;
      // Cancelled bookings earn nobody a commission.
      if (raw.status === 'cancelled') return;

      const entry = bookingsByCode.get(code) ?? { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += Number(raw.totalPrice) || 0;
      bookingsByCode.set(code, entry);
    });

    const data = await Promise.all(
      affiliateSnapshot.docs.map(async (doc) => {
        const raw = doc.data();
        const code: string = raw.code ?? doc.id;
        const commissionRate = Number(raw.commissionRate) || 10;

        const eventSnapshot = await db
          .collection('affiliate_public')
          .doc(code)
          .collection('events')
          .where('createdAt', '>=', window.start)
          .where('createdAt', '<', window.end)
          .get();

        let monthClicks = 0;
        let monthLeads = 0;

        eventSnapshot.docs.forEach((eventDoc) => {
          const event = eventDoc.data();
          monthClicks += 1;
          if (event.convertedToEnquiry) monthLeads += 1;
        });

        const booking = bookingsByCode.get(code) ?? { count: 0, revenue: 0 };

        return {
          id: doc.id,
          code,
          name: raw.name ?? '',
          email: raw.email ?? '',
          status: raw.status ?? 'pending',
          commissionRate,
          lifetime: {
            clicks: Number(raw.totalClicks) || 0,
            leads: Number(raw.totalLeads) || 0,
            bookings: Number(raw.totalBookings) || 0,
          },
          month: {
            clicks: monthClicks,
            leads: monthLeads,
            bookings: booking.count,
            revenue: Math.round(booking.revenue * 100) / 100,
            // What the statement actually pays out.
            commission: Math.round(booking.revenue * commissionRate) / 100,
          },
        };
      })
    );

    return NextResponse.json({ month: window.month, count: data.length, data });
  } catch (error) {
    console.error('[automation/affiliates]', error);
    return NextResponse.json({ error: 'Could not read affiliate data.' }, { status: 500 });
  }
}
