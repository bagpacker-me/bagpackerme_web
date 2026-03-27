import { getRelatedPackages } from '@/lib/firestore';
import PackageCard from '@/components/home/PackageCard';

export default async function RelatedPackages({ category, currentSlug }: { category: string, currentSlug: string }) {
  const related = await getRelatedPackages(category, currentSlug, 3);
  
  if (!related || related.length === 0) return null;

  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-teal font-display font-bold uppercase tracking-[0.3em] text-sm block mb-4">
            ✦ KEEP EXPLORING
          </span>
          <h2 className="text-void font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {related.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

      </div>
    </section>
  );
}
