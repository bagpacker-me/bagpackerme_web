import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';

export const metadata: Metadata = {
  title: 'India Travel Packages | BagPackerMe',
  description:
    'Explore curated India journeys across culture, food, wellness, wildlife, heritage, and adventure.',
  alternates: {
    canonical: '/in/packages',
  },
};

export default function IndiaPackagesPage() {
  return (
    <PackagesListingPage
      market="india"
      eyebrow="India Journeys"
      title="Curated trips across India"
      description="From culinary trails to spiritual paths, experience the subcontinent through deeply intentional travel."
      heroImage="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600"
      heroAlt="Landscape in India with mountains and dramatic evening light"
    />
  );
}
