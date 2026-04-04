import { getRelatedPackages } from '@/lib/firestore';
import PackageCard from '@/components/home/PackageCard';
import { FadeInSection } from '@/components/ui/FadeInSection';

export default async function RelatedPackages({ category, currentSlug }: { category: string, currentSlug: string }) {
  const related = await getRelatedPackages(category, currentSlug, 3);
  
  if (!related || related.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <FadeInSection className="mb-[64px] md:mb-[96px] flex flex-col items-center">
          <div className="flex items-center gap-[16px] mb-[24px]">
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
             <span className="font-display font-bold uppercase text-[11px] tracking-widest text-[#221E2A]">Keep Exploring</span>
             <div className="h-[1px] w-[32px] bg-[#221E2A]" />
          </div>
          <h2 className="text-[#221E2A] font-display text-[clamp(2rem,4vw,3rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1]">
            You May Also Like
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {related.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </FadeInSection>

      </div>
    </section>
  );
}
