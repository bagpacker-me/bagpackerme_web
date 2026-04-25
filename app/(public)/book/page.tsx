import type { Metadata } from 'next';
import { InquiryExperiencePage } from '@/components/inquiry/InquiryExperiencePage';

export const metadata: Metadata = {
  title: 'Book Your India Trip',
  description:
    'Share your destination ideas, trip vibe, duration, and travel timing, then continue the conversation with BagPackerMe on WhatsApp.',
};

export default function BookPage() {
  return <InquiryExperiencePage variant="b2c" />;
}
