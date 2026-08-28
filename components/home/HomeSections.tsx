'use client';

import DiscoverTheWorld from './DiscoverTheWorld';
import SeasonExplorer from './SeasonExplorer';
import EffortlessPlanning from './EffortlessPlanning';
import MemorableMoments from './MemorableMoments';
import ImageGallery from '@/components/ui/image-gallery';
import FAQSection from './FAQSection';
import type { PackageMarket } from '@/types';

/**
 * Below-the-fold interactive content is a separate chunk. It still renders on
 * the server (see DeferredHomeSections) so links, FAQs and public copy remain
 * visible to crawlers and work before its client code hydrates.
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
      <MemorableMoments market={market} />
      <ImageGallery market={market} />
      <FAQSection />
    </>
  );
}
