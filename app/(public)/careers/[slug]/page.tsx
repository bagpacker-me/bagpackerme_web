import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildJobPostingSchema } from '@/lib/structured-data';
import { getPublishedJobOpenings, getPublishedJobOpeningBySlug } from '@/lib/careers-server';
import JobDetailContent from './_components/JobDetailContent';

export const revalidate = 300;

export async function generateStaticParams() {
  const jobs = await getPublishedJobOpenings();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await getPublishedJobOpeningBySlug(params.slug);

  if (!job) {
    return { title: 'Role not found' };
  }

  const where = job.locationType === 'remote' ? 'Remote' : job.location;

  return {
    title: job.title,
    description: `${job.title} — ${where}. Join the team designing bespoke journeys at BagPackerMe.`,
    alternates: { canonical: `/careers/${job.slug}` },
  };
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getPublishedJobOpeningBySlug(params.slug);

  // Covers a draft, a closed role, and a bad slug alike — an unpublished role
  // must not be reachable by guessing its URL.
  //
  // KNOWN LIMITATION: this renders the 404 page but the response still carries
  // HTTP 200 — a soft 404. app/(public)/loading.tsx puts a Suspense boundary
  // above every public route, so Next streams and flushes the status before
  // this code runs; nothing thrown from here (or from generateMetadata — tested)
  // can change it afterwards. /blog/[slug] and /packages/[slug] have the same
  // behaviour in production today.
  //
  // Worth fixing for careers specifically: Google wants an expired or missing
  // JobPosting URL to return 404/410, and a 200 risks the postings being
  // dropped. The one change that works is removing app/(public)/loading.tsx,
  // which trades away streaming on every public route — a site-wide call, not
  // one to make quietly from here.
  if (!job) notFound();

  return (
    <>
      {/* One JobPosting per page: Google rejects a page carrying several, which
          is why the listing at /careers links here rather than inlining these. */}
      <JsonLd data={buildJobPostingSchema(job)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
          { name: job.title, path: `/careers/${job.slug}` },
        ])}
      />
      <JobDetailContent job={job} />
    </>
  );
}
