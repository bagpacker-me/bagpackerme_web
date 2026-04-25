import type { Metadata } from 'next';
import { InquiryExperiencePage } from '@/components/inquiry/InquiryExperiencePage';

export const metadata: Metadata = {
  title: 'Corporate Retreats & MICE',
  description:
    'Plan your BagPackerMe corporate retreat through a guided 7-step brief covering attendees, stay, meetings, food, activities, budget, and contact details.',
};

export default function CorporatePage() {
  return <InquiryExperiencePage variant="corporate" />;
}
