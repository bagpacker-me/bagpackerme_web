import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildPackageCollectionSchema } from '@/lib/structured-data';
import { getPublishedPackagesForMarket } from '@/lib/firestore';
import type { Package } from '@/types';

export const metadata: Metadata = {
  title: 'India Travel Packages: Curated Journeys',
  description:
    'Discover curated India travel packages for heritage, food, wildlife, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
  keywords: [
    'India travel packages',
    'private India tours',
    'India heritage tours',
    'India wellness trips',
    'custom India itineraries',
    'Gujarat textile tour',
    'North India spiritual tour',
    'Golden Triangle Jodhpur tour',
    'Nainital culinary tour',
    'Kerala riverside retreat',
    'Kashmir culinary tour',
    'Jaipur food tour',
    'Golden Triangle Mandawa tour',
    'Golden Triangle Udaipur tour',
    'Sariska luxury safari',
    'Sariska couples retreat',
  ],
  alternates: {
    canonical: '/in/packages',
    languages: { en: '/packages', 'en-IN': '/in/packages', 'x-default': '/packages' },
  },
  openGraph: {
    type: 'website',
    url: '/in/packages',
    siteName: 'BagPackerMe',
    title: 'India Travel Packages: Curated Journeys',
    description:
      'Discover curated India travel packages for heritage, food, wildlife, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
    images: [
      {
        url: '/images/packages/india/india-curated-journeys-hero.png',
        alt: 'Sunrise over an Indian lake, hills and a distant heritage palace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Travel Packages: Curated Journeys',
    description:
      'Discover curated India travel packages for heritage, food, wildlife, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
    images: ['/images/packages/india/india-curated-journeys-hero.png'],
  },
};

export default async function IndiaPackagesPage() {
  // Render the actual package cards in the initial document. The previous
  // client-only fetch left crawlers with a grid of loading skeletons and no
  // internal links to the India package pages.
  let initialPackages: Package[] = [];
  try {
    initialPackages = await getPublishedPackagesForMarket('india');
  } catch {
    // The client-side refresh remains a fallback if the upstream public read is
    // temporarily unavailable during a server render.
  }

  return (
    <>
    <JsonLd
      data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'India', path: '/in' },
        { name: 'India Packages', path: '/in/packages' },
      ])}
    />
    {initialPackages.length > 0 && (
      <JsonLd data={buildPackageCollectionSchema(initialPackages, 'india')} />
    )}
    <PackagesListingPage
      market="india"
      eyebrow="India Journeys"
      title="India travel packages, curated around you"
      description="Discover heritage, food, wildlife, wellness and festival journeys designed with local context, a slower rhythm and room to make every detail your own."
      heroImage="/images/packages/india/india-curated-journeys-hero.png"
      heroAlt="Sunrise over an Indian lake, hills and a distant heritage palace"
      initialPackages={initialPackages}
    />
    </>
  );
}
