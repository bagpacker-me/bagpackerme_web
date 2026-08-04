import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'India Travel Packages',
  description:
    'Explore curated India journeys across culture, food, wellness, wildlife, heritage, and adventure.',
  alternates: {
    canonical: '/in/packages',
    languages: { en: '/packages', 'en-IN': '/in/packages', 'x-default': '/packages' },
  },
};

export default function IndiaPackagesPage() {
  return (
    <>
    <JsonLd
      data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'India', path: '/in' },
        { name: 'India Packages', path: '/in/packages' },
      ])}
    />
    <PackagesListingPage
      market="india"
      eyebrow="India Journeys"
      title="Curated trips across India"
      description="From culinary trails to spiritual paths, experience the subcontinent through deeply intentional travel."
      heroImage="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600"
      heroAlt="Landscape in India with mountains and dramatic evening light"
    />
    </>
  );
}
