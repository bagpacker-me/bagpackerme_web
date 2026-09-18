import HomeSections from './HomeSections';
import type { PackageMarket } from '@/types';

// Kept as a semantic boundary at the page call sites, but no longer made into
// one large client-side dynamic import. Individual interactive children now
// create their own client boundaries, leaving static below-the-fold content
// out of the initial JavaScript payload without removing it from the HTML.

export default function DeferredHomeSections({
  market = 'global',
  includeSeason = true,
}: {
  market?: PackageMarket;
  includeSeason?: boolean;
}) {
  return <HomeSections market={market} includeSeason={includeSeason} />;
}
