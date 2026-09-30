import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth } from '@/lib/automation-auth';
import { CURIOUS_CLUB_ARTICLES } from '@/lib/curious-club-articles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/automation/articles/slugs
 *
 * Every published slug on the Journal, committed and Firestore alike.
 *
 * This exists because the writer cannot invent internal links. relatedSlugs is a
 * hard requirement in lib/article-validation.ts — an article whose related links
 * do not resolve is rejected — so the workflow has to choose from a real list
 * rather than guess at plausible URLs. Titles and categories come along so the
 * model can pick links that are topically honest instead of arbitrary.
 *
 * Unlike /api/automation/content this deliberately DOES include the committed
 * cluster: the point here is "what can I link to", and the 21 static articles are
 * the densest part of the existing graph.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  const staticArticles = CURIOUS_CLUB_ARTICLES.map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    source: 'committed' as const,
  }));

  let firestoreArticles: Array<{
    slug: string;
    title: string;
    category: string;
    source: 'firestore';
  }> = [];

  try {
    const snapshot = await adminDb()
      .collection('blogs')
      .where('status', '==', 'published')
      .get();

    firestoreArticles = snapshot.docs
      .map((doc) => {
        const raw = doc.data();
        return {
          slug: String(raw.slug ?? ''),
          title: String(raw.title ?? ''),
          category: String(raw.category ?? ''),
          source: 'firestore' as const,
        };
      })
      .filter((entry) => entry.slug.length > 0);
  } catch (error) {
    // The committed cluster alone is a usable link target set, and returning it
    // lets the engine keep publishing through a Firestore blip. The cost of the
    // degraded case is a slightly smaller pool to link into, not a failed run.
    console.error('[automation/articles/slugs] firestore read failed', error);
  }

  // A Firestore post deliberately overriding a committed slug (lib/blogs.ts
  // merges the same way) should appear once, not twice.
  const bySlug = new Map<string, (typeof staticArticles)[number] | (typeof firestoreArticles)[number]>();
  staticArticles.forEach((entry) => bySlug.set(entry.slug, entry));
  firestoreArticles.forEach((entry) => bySlug.set(entry.slug, entry));

  const data = Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));

  return NextResponse.json({ count: data.length, data });
}
