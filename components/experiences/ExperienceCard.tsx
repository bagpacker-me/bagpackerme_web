import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { formatInr } from '@/lib/experiences';
import type { ExperienceCard as ExperienceCardData } from '@/types/experiences';

/**
 * Photo | Name | Duration | Rating | From ₹Price — the card the flow specifies,
 * in that reading order. Everything on it comes from the curated Data Table, so
 * a card never waits on Viator.
 */
export function ExperienceCard({ experience }: { experience: ExperienceCardData }) {
  return (
    <Link
      href={`/experiences/${encodeURIComponent(experience.productCode)}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={experience.photo}
          alt={experience.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {experience.likelyToSellOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
            Likely to sell out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{experience.title}</h3>

        <p className="text-sm text-muted-foreground">{experience.durationLabel}</p>

        <div className="flex items-center gap-1.5 text-sm">
          <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden />
          <span className="font-medium">{experience.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({experience.reviewCount.toLocaleString('en-IN')})
          </span>
        </div>

        <div className="mt-auto pt-2">
          {experience.freeCancellation ? (
            <p className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Free cancellation
            </p>
          ) : null}

          <p className="text-sm text-muted-foreground">
            From <span className="text-base font-semibold text-foreground">{formatInr(experience.fromPriceInr)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
