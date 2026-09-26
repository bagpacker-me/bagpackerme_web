/**
 * Integrity checks for the permanent Curious Club editorial cluster.
 *
 * Run with: npm run test:curious-club
 *
 * This prevents quiet regressions that TypeScript cannot see: an article being
 * omitted from the hub, a historical display date being changed, a broken
 * internal link, or a pillar being reduced below its promised depth.
 */
import { CURIOUS_CLUB_ARTICLES } from './lib/curious-club-articles.ts';

const PLAN = [
  ['travel-but-no-one-to-go-with', 'I Want to Travel, But I Have No One to Go With: A Guide for Indian Travellers', '2026-06-18', 2000],
  ['solo-travel-vs-group-travel', 'Solo Travel vs Group Travel: Which One Is Actually Right for You?', '2026-06-24', 1500],
  ['find-people-to-travel-with-india', 'How to Find People to Travel With in India', '2026-07-01', 1200],
  ['travelling-with-strangers', 'Travelling With Strangers: What Is It Actually Like?', '2026-07-08', 1200],
  ['choose-group-trip-solo-traveller', "How to Choose a Group Trip When You're Travelling Solo", '2026-07-15', 1200],
  ['make-friends-while-travelling', 'How to Make Friends While Travelling as an Adult', '2026-07-22', 1000],
  ['what-is-a-curated-group-trip', 'What Is a Curated Group Trip?', '2026-08-02', 1200],
  ['why-your-travel-group-matters', 'Why Your Travel Group Matters More Than Your Itinerary', '2026-08-07', 1000],
  ['who-is-the-curious-club-for', 'Who Is The Curious Club For — and Who Is It Not For?', '2026-08-12', 1000],
  ['travel-communities-india', 'The Rise of Travel Communities in India: Why More People Are Travelling With Strangers', '2026-08-17', 1200],
  ['first-international-group-trip', 'Your First International Group Trip: Everything You Need to Know', '2026-08-22', 1500],
  ['travel-with-strangers-memories', 'Why Some of Your Best Travel Memories Start With Complete Strangers', '2026-08-27', 1000],
  ['thailand-first-time-indian-travellers', 'Thailand for First-Time International Travellers From India: Complete Guide', '2026-09-01', 2000],
  ['thailand-trip-cost-from-india', 'How Much Does a Thailand Trip From India Really Cost in 2026?', '2026-09-05', 1200],
  ['phuket-vs-krabi-vs-koh-samui', 'Phuket vs Krabi vs Koh Samui: Which One Is Right for Your Trip?', '2026-09-09', 1200],
  ['thailand-beyond-bangkok', 'Beyond Bangkok: The Thailand Most Indian Travellers Miss', '2026-09-13', 1000],
  ['travel-experiences-20s-30s', '21 Experiences Worth Travelling for in Your 20s and 30s', '2026-09-15', 1200],
  ['find-unique-travel-experiences', 'How to Find Travel Experiences That Aren’t on Every Tourist Itinerary', '2026-09-18', 1000],
  ['thailand-with-strangers-curious-club', 'Thailand With Strangers: What a Curious Club Trip Actually Feels Like', '2026-09-21', 800],
  ['how-curious-club-selects-travellers', 'How The Curious Club Chooses Who Travels Together', '2026-09-24', 1000],
  ['what-happens-curious-club-trip', 'What Actually Happens on a Curious Club Trip?', '2026-09-26', 1500],
];

let pass = 0;
let fail = 0;
const check = (label, condition) => {
  if (condition) pass += 1;
  else {
    fail += 1;
    console.error(`FAIL ${label}`);
  }
};

const words = (html) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[^;]+;/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;

const bySlug = new Map(CURIOUS_CLUB_ARTICLES.map((post) => [post.slug, post]));
check('the content engine has exactly 21 articles', CURIOUS_CLUB_ARTICLES.length === 21);
check('all article slugs are unique', bySlug.size === CURIOUS_CLUB_ARTICLES.length);

for (const [slug, title, date, minimumWords] of PLAN) {
  const post = bySlug.get(slug);
  check(`${slug}: exists`, Boolean(post));
  if (!post) continue;
  check(`${slug}: title matches the editorial plan`, post.title === title);
  check(`${slug}: editorial display date matches the plan`, post.editorialDisplayDate === date);
  check(`${slug}: uses the truthful technical release date`, post.publishDate === '2026-09-26' && post.createdAt === '2026-09-26');
  check(`${slug}: has meaningful copy (${minimumWords}+ words)`, words(post.contentHtml) >= minimumWords);
  check(`${slug}: has a meta title`, Boolean(post.metaTitle?.trim()));
  check(`${slug}: has a meta description`, Boolean(post.metaDescription?.trim()));
  check(`${slug}: uses a local, descriptive cover image`, post.featuredImageUrl.startsWith('/') && Boolean(post.featuredImageAlt?.trim()));
  check(`${slug}: has intentional related articles`, (post.relatedSlugs?.length || 0) >= 2);
  for (const relatedSlug of post.relatedSlugs || []) {
    check(`${slug}: related slug ${relatedSlug} exists`, bySlug.has(relatedSlug));
  }
}

const linksTo = (slug) => CURIOUS_CLUB_ARTICLES.filter((post) =>
  post.contentHtml.includes(`href="/blog/${slug}"`) || post.relatedSlugs?.includes(slug)
).map((post) => post.slug);

check('Core pillar receives several direct cluster links', linksTo('travel-but-no-one-to-go-with').length >= 4);
check('Thailand pillar receives several direct cluster links', linksTo('thailand-first-time-indian-travellers').length >= 4);
for (const requiredSource of [
  'what-is-a-curated-group-trip',
  'who-is-the-curious-club-for',
  'how-curious-club-selects-travellers',
  'thailand-with-strangers-curious-club',
  'first-international-group-trip',
]) {
  check(`${requiredSource}: links directly to the final Curious Club explainer`, linksTo('what-happens-curious-club-trip').includes(requiredSource));
}

for (const pillar of ['travel-but-no-one-to-go-with', 'thailand-first-time-indian-travellers']) {
  const post = bySlug.get(pillar);
  check(`${pillar}: has FAQ data`, (post?.faqItems?.length || 0) >= 3);
  check(`${pillar}: FAQ questions are visibly represented`, post?.faqItems?.every((faq) => post.contentHtml.includes(faq.question)));
}

console.log(`Curious Club content: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
