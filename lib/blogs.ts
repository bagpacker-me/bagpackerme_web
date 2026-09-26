import 'server-only';

import { cache } from 'react';
import { CURIOUS_CLUB_ARTICLES } from '@/lib/curious-club-articles';
import type { BlogPost } from '@/types';

/**
 * The Journal contains two compatible sources: editable legacy Firestore posts
 * and the reviewed Curious Club editorial cluster committed with the site.
 * Static articles are deliberately first-class public content rather than
 * seeding Firestore at request time, which keeps them crawlable even if a
 * database read is temporarily unavailable.
 */
const toFirestorePosts = (docs: Array<{ id: string; data: () => unknown }>) =>
  docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) } as BlogPost));

export function blogDisplayDate(post: Pick<BlogPost, 'editorialDisplayDate' | 'publishDate'>) {
  return post.editorialDisplayDate || post.publishDate;
}

/** Machine-readable timestamps must reflect the actual technical release. */
export function blogTechnicalPublishedDate(
  post: Pick<BlogPost, 'createdAt' | 'publishDate'>
) {
  return post.createdAt || post.publishDate;
}

export function blogTechnicalModifiedDate(
  post: Pick<BlogPost, 'updatedAt' | 'createdAt' | 'publishDate'>
) {
  return post.updatedAt || post.createdAt || post.publishDate;
}

function dateValue(post: BlogPost) {
  return Date.parse(blogDisplayDate(post)) || 0;
}

function mergePosts(firestorePosts: BlogPost[]) {
  const bySlug = new Map<string, BlogPost>();

  // A CMS post always wins if an editor deliberately replaces a static entry
  // with the same slug in the future.
  CURIOUS_CLUB_ARTICLES.forEach((post) => bySlug.set(post.slug, post));
  firestorePosts.forEach((post) => bySlug.set(post.slug, post));

  return Array.from(bySlug.values()).sort((a, b) => dateValue(b) - dateValue(a));
}

export const getPublishedBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    // Firestore initializes the client at module load. Loading it lazily keeps
    // the committed editorial cluster renderable in environments where CMS
    // credentials are intentionally absent (for example static builds).
    const { getPublishedBlogs } = await import('@/lib/firestore');
    const snapshot = await getPublishedBlogs();
    return mergePosts(toFirestorePosts(snapshot.docs));
  } catch {
    // The editorial cluster must remain available if the optional CMS is
    // temporarily unavailable during a server render or sitemap refresh.
    return mergePosts([]);
  }
});

export const getPublishedBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const staticArticle = CURIOUS_CLUB_ARTICLES.find((post) => post.slug === slug);
  if (staticArticle) return staticArticle;

  try {
    const { getBlogBySlug: getFirestoreBlogBySlug } = await import('@/lib/firestore');
    return await getFirestoreBlogBySlug(slug);
  } catch {
    return null;
  }
});

export async function getRelatedBlogPosts(post: BlogPost, count = 3): Promise<BlogPost[]> {
  const allPosts = await getPublishedBlogPosts();
  const bySlug = new Map(allPosts.map((candidate) => [candidate.slug, candidate]));

  if (post.relatedSlugs?.length) {
    return post.relatedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((candidate): candidate is BlogPost => Boolean(candidate))
      .slice(0, count);
  }

  return allPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .slice(0, count);
}

/** Static pages are safe to prerender without making a Firestore build call. */
export const getStaticBlogSlugs = () => CURIOUS_CLUB_ARTICLES.map((post) => post.slug);
