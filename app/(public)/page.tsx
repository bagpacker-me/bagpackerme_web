import React from 'react';
import HeroInteractive from '@/components/home/HeroInteractive';
import DiscoverTheWorld from '@/components/home/DiscoverTheWorld';
import SeasonExplorer from '@/components/home/SeasonExplorer';
import EffortlessPlanning from '@/components/home/EffortlessPlanning';
import MemorableMoments from '@/components/home/MemorableMoments';
import FAQSection from '@/components/home/FAQSection';
import ImageGallery from '@/components/ui/image-gallery';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildFaqPageSchema } from '@/lib/structured-data';
import { HOME_FAQS } from '@/lib/faq';


export const metadata = {
  title: 'Curated Global Journeys',
  description:
    "We plan experience-led journeys across Thailand, Vietnam, Kenya, India, and beyond with local detail and human care.",
  alternates: {
    canonical: '/',
    // The two markets differ by inventory, not language, but they target
    // overlapping intent, so pair the market roots. Every page lists all
    // alternates including itself, or the cluster is invalid.
    languages: { en: '/', 'en-IN': '/in', 'x-default': '/' },
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface-lowest">
      <JsonLd data={buildFaqPageSchema(HOME_FAQS)} />
      <HeroInteractive market="global" />
      <DiscoverTheWorld market="global" />
      <SeasonExplorer />
      <EffortlessPlanning market="global" />
      <MemorableMoments market="global" />
      <ImageGallery market="global" />
      <FAQSection />

    </main>
  );
}
