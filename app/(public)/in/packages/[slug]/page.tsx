import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPackageBySlugForMarket, getPublishedPackagesForMarket } from '@/lib/firestore';

import HeroSection from '../../../packages/[slug]/_components/HeroSection';
import StickyNav from '../../../packages/[slug]/_components/StickyNav';
import OverviewSection from '../../../packages/[slug]/_components/OverviewSection';
import ItineraryTimeline from '../../../packages/[slug]/_components/ItineraryTimeline';
import WhatsIncluded from '../../../packages/[slug]/_components/WhatsIncluded';
import PackageGallery from '../../../packages/[slug]/_components/PackageGallery';
import BookingForm from '../../../packages/[slug]/_components/BookingForm';
import RelatedPackages from '../../../packages/[slug]/_components/RelatedPackages';

interface Props {
  params: { slug: string };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const packages = await getPublishedPackagesForMarket('india');
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlugForMarket(params.slug, 'india');

  if (!pkg) {
    return { title: 'India Package Not Found - BagPackerMe' };
  }

  return {
    title: `${pkg.metaTitle || pkg.title} | BagPackerMe India`,
    description: pkg.metaDescription || pkg.tagline,
    alternates: {
      canonical: `/in/packages/${pkg.slug}`,
    },
    openGraph: {
      title: pkg.metaTitle || pkg.title,
      description: pkg.metaDescription || pkg.tagline,
      images: [{ url: pkg.heroImageUrl }],
      type: 'website',
    },
  };
}

export default async function IndiaPackageDetailPage({ params }: Props) {
  const pkg = await getPackageBySlugForMarket(params.slug, 'india');

  if (!pkg || pkg.status !== 'published') {
    notFound();
  }

  return (
    <main className="w-full relative bg-void font-body selection:bg-lime selection:text-void">
      <HeroSection pkg={pkg} market="india" />
      <StickyNav />
      <OverviewSection pkg={pkg} market="india" />
      <ItineraryTimeline pkg={pkg} />
      <WhatsIncluded pkg={pkg} />
      <PackageGallery pkg={pkg} />
      <BookingForm pkg={pkg} />
      <RelatedPackages category={pkg.category} currentSlug={pkg.slug} market="india" />
    </main>
  );
}
