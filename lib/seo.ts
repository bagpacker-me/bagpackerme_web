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
    'Beyond the Taj: Hidden Indian Architecture',
  'experiences-in-india-2026-travel-beyond-the-familiar':
    'India 2026: Travel Beyond the Familiar',
  'india-unhurried-a-curated-journey-through-the-countrys-most-intimate-luxury-retreats':
    'India Unhurried: Curated Luxury Retreats',
  'mumbai-heritage-walks-a-complete-guide-to-exploring-the-citys-historic-landmarks':
    'Mumbai Heritage Walks: Complete Guide',
  'slow-journeys-deeper-discoveries-india-2026-awaits':
    'Slow Journeys: Discover India in 2026',
};

// Legacy articles have broad excerpts but no explicit meta descriptions. These
// succinct fallbacks retain their primary search intent without truncation.
const BLOG_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'beyond-the-taj-exploring-lesser-known-architectural-masterpieces-of-india':
    'Discover lesser-known Indian architecture, from temples and stepwells to historic cities, and plan a culture-rich journey beyond the Taj Mahal.',
  'slow-journeys-deeper-discoveries-india-2026-awaits':
    'Discover slow travel in India in 2026, with thoughtful routes, local encounters and unhurried stays designed for deeper connection.',
  'india-unhurried-a-curated-journey-through-the-countrys-most-intimate-luxury-retreats':
    'Explore intimate luxury retreats across India’s forests, mountains and coast, curated for privacy, culture and unhurried time.',
  'experiences-in-india-2026-travel-beyond-the-familiar':
    'Travel beyond India’s famous sights in 2026 with immersive food, craft, culture and nature experiences that reveal local life.',
  'why-summer-is-the-best-time-for-safari-in-india':
    'Why summer is India’s best season for tiger safaris: where to go, what to see and how to plan a thoughtful wildlife journey.',
  'mumbai-heritage-walks-a-complete-guide-to-exploring-the-citys-historic-landmarks':
    'Explore Mumbai’s historic landmarks on a heritage walk, from colonial facades to the layered stories hidden in its streets.',
};

/** Concise editorial H1/card copy for the handful of exceptionally long headlines. */
export function blogDisplayTitle(blog: Pick<BlogPost, 'slug' | 'title'>): string {
  return BLOG_TITLE_OVERRIDES[blog.slug] || blog.title;
}

export function blogMetaTitle(blog: Pick<BlogPost, 'slug' | 'title' | 'metaTitle'>): string {
  // The app layout appends " | BagPackerMe" (15 characters). Reserve that
  // space so titles stay within the common 60-character search-result limit.
  const source =
    blog.metaTitle?.trim() || BLOG_TITLE_OVERRIDES[blog.slug] || blog.title;

  return truncateSeoText(source.replace(BRAND_SUFFIX, ''), 44);
}

/** Keep article snippets descriptive without asking search engines to truncate them. */
export function blogMetaDescription(
  blog: Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'metaDescription'>
): string {
  const source =
    blog.metaDescription?.trim() ||
    BLOG_DESCRIPTION_OVERRIDES[blog.slug] ||
    blog.excerpt?.trim() ||
    `Read ${blog.title} from BagPackerMe for practical travel ideas and route inspiration.`;

  return truncateSeoText(source, 155);
}
