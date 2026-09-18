import { ArrowRight, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { HOME_FAQS, type FaqItem } from '@/lib/faq';

const FAQS = HOME_FAQS;
const DEFAULT_FAQ_COUNT = 6;

function FaqItem({ faq, index, open = false }: { faq: FaqItem; index: number; open?: boolean }) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <details
      open={open}
      className="group overflow-hidden rounded-2xl border border-medium transition-all duration-300 hover:border-teal/30 open:border-teal/20 open:bg-white open:shadow-card-teal motion-reduce:transition-none"
    >
      <summary
        id={triggerId}
        aria-controls={panelId}
        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal md:p-7 [&::-webkit-details-marker]:hidden"
      >
        <span className="font-display text-base font-semibold text-void/80 transition-colors group-open:text-teal motion-reduce:transition-none md:text-lg">
          {faq.question}
        </span>
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-void/5 text-void/50 transition-all duration-300 group-open:bg-teal group-open:text-white motion-reduce:transition-none">
          <Plus strokeWidth={2} className="h-3.5 w-3.5 group-open:hidden" aria-hidden="true" />
          <Minus strokeWidth={2} className="hidden h-3.5 w-3.5 group-open:block" aria-hidden="true" />
        </span>
      </summary>
      {/* Native <details> keeps every answer in the initial HTML while retaining
          keyboard support and disclosure semantics without client hydration. */}
      <div id={panelId} role="region" aria-labelledby={triggerId}>
        <p className="px-6 pb-6 pr-8 font-body text-sm leading-relaxed text-content-muted md:px-7 md:pb-7 md:text-base">
          {faq.answer}
        </p>
      </div>
    </details>
  );
}

export default function FAQSection() {
  const visibleFaqs = FAQS.slice(0, DEFAULT_FAQ_COUNT);
  const hiddenFaqs = FAQS.slice(DEFAULT_FAQ_COUNT);

  return (
    <section className="bg-surface-lowest py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6 lg:px-8">
        <div className="split-layout">
          {/* Left Column: Heading and Info card */}
          <div className="lg:sticky lg:top-28">
            <div className="accent-line-cyan" />
            <h2 className="mb-5 font-display text-4xl font-bold tracking-tight text-void md:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mb-8 font-body text-base leading-relaxed text-content-muted">
              Got questions before your next trip? Here is everything you need to know about starting your journey with BagPackerMe.
            </p>

            {/* Quick Contact Card */}
            <div className="rounded-2xl border border-medium bg-ice/40 p-6 md:p-8">
              <h3 className="mb-2 font-display text-lg font-semibold text-void">Still have questions?</h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-content-muted">
                Can&apos;t find what you are looking for? Send us a quick inquiry and we&apos;ll get right back to you.
              </p>
              <Link
                href="/contact"
                // A 16px-tall text link is the smallest kind of target there is.
                // The negative margin keeps its optical position in the card.
                className="group -my-3 inline-flex min-h-[44px] items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-teal hover:text-teal/85"
              >
                Let&apos;s chat
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </div>
          </div>

          {/* Every Q&A is served in the document, matching FAQPage JSON-LD.
              Native disclosures preserve visibility and a11y without a large
              client-side accordion runtime. */}
          <div className="space-y-3">
            {visibleFaqs.map((faq, index) => (
              <FaqItem key={faq.question} faq={faq} index={index} open={index === 0} />
            ))}

            <details className="group/show-all pt-6">
              <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center rounded-full border border-teal px-6 py-3 font-display text-[12px] font-bold uppercase tracking-widest text-teal transition-all duration-300 hover:bg-teal hover:text-white hover:shadow-card-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal active:scale-[0.98] motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2 group-open/show-all:hidden">
                  Show all questions ({FAQS.length})
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="hidden items-center gap-2 group-open/show-all:inline-flex">
                  Show fewer questions
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="space-y-3 pt-6">
                {hiddenFaqs.map((faq, index) => (
                  <FaqItem key={faq.question} faq={faq} index={index + DEFAULT_FAQ_COUNT} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
