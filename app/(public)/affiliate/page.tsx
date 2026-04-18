'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const BENEFITS = [
  {
    icon: '🔗',
    title: 'Your Unique Link',
    desc: 'Get a personal tracking link for every package. Share it anywhere — Instagram, WhatsApp, email, or your blog.',
  },
  {
    icon: '📊',
    title: 'Real-Time Stats',
    desc: 'Watch your clicks and leads grow in your affiliate dashboard. Full transparency, always.',
  },
  {
    icon: '💰',
    title: '10% Commission',
    desc: 'Earn 10% on every booking that comes through your link. Payouts handled directly, no fuss.',
  },
  {
    icon: '🌍',
    title: 'Curated Packages',
    desc: 'Promote India\'s most unique travel experiences — hand-crafted itineraries your audience will love.',
  },
];

const STEPS = [
  { num: '01', title: 'Register Below', desc: 'Fill in a quick form. We review applications within 24 hours.' },
  { num: '02', title: 'Get Your Code', desc: 'Once approved, receive your unique affiliate code and personal dashboard link.' },
  { num: '03', title: 'Share & Earn', desc: 'Add ?ref=YOUR_CODE to any package URL and share. We track every click and booking automatically.' },
];

const FAQS = [
  {
    q: 'Who can become an affiliate?',
    a: 'Anyone — travel bloggers, influencers, tour guides, or just passionate travellers with an audience. If you love travel and want to earn while sharing it, you\'re welcome.',
  },
  {
    q: 'How are conversions tracked?',
    a: 'When someone clicks your link, their session is tagged with your code. If they submit an enquiry or make a booking during that session, it\'s attributed to you automatically.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Once a booking attributed to you is confirmed and completed, our team processes your commission manually. We\'ll contact you to arrange payment.',
  },
  {
    q: 'Can I share links to any package?',
    a: 'Yes! Just add ?ref=YOUR_CODE to the end of any BagPackerMe package URL. Your dashboard will show which packages are performing best.',
  },
  {
    q: 'Is there a minimum payout threshold?',
    a: 'Not currently. Every confirmed booking earns you commission regardless of size.',
  },
];

export default function AffiliatePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', socialHandle: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setState('success');
      setResultMsg(data.message);
    } catch (err) {
      setState('error');
      setResultMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const inputCls = 'w-full px-5 py-4 rounded-2xl border border-void/10 bg-white/60 backdrop-blur-sm font-body text-[15px] text-void placeholder-void/40 outline-none focus:border-teal/50 focus:ring-4 focus:ring-teal/10 transition-all';

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-teal pt-40 md:pt-56 pb-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-lime/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[860px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Affiliate Program
            </div>
            <h1 className="font-display text-white text-[46px] md:text-[76px] font-bold leading-[1.05] mb-6">
              Earn While You<br />
              <span className="text-lime">Inspire Travel</span>
            </h1>
            <p className="font-body text-white/80 text-[17px] md:text-[21px] leading-relaxed max-w-[640px] mx-auto mb-10">
              Share India&apos;s most extraordinary journeys with your audience and earn 10% commission on every confirmed booking.
            </p>
            <a
              href="#register"
              className="inline-flex items-center gap-3 px-8 py-5 bg-lime text-void font-display font-bold text-[13px] tracking-widest uppercase rounded-full hover:bg-white transition-all duration-300 shadow-[0_12px_40px_rgba(193,234,0,0.35)] hover:shadow-[0_16px_48px_rgba(193,234,0,0.5)] hover:-translate-y-1"
            >
              Join the Program
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-t-[40px] md:rounded-t-[60px] -mt-12 md:-mt-20 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.04)]">

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-32 pb-16 md:pb-24">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <p className="font-display text-teal text-sm font-bold tracking-[0.2em] uppercase mb-3">Why Join?</p>
            <h2 className="font-display text-void text-[34px] md:text-[48px] font-bold leading-tight">Everything You Need to Succeed</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeUp}
                className="bg-ice/60 rounded-3xl p-8 hover:bg-teal/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-4xl mb-5">{b.icon}</div>
                <h3 className="font-display text-void font-bold text-[18px] mb-3 group-hover:text-teal transition-colors">{b.title}</h3>
                <p className="font-body text-void/60 text-[14px] leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section className="bg-teal/5 py-20 md:py-28">
          <div className="max-w-[960px] mx-auto px-6">
            <motion.div className="text-center mb-14" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <p className="font-display text-teal text-sm font-bold tracking-[0.2em] uppercase mb-3">Simple Process</p>
              <h2 className="font-display text-void text-[34px] md:text-[48px] font-bold leading-tight">How It Works</h2>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative">
              {/* connecting line */}
              <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-[2px] bg-teal/20" />
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  custom={i + 1}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex-1 flex flex-col items-center text-center relative"
                >
                  <div className="w-[72px] h-[72px] rounded-full bg-teal flex items-center justify-center text-lime font-display font-bold text-[22px] mb-6 shadow-[0_8px_24px_rgba(40,80,86,0.3)] relative z-10">
                    {s.num}
                  </div>
                  <h3 className="font-display text-void font-bold text-[19px] mb-3">{s.title}</h3>
                  <p className="font-body text-void/60 text-[14px] leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Registration Form ─────────────────────────────────────────── */}
        <section id="register" className="max-w-[720px] mx-auto px-6 py-20 md:py-32">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="font-display text-teal text-sm font-bold tracking-[0.2em] uppercase mb-3">Get Started</p>
            <h2 className="font-display text-void text-[34px] md:text-[48px] font-bold leading-tight mb-4">Apply Now</h2>
            <p className="font-body text-void/60 text-[16px]">Fill in the form below. We review all applications within 24 hours and will reach out via email.</p>
          </motion.div>

          {state === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-teal/5 border border-teal/20 rounded-3xl p-12 text-center"
            >
              <div className="text-5xl mb-6">🎉</div>
              <h3 className="font-display text-void font-bold text-[26px] mb-3">Application Received!</h3>
              <p className="font-body text-void/60 text-[16px] leading-relaxed mb-8">{resultMsg}</p>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 px-6 py-4 bg-teal text-white font-display font-bold text-[12px] tracking-widest uppercase rounded-full hover:bg-void transition-colors"
              >
                Browse Packages
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1}
              onSubmit={handleSubmit}
              className="bg-ice/50 rounded-3xl p-8 md:p-10 space-y-5 border border-void/5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-display text-[13px] font-bold text-void mb-2 ml-1 tracking-wide">Full Name *</label>
                  <input
                    id="affiliate-name"
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="block font-display text-[13px] font-bold text-void mb-2 ml-1 tracking-wide">Email Address *</label>
                  <input
                    id="affiliate-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-display text-[13px] font-bold text-void mb-2 ml-1 tracking-wide">Phone Number</label>
                  <input
                    id="affiliate-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-display text-[13px] font-bold text-void mb-2 ml-1 tracking-wide">Instagram / Blog / Channel</label>
                  <input
                    id="affiliate-social"
                    type="text"
                    placeholder="@yourhandle or website URL"
                    value={form.socialHandle}
                    onChange={e => setForm(f => ({ ...f, socialHandle: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              {state === 'error' && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm font-body">
                  {resultMsg}
                </div>
              )}

              <button
                id="affiliate-submit"
                type="submit"
                disabled={state === 'loading'}
                className="w-full py-5 bg-teal text-white font-display font-bold text-[13px] tracking-widest uppercase rounded-2xl hover:bg-void transition-all duration-300 shadow-[0_8px_24px_rgba(40,80,86,0.25)] hover:shadow-[0_12px_32px_rgba(40,80,86,0.4)] hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {state === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit Application &rarr;</>
                )}
              </button>

              <p className="font-body text-void/40 text-[13px] text-center">
                By applying, you agree to our <Link href="/terms" className="underline hover:text-teal">Terms of Service</Link>.
              </p>
            </motion.form>
          )}
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="bg-void/[0.02] border-t border-void/5 py-20 md:py-28">
          <div className="max-w-[760px] mx-auto px-6">
            <motion.div className="text-center mb-12" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <h2 className="font-display text-void text-[32px] md:text-[44px] font-bold">Frequently Asked Questions</h2>
            </motion.div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-void/8 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-display font-bold text-void text-[16px] group-hover:text-teal transition-colors pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-teal shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="font-body text-void/60 text-[15px] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Already an affiliate? ─────────────────────────────────────── */}
        <section className="max-w-[960px] mx-auto px-6 py-16 text-center">
          <p className="font-body text-void/50 text-[15px]">
            Already an affiliate?{' '}
            <Link href="/affiliate/dashboard" className="text-teal font-bold hover:underline">
              Access your dashboard →
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
