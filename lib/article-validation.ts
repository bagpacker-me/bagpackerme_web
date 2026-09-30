import 'server-only';

import type { BlogPost } from '@/types';

/**
 * The gate between a generated article and the public Journal.
 *
 * The 21 committed Curious Club articles are held to a standard by
 * curious-club-articles.test.mjs, which runs in CI before anything ships. An
 * article that arrives over the automation API has no such moment: it is written
 * and published inside one workflow run, with nobody reading it first. So every
 * rule that test asserts at build time is asserted here at request time
 * instead — same floor, enforced at the only point where enforcement is still
 * possible.
 *
 * Deliberately returns a list of problems rather than throwing on the first one.
 * The workflow feeds the whole list back into a single rewrite attempt, and one
 * problem at a time would need as many round trips as there are mistakes.
 */

/**
 * What the writer is allowed to emit. This mirrors the output of the typed
 * helpers in lib/curious-club-articles/shared.ts, because the article CSS was
 * written against exactly those elements — an <h1> or an inline <style> does not
 * fail validation anywhere else, it just renders wrong.
 */
const ALLOWED_TAGS = new Set([
  'p',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'a',
  'strong',
  'em',
  'aside',
  'section',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]);

/**
 * Hosts already cleared in next.config.mjs — both the CSP img-src and the
 * next/image remotePatterns. A URL on any other host renders as a broken image
 * with a console CSP violation, so it is rejected rather than published.
 */
const ALLOWED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'firebasestorage.googleapis.com',
  'media.viator.com',
  'cache.graphicslib.viator.com',
  'media-cdn.tripadvisor.com',
]);

/**
 * Every percentage that may legitimately appear in a sentence about money,
 * copied from lib/faq.ts: a 25–30% deposit, then cancellation at 50% (30–44
 * days), 75% (15–29 days) and 100% (inside 15 days).
 */
const COMMERCIAL_PERCENTAGES = new Set([25, 30, 50, 75, 100]);
const DEPOSIT_PERCENTAGES = new Set([25, 30]);

const COMMERCIAL_SENTENCE = /\b(deposits?|cancel\w*|refund\w*)\b/i;

/**
 * Regulatory and pricing claims that go stale without anyone noticing.
 *
 * A figure (or "free") has to follow the phrase, so this catches "the visa fee is
 * USD 25" while leaving prose about the rule alone — an earlier bare-phrase version
 * rejected the sentence "do not treat visa costs as fixed", which states nothing.
 * "no visa required" needs no figure; it is a complete claim by itself.
 */
const UNSOURCED_CLAIM =
  /\b(?:(?:e-)?visas?\s+(?:fees?|costs?)\s*(?:is|are|:)?\s*(?:about|around|roughly|approximately|only|just)?\s*(?:[\u20b9$\u20ac\u00a3]|\d|usd|inr|eur|gbp|free)|entry\s+fees?\s+(?:is|are)\s*(?:about|around|roughly|approximately)?\s*(?:[\u20b9$\u20ac\u00a3]|\d|free)|(?:e-)?visas?\s+(?:is|are)\s+free|no\s+visas?\s+(?:is\s+|are\s+)?required)/i;

export type ArticleCandidate = Omit<
  BlogPost,
  'id' | 'author' | 'status' | 'publishDate' | 'createdAt' | 'updatedAt'
>;

export interface ArticleValidationContext {
  /** Every published slug, static and Firestore, for resolving relatedSlugs. */
  knownSlugs: Iterable<string>;
  /** From the content_calendar row. Falls back to the cluster floor. */
  minWords?: number;
  /**
   * Two knobs where the automated floor is deliberately stricter than the 2026
   * committed cluster, rather than accidentally so.
   *
   * `requireFaq` defaults to true: in the committed cluster only the two pillars
   * carry faqItems, but every automated article gets them, because a visible
   * question-and-answer pair is what makes a passage quotable by an AI answer
   * engine — the reasoning lib/faq.ts sets out — and it costs the writer nothing.
   *
   * `maxMetaDescription` defaults to 160 for the same reason: two committed
   * articles run to 164 and 170 characters, which is not wrong, but new content
   * may as well fit the SERP snippet rather than be cut off in it.
   */
  requireFaq?: boolean;
  maxMetaDescription?: number;
}

const DEFAULT_MIN_WORDS = 1000;
const DEFAULT_MAX_META_DESCRIPTION = 160;

/** Tag-stripped, entity-decoded, whitespace-collapsed body text. */
export function articleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function articleWordCount(html: string): number {
  const text = articleText(html);
  return text ? text.split(' ').length : 0;
}

function usedTags(html: string): string[] {
  const tags = new Set<string>();
  const pattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g;
  let match = pattern.exec(html);

  while (match) {
    tags.add(match[1].toLowerCase());
    match = pattern.exec(html);
  }

  return Array.from(tags);
}

/**
 * Compare a FAQ question against the body without tripping over escaping. The
 * point of the rule is that a reader can see the question on the page, and a
 * question written with a straight apostrophe in the FAQ array and a curly one
 * in the prose is visibly present either way.
 */
function normalizeForComparison(value: string): string {
  return articleText(value)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-');
}

function commercialFigureProblems(html: string): string[] {
  const problems: string[] = [];
  const sentences = articleText(html).split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if (!COMMERCIAL_SENTENCE.test(sentence)) continue;

    const percentages = Array.from(sentence.matchAll(/(\d{1,3})\s?%/g)).map((m) => Number(m[1]));
    if (percentages.length === 0) continue;

    // A sentence naming only the deposit must carry a deposit figure. One that also
    // describes the cancellation ladder legitimately carries 50/75/100 alongside it —
    // "more than 45 days out loses the deposit only, 30-44 days 50%" is our actual
    // policy, and narrowing that to the deposit set rejects correct copy.
    const mentionsCancellation = /\b(cancel\w*|refund\w*)\b/i.test(sentence);
    const depositOnly = /\bdeposit\b/i.test(sentence) && !mentionsCancellation;

    for (const value of percentages) {
      const allowed = depositOnly ? DEPOSIT_PERCENTAGES : COMMERCIAL_PERCENTAGES;

      if (!allowed.has(value)) {
        problems.push(
          `contentHtml states "${value}%" in a sentence about ${
            depositOnly ? 'the deposit' : 'cancellation or refunds'
          }, which contradicts the Terms of Service. Allowed: ${Array.from(allowed).join('%, ')}%. Sentence: "${sentence.trim()}"`
        );
      }
    }
  }

  return problems;
}

export function validateArticle(
  candidate: ArticleCandidate,
  context: ArticleValidationContext
): string[] {
  const problems: string[] = [];
  const minWords = context.minWords ?? DEFAULT_MIN_WORDS;
  const requireFaq = context.requireFaq ?? true;
  const maxMetaDescription = context.maxMetaDescription ?? DEFAULT_MAX_META_DESCRIPTION;
  const knownSlugs = new Set(context.knownSlugs);

  // --- Body -----------------------------------------------------------------
  const wordCount = articleWordCount(candidate.contentHtml);
  if (wordCount < minWords) {
    problems.push(`contentHtml is ${wordCount} words; this brief requires at least ${minWords}.`);
  }

  const disallowed = usedTags(candidate.contentHtml).filter((tag) => !ALLOWED_TAGS.has(tag));
  if (disallowed.length > 0) {
    problems.push(
      `contentHtml uses unsupported HTML tags: ${disallowed.join(', ')}. Allowed tags are ${Array.from(
        ALLOWED_TAGS
      ).join(', ')}.`
    );
  }

  if (UNSOURCED_CLAIM.test(candidate.contentHtml)) {
    problems.push(
      'contentHtml states a visa or entry fee as present-tense fact. Link the official government source instead of quoting the figure.'
    );
  }

  problems.push(...commercialFigureProblems(candidate.contentHtml));

  // --- SEO ------------------------------------------------------------------
  const metaTitle = candidate.metaTitle?.trim() ?? '';
  if (!metaTitle) {
    problems.push('metaTitle is required.');
  } else if (metaTitle.length > 60) {
    problems.push(`metaTitle is ${metaTitle.length} characters; keep it to 60 or fewer.`);
  }

  const metaDescription = candidate.metaDescription?.trim() ?? '';
  if (!metaDescription) {
    problems.push('metaDescription is required.');
  } else if (metaDescription.length < 80 || metaDescription.length > maxMetaDescription) {
    problems.push(
      `metaDescription is ${metaDescription.length} characters; it must be between 80 and ${maxMetaDescription}.`
    );
  }

  // --- Cover image ----------------------------------------------------------
  const imageUrl = candidate.featuredImageUrl?.trim() ?? '';
  if (!imageUrl) {
    problems.push('featuredImageUrl is required.');
  } else if (!imageUrl.startsWith('/')) {
    let host = '';
    try {
      host = new URL(imageUrl).hostname;
    } catch {
      problems.push(`featuredImageUrl "${imageUrl}" is not a valid URL or site-relative path.`);
    }

    if (host && !ALLOWED_IMAGE_HOSTS.has(host)) {
      problems.push(
        `featuredImageUrl host "${host}" is not allowed by the Content Security Policy. Allowed hosts: ${Array.from(
          ALLOWED_IMAGE_HOSTS
        ).join(', ')}.`
      );
    }
  }

  if (!candidate.featuredImageAlt?.trim()) {
    problems.push('featuredImageAlt is required — describe the photograph for assistive tech.');
  }

  // --- Internal link graph --------------------------------------------------
  const relatedSlugs = candidate.relatedSlugs ?? [];
  if (relatedSlugs.length < 2) {
    problems.push(
      `relatedSlugs has ${relatedSlugs.length} entries; at least 2 are required so the article joins the cluster.`
    );
  }

  const unresolved = relatedSlugs.filter((slug) => !knownSlugs.has(slug));
  if (unresolved.length > 0) {
    problems.push(
      `relatedSlugs contains slugs that do not exist: ${unresolved.join(', ')}. Only use slugs from the supplied list.`
    );
  }

  if (relatedSlugs.includes(candidate.slug)) {
    problems.push('relatedSlugs must not contain the article’s own slug.');
  }

  // --- FAQ ------------------------------------------------------------------
  const faqItems = candidate.faqItems ?? [];
  if (requireFaq && faqItems.length < 3) {
    problems.push(`faqItems has ${faqItems.length} entries; at least 3 are required.`);
  }

  const normalizedBody = normalizeForComparison(candidate.contentHtml);
  for (const item of faqItems) {
    if (!normalizeForComparison(item.question)) {
      problems.push('An faqItems entry has an empty question.');
      continue;
    }

    if (!normalizedBody.includes(normalizeForComparison(item.question))) {
      problems.push(
        `FAQ question "${item.question}" does not appear in contentHtml. Every FAQ question must be visible to readers, not only in structured data.`
      );
    }

    if (!item.answer?.trim()) {
      problems.push(`FAQ question "${item.question}" has no answer.`);
    }
  }

  // --- Table of contents ----------------------------------------------------
  const toc = candidate.tableOfContents ?? [];
  if (toc.length > 0) {
    const headingIds = new Set(
      Array.from(candidate.contentHtml.matchAll(/\sid="([^"]+)"/g)).map((m) => m[1])
    );

    const missing = toc.filter((entry) => !headingIds.has(entry.id)).map((entry) => entry.id);
    if (missing.length > 0) {
      problems.push(
        `tableOfContents points at ids with no matching heading in contentHtml: ${missing.join(', ')}.`
      );
    }
  }

  return problems;
}
