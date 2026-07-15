import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPackageBySlugAnyMarket, getPublishedPackagesForMarket } from '@/lib/firestore';

import HeroSection from './_components/HeroSection';
import StickyNav from './_components/StickyNav';
import OverviewSection from './_components/OverviewSection';
import ItineraryTimeline from './_components/ItineraryTimeline';
import WhatsIncluded from './_components/WhatsIncluded';
import PackageGallery from './_components/PackageGallery';
import BookingForm from './_components/BookingForm';
import RelatedPackages from './_components/RelatedPackages';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildTouristTripSchema, buildBreadcrumbSchema } from '@/lib/structured-data';

interface Props {
  params: { slug: string };
}

export const revalidate = 3600;

// 1. Generate Static Params for SSG (only published packages, matching Firestore security rules)
export async function generateStaticParams() {
  const packages = await getPublishedPackagesForMarket('global');
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

// 2. Generate Metadata targeting the actual package data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlugAnyMarket(params.slug);
  
  if (!pkg) {
    return { title: 'Package Not Found' };
  }

  if (pkg.market !== 'global') {
    redirect(`/in/packages/${pkg.slug}`);
  }

  return {
    title: pkg.metaTitle || pkg.title,
    description: pkg.metaDescription || pkg.tagline,
    alternates: {
      canonical: `/packages/${pkg.slug}`,
    },
    // No `images` here — the colocated opengraph-image.tsx supplies the card and
    // would be ignored if this segment set openGraph.images. url/siteName are
    // re-stated because Next replaces (not merges) the root layout's openGraph.
    openGraph: {
      type: 'website',
      url: `/packages/${pkg.slug}`,
      siteName: 'BagPackerMe',
      title: pkg.metaTitle || pkg.title,
      description: pkg.metaDescription || pkg.tagline,
    },
  };
}

// 3. Page Component
export default async function PackageDetailPage({ params }: Props) {
  const pkg = await getPackageBySlugAnyMarket(params.slug);

  // Handle 404
  if (!pkg || pkg.status !== 'published') {
    notFound();
  }

  if (pkg.market !== 'global') {
    redirect(`/in/packages/${pkg.slug}`);
  }

  return (
    <main className="w-full relative bg-void font-body selection:bg-lime selection:text-void pb-[76px] lg:pb-0">
      <JsonLd data={buildTouristTripSchema(pkg, 'global')} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Packages', path: '/packages' },
          { name: pkg.title, path: `/packages/${pkg.slug}` },
        ])}
      />

      {/* Part 1: Hero */}
      <HeroSection pkg={pkg} market="global" />

      {/* Part 2: Sticky Anchor Navigation */}
      <StickyNav />

      {/* Part 3: Overview Section */}
      <OverviewSection pkg={pkg} market="global" />

      {/* Part 4: Itinerary Timeline */}
      <ItineraryTimeline pkg={pkg} />

      {/* Part 5: What's Included */}
      <WhatsIncluded pkg={pkg} />

      {/* Part 6: Photo Gallery */}
      <PackageGallery pkg={pkg} />

      {/* Part 7: Booking Form */}
      <BookingForm pkg={pkg} />

      {/* Part 8: Related Packages */}
      <RelatedPackages category={pkg.category} currentSlug={pkg.slug} market="global" />

    </main>
  );
}
