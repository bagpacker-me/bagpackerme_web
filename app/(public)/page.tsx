import React from 'react';
import Hero from '@/components/home/Hero';
import DeferredHomeSections from '@/components/home/DeferredHomeSections';
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
      <Hero market="global" />
      <DeferredHomeSections />

    </main>
  );
}
