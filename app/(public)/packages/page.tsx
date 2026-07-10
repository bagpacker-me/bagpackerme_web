import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';

export const metadata: Metadata = {
  title: 'Global Travel Packages | BagPackerMe',
  description:
    'Explore curated international journeys across Thailand, Vietnam, Kenya, and more with BagPackerMe.',
  alternates: {
    canonical: '/packages',
  },
};

export default function PackagesPage() {
  return (
    <PackagesListingPage
      market="global"
      eyebrow="Global Journeys"
      title="Curated trips around the world"
      description="Thailand beaches, Vietnam culture, Kenya safaris, and bespoke routes built with trusted local partners."
      heroImage="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600"
      heroAlt="A safari vehicle crossing an open savannah at sunset"
    />
  );
}
