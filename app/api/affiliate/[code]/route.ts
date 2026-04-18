import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateByCode, getClicksByAffiliate } from '@/lib/firestore';

/** Public GET /api/affiliate/[code] — affiliate self-service stats */
export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code?.toUpperCase();
    if (!code) {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    const affiliate = await getAffiliateByCode(code);
    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found.' }, { status: 404 });
    }

    // Only return safe public fields — never expose notes, commissionRate, or internal ID to public
    const publicData = {
      name: affiliate.name,
      code: affiliate.code,
      status: affiliate.status,
      totalClicks: affiliate.totalClicks,
      totalLeads: affiliate.totalLeads,
      totalBookings: affiliate.totalBookings,
      createdAt: affiliate.createdAt,
    };

    // Fetch recent 20 clicks for the affiliate's dashboard
    const clicksSnap = await getClicksByAffiliate(code);
    const recentClicks = clicksSnap.docs.slice(0, 20).map((d) => {
      const data = d.data();
      return {
        pageUrl: data.pageUrl,
        packageSlug: data.packageSlug,
        convertedToEnquiry: data.convertedToEnquiry,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json({ affiliate: publicData, recentClicks });
  } catch (err) {
    console.error('[affiliate/[code]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
