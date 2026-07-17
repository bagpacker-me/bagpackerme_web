'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { JOB_TYPE_LABELS, JOB_LOCATION_TYPE_LABELS, formatSalaryRange } from '@/lib/careers';
import type { JobOpening } from '@/types';
import ApplyForm from './ApplyForm';

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-[12px]">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-[12px] font-body text-[15px] text-void/75 leading-relaxed">
          <span className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-lime" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function JobDetailContent({ job }: { job: JobOpening }) {
  const shouldReduceMotion = useReducedMotion();
  const salary = formatSalaryRange(job);

  const facts = [
    { label: 'Location', value: `${job.location} · ${JOB_LOCATION_TYPE_LABELS[job.locationType]}` },
    { label: 'Type', value: JOB_TYPE_LABELS[job.type] },
    ...(job.department ? [{ label: 'Team', value: job.department }] : []),
    ...(salary ? [{ label: 'Salary', value: salary }] : []),
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* ── Section 1: Hero ──────────────────────────────────────────────────── */}
      <div className="relative bg-teal pt-[160px] md:pt-[200px] pb-[80px] md:pb-[100px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto px-[24px]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
          >
            <Link
              href="/careers"
              className="inline-flex items-center gap-[8px] font-display text-[12px] font-bold uppercase tracking-widest text-lime mb-[24px] transition-opacity hover:opacity-70"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              All roles
            </Link>

            <h1 className="font-display text-white text-[36px] md:text-[60px] font-bold leading-[1.1] mb-[24px]">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-[10px]">
              {facts.map((fact) => (
                <span
                  key={fact.label}
                  className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-[16px] py-[8px] font-body text-[14px] text-white/90"
                >
                  {fact.value}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Section 2: The role ──────────────────────────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[100px]">
        <div className="max-w-[900px] mx-auto px-[24px] space-y-[64px]">
          <FadeInSection>
            <p className="section-label mb-[16px]">About The Role</p>
            {/* Trusted HTML: authored by the admin in the TipTap editor, not by
                the public. Same trust model as blog post bodies. */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
            />
          </FadeInSection>

          {job.responsibilities.length > 0 && (
            <FadeInSection>
              <p className="section-label mb-[16px]">What You&apos;ll Do</p>
              <BulletList items={job.responsibilities} />
            </FadeInSection>
          )}

          {job.requirements.length > 0 && (
            <FadeInSection>
              <p className="section-label mb-[16px]">What We&apos;re Looking For</p>
              <BulletList items={job.requirements} />
            </FadeInSection>
          )}
        </div>
      </section>

      {/* ── Section 3: Apply ─────────────────────────────────────────────────── */}
      <section id="apply" className="bg-[#fafafa] py-[80px] md:py-[120px]">
        <div className="max-w-[760px] mx-auto px-[24px]">
          <FadeInSection>
            <p className="section-label mb-[16px]">Apply</p>
            <h2 className="font-display text-[32px] md:text-[44px] font-bold text-void leading-tight mb-[16px]">
              Tell us about yourself
            </h2>
            <p className="font-body text-[16px] text-void/70 leading-relaxed mb-[48px]">
              A real person reads every application. Take five minutes over it and we will do the same.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="bg-white rounded-3xl p-[24px] md:p-[40px] border border-void/5 shadow-sm">
              <ApplyForm job={job} />
            </div>
          </FadeInSection>
        </div>
      </section>
    </main>
  );
}
