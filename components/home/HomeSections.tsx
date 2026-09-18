import DiscoverTheWorld from './DiscoverTheWorld';
import SeasonExplorer from './SeasonExplorer';
import EffortlessPlanning from './EffortlessPlanning';
import DeferredMemorableMoments from './DeferredMemorableMoments';
import ImageGallery from '@/components/ui/image-gallery';
import FAQSection from './FAQSection';
import type { PackageMarket } from '@/types';

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
  return (
    <>
      <DiscoverTheWorld market={market} />
      {includeSeason && <SeasonExplorer />}
      <EffortlessPlanning market={market} />
      <DeferredMemorableMoments market={market} />
      <ImageGallery market={market} />
      <FAQSection />
    </>
  );
}
