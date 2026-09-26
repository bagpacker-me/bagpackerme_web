import { COMMUNITY_ARTICLES } from './curious-club-articles/community';
import { CONVERSION_ARTICLES } from './curious-club-articles/conversion';
import { CORE_ARTICLES } from './curious-club-articles/core';
import { THAILAND_ARTICLES } from './curious-club-articles/thailand';

/**
 * The permanent Curious Club editorial cluster. It is intentionally static so
 * the content remains indexable even if the editorial Firestore collection is
 * temporarily unavailable at render time.
 */
export const CURIOUS_CLUB_ARTICLES = [
  ...CORE_ARTICLES,
  ...COMMUNITY_ARTICLES,
  ...THAILAND_ARTICLES,
  ...CONVERSION_ARTICLES,
];
