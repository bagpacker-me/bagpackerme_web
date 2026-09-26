import { SITE_URL, absoluteUrl } from '@/lib/site-url';
import { getPackagePrimaryPrice, hasPackagePrice } from '@/lib/packagePricing';
import type { ResolvedSiteSettings } from '@/lib/site-settings';
import { findAuthor } from '@/lib/authors';
import type { FaqItem } from '@/lib/faq';
import type { BlogPost, JobOpening, JobType, Package, PackageMarket } from '@/types';
import { getBlogPresentation } from '@/lib/blog-presentation';
import { blogMetaDescription, packageMetaDescription } from '@/lib/seo';

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

const absoluteAssetUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : absoluteUrl(url);
// Stable @ids so blocks in separate <script> tags cross-reference. Google merges
// all JSON-LD on a page before resolving @id.
export const ORG_ID = `${SITE_URL}/#organization`;
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
  const itineraryDays = pkg.itinerary.filter((day) => Boolean(day.location?.trim()));
  const itinerary =
    itineraryDays.length > 0
      ? {
          '@type': 'ItemList',
          numberOfItems: itineraryDays.length,
          itemListElement: itineraryDays.map((day) => ({
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
    description: packageMetaDescription(pkg),
    ...optionalImage(
      pkg.heroImageUrl?.trim() ? absoluteAssetUrl(pkg.heroImageUrl) : undefined
    ),
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
  const presentation = getBlogPresentation(post);
  // Editorial chronology is intentionally reader-facing only. New static
  // articles use the actual deployment date in machine-readable fields rather
  // than pretending they were technically published before the site contained
  // them. Legacy CMS posts retain their historical publishDate semantics.
  const technicalPublishedDate = post.editorialDisplayDate ? post.createdAt : post.publishDate;
  const technicalModifiedDate = post.editorialDisplayDate
    ? post.updatedAt || post.createdAt
    : post.updatedAt || post.publishDate;

  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    description: blogMetaDescription(post),
    ...optionalImage(absoluteAssetUrl(presentation.imageSrc)),
    datePublished: technicalPublishedDate,
    dateModified: technicalModifiedDate,
    // A bare `{ name }` Person is an unresolvable blank node. When the byline
    // matches a known author, emit the full entity so the credential text is
    // machine-readable and the same @id is reused across every post they wrote.
    author: post.author === 'BagPackerMe Editorial Team'
      ? { '@type': 'Organization', '@id': ORG_ID, name: 'BagPackerMe' }
      : author
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
    articleSection: presentation.category,
    ...(presentation.tags.length > 0 ? { keywords: presentation.tags.join(', ') } : {}),
  };
}

/** Semantic, crawlable catalogue for either the India or global journey listing. */
export function buildPackageCollectionSchema(
  packages: Package[],
  market: PackageMarket
): JsonLdDocument {
  const path = market === 'india' ? '/in/packages' : '/packages';
  const url = absoluteUrl(path);
  const label = market === 'india' ? 'India Travel Packages' : 'Global Travel Packages';

  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    '@id': `${url}#journeys`,
    name: label,
    description:
      market === 'india'
        ? 'Curated India travel packages for food, wildlife, heritage, wellness and romantic escapes, tailored by BagPackerMe.'
        : 'Curated global travel packages, tailored by BagPackerMe.',
    url,
    isPartOf: { '@id': SITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: packages.length,
      itemListElement: packages.map((pkg, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pkg.title,
        url: absoluteUrl(packagePath(pkg, market)),
        ...optionalImage(
          pkg.heroImageUrl?.trim() ? absoluteAssetUrl(pkg.heroImageUrl) : undefined
        ),
      })),
    },
  };
}

/** Semantic index of the Journal's current articles for search engines. */
export function buildBlogCollectionSchema(posts: BlogPost[]): JsonLdDocument {
  const url = absoluteUrl('/blog');

  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    '@id': `${url}#journal`,
    name: 'BagPackerMe Journal',
    description:
      'Practical travel guides, honest answers and stories for curious people planning more meaningful journeys with BagPackerMe.',
    url,
    isPartOf: { '@id': SITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => {
        const presentation = getBlogPresentation(post);
        const postUrl = absoluteUrl(`/blog/${post.slug}`);
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: post.title,
          url: postUrl,
          image: absoluteAssetUrl(presentation.imageSrc),
        };
      }),
    },
  };
}
