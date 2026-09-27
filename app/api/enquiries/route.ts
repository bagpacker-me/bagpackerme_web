import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { EnquiryFormData } from '@/types';
import { persistEnquiryWithAffiliateAttribution } from '@/lib/enquiry-submission';
import { deliverEnquiry } from '@/lib/enquiry-delivery';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';

const enquiryFormDataValue = z.union([z.string(), z.array(z.string())]);

const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('A valid email is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  inquiryType: z.string().trim().min(1, 'Inquiry type is required'),
  packageSlug: z.string().trim().min(1).optional(),
  groupSize: z.coerce.number().int().positive().optional(),
  travelDate: z.string().trim().optional(),
  message: z.string().optional().default(''),
  source: z.string().trim().optional(),
  submittedVia: z.string().trim().optional(),
  formVariant: z.enum(['contact', 'package-booking', 'b2c', 'corporate']).optional(),
  formData: z.record(z.string(), enquiryFormDataValue).optional(),
  affiliateCode: z.string().trim().optional(),
  affiliateSessionId: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bots autofill the hidden field. Return success so they get no signal that
    // they were caught, and drop the payload on the floor.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(`enquiries:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the enquiry details and try again.' },
        { status: 400 }
      );
    }

    const { affiliateSessionId, formData, ...data } = parsed.data;
    const submittedAt = new Date().toISOString();

    // This route carries the two richest lead types on the site: the B2C trip
    // brief and the 7-step corporate/MICE wizard. Both used to persist silently,
    // so the highest-intent enquiries were the only ones nobody was notified
    // about. formData is forwarded verbatim because for a corporate brief that is
    // where the 20-odd answers actually live.
    const { persisted, notified } = await deliverEnquiry({
      label: 'enquiries',
      persist: () =>
        persistEnquiryWithAffiliateAttribution(
          {
            ...data,
            status: 'new',
            ...(formData ? { formData: formData as EnquiryFormData } : {}),
            createdAt: submittedAt,
          },
          affiliateSessionId
        ),
      webhookUrl: process.env.N8N_BRIEF_WEBHOOK_URL,
      webhookPayload: {
        ...data,
        ...(formData ? { formData } : {}),
        source: data.source ?? 'contact-page',
        submittedAt,
      },
    });

    // Only a genuine failure if *both* sinks rejected the enquiry.
    if (!persisted && !notified) {
      return NextResponse.json(
        { error: 'We could not save your enquiry right now. Please try again in a moment.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Public enquiry submission failed:', error);

    return NextResponse.json(
      { error: 'We could not save your enquiry right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
