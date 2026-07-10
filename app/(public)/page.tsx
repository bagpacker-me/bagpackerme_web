import React from 'react';
import HeroInteractive from '@/components/home/HeroInteractive';
import DiscoverTheWorld from '@/components/home/DiscoverTheWorld';
import EffortlessPlanning from '@/components/home/EffortlessPlanning';
import MemorableMoments from '@/components/home/MemorableMoments';
import FAQSection from '@/components/home/FAQSection';
import ImageGallery from '@/components/ui/image-gallery';


export const metadata = {
  title: 'Curated Global Journeys | BagPackerMe',
  description:
    "We plan experience-led journeys across Thailand, Vietnam, Kenya, India, and beyond with local detail and human care.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface-lowest">
      <HeroInteractive market="global" />
      <DiscoverTheWorld market="global" />
      <EffortlessPlanning market="global" />
      <MemorableMoments market="global" />
      <ImageGallery market="global" />
      <FAQSection />

    </main>
  );
}
