import React from 'react';
import HeroInteractive from '@/components/home/HeroInteractive';
import DiscoverTheWorld from '@/components/home/DiscoverTheWorld';
import EffortlessPlanning from '@/components/home/EffortlessPlanning';
import MemorableMoments from '@/components/home/MemorableMoments';
import FAQSection from '@/components/home/FAQSection';
import ImageGallery from '@/components/ui/image-gallery';

export const metadata = {
  title: 'Experiential Journeys through India | BagPackerMe',
  description:
    "Explore curated India journeys with BagPackerMe, from spiritual routes and food trails to wildlife, wellness, and heritage travel.",
};

export default function IndiaHomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-surface-lowest">
      <HeroInteractive market="india" />
      <DiscoverTheWorld market="india" />
      <EffortlessPlanning market="india" />
      <MemorableMoments market="india" />
      <ImageGallery market="india" />
      <FAQSection />
    </main>
  );
}
