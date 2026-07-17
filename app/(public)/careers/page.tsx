import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import { getPublishedJobOpenings } from '@/lib/careers-server';
import CareersContent from './_components/CareersContent';

// No `languages` key: careers is market-agnostic, like /about and /blog. There
// is no /in/careers to pair with.
export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join the team designing bespoke journeys at BagPackerMe. See our open roles and how we work.',
  alternates: { canonical: '/careers' },
};

// Matches the cache in getPublishedJobOpenings, so publishing a role shows up
// within five minutes without a redeploy.
export const revalidate = 300;

export default async function CareersPage() {
  const jobs = await getPublishedJobOpenings();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
        ])}
      />
      <CareersContent jobs={jobs} />
    </>
  );
}
