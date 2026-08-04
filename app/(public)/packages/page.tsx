import type { Metadata } from 'next';
import PackagesListingPage from '@/components/packages/PackagesListingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

// The catalogue is majority Europe and Japan — Switzerland, Italy, Spain,
// Portugal, the Nordics, Central Europe, Japan — with Vietnam, Thailand, and
// Kenya alongside. The previous copy led with "Thailand, Vietnam, Kenya", which
// under-described the inventory and pointed the page at intent it cannot serve
// while missing the terms it can rank for.
export const metadata: Metadata = {
  title: 'Global Travel Packages',
  description:
    'Private, tailor-made journeys from 3 to 11 nights across Europe, Japan, Vietnam, Thailand, and Kenya — planned end to end and booked with trusted local partners.',
  alternates: {
    canonical: '/packages',
    languages: { en: '/packages', 'en-IN': '/in/packages', 'x-default': '/packages' },
  },
};

export default function PackagesPage() {
  return (
    <>
    <JsonLd
      data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Packages', path: '/packages' },
      ])}
    />
    <PackagesListingPage
      market="global"
      eyebrow="Global Journeys"
      title="Curated trips around the world"
      description="Swiss rail routes, Japanese city trails, Italian classics, Vietnamese coastlines, and Kenyan safari — private itineraries built with trusted local partners."
      heroImage="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600"
      heroAlt="A safari vehicle crossing an open savannah at sunset"
    />
    </>
  );
}
