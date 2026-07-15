import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

// Site-default social card. Inherited by routes that don't set their own
// openGraph key (/, /in, /packages, /blog, /about, /affiliate). Routes that DO
// set an openGraph key (the [slug] pages) need their own colocated file.
export const runtime = 'nodejs';
export const alt = 'BagPackerMe — private, tailor-made journeys';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgCard({
    title: 'Private journeys, designed around you',
    meta: 'Thailand · Vietnam · Kenya · India · and beyond',
  });
}
