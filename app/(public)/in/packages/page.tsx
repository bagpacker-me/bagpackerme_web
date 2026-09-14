import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildPackageCollectionSchema } from '@/lib/structured-data';
import { getPublishedPackagesForMarket } from '@/lib/firestore';
import type { Package } from '@/types';

export const metadata: Metadata = {
  title: 'India Travel Packages: Culture & Wellness',
  description:
    'Discover curated India travel packages for food, wildlife, heritage, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
  alternates: {
    canonical: '/in/packages',
    languages: { en: '/packages', 'en-IN': '/in/packages', 'x-default': '/packages' },
  },
  openGraph: {
    type: 'website',
    url: '/in/packages',
    siteName: 'BagPackerMe',
    title: 'India Travel Packages: Culture & Wellness',
    description:
      'Discover curated India travel packages for food, wildlife, heritage, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Travel Packages: Culture & Wellness',
    description:
      'Discover curated India travel packages for food, wildlife, heritage, wellness and romantic escapes. Tailor your route, stays and pace with BagPackerMe.',
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
      title="Curated trips across India"
      description="From culinary trails to spiritual paths, experience the subcontinent through deeply intentional travel."
      heroImage="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600"
      heroAlt="Landscape in India with mountains and dramatic evening light"
      initialPackages={initialPackages}
    />
    </>
  );
}
