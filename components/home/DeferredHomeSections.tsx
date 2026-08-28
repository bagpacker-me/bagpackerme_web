'use client';

import dynamic from 'next/dynamic';
import type { PackageMarket } from '@/types';

// This boundary is intentionally tiny. With SSR enabled, the sections retain
// their semantic HTML in the document while Framer Motion and the map/filter
// code move out of the hero's critical client chunk.
const HomeSections = dynamic(() => import('./HomeSections'), { ssr: true });

export default function DeferredHomeSections({
  market = 'global',
  includeSeason = true,
}: {
  market?: PackageMarket;
  includeSeason?: boolean;
}) {
  return <HomeSections market={market} includeSeason={includeSeason} />;
}
