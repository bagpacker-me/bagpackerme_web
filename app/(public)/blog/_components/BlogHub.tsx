import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { blogDisplayDate } from '@/lib/blogs';
import { getBlogPresentation } from '@/lib/blog-presentation';
import { blogDisplayTitle } from '@/lib/seo';
import type { BlogPost } from '@/types';

type HubProps = { posts: BlogPost[] };

const START_HERE_SLUGS = [
  'travel-but-no-one-to-go-with',
  'solo-travel-vs-group-travel',
  'what-is-a-curated-group-trip',
];

const CURIOUS_CLUB_SLUGS = [
  'who-is-the-curious-club-for',
  'how-curious-club-selects-travellers',
  'what-happens-curious-club-trip',
];

const THAILAND_SLUGS = [
  'thailand-first-time-indian-travellers',
  'thailand-trip-cost-from-india',
  'phuket-vs-krabi-vs-koh-samui',
  'thailand-beyond-bangkok',
  'thailand-with-strangers-curious-club',
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

function pick(posts: BlogPost[], slugs: string[]) {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  return slugs.map((slug) => bySlug.get(slug)).filter((post): post is BlogPost => Boolean(post));
}

function StoryCard({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const presentation = getBlogPresentation(post);
  const displayDate = blogDisplayDate(post);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-void/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(34,30,42,0.12)]">
      <Link
        href={`/blog/${post.slug}`}
        prefetch={false}
        aria-label={`Read ${blogDisplayTitle(post)}`}
        className="relative block aspect-[16/10] overflow-hidden bg-void"
      >
        <Image
          src={presentation.imageSrc}
          alt={presentation.imageAlt}
          fill
          priority={eager}
          sizes="(min-width: 1280px) 390px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-teal shadow-sm">
          {presentation.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-body text-[12px] text-gray-500">
          <time dateTime={displayDate}>{formatDate(displayDate)}</time>
          <span aria-hidden="true" className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} />{post.readTimeMinutes} min read</span>
        </div>
        <h3 className="font-display text-[22px] font-bold leading-[1.18] text-void transition-colors group-hover:text-teal">
          <Link href={`/blog/${post.slug}`} prefetch={false}>{blogDisplayTitle(post)}</Link>
        </h3>
        <p className="mt-3 flex-1 font-body text-[15px] leading-relaxed text-gray-600">{post.excerpt}</p>
        {presentation.tags.length > 0 && (
          <ul aria-label={`Topics for ${post.title}`} className="mt-5 flex flex-wrap gap-2">
            {presentation.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full bg-ice px-2.5 py-1 font-body text-[10px] font-semibold tracking-wide text-teal">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/blog/${post.slug}`}
          prefetch={false}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 self-start font-display text-[11px] font-bold uppercase tracking-widest text-teal transition-colors hover:text-void"
        >
          Read the story <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function StorySection({
  eyebrow,
  title,
  intro,
  posts,
  id,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  posts: BlogPost[];
  id: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby={id} className="border-t border-void/10 py-14 md:py-20">
      <div className="mb-8 max-w-[720px] md:mb-10">
        <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
        <h2 id={id} className="font-display text-[clamp(2rem,4vw,3.3rem)] font-bold leading-[1.05] text-void">{title}</h2>
        <p className="mt-4 font-body text-[16px] leading-relaxed text-gray-600">{intro}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => <StoryCard key={post.slug} post={post} eager={index === 0} />)}
      </div>
    </section>
  );
}

/**
 * Server-rendered article index. The navigation and article cards are present
 * in initial HTML so readers and crawlers can understand the content graph
 * without waiting for a client-side filter or animation bundle.
 */
export default function BlogHub({ posts }: HubProps) {
  // Keep the 21-article Curious Club ecosystem coherent and chronological,
  // while leaving legacy CMS stories public in a clearly separate archive.
  const contentEnginePosts = posts.filter((post) => post.id.startsWith('curious-club-'));
  const archivePosts = posts.filter((post) => !post.id.startsWith('curious-club-'));
  const startHere = pick(contentEnginePosts, START_HERE_SLUGS);
  const curiousClub = pick(contentEnginePosts, CURIOUS_CLUB_SLUGS);
  const thailand = pick(contentEnginePosts, THAILAND_SLUGS);

  return (
    <main className="min-h-screen bg-[#F5F5F5] pt-[84px] text-void md:pt-[96px]">
      <section className="border-b border-void/10 bg-white px-5 py-14 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end">
          <div>
            <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-teal">The BagPackerMe Journal</p>
            <h1 className="max-w-[860px] font-display text-[clamp(2.7rem,6vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.035em] text-void [text-wrap:balance]">
              Travel stories, ideas &amp; guides for the curious.
            </h1>
          </div>
          <div className="max-w-[520px] border-l-2 border-lime pl-5 font-body text-[17px] leading-relaxed text-gray-600 md:text-[19px]">
            Practical guides, honest answers and stories for people who want to see more of the world—even when their usual travel group can&apos;t come.
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <nav aria-label="Journal sections" className="flex gap-5 overflow-x-auto border-b border-void/10 py-4 font-display text-[11px] font-bold uppercase tracking-widest text-teal md:gap-8">
          <a href="#start-here" className="min-h-[36px] whitespace-nowrap py-2 hover:text-void">Start here</a>
          <a href="#curious-club" className="min-h-[36px] whitespace-nowrap py-2 hover:text-void">The Curious Club</a>
          <a href="#thailand" className="min-h-[36px] whitespace-nowrap py-2 hover:text-void">Thailand</a>
          <a href="#latest-stories" className="min-h-[36px] whitespace-nowrap py-2 hover:text-void">Latest stories</a>
          {archivePosts.length > 0 && <a href="#from-the-archive" className="min-h-[36px] whitespace-nowrap py-2 hover:text-void">From the archive</a>}
        </nav>

        <StorySection
          id="start-here"
          eyebrow="Start here"
          title="Begin with the question beneath the trip."
          intro="If the challenge is finding people, choosing a group format or understanding what a more intentional trip can look like, these are the clearest places to begin."
          posts={startHere}
        />

        <StorySection
          id="curious-club"
          eyebrow="The Curious Club"
          title="People-first travel, explained honestly."
          intro="A transparent guide to what the Club is, who it may suit, and what the public application and accepted-member journey actually involve."
          posts={curiousClub}
        />

        <StorySection
          id="thailand"
          eyebrow="Thailand"
          title="Plan with more confidence, and more curiosity."
          intro="Start with current, practical planning guidance, then use the route and group-fit stories to shape a Thailand experience that works for you."
          posts={thailand}
        />

        <StorySection
          id="latest-stories"
          eyebrow="Latest stories"
          title="Every story in the Journal."
          intro="The complete 21-story Curious Club series, ordered by its editorial chronology: travel companions, curated groups, community, Thailand planning and ways to choose experiences with more depth."
          posts={contentEnginePosts}
        />

        <StorySection
          id="from-the-archive"
          eyebrow="From the archive"
          title="Earlier BagPackerMe Journal stories."
          intro="Existing destination, culture and travel-planning stories remain available alongside the Curious Club editorial series."
          posts={archivePosts}
        />
      </div>
    </main>
  );
}
