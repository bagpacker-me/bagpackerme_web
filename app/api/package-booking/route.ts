import { NextResponse } from 'next/server';
import { z } from 'zod';
import { packageBookingSchema } from '@/lib/package-booking';
import { persistEnquiryWithAffiliateAttribution } from '@/lib/enquiry-submission';
import { deliverEnquiry } from '@/lib/enquiry-delivery';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';

const packageBookingSubmissionSchema = packageBookingSchema.extend({
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

    if (isRateLimited(`package-booking:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = packageBookingSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the booking details and try again.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { persisted, notified } = await deliverEnquiry({
      label: 'package-booking',
      persist: () =>
        persistEnquiryWithAffiliateAttribution(
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            inquiryType: 'Package Booking',
            packageSlug: data.packageSlug,
            groupSize: data.groupSize,
            travelDate: data.travelDate,
            message: data.message ?? '',
            status: 'new',
            source: 'package-booking-page',
            submittedVia: 'whatsapp-handoff',
            formVariant: 'package-booking',
            affiliateCode: data.affiliateCode,
            affiliateSessionId: data.affiliateSessionId,
            createdAt: new Date().toISOString(),
          },
          data.affiliateSessionId
        ),
      webhookUrl: process.env.N8N_PACKAGE_WEBHOOK_URL,
      webhookPayload: {
        ...data,
        inquiryType: 'Package Booking',
        message: data.message ?? '',
        source: 'package-booking-page',
        submittedAt: new Date().toISOString(),
      },
    });

    // Only a genuine failure if *both* sinks rejected the enquiry.
    if (!persisted && !notified) {
      return NextResponse.json(
        { error: 'We could not send your booking right now. Please try again in a moment.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Package booking submission failed:', error);

    return NextResponse.json(
      { error: 'We could not send your booking right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
