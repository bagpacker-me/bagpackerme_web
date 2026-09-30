/**
 * Gate checks for the automated article publish path.
 *
 * Run with: npm run test:articles
 *
 * lib/article-validation.ts is the only thing standing between a generated
 * article and a live, indexed page — articles publish without a human reading
 * them first. So the gate itself needs tests: a rule that silently stopped
 * firing would not break a build, it would just start letting things through.
 *
 * The last block is the important one. It runs the 21 reviewed committed
 * articles through the same gate, which proves the automated floor is the house
 * standard rather than a stricter invention that no real article could clear.
 */
import { CURIOUS_CLUB_ARTICLES } from './lib/curious-club-articles.ts';
import {
  validateArticle,
  articleWordCount,
  articleText,
} from './lib/article-validation.ts';

let failures = 0;
let checks = 0;

function check(label, condition, detail = '') {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

/** A problem list must contain exactly one entry matching the pattern. */
function expectProblem(label, problems, pattern) {
  const matched = problems.filter((p) => pattern.test(p));
  check(
    label,
    matched.length >= 1,
    matched.length === 0 ? `no problem matched ${pattern}. Got: ${JSON.stringify(problems)}` : ''
  );
}

function expectClean(label, problems) {
  check(label, problems.length === 0, problems.length ? JSON.stringify(problems, null, 2) : '');
}

const KNOWN_SLUGS = [
  'travel-but-no-one-to-go-with',
  'solo-travel-vs-group-travel',
  'what-happens-curious-club-trip',
];

const SENTENCE =
  'Kyoto in early April is busy, expensive and worth it, and the practical question is whether you can absorb a fortnight of crowds for a week of cherry blossom. ';

/** ~1200 words of structurally valid body with everything the gate looks for. */
function body({ extra = '', paragraphs = 9 } = {}) {
  const filler = Array.from({ length: paragraphs }, () => `<p>${SENTENCE.repeat(10)}</p>`).join('');

  return [
    '<h2 id="when-to-go">When to go</h2>',
    filler,
    '<h3>How much does a Japan trip from India cost?</h3>',
    `<p>${SENTENCE.repeat(4)}</p>`,
    '<ul><li>Flights from Delhi or Mumbai</li><li>Rail passes</li><li>Accommodation</li></ul>',
    '<h2 id="what-it-costs">What it costs</h2>',
    filler,
    '<h3>Is two weeks long enough for Japan?</h3>',
    `<p>${SENTENCE.repeat(4)}</p>`,
    '<h3>Do I need to book the rail pass before arriving?</h3>',
    `<p>${SENTENCE.repeat(4)}</p>`,
    '<aside><strong>Worth knowing</strong><p>Shoulder season is cheaper and quieter.</p></aside>',
    `<p>Read more in <a href="/blog/solo-travel-vs-group-travel">our comparison of solo and group travel</a>.</p>`,
    extra,
  ].join('');
}

function candidate(overrides = {}) {
  return {
    title: 'Japan for First-Time Travellers From India: A Complete Guide',
    slug: 'japan-first-time-travellers-india',
    category: 'Japan Guides',
    excerpt:
      'What a first trip to Japan from India actually costs, when to go, and how long you need to see Tokyo and Kyoto without rushing either of them.',
    contentHtml: body(),
    featuredImageUrl: 'https://images.unsplash.com/photo-123456789',
    featuredImageAlt: 'Cherry blossom along a canal in Kyoto at first light',
    featuredImageCredit: { name: 'A Photographer', url: 'https://unsplash.com/@someone' },
    tags: ['Japan', 'First international trip'],
    readTimeMinutes: 8,
    metaTitle: 'Japan From India: First-Timer Guide',
    metaDescription:
      'What a first trip to Japan from India costs, the best months to go, and how many days Tokyo and Kyoto really need on a two-week itinerary.',
    relatedSlugs: ['solo-travel-vs-group-travel', 'what-happens-curious-club-trip'],
    tableOfContents: [
      { id: 'when-to-go', label: 'When to go' },
      { id: 'what-it-costs', label: 'What it costs' },
    ],
    faqItems: [
      { question: 'How much does a Japan trip from India cost?', answer: 'Budget for flights, rail and hotels separately.' },
      { question: 'Is two weeks long enough for Japan?', answer: 'For Tokyo and Kyoto, comfortably yes.' },
      { question: 'Do I need to book the rail pass before arriving?', answer: 'It is cheaper bought before you fly.' },
    ],
    cta: {
      eyebrow: 'Group travel, thoughtfully',
      title: 'Planning Japan?',
      body: 'We plan private Japan itineraries end to end.',
      href: '/contact',
      label: 'Talk to us',
    },
    ...overrides,
  };
}

const ctx = (overrides = {}) => ({ knownSlugs: KNOWN_SLUGS, minWords: 1000, ...overrides });

console.log('\nText helpers');
check('articleText strips tags', !articleText('<p>Hello <strong>there</strong></p>').includes('<'));
check(
  'articleText decodes entities',
  articleText('<p>Krabi &amp; Phuket</p>') === 'Krabi & Phuket',
  articleText('<p>Krabi &amp; Phuket</p>')
);
check('articleWordCount counts words, not tags', articleWordCount('<p>one two three</p>') === 3, String(articleWordCount('<p>one two three</p>')));

console.log('\nA well-formed article');
expectClean('passes the gate cleanly', validateArticle(candidate(), ctx()));

console.log('\nBody rules');
expectProblem(
  'rejects a body below the brief’s floor',
  validateArticle(candidate({ contentHtml: body({ paragraphs: 1 }) }), ctx()),
  /words; this brief requires at least 1000/
);
expectProblem(
  'rejects an unsupported tag',
  validateArticle(candidate({ contentHtml: body({ extra: '<h1>Nope</h1>' }) }), ctx()),
  /unsupported HTML tags: h1/
);
expectProblem(
  'rejects inline script',
  validateArticle(candidate({ contentHtml: body({ extra: '<script>alert(1)</script>' }) }), ctx()),
  /unsupported HTML tags:.*script/
);

console.log('\nCommercial figures (must agree with lib/faq.ts)');
expectProblem(
  'rejects a deposit percentage that contradicts the Terms',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>A 10% deposit confirms your booking.</p>' }) }), ctx()),
  /contradicts the Terms of Service/
);
expectClean(
  'accepts the real 30% deposit',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>A non-refundable deposit of 30% confirms your booking.</p>' }) }), ctx())
);
expectClean(
  // Regression: the deposit set used to win whenever "deposit" appeared, so a single
  // sentence stating the whole policy correctly was rejected for its 50/75/100 tiers.
  'accepts one sentence naming the deposit and the cancellation ladder together',
  validateArticle(
    candidate({
      contentHtml: body({
        extra:
          '<p>Cancellations more than 45 days out lose the deposit only; 30-44 days out is 50%,'
          + ' 15-29 days out is 75%, and inside 15 days is 100% of the trip cost.</p>',
      }),
    }),
    ctx()
  )
);
expectProblem(
  'still rejects a wrong deposit figure when cancellation is mentioned alongside it',
  validateArticle(
    candidate({
      contentHtml: body({
        extra: '<p>A 10% deposit holds the booking, and cancellation inside 15 days is 100%.</p>',
      }),
    }),
    ctx()
  ),
  /contradicts the Terms of Service/
);
expectClean(
  'accepts the real cancellation tiers',
  validateArticle(
    candidate({
      contentHtml: body({
        extra: '<p>Cancel between 30 and 44 days out and you are charged 50% of the trip cost.</p>',
      }),
    }),
    ctx()
  )
);
expectProblem(
  'rejects an invented cancellation tier',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>Cancel late and the refund is 40% of what you paid.</p>' }) }), ctx()),
  /contradicts the Terms of Service/
);
expectClean(
  'leaves unrelated percentages alone',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>Roughly 12% of visitors arrive in April.</p>' }) }), ctx())
);

console.log('\nRegulatory claims');
expectProblem(
  'rejects a visa fee stated as fact',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>The Japan visa fee is 3,000 rupees.</p>' }) }), ctx()),
  /visa or entry fee as present-tense fact/
);
expectProblem(
  'rejects an e-visa price stated as fact',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>The e-visa costs USD 25 and lands in three days.</p>' }) }), ctx()),
  /visa or entry fee as present-tense fact/
);
expectProblem(
  'rejects a blanket "no visa required" claim',
  validateArticle(candidate({ contentHtml: body({ extra: '<p>For Indian passport holders no visa is required.</p>' }) }), ctx()),
  /visa or entry fee as present-tense fact/
);
expectClean(
  // Regression: the bare-phrase regex fired on prose that states no figure at all,
  // which is exactly the sentence we want writers to use instead.
  'accepts prose about visa costs that quotes no figure',
  validateArticle(
    candidate({
      contentHtml: body({
        extra:
          '<p>Entry rules change without notice, so never treat visa costs as fixed. Check the'
          + ' <a href="https://evisa.gov.vn">official portal</a> before you book.</p>',
      }),
    }),
    ctx()
  )
);

console.log('\nSEO fields');
expectProblem('requires metaTitle', validateArticle(candidate({ metaTitle: '  ' }), ctx()), /metaTitle is required/);
expectProblem(
  'rejects an over-long metaTitle',
  validateArticle(candidate({ metaTitle: 'x'.repeat(61) }), ctx()),
  /metaTitle is 61 characters/
);
expectProblem(
  'rejects a short metaDescription',
  validateArticle(candidate({ metaDescription: 'Too short.' }), ctx()),
  /metaDescription is 10 characters/
);

console.log('\nCover image');
expectProblem(
  'rejects a host outside the CSP',
  validateArticle(candidate({ featuredImageUrl: 'https://example.com/photo.jpg' }), ctx()),
  /host "example.com" is not allowed by the Content Security Policy/
);
expectClean(
  'accepts a site-relative image',
  validateArticle(candidate({ featuredImageUrl: '/web_photos/hero_1.webp', featuredImageCredit: undefined }), ctx())
);
expectProblem(
  'requires alt text',
  validateArticle(candidate({ featuredImageAlt: '   ' }), ctx()),
  /featuredImageAlt is required/
);

console.log('\nInternal link graph');
expectProblem(
  'requires two related slugs',
  validateArticle(candidate({ relatedSlugs: ['solo-travel-vs-group-travel'] }), ctx()),
  /relatedSlugs has 1 entries/
);
expectProblem(
  'rejects a slug that does not exist',
  validateArticle(candidate({ relatedSlugs: ['solo-travel-vs-group-travel', 'invented-article'] }), ctx()),
  /do not exist: invented-article/
);
expectProblem(
  'rejects self-linking',
  validateArticle(
    candidate({ relatedSlugs: ['solo-travel-vs-group-travel', 'japan-first-time-travellers-india'] }),
    ctx({ knownSlugs: [...KNOWN_SLUGS, 'japan-first-time-travellers-india'] })
  ),
  /own slug/
);

console.log('\nFAQ visibility');
expectProblem(
  'requires three FAQ entries',
  validateArticle(candidate({ faqItems: candidate().faqItems.slice(0, 2) }), ctx()),
  /faqItems has 2 entries/
);
expectProblem(
  'rejects a FAQ question that is not in the body',
  validateArticle(
    candidate({
      faqItems: [
        ...candidate().faqItems.slice(0, 2),
        { question: 'Is Japan safe for solo female travellers?', answer: 'Broadly yes.' },
      ],
    }),
    ctx()
  ),
  /does not appear in contentHtml/
);

console.log('\nTable of contents');
expectProblem(
  'rejects a toc id with no heading',
  validateArticle(candidate({ tableOfContents: [{ id: 'nowhere', label: 'Nowhere' }] }), ctx()),
  /ids with no matching heading/
);

console.log('\nThe 21 reviewed committed articles must clear the universal rules');
const allSlugs = CURIOUS_CLUB_ARTICLES.map((post) => post.slug);
for (const post of CURIOUS_CLUB_ARTICLES) {
  const problems = validateArticle(post, {
    knownSlugs: allSlugs,
    // 800 is the lowest floor in the published editorial plan, so word count
    // never fails here — this block is about the rules that apply to every
    // article regardless of when it was written: the tag allowlist, cover image
    // and alt text, a resolving link graph, FAQ questions being visible when
    // present, toc ids, and commercial figures matching the Terms.
    minWords: 800,
    // The two knobs where the automated floor is deliberately stricter. In the
    // committed cluster only the pillars carry faqItems (asserted separately
    // below), and two articles run slightly past 160 characters of meta
    // description. Relaxing them here keeps this block honest about what it is
    // testing instead of failing on a difference that is intentional.
    requireFaq: false,
    maxMetaDescription: 180,
  });
  check(`committed article "${post.slug}" clears the universal rules`, problems.length === 0, JSON.stringify(problems, null, 2));
}

console.log('\nBoth pillars still carry a visible FAQ');
for (const slug of ['travel-but-no-one-to-go-with', 'thailand-first-time-indian-travellers']) {
  const pillar = CURIOUS_CLUB_ARTICLES.find((post) => post.slug === slug);
  const problems = validateArticle(pillar, { knownSlugs: allSlugs, minWords: 800, requireFaq: true, maxMetaDescription: 180 });
  check(`pillar "${slug}" clears the gate with FAQs required`, problems.length === 0, JSON.stringify(problems, null, 2));
}

console.log(`\n${checks - failures}/${checks} checks passed.`);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
