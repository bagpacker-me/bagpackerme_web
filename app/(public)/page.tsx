import React from 'react';
import { HeroSectionAnimated } from '@/components/home/HeroSectionAnimated';
import StatsSection from '@/components/home/StatsSection';
import FeaturedTrips from '@/components/home/FeaturedTrips';
import AboutSection from '@/components/home/AboutSection';
import WhatWeDo from '@/components/home/WhatWeDo';
import BlogPreview from '@/components/home/BlogPreview';
import AudienceSplit from '@/components/home/AudienceSplit';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata = {
  title: 'Experiential Journeys through India | BagPackerMe',
  description: "We don't just plan trips. We create memories that last a lifetime — connecting adventurous souls with the heart of India.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-void">
      <HeroSectionAnimated />
      <StatsSection />
      <FeaturedTrips />
      <AboutSection />
      <WhatWeDo />
      <BlogPreview />
      <AudienceSplit />
      <NewsletterSection />
    </main>
  );
}
