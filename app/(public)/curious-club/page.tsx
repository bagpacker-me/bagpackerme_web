import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/structured-data';
import CuriousClubContent from './_components/CuriousClubContent';

// No `languages` key: the club is one community, not a market-split product.
// There is no /in/curious-club to pair with.
export const metadata: Metadata = {
  title: 'The Curious Club',
  description:
    'An invite-only community for curious Indians who travel for stories, people, culture and experiences. Applications are reviewed individually.',
  alternates: { canonical: '/curious-club' },
  openGraph: {
    title: 'The Curious Club — by BagpackerMe',
    description:
      'You don’t need more travel options. You need better people to discover them with. Apply for an invite.',
    url: '/curious-club',
    type: 'website',
  },
};

export default function CuriousClubPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'The Curious Club', path: '/curious-club' },
        ])}
      />
      <CuriousClubContent />
    </>
  );
}
