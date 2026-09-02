import type { Package } from '@/types';

const BRAND_SUFFIX = /\s*(?:[|\u2014\u2013-]\s*)?bagpackerme\s*$/i;

/** Keep search snippets readable without cutting a word in half. */
export function truncateSeoText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;

  const boundary = text.lastIndexOf(' ', maxLength - 1);
  const end = boundary >= Math.floor(maxLength * 0.65) ? boundary : maxLength - 1;
  return `${text.slice(0, end).trimEnd()}\u2026`;
}

export function shortPackageTitle(title: string, maxLength = 48): string {
  return truncateSeoText(title.replace(BRAND_SUFFIX, ''), maxLength);
}

export function packageMetaTitle(pkg: Pick<Package, 'title' | 'metaTitle'>): string {
  // The root metadata template appends " | BagPackerMe" (15 characters), so
  // reserving that space keeps the rendered title inside search result limits.
  return shortPackageTitle(pkg.metaTitle?.trim() || pkg.title, 44);
}

export function packageMetaDescription(
  pkg: Pick<Package, 'title' | 'tagline' | 'metaDescription'>
): string {
  const source =
    pkg.metaDescription?.trim() ||
    pkg.tagline?.trim() ||
    `Explore ${pkg.title} with BagPackerMe. Talk to a travel specialist to tailor the route, stays, and pace to your plans.`;

  return truncateSeoText(source, 155);
}
