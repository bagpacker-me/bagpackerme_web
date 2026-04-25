import type { Metadata } from 'next';
import { InquiryExperiencePage } from '@/components/inquiry/InquiryExperiencePage';
import { normalizeContactIntent } from '@/lib/contact-intent';

export const metadata: Metadata = {
  title: 'Contact, Trip Planning & Corporate Retreats',
  description:
    'Start every BagPackerMe enquiry from one contact hub for custom trips, corporate retreats, and general questions.',
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: {
    intent?: string | string[];
  };
}) {
  const rawIntent = Array.isArray(searchParams?.intent)
    ? searchParams?.intent[0]
    : searchParams?.intent;
  const initialIntent = normalizeContactIntent(rawIntent);

  return <InquiryExperiencePage initialIntent={initialIntent} />;
}
