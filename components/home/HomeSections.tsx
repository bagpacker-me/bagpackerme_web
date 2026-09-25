import DiscoverTheWorld from './DiscoverTheWorld';
import DeferredSeasonExplorer from './DeferredSeasonExplorer';
import EffortlessPlanning from './EffortlessPlanning';
import DeferredMemorableMoments from './DeferredMemorableMoments';
import ImageGallery from '@/components/ui/image-gallery';
import FAQSection from './FAQSection';
import { STATIC_GLOBAL_PACKAGE_SUMMARIES } from '@/lib/static-global-package-summaries';
import type { PackageMarket } from '@/types';

// The homepage is a discovery surface, not the full catalogue. Passing a small
// server-rendered selection keeps the first document useful to people and
// crawlers, while the dedicated /packages page remains the complete index.
// Crucially, this keeps the 27-card seed out of the initial client bundle.
const HOME_FEATURED_PACKAGE_COUNT = 6;

/**
 * This deliberately stays a Server Component. Interactive sections establish
 * their own client boundaries, while static sections stay out of the home
 * route's hydration payload. All of the public copy, links and FAQ content is
 * therefore present in the initial HTML for visitors and crawlers alike.
 */
export default function HomeSections({
  market = 'global',
  includeSeason = true,
}: {
  market?: PackageMarket;
  includeSeason?: boolean;
}) {
  const initialPackages =
    market === 'global'
      ? STATIC_GLOBAL_PACKAGE_SUMMARIES.slice(0, HOME_FEATURED_PACKAGE_COUNT)
      : [];

  return (
    <>
      <DiscoverTheWorld market={market} initialPackages={initialPackages} />
      {includeSeason && <DeferredSeasonExplorer />}
      <EffortlessPlanning market={market} />
      <DeferredMemorableMoments market={market} />
      <ImageGallery market={market} />
      <FAQSection />
    </>
  );
}
