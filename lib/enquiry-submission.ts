import type { Enquiry } from '@/types';
import { createEnquiry, incrementAffiliatePublicMetric, markAffiliatePublicEventConversion } from '@/lib/firestore';
import { normalizeAffiliateCode, normalizeAffiliateSessionId } from '@/lib/affiliate';

export async function persistEnquiryWithAffiliateAttribution(
  enquiry: Omit<Enquiry, 'id'>,
  affiliateSessionId?: string | null
) {
  await createEnquiry(enquiry);

  const affiliateCode = normalizeAffiliateCode(enquiry.affiliateCode);
  const normalizedSessionId = normalizeAffiliateSessionId(affiliateSessionId);

  if (!affiliateCode) {
    return;
  }

  if (!normalizedSessionId) {
    await incrementAffiliatePublicMetric(affiliateCode, 'totalLeads');
    return;
  }

  await markAffiliatePublicEventConversion(affiliateCode, normalizedSessionId, 'enquiry');
}
