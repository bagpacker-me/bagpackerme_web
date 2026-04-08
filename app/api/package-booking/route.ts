import { NextResponse } from 'next/server';
import { packageBookingSchema } from '@/lib/package-booking';

const PACKAGE_BOOKING_WEBHOOK_URL = 'https://n8n.srv1046139.hstgr.cloud/webhook/bpm-package';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = packageBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the booking details and try again.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const webhookResponse = await fetch(PACKAGE_BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        inquiryType: 'Package Booking',
        message: data.message ?? '',
        source: 'package-booking-page',
        submittedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      console.error('Package booking webhook failed:', webhookResponse.status, responseText);

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
