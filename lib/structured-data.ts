import { SITE_URL, absoluteUrl } from '@/lib/site-url';
import { getPackagePrimaryPrice, hasPackagePrice } from '@/lib/packagePricing';
import type { ResolvedSiteSettings } from '@/lib/site-settings';
import { findAuthor } from '@/lib/authors';
import type { FaqItem } from '@/lib/faq';
import type { BlogPost, JobOpening, JobType, Package, PackageMarket } from '@/types';

// A loose alias at the boundary so JSON.stringify is happy; each builder returns
// a precise object literal internally. No `any`.
export type JsonLdDocument = { '@context': 'https://schema.org' } & Record<string, unknown>;
export interface BreadcrumbItem { name: string; path: string }

const CONTEXT = 'https://schema.org' as const;

// Firestore stores an empty string for an unset image rather than omitting the
// field, and `image: ""` is an invalid value Google reports as an error — worse
// than having no image property at all. Omit rather than emit the empty.
const optionalImage = (url: string | undefined) =>
  url && url.trim() ? { image: url } : {};
// Stable @ids so blocks in separate <script> tags cross-reference. Google merges
// all JSON-LD on a page before resolving @id.
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** Path for a package within its market. */
export function packagePath(pkg: Pick<Package, 'slug'>, market: PackageMarket): string {
  return market === 'global' ? `/packages/${pkg.slug}` : `/in/packages/${pkg.slug}`;
}

export function buildOrganizationSchema(settings: ResolvedSiteSettings): JsonLdDocument {
  const sameAs = [
    settings.instagramUrl,
    settings.facebookUrl,
    settings.twitterUrl,
    settings.youtubeUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    '@context': CONTEXT,
    '@type': 'TravelAgency',
    '@id': ORG_ID,
    name: 'BagPackerMe',
    url: SITE_URL,
    // PNG/JPG only — Google rejects WebP logos.
    logo: absoluteUrl('/logo_b.png'),
    image: absoluteUrl('/logo_b.png'),
    email: settings.contactEmail,
    telephone: settings.contactPhone,
    address: settings.address,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSiteSchema(): JsonLdDocument {
  // No SearchAction — there is no site search endpoint to point it at.
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: 'BagPackerMe',
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildTouristTripSchema(pkg: Package, market: PackageMarket): JsonLdDocument {
  const url = absoluteUrl(packagePath(pkg, market));
  const primary = getPackagePrimaryPrice(pkg, market);

  // Omit `offers` entirely when there is no real price — never emit price:null
  // or price:"ON REQUEST". hasPackagePrice narrows to a finite number.
  const offers = hasPackagePrice(primary.amount)
    ? {
        '@type': 'Offer',
        price: primary.amount,
        priceCurrency: primary.currency,
        availability: 'https://schema.org/InStock',
        url,
      }
    : undefined;

  // itinerary[].location holds narrative day headings ("Four islands and cable
  // car"), not clean place names — Place is the honest supertype, not City.
  const itinerary =
    pkg.itinerary.length > 0
      ? {
          '@type': 'ItemList',
          numberOfItems: pkg.itinerary.length,
          itemListElement: pkg.itinerary.map((day) => ({
            '@type': 'ListItem',
            position: day.day,
            item: { '@type': 'Place', name: day.location, description: day.description },
          })),
        }
      : undefined;

  return {
    '@context': CONTEXT,
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: pkg.title,
    description: pkg.metaDescription || pkg.tagline,
    ...optionalImage(pkg.heroImageUrl),
    url,
    touristType: pkg.category,
    provider: { '@id': ORG_ID },
    ...(offers ? { offers } : {}),
    ...(itinerary ? { itinerary } : {}),
  };
}

const EMPLOYMENT_TYPE_MAP: Record<JobType, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  internship: 'INTERN',
};

// Google drops postings that never expire, so a posting with no explicit end
// date is advertised as good for this long after it went up.
const JOB_VALID_DAYS = 90;

export function buildJobPostingSchema(job: JobOpening): JsonLdDocument {
  const url = absoluteUrl(`/careers/${job.slug}`);

  const validThrough = new Date(
    new Date(job.createdAt).getTime() + JOB_VALID_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // Omit baseSalary entirely unless both ends are real numbers — a half-range
  // or a null value is worse than no salary field at all.
  const baseSalary =
    typeof job.salaryMin === 'number' && typeof job.salaryMax === 'number'
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salaryCurrency || 'INR',
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: job.salaryPeriod,
          },
        }
      : undefined;

  // Remote roles use jobLocationType + applicantLocationRequirements; anything
  // a candidate physically attends (including hybrid) needs a jobLocation.
  const location =
    job.locationType === 'remote'
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: { '@type': 'Country', name: 'India' },
        }
      : {
          jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: job.location },
          },
        };

  return {
    '@context': CONTEXT,
    '@type': 'JobPosting',
    '@id': `${url}#job`,
    title: job.title,
    // HTML is permitted here and Google prefers the formatted description.
    description: job.descriptionHtml,
    datePosted: job.createdAt,
    validThrough,
    employmentType: EMPLOYMENT_TYPE_MAP[job.type],
    hiringOrganization: { '@id': ORG_ID },
    ...(job.department ? { industry: job.department } : {}),
    ...location,
    ...(baseSalary ? { baseSalary } : {}),
    directApply: true,
  };
}

export function buildFaqPageSchema(faqs: readonly FaqItem[]): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildBlogPostingSchema(post: BlogPost): JsonLdDocument {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const author = findAuthor(post.author);

  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    ...optionalImage(post.featuredImageUrl),
    // publishDate is already 'yyyy-MM-dd' (valid ISO 8601) — emit as-is.
    datePublished: post.publishDate,
    // Posts predating the updatedAt field fall back to publishDate: an unedited
    // post genuinely was last modified when it was published, so this is
    // accurate rather than merely convenient.
    dateModified: post.updatedAt || post.publishDate,
    // A bare `{ name }` Person is an unresolvable blank node. When the byline
    // matches a known author, emit the full entity so the credential text is
    // machine-readable and the same @id is reused across every post they wrote.
    author: author
      ? {
          '@type': 'Person',
          '@id': `${SITE_URL}/#author-${author.slug}`,
          name: author.name,
          jobTitle: author.jobTitle,
          description: author.bio,
          knowsAbout: author.knowsAbout,
          worksFor: { '@id': ORG_ID },
          ...(author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
        }
      : { '@type': 'Person', name: post.author },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: url,
    ...(post.category ? { articleSection: post.category } : {}),
  };
}
