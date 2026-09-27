import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth, parseLimit, parseSince } from '@/lib/automation-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/automation/content?since=<iso>&limit=50
 *
 * Feeds the publish-distribution workflow: newly published blog posts and
 * packages to submit to IndexNow and draft social copy for.
 *
 * Only Firestore content appears here. The 27 global packages
 * (lib/static-global-packages.ts) and the 21 Curious Club articles
 * (lib/curious-club-articles/) are committed TypeScript — they ship with a
 * deploy, so there is no publish moment for a workflow to react to, and
 * including them would make every poll look like 48 brand-new posts.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const since = parseSince(url.searchParams.get('since'));
    const limit = parseLimit(url.searchParams.get('limit'), 50, 200);

    const db = adminDb();

    const [blogSnapshot, packageSnapshot] = await Promise.all([
      db.collection('blogs').where('status', '==', 'published').limit(limit).get(),
      db.collection('packages').where('status', '==', 'published').limit(limit).get(),
    ]);

    const blogs = blogSnapshot.docs.map((doc) => {
      const raw = doc.data();
      return {
        kind: 'blog' as const,
        id: doc.id,
        slug: raw.slug ?? '',
        title: raw.title ?? '',
        excerpt: raw.excerpt ?? '',
        category: raw.category ?? null,
        url: `https://www.bagpackerme.com/blog/${raw.slug ?? ''}`,
        publishedAt: raw.publishDate ?? raw.createdAt ?? null,
        updatedAt: raw.updatedAt ?? raw.createdAt ?? null,
      };
    });

    const packages = packageSnapshot.docs.map((doc) => {
      const raw = doc.data();
      const slug = raw.slug ?? '';
      // Market decides the public path — middleware.ts routes /packages/[slug]
      // vs /in/packages/[slug] off this same field.
      const prefix = raw.market === 'india' ? '/in/packages' : '/packages';

      return {
        kind: 'package' as const,
        id: doc.id,
        slug,
        title: raw.title ?? '',
        excerpt: raw.summary ?? raw.overview ?? '',
        category: raw.category ?? null,
        market: raw.market ?? 'global',
        url: `https://www.bagpackerme.com${prefix}/${slug}`,
        publishedAt: raw.createdAt ?? null,
        updatedAt: raw.updatedAt ?? raw.createdAt ?? null,
      };
    });

    // Sorted and filtered in memory: `status == published` plus a range on a
    // second field would need another composite index, and these collections are
    // small enough (~63 packages, tens of posts) that it is not worth one.
    const merged = [...blogs, ...packages]
      .filter((item) => !since || (item.updatedAt ?? '') >= since)
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
      .slice(0, limit);

    return NextResponse.json({ count: merged.length, data: merged });
  } catch (error) {
    console.error('[automation/content]', error);
    return NextResponse.json({ error: 'Could not read content.' }, { status: 500 });
  }
}
