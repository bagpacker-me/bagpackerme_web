import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildContactWhatsAppMessage, contactFormSchema } from '@/lib/contact-form';
import { persistEnquiryWithAffiliateAttribution } from '@/lib/enquiry-submission';
import { deliverEnquiry } from '@/lib/enquiry-delivery';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';

const contactSubmissionSchema = contactFormSchema.extend({
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

    if (isRateLimited(`contact:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the form fields and try again.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const whatsappMessage = buildContactWhatsAppMessage(data);
    const { persisted, notified } = await deliverEnquiry({
      label: 'contact',
      persist: () =>
        persistEnquiryWithAffiliateAttribution(
          {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            phone: data.phone,
            inquiryType: data.inquiryType,
            message: whatsappMessage,
            status: 'new',
            source: 'contact-page',
            submittedVia: 'contact-form',
            formVariant: 'contact',
            formData: {
              firstName: data.firstName.trim(),
              lastName: data.lastName.trim(),
              email: data.email.trim(),
              phone: data.phone.trim(),
              inquiryType: data.inquiryType,
              message: data.message.trim(),
            },
            affiliateCode: data.affiliateCode,
            affiliateSessionId: data.affiliateSessionId,
            createdAt: new Date().toISOString(),
          },
          data.affiliateSessionId
        ),
      webhookUrl: process.env.N8N_ENQUIRY_WEBHOOK_URL,
      webhookPayload: {
        ...data,
        name: `${data.firstName} ${data.lastName}`.trim(),
        source: 'contact-page',
        submittedAt: new Date().toISOString(),
      },
    });

    // Only a genuine failure if *both* sinks rejected the enquiry.
    if (!persisted && !notified) {
      return NextResponse.json(
        { error: 'We could not send your message right now. Please try again in a moment.' },
        { status: 502 }
      );
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
