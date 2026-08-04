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
import { JsonLd } from '@/components/seo/JsonLd';
import { buildTouristTripSchema, buildBreadcrumbSchema } from '@/lib/structured-data';

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
    return { title: 'India Package Not Found' };
  }

  return {
    title: pkg.metaTitle || pkg.title,
    description: pkg.metaDescription || pkg.tagline,
    alternates: {
      canonical: `/in/packages/${pkg.slug}`,
    },
    // No `images` here — the colocated opengraph-image.tsx supplies the card and
    // would be ignored if this segment set openGraph.images. url/siteName are
    // re-stated because Next replaces (not merges) the root layout's openGraph.
    openGraph: {
      type: 'website',
      url: `/in/packages/${pkg.slug}`,
      siteName: 'BagPackerMe',
      title: pkg.metaTitle || pkg.title,
      description: pkg.metaDescription || pkg.tagline,
    },
  };
}

export default async function IndiaPackageDetailPage({ params }: Props) {
  const pkg = await getPackageBySlugForMarket(params.slug, 'india');

  if (!pkg || pkg.status !== 'published') {
    notFound();
  }

  return (
    <main className="w-full relative bg-void font-body selection:bg-lime selection:text-void pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-0">
      <JsonLd data={buildTouristTripSchema(pkg, 'india')} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'India', path: '/in' },
          { name: 'Packages', path: '/in/packages' },
          { name: pkg.title, path: `/in/packages/${pkg.slug}` },
        ])}
      />
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
