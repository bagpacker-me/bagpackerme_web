import type { Metadata } from 'next';
import AffiliateContent from './_components/AffiliateContent';

export const metadata: Metadata = {
  title: 'Affiliate Program',
  description:
    'Earn commission by referring travellers to BagPackerMe. Join our affiliate program and track your referrals.',
  alternates: { canonical: '/affiliate' },
};

export default function AffiliatePage() {
  return <AffiliateContent />;
}
