import React from 'react';
import Hero from '@/components/home/Hero';
import DeferredHomeSections from '@/components/home/DeferredHomeSections';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';

export const metadata = {
  title: 'Experiential Journeys through India',
  description:
    "Explore curated India journeys with BagPackerMe, from spiritual routes and food trails to wildlife, wellness, and heritage travel.",
  alternates: {
    canonical: '/in',
    languages: { en: '/', 'en-IN': '/in', 'x-default': '/' },
  },
};

export default function IndiaHomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-surface-lowest">
      {/* No FAQPage block here. The India page renders the same HOME_FAQS as
          the global home, and emitting byte-identical FAQPage markup on two
          different canonicals is duplicate structured data with no upside —
          Google retired FAQ rich results for all sites on 7 May 2026, so the
          only remaining consumers are non-Google parsers. The single instance
          on / is enough. Give this page its own FAQ set and the block can
          come back. */}
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'India', path: '/in' },
        ])}
      />
      <Hero market="india" />
      <DeferredHomeSections market="india" includeSeason={false} />
    </main>
  );
}
