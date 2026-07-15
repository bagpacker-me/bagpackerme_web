import 'server-only';

import type { Enquiry } from '@/types';
import {
  createEnquiryAdmin,
  incrementMetricAdmin,
  markConversionAdmin,
} from '@/lib/affiliate-admin';
import { normalizeAffiliateCode, normalizeAffiliateSessionId } from '@/lib/affiliate';

/**
 * Only the API routes (contact, package-booking, enquiries) create enquiries,
 * so this runs through the Admin SDK and firestore.rules can deny enquiry
 * writes to browsers outright.
 */
export async function persistEnquiryWithAffiliateAttribution(
  enquiry: Omit<Enquiry, 'id'>,
  affiliateSessionId?: string | null
) {
  await createEnquiryAdmin(enquiry);

  const affiliateCode = normalizeAffiliateCode(enquiry.affiliateCode);
  const normalizedSessionId = normalizeAffiliateSessionId(affiliateSessionId);

  if (!affiliateCode) {
    return;
  }

  // Attribution is best-effort: a bad affiliate code must not lose the lead.
  try {
    if (!normalizedSessionId) {
      await incrementMetricAdmin(affiliateCode, 'totalLeads');
      return;
    }

    await markConversionAdmin(affiliateCode, normalizedSessionId, 'enquiry');
  } catch (err) {
    console.error('[enquiry-submission] affiliate attribution failed', affiliateCode, err);
  }
}
