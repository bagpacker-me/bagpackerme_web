'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeInSection, CARD_GRID_VARIANTS, CARD_ITEM_VARIANTS } from '@/components/ui/FadeInSection';
import { JOB_TYPE_LABELS, JOB_LOCATION_TYPE_LABELS, formatSalaryRange } from '@/lib/careers';
import type { JobOpening } from '@/types';

const VALUES = [
  {
    title: 'Craft over volume',
    body: 'We design a small number of journeys properly rather than a large number quickly. That standard applies to how we build the company too.',
  },
  {
    title: 'Local partners, not vendors',
    body: 'The people on the ground know things we never will. We plan with them, credit them, and pay them properly.',
  },
  {
    title: 'Ownership, early',
    body: 'Small team, real responsibility. You will own a piece of the work outright rather than wait your turn for it.',
  },
];

function JobCard({ job }: { job: JobOpening }) {
  const salary = formatSalaryRange(job);

  const meta = [
    job.location,
    JOB_LOCATION_TYPE_LABELS[job.locationType],
    JOB_TYPE_LABELS[job.type],
  ].filter(Boolean);

  return (
    <motion.article variants={CARD_ITEM_VARIANTS}>
      <Link
        href={`/careers/${job.slug}`}
        className="group flex flex-col h-full bg-white rounded-3xl p-[24px] md:p-[32px] border border-void/5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20"
      >
        {job.department && (
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-teal/70 mb-[10px]">
            {job.department}
          </p>
        )}

        <h3 className="font-display text-[22px] md:text-[26px] font-bold text-void leading-snug mb-[12px] group-hover:text-teal transition-colors">
          {job.title}
        </h3>

        <p className="font-body text-[14px] text-void/60 mb-[16px]">{meta.join(' · ')}</p>

        {salary && (
          <p className="font-body text-[14px] font-medium text-void/80 mb-[16px]">{salary}</p>
        )}

        {job.requirements.length > 0 && (
          <ul className="space-y-[8px] mb-[24px]">
            {job.requirements.slice(0, 3).map((requirement) => (
              <li key={requirement} className="flex items-start gap-[10px] font-body text-[14px] text-void/70">
                <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-lime" />
                <span className="line-clamp-2">{requirement}</span>
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto inline-flex items-center gap-[8px] font-display text-[13px] font-bold uppercase tracking-widest text-teal">
          View role
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}

export default function CareersContent({ jobs }: { jobs: JobOpening[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-white">
      {/* ── Section 1: Hero ──────────────────────────────────────────────────── */}
      <div className="relative bg-teal pt-[160px] md:pt-[200px] pb-[80px] md:pb-[120px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-[800px] mx-auto px-[24px]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Careers
            </div>
            <h1 className="font-display text-white text-[44px] md:text-[72px] font-bold leading-[1.1] mb-6">
              Build journeys worth taking
            </h1>
            <p className="font-body text-white/80 text-[16px] md:text-[20px] leading-relaxed max-w-[600px] mx-auto">
              We are a small studio designing bespoke trips with people who actually know the ground.
              If that sounds like your kind of work, we would like to meet you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Section 2: How we work ───────────────────────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto px-[24px]">
          <FadeInSection>
            <p className="section-label mb-[16px]">How We Work</p>
            <h2 className="font-display text-[32px] md:text-[48px] font-bold text-void leading-tight max-w-[700px] mb-[48px]">
              A small team that takes the craft seriously
            </h2>
          </FadeInSection>

          <motion.div
            variants={CARD_GRID_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px]"
          >
            {VALUES.map((value) => (
              <motion.div
                key={value.title}
                variants={CARD_ITEM_VARIANTS}
                className="bg-ice/40 rounded-3xl p-[32px] border border-void/5"
              >
                <h3 className="font-display text-[20px] font-bold text-void mb-[12px]">{value.title}</h3>
                <p className="font-body text-[15px] text-void/70 leading-relaxed">{value.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Open roles ────────────────────────────────────────────── */}
      <section id="open-roles" className="bg-[#fafafa] py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto px-[24px]">
          <FadeInSection>
            <p className="section-label mb-[16px]">Open Roles</p>
            <h2 className="font-display text-[32px] md:text-[48px] font-bold text-void leading-tight max-w-[700px] mb-[48px]">
              {jobs.length > 0
                ? `${jobs.length} ${jobs.length === 1 ? 'role' : 'roles'} open right now`
                : 'No open roles right now'}
            </h2>
          </FadeInSection>

          {jobs.length > 0 ? (
            <motion.div
              variants={CARD_GRID_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]"
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>
          ) : (
            <FadeInSection>
              <div className="bg-white rounded-3xl p-[32px] md:p-[48px] border border-void/5 text-center max-w-[640px] mx-auto">
                <p className="font-body text-[16px] text-void/70 leading-relaxed mb-[24px]">
                  We are not hiring for anything specific at the moment. That said, we have made room
                  before for people who were obviously right — if that is you, tell us what you would
                  want to do here.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-[8px] bg-teal text-white font-display text-[13px] font-bold uppercase tracking-widest px-[32px] py-[16px] rounded-full transition-colors hover:bg-teal/90"
                >
                  Get in touch
                </Link>
              </div>
            </FadeInSection>
          )}
        </div>
      </section>
    </main>
  );
}
