import { NextResponse } from 'next/server';
import { z } from 'zod';
import { contactFormSchema } from '@/lib/contact-form';
import { persistEnquiryWithAffiliateAttribution } from '@/lib/enquiry-submission';

const CONTACT_WEBHOOK_URL = 'https://n8n.srv1046139.hstgr.cloud/webhook/bpm-enquiry';
const contactSubmissionSchema = contactFormSchema.extend({
  affiliateCode: z.string().trim().optional(),
  affiliateSessionId: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the form fields and try again.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const webhookResponse = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        name: `${data.firstName} ${data.lastName}`.trim(),
        source: 'contact-us-page',
        submittedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      console.error('Contact webhook failed:', webhookResponse.status, responseText);

      return NextResponse.json(
        { error: 'We could not send your message right now. Please try again in a moment.' },
        { status: 502 }
      );
    }

    try {
      await persistEnquiryWithAffiliateAttribution(
        {
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          phone: data.phone,
          inquiryType: data.inquiryType,
          message: data.message,
          status: 'new',
          source: 'contact-us-page',
          submittedVia: 'contact-form',
          formVariant: 'contact',
          affiliateCode: data.affiliateCode,
          affiliateSessionId: data.affiliateSessionId,
          createdAt: new Date().toISOString(),
        },
        data.affiliateSessionId
      );
    } catch (error) {
      console.error('Contact enquiry persistence failed:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submission failed:', error);

    return NextResponse.json(
      { error: 'We could not send your message right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
