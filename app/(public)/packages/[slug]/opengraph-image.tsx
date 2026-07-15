import { getPackageBySlugForMarket, getPublishedPackagesForMarket } from '@/lib/firestore';
import { getPackagePrimaryPrice } from '@/lib/packagePricing';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const runtime = 'nodejs';
export const alt = 'BagPackerMe journey';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The image route is separate from the page, so it needs its own params or every
// card is generated on-demand at runtime instead of at build.
export async function generateStaticParams() {
  const packages = await getPublishedPackagesForMarket('global');
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const pkg = await getPackageBySlugForMarket(params.slug, 'global');
  if (!pkg) {
    return renderOgCard({ title: 'Private journeys, designed around you' });
  }

  const price = getPackagePrimaryPrice(pkg, 'global').label;
  const meta = [pkg.duration, pkg.destinations?.slice(0, 3).join(' · '), price]
    .filter(Boolean)
    .join('  ·  ');

  return renderOgCard({ eyebrow: pkg.category, title: pkg.title, meta });
}
