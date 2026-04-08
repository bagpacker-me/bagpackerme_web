import React from 'react';
import HeroInteractive from '@/components/home/HeroInteractive';
import EffortlessPlanning from '@/components/home/EffortlessPlanning';
import MemorableMoments from '@/components/home/MemorableMoments';
import FAQSection from '@/components/home/FAQSection';
import ImageGallery from '@/components/ui/image-gallery';


export const metadata = {
  title: 'Experiential Journeys through India | BagPackerMe',
  description: "We don't just plan trips. We create memories that last a lifetime — connecting adventurous souls with the heart of India.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface-lowest">
      <HeroInteractive />
      <EffortlessPlanning />
      <MemorableMoments />
      <ImageGallery />
      <FAQSection />

    </main>
  );
}
