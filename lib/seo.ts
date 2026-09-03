import type { BlogPost, Package } from '@/types';

const BRAND_SUFFIX = /\s*(?:[|\u2014\u2013-]\s*)?bagpackerme\s*$/i;

/** Keep search snippets readable without cutting a word in half. */
export function truncateSeoText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;

  const boundary = text.lastIndexOf(' ', maxLength - 1);
  const end = boundary >= Math.floor(maxLength * 0.65) ? boundary : maxLength - 1;
  return `${text.slice(0, end).trimEnd()}\u2026`;
}

export function shortPackageTitle(title: string, maxLength = 48): string {
  return truncateSeoText(title.replace(BRAND_SUFFIX, ''), maxLength);
}

export function packageMetaTitle(pkg: Pick<Package, 'title' | 'metaTitle'>): string {
  // The root metadata template appends " | BagPackerMe" (15 characters), so
  // reserving that space keeps the rendered title inside search result limits.
  return shortPackageTitle(pkg.metaTitle?.trim() || pkg.title, 44);
}

export function packageMetaDescription(
  pkg: Pick<Package, 'title' | 'tagline' | 'metaDescription'>
): string {
  const source =
    pkg.metaDescription?.trim() ||
    pkg.tagline?.trim() ||
    `Explore ${pkg.title} with BagPackerMe. Talk to a travel specialist to tailor the route, stays, and pace to your plans.`;

  return truncateSeoText(source, 155);
}

// These articles need a search-result title that keeps the central query while
// leaving room for the root layout's " | BagPackerMe" suffix. The editorial
// headline remains untouched in the on-page H1 and the article schema.
const BLOG_TITLE_OVERRIDES: Record<string, string> = {
  'beyond-the-taj-exploring-lesser-known-architectural-masterpieces-of-india':
    "Beyond the Taj: India's Hidden Architecture",
  'experiences-in-india-2026-travel-beyond-the-familiar':
    'India 2026: Travel Beyond the Familiar',
  'india-unhurried-a-curated-journey-through-the-countrys-most-intimate-luxury-retreats':
    'India Unhurried: Curated Luxury Retreats',
  'mumbai-heritage-walks-a-complete-guide-to-exploring-the-citys-historic-landmarks':
    'Mumbai Heritage Walks: Complete Guide',
  'slow-journeys-deeper-discoveries-india-2026-awaits':
    'Slow Journeys: Discover India in 2026',
};

export function blogMetaTitle(blog: Pick<BlogPost, 'slug' | 'title' | 'metaTitle'>): string {
  // The app layout appends " | BagPackerMe" (15 characters). Reserve that
  // space so titles stay within the common 60-character search-result limit.
  const source =
    BLOG_TITLE_OVERRIDES[blog.slug] || blog.metaTitle?.trim() || blog.title;

  return truncateSeoText(source.replace(BRAND_SUFFIX, ''), 44);
}
