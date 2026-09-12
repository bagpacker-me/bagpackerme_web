import type { BlogPost } from '@/types';

/**
 * Presentation defaults for the legacy posts that predate uploaded blog
 * artwork and topic fields. They keep the public journal truthful and useful
 * while the admin can progressively replace them with per-post uploads.
 */
type BlogPresentationOverride = {
  category: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
};

const CURATED_PRESENTATIONS: Record<string, BlogPresentationOverride> = {
  'beyond-the-taj-exploring-lesser-known-architectural-masterpieces-of-india': {
    category: 'Heritage & Culture',
    tags: ['Indian architecture', 'Heritage travel', 'Jaipur'],
    imageSrc: '/web_photos/hero_3.webp',
    imageAlt: 'The illuminated honeycomb facade of Hawa Mahal in Jaipur at dusk',
  },
  'slow-journeys-deeper-discoveries-india-2026-awaits': {
    category: 'Slow Travel',
    tags: ['India travel 2026', 'Slow travel', 'Cultural journeys'],
    imageSrc: '/web_photos/gallery_3.webp',
    imageAlt: 'A traditional houseboat travelling through Kerala’s green backwaters',
  },
  'india-unhurried-a-curated-journey-through-the-countrys-most-intimate-luxury-retreats': {
    category: 'Luxury Retreats',
    tags: ['Luxury stays', 'Slow travel India', 'Wellness escapes'],
    imageSrc: '/images/packages/satpura/satpura-riverside-lodge.webp',
    imageAlt: 'A lantern-lit riverside lodge surrounded by a forested Indian landscape',
  },
  'experiences-in-india-2026-travel-beyond-the-familiar': {
    category: 'Cultural Experiences',
    tags: ['India travel 2026', 'Local experiences', 'Food and culture'],
    imageSrc: '/web_photos/hero_4.webp',
    imageAlt: 'Boats and historic riverfront architecture along the Ganges in Varanasi',
  },
  'why-summer-is-the-best-time-for-safari-in-india': {
    category: 'Wildlife Safari',
    tags: ['India safari', 'National parks', 'Summer wildlife'],
    imageSrc: '/images/packages/kanha/kanha-beyond-safari-cover.webp',
    imageAlt: 'A Bengal tiger walking through dry forest beside a safari jeep',
  },
  'mumbai-heritage-walks-a-complete-guide-to-exploring-the-citys-historic-landmarks': {
    category: 'Heritage & City Guides',
    tags: ['Mumbai heritage', 'South Bombay', 'Walking tours'],
    imageSrc: 'https://images.unsplash.com/photo-1709060705637-e09faf11b4cd?auto=format&fit=crop&q=85&w=1800',
    imageAlt: 'Gothic Revival architecture on a busy street in South Mumbai',
  },
};

const DEFAULT_PRESENTATION: BlogPresentationOverride = {
  category: 'Travel Stories',
  tags: [],
  imageSrc: '/web_photos/hero_1.webp',
  imageAlt: 'India Gate at dusk in New Delhi',
};

export type ResolvedBlogPresentation = {
  category: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
};

function normalizeTags(tags: BlogPost['tags']) {
  return (tags ?? []).map((tag) => tag.trim()).filter(Boolean).slice(0, 8);
}

/**
 * Resolve a complete, descriptive set of visual and topic metadata for a
 * post. Uploaded Firestore fields always take precedence over defaults.
 */
export function getBlogPresentation(
  post: Pick<BlogPost, 'title' | 'slug' | 'category' | 'featuredImageUrl' | 'featuredImageAlt' | 'tags'>
): ResolvedBlogPresentation {
  const curated = CURATED_PRESENTATIONS[post.slug];
  const hasLegacyGenericCategory = post.category === 'Adventure' && Boolean(curated);
  const uploadedTags = normalizeTags(post.tags);

  return {
    category:
      (!hasLegacyGenericCategory && post.category?.trim()) ||
      curated?.category ||
      DEFAULT_PRESENTATION.category,
    tags: uploadedTags.length > 0 ? uploadedTags : (curated?.tags ?? DEFAULT_PRESENTATION.tags),
    imageSrc: post.featuredImageUrl?.trim() || curated?.imageSrc || DEFAULT_PRESENTATION.imageSrc,
    imageAlt: post.featuredImageAlt?.trim() || curated?.imageAlt || post.title,
  };
}
