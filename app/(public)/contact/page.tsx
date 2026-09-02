import type { Metadata } from 'next';
import { InquiryExperiencePage } from '@/components/inquiry/InquiryExperiencePage';

export const metadata: Metadata = {
  title: 'Contact, Trip Planning & Corporate Retreats',
  description:
    'Start every BagPackerMe enquiry from one contact hub for custom trips, corporate retreats, and general questions.',
  // Intent is selected with a non-crawlable URL fragment, so every enquiry
  // variation shares one canonical document URL.
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <InquiryExperiencePage />;
}
