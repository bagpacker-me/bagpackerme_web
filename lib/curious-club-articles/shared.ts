import type { BlogPost } from '@/types';

// This is the technical publication date of the committed editorial cluster.
// Reader-facing chronology deliberately lives in editorialDisplayDate instead.
const TECHNICAL_RELEASE_DATE = '2026-09-26';

type ArticleDraft = Omit<
  BlogPost,
  'id' | 'author' | 'publishDate' | 'status' | 'createdAt' | 'updatedAt'
>;

export const p = (...paragraphs: string[]) => paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');

export const section = (id: string, heading: string, content: string) =>
  `<h2 id="${id}">${heading}</h2>${content}`;

export const h3 = (heading: string, content: string) => `<h3>${heading}</h3>${content}`;

export const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;

export const orderedList = (items: string[]) => `<ol>${items.map((item) => `<li>${item}</li>`).join('')}</ol>`;

export const note = (title: string, body: string) =>
  `<aside><strong>${title}</strong><p>${body}</p></aside>`;

export const comparisonTable = (headers: string[], rows: string[][]) =>
  `<div class="article-table"><table><thead><tr>${headers.map((header) => `<th scope="col">${header}</th>`).join('')}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;

export function clubCta(
  title: string,
  body: string,
  options: { apply?: boolean; label?: string } = {}
): NonNullable<BlogPost['cta']> {
  const apply = options.apply ?? false;

  return {
    eyebrow: apply ? 'The Curious Club' : 'Group travel, thoughtfully',
    title,
    body,
    href: apply ? '/curious-club/apply' : '/curious-club',
    label: options.label || (apply ? 'Apply to The Curious Club' : 'Learn about The Curious Club'),
    eventName: apply ? 'curious_club_apply_click' : 'blog_curious_club_click',
  };
}

export function article(draft: ArticleDraft): BlogPost {
  return {
    id: `curious-club-${draft.slug}`,
    author: 'BagPackerMe Editorial Team',
    publishDate: TECHNICAL_RELEASE_DATE,
    status: 'published',
    createdAt: TECHNICAL_RELEASE_DATE,
    updatedAt: TECHNICAL_RELEASE_DATE,
    ...draft,
  };
}

