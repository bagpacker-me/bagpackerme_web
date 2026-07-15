import type { Metadata } from 'next';
import AboutContent from './_components/AboutContent';

export const metadata: Metadata = {
  title: 'About BagPackerMe',
  description:
    'We are a bespoke trip-planning studio. Meet the team behind BagPackerMe and the way we design private, tailor-made journeys.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutContent />;
}
