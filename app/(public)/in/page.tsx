import React from 'react';
import HeroInteractive from '@/components/home/HeroInteractive';
import DiscoverTheWorld from '@/components/home/DiscoverTheWorld';
import EffortlessPlanning from '@/components/home/EffortlessPlanning';
import MemorableMoments from '@/components/home/MemorableMoments';
import FAQSection from '@/components/home/FAQSection';
import ImageGallery from '@/components/ui/image-gallery';
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
      <HeroInteractive market="india" />
      <DiscoverTheWorld market="india" />
      <EffortlessPlanning market="india" />
      <MemorableMoments market="india" />
      <ImageGallery market="india" />
      <FAQSection />
    </main>
  );
}
