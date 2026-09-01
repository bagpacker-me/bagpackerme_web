/**
 * Static global package integrity tests. Run with: npm run test:packages
 *
 * The global catalogue is split across two files that must agree:
 *
 *   lib/static-global-packages.ts          full records, used by the detail pages
 *   lib/static-global-package-summaries.ts card fields only, used by the listing
 *
 * The split exists so the client bundle does not carry every day-by-day, but it
 * means a package added to one file and not the other builds and typechecks
 * cleanly while being invisible on the listing — which is exactly how the
 * summaries file silently fell 23 packages behind. These tests are the guard.
 *
 * The price-ceiling check covers a second silent failure: the listing's range
 * filter is inclusive on both ends, so a package priced above the slider maximum
 * is hidden at every slider position, including the default one.
 */
import { STATIC_GLOBAL_PACKAGES as FULL } from './lib/static-global-packages.ts';
import { STATIC_GLOBAL_PACKAGE_SUMMARIES as SUMMARIES } from './lib/static-global-package-summaries.ts';
import { PACKAGE_CATEGORIES } from './types/index.ts';

// Keep in step with MARKET_PRICE_CONFIG.global.max in
// components/packages/PackagesListingPage.tsx.
const GLOBAL_PRICE_CEILING = 800000;
const USD_TO_INR_RATE = 100;

let pass = 0, fail = 0;
const check = (name, cond) => {
  if (cond) { pass++; }
  else { console.log(`  FAIL  ${name}`); fail++; }
};

console.log('\n--- Identity ---');
const ids = new Set(), slugs = new Set();
for (const p of FULL) {
  check(`unique id: ${p.id}`, !ids.has(p.id));
  check(`unique slug: ${p.slug}`, !slugs.has(p.slug));
  ids.add(p.id); slugs.add(p.slug);
}
check('every package has a market of global', FULL.every((p) => p.market === 'global'));
check('every category is a known PackageCategory',
  FULL.every((p) => PACKAGE_CATEGORIES.includes(p.category)));

console.log('--- Duration and itinerary agree ---');
for (const p of FULL) {
  const m = p.duration.match(/^(\d+) days \/ (\d+) nights$/);
  check(`${p.slug}: duration parses`, Boolean(m));
  if (!m) continue;
  const days = Number(m[1]), nights = Number(m[2]);
  check(`${p.slug}: days = nights + 1`, days === nights + 1);
  check(`${p.slug}: itinerary length matches duration`, p.itinerary.length === days);
  check(`${p.slug}: itinerary days number 1..n in order`,
    p.itinerary.every((d, i) => d.day === i + 1));
  const slugNights = p.slug.match(/(\d+)-nights$/);
  if (slugNights) {
    check(`${p.slug}: slug night count matches duration`, Number(slugNights[1]) === nights);
  }
}

console.log('--- Required content is present ---');
for (const p of FULL) {
  for (const field of ['title', 'tagline', 'heroImageUrl', 'overviewHtml', 'groupSize']) {
    check(`${p.slug}: ${field} is non-empty`, typeof p[field] === 'string' && p[field].trim() !== '');
  }
  check(`${p.slug}: has at least one gallery image`, p.galleryUrls.length > 0);
  check(`${p.slug}: has destinations`, p.destinations.length > 0);
  check(`${p.slug}: has exclusions`, p.exclusions.length > 0);
  check(`${p.slug}: every itinerary day has a real description`,
    p.itinerary.every((d) => d.description && d.description.length > 40));
  check(`${p.slug}: every itinerary day has a location`,
    p.itinerary.every((d) => d.location && d.location.trim() !== ''));
}

console.log('--- Images are local assets or https URLs ---');
for (const p of FULL) {
  for (const url of [p.heroImageUrl, ...p.galleryUrls]) {
    check(`${p.slug}: ${url.slice(0, 60)} is a supported image URL`,
      url.startsWith('/') || url.startsWith('https://'));
  }
}

console.log('--- Pricing is visible to the listing filter ---');
for (const p of FULL) {
  check(`${p.slug}: has a price in at least one currency`,
    p.priceUsd != null || p.priceInr != null);
  if (p.priceUsd != null) {
    check(`${p.slug}: converted USD price is within the listing filter ceiling`,
      p.priceUsd > 0 && p.priceUsd * USD_TO_INR_RATE <= GLOBAL_PRICE_CEILING);
  }
}

console.log('--- Summaries mirror the full records ---');
check('summaries and full list have the same length', FULL.length === SUMMARIES.length);
const summaryById = new Map(SUMMARIES.map((s) => [s.id, s]));
const MIRRORED = ['title', 'slug', 'market', 'category', 'tagline', 'heroImageUrl',
  'duration', 'groupSize', 'priceInr', 'priceUsd', 'status', 'createdAt',
  'vibe', 'locationIdea'];
for (const p of FULL) {
  const s = summaryById.get(p.id);
  check(`${p.slug}: present in summaries`, Boolean(s));
  if (!s) continue;
  for (const field of MIRRORED) {
    check(`${p.slug}: ${field} matches summary`,
      JSON.stringify(p[field]) === JSON.stringify(s[field]));
  }
  check(`${p.slug}: destinations match summary`,
    JSON.stringify(p.destinations) === JSON.stringify(s.destinations));
}
for (const s of SUMMARIES) {
  check(`summary ${s.slug} has a matching full record`, FULL.some((p) => p.id === s.id));
  // The whole point of the split: summaries must stay light.
  check(`summary ${s.slug} carries no itinerary`, s.itinerary.length === 0);
  check(`summary ${s.slug} carries no overview html`, s.overviewHtml === '');
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
