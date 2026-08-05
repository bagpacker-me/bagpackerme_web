import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateDashboardAdmin } from '@/lib/affiliate-admin';

export const runtime = 'nodejs';

/** Public GET /api/affiliate/[code] — affiliate self-service stats */
export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // Returns only the mirror's public fields — never notes, commissionRate,
    // or the private affiliate id. See getAffiliateDashboardAdmin.
    const dashboard = await getAffiliateDashboardAdmin(params.code, 20);
    if (!dashboard) {
      return NextResponse.json({ error: 'Affiliate not found.' }, { status: 404 });
    }

    return NextResponse.json(dashboard);
  } catch (err) {
    console.error('[affiliate/[code]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
