import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPackageBySlug, getPackages } from '@/lib/firestore';

import HeroSection from './_components/HeroSection';
import StickyNav from './_components/StickyNav';
import OverviewSection from './_components/OverviewSection';
import ItineraryTimeline from './_components/ItineraryTimeline';
import WhatsIncluded from './_components/WhatsIncluded';
import PackageGallery from './_components/PackageGallery';
import BookingForm from './_components/BookingForm';
import RelatedPackages from './_components/RelatedPackages';

interface Props {
  params: { slug: string };
}

// 1. Generate Static Params for SSG
export async function generateStaticParams() {
  const packagesSnapshot = await getPackages();
  return packagesSnapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// 2. Generate Metadata targeting the actual package data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlug(params.slug);
  
  if (!pkg) {
    return { title: 'Package Not Found - BagPackerMe' };
  }

  return {
    title: `${pkg.metaTitle || pkg.title} | BagPackerMe`,
    description: pkg.metaDescription || pkg.tagline,
    openGraph: {
      title: pkg.metaTitle || pkg.title,
      description: pkg.metaDescription || pkg.tagline,
      images: [{ url: pkg.heroImageUrl }],
      type: 'website'
    },
  };
}

// 3. Page Component
export default async function PackageDetailPage({ params }: Props) {
  const pkg = await getPackageBySlug(params.slug);

  // Handle 404
  if (!pkg || pkg.status !== 'published') {
    notFound();
  }

  return (
    <main className="w-full relative bg-void font-body selection:bg-lime selection:text-void">
      
      {/* Part 1: Hero */}
      <HeroSection pkg={pkg} />

      {/* Part 2: Sticky Anchor Navigation */}
      <StickyNav />

      {/* Part 3: Overview Section */}
      <OverviewSection pkg={pkg} />

      {/* Part 4: Itinerary Timeline */}
      <ItineraryTimeline pkg={pkg} />

      {/* Part 5: What's Included */}
      <WhatsIncluded pkg={pkg} />

      {/* Part 6: Photo Gallery */}
      <PackageGallery pkg={pkg} />

      {/* Part 7: Booking Form */}
      <BookingForm pkg={pkg} />

      {/* Part 8: Related Packages */}
      <RelatedPackages category={pkg.category} currentSlug={pkg.slug} />

    </main>
  );
}
