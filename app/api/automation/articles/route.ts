import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth } from '@/lib/automation-auth';
import { validateArticle, articleWordCount } from '@/lib/article-validation';
import { CURIOUS_CLUB_ARTICLES } from '@/lib/curious-club-articles';
import type { BlogPost } from '@/types';

export const runtime = 'nodejs';

/**
 * POST /api/automation/articles
 *
 * The one write that puts public content on the site, so it is the narrowest
 * surface I could make it and still have the content engine work.
 *
 * Two things are deliberately NOT the caller's decision:
 *
 * 1. Dates. publishDate, createdAt and updatedAt are stamped here from the
 *    server clock. types/index.ts keeps editorialDisplayDate separate precisely
 *    so a planned series never pretends it was published before it reached the
 *    site; letting a workflow post its own publishDate would hand that guarantee
 *    to a prompt.
 * 2. Byline and status. Automated articles are published as the editorial team,
 *    never as a named person — lib/authors.ts treats an invented author entity as
 *    a trust failure, and attributing generated prose to Kevin would be exactly
 *    that.
 *
 * Everything else has to clear lib/article-validation.ts. A 422 carries the full
 * list of problems so the workflow can make one informed rewrite attempt rather
 * than guessing.
 */

const ctaSchema = z.object({
  eyebrow: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(400),
  href: z.string().trim().regex(/^\/[a-zA-Z0-9\-/]*$/, 'cta.href must be a site-relative path.'),
  label: z.string().trim().min(1).max(60),
  eventName: z.enum(['blog_curious_club_click', 'curious_club_apply_click']).optional(),
});

const bodySchema = z.object({
  title: z.string().trim().min(10).max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase words separated by single hyphens.')
    .max(90),
  category: z.string().trim().min(2).max(60),
  excerpt: z.string().trim().min(40).max(400),
  contentHtml: z.string().min(1).max(120_000),
  featuredImageUrl: z.string().trim().min(1).max(600),
  featuredImageAlt: z.string().trim().min(5).max(300),
  featuredImageCredit: z
    .object({
      name: z.string().trim().min(1).max(120),
      url: z.string().trim().url().max(600),
    })
    .optional(),
  tags: z.array(z.string().trim().min(2).max(60)).max(8).optional(),
  readTimeMinutes: z.coerce.number().int().min(1).max(60),
  metaTitle: z.string().trim().max(120).optional(),
  metaDescription: z.string().trim().max(400).optional(),
  relatedSlugs: z.array(z.string().trim().min(1).max(90)).max(6).optional(),
  tableOfContents: z
    .array(z.object({ id: z.string().trim().min(1).max(80), label: z.string().trim().min(1).max(120) }))
    .max(12)
    .optional(),
  faqItems: z
    .array(z.object({ question: z.string().trim().min(8).max(300), answer: z.string().trim().min(20).max(1200) }))
    .max(8)
    .optional(),
  cta: ctaSchema.optional(),
  /**
   * The floor from the content_calendar row. Passed in rather than fixed because
   * a 2000-word pillar and an 800-word explainer are both legitimate, and the
   * brief is what knows which one this is.
   */
  minWords: z.coerce.number().int().min(600).max(4000).optional(),
});

export async function POST(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const parsed = bodySchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payload.',
          problems: parsed.error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`),
        },
        { status: 400 }
      );
    }

    const { minWords, ...candidate } = parsed.data;
    const db = adminDb();

    // Slug uniqueness across BOTH sources. A Firestore post can legitimately
    // override a committed slug by hand (lib/blogs.ts lets the CMS win), but that
    // is an editor's deliberate replacement — an automation quietly shadowing a
    // reviewed article is a different thing, so it is refused here.
    const staticSlugs = new Set(CURIOUS_CLUB_ARTICLES.map((post) => post.slug));
    if (staticSlugs.has(candidate.slug)) {
      return NextResponse.json(
        { error: `Slug "${candidate.slug}" belongs to a reviewed committed article.` },
        { status: 409 }
      );
    }

    const existing = await db.collection('blogs').where('slug', '==', candidate.slug).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: `Slug "${candidate.slug}" is already published.` },
        { status: 409 }
      );
    }

    // Link targets: everything that currently resolves on /blog/<slug>.
    const publishedSnapshot = await db.collection('blogs').where('status', '==', 'published').get();
    const knownSlugs = new Set<string>(staticSlugs);
    publishedSnapshot.docs.forEach((doc) => {
      const slug = doc.data().slug;
      if (typeof slug === 'string' && slug) knownSlugs.add(slug);
    });

    const problems = validateArticle(candidate, { knownSlugs, minWords });

    if (problems.length > 0) {
      // 422 rather than 400: the payload is well-formed, it just does not meet the
      // editorial floor. The workflow branches on this to retry once.
      return NextResponse.json({ error: 'Article did not meet the editorial standard.', problems }, { status: 422 });
    }

    const now = new Date().toISOString();
    const publishDate = now.slice(0, 10);

    const document: Omit<BlogPost, 'id'> = {
      ...candidate,
      metaTitle: candidate.metaTitle || candidate.title,
      metaDescription: candidate.metaDescription || candidate.excerpt,
      author: 'BagPackerMe Editorial Team',
      status: 'published',
      publishDate,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection('blogs').add(document);

    return NextResponse.json({
      success: true,
      id: ref.id,
      slug: candidate.slug,
      url: `https://www.bagpackerme.com/blog/${candidate.slug}`,
      wordCount: articleWordCount(candidate.contentHtml),
      publishDate,
    });
  } catch (error) {
    console.error('[automation/articles]', error);
    return NextResponse.json({ error: 'Could not publish the article.' }, { status: 500 });
  }
}
