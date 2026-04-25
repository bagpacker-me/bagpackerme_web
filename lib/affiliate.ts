import type { Affiliate, AffiliatePublic } from '@/types';

export function normalizeAffiliateCode(code?: string | null) {
  return code?.trim().toUpperCase() || '';
}

export function normalizeAffiliateSessionId(sessionId?: string | null) {
  return sessionId?.trim() || '';
}

export function buildAffiliatePublicData(
  affiliate: Pick<Affiliate, 'name' | 'code' | 'status' | 'createdAt'> &
    Partial<Pick<Affiliate, 'updatedAt' | 'totalClicks' | 'totalLeads' | 'totalBookings'>>
): AffiliatePublic {
  return {
    code: normalizeAffiliateCode(affiliate.code),
    name: affiliate.name,
    status: affiliate.status,
    totalClicks: affiliate.totalClicks ?? 0,
    totalLeads: affiliate.totalLeads ?? 0,
    totalBookings: affiliate.totalBookings ?? 0,
    createdAt: affiliate.createdAt,
    updatedAt: affiliate.updatedAt || new Date().toISOString(),
  };
}

export function mergeAffiliatePublicStats<T extends Affiliate>(
  affiliate: T,
  affiliatePublic?: AffiliatePublic | null
): T {
  if (!affiliatePublic) {
    return affiliate;
  }

  return {
    ...affiliate,
    totalClicks: affiliatePublic.totalClicks,
    totalLeads: affiliatePublic.totalLeads,
    totalBookings: affiliatePublic.totalBookings,
    status: affiliatePublic.status || affiliate.status,
  };
}
