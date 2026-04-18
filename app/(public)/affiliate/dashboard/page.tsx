'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AffiliateStats {
  name: string;
  code: string;
  status: string;
  totalClicks: number;
  totalLeads: number;
  totalBookings: number;
  createdAt: string;
}

interface ClickEvent {
  pageUrl: string;
  packageSlug: string;
  convertedToEnquiry: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-lime/20 text-teal border-lime/30',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paused: 'bg-void/10 text-void/60 border-void/20',
  rejected: 'bg-red-50 text-red-600 border-red-200',
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

function AffiliateDashboard() {
  const searchParams = useSearchParams();
  const codeParam = searchParams?.get('code') ?? '';

  const [code, setCode] = useState(codeParam);
  const [inputCode, setInputCode] = useState(codeParam);
  const [affiliate, setAffiliate] = useState<AffiliateStats | null>(null);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const fetchData = useCallback(async (c: string) => {
    if (!c) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/affiliate/${encodeURIComponent(c.toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Not found');
      setAffiliate(data.affiliate);
      setClicks(data.recentClicks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load affiliate data.');
      setAffiliate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (codeParam) fetchData(codeParam);
  }, [codeParam, fetchData]);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bagpackerme.com';
  const affiliateBaseUrl = affiliate ? `${baseUrl}/packages?ref=${affiliate.code}` : '';

  const stats = [
    { label: 'Total Clicks', value: affiliate?.totalClicks ?? 0, icon: '👆', color: 'from-teal/10 to-teal/5' },
    { label: 'Leads Generated', value: affiliate?.totalLeads ?? 0, icon: '📋', color: 'from-lime/20 to-lime/5' },
    { label: 'Confirmed Bookings', value: affiliate?.totalBookings ?? 0, icon: '✅', color: 'from-cyan/20 to-cyan/5' },
    {
      label: 'Conversion Rate',
      value: affiliate && affiliate.totalClicks > 0
        ? `${((affiliate.totalLeads / affiliate.totalClicks) * 100).toFixed(1)}%`
        : '0%',
      icon: '📈',
      color: 'from-amber-50 to-white',
    },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative bg-teal pt-40 md:pt-52 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[45%] h-[45%] bg-lime/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="relative max-w-[860px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Affiliate Dashboard
            </div>
            <h1 className="font-display text-white text-[42px] md:text-[64px] font-bold leading-[1.1]">
              Your Affiliate Hub
            </h1>
            <p className="font-body text-white/70 text-[16px] md:text-[19px] mt-4">
              Track your clicks, leads, and earnings in one place.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="bg-white rounded-t-[40px] md:rounded-t-[60px] -mt-10 md:-mt-16 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.04)]">
        <div className="max-w-[960px] mx-auto px-6 pt-14 pb-24">

          {/* ── Code Lookup ─────────────────────────────────────────────── */}
          {!affiliate && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="bg-ice/60 rounded-3xl p-8 border border-void/8">
                <h2 className="font-display text-void font-bold text-[22px] mb-2">Enter Your Affiliate Code</h2>
                <p className="font-body text-void/50 text-[14px] mb-6">
                  Your code was sent to you via email after approval (e.g. <span className="font-mono text-teal">BP-JOHN42</span>).
                </p>
                <form
                  className="flex gap-3"
                  onSubmit={e => { e.preventDefault(); setCode(inputCode); fetchData(inputCode); }}
                >
                  <input
                    id="affiliate-code-input"
                    type="text"
                    placeholder="e.g. BP-JOHN42"
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value.toUpperCase())}
                    className="flex-1 px-5 py-4 rounded-2xl border border-void/10 bg-white font-mono text-[15px] text-void placeholder-void/30 outline-none focus:border-teal/50 focus:ring-4 focus:ring-teal/10 transition-all uppercase"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-4 bg-teal text-white font-display font-bold text-[13px] tracking-widest uppercase rounded-2xl hover:bg-void transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Loading…' : 'View Stats'}
                  </button>
                </form>
                {error && <p className="mt-4 text-red-500 font-body text-[14px]">{error}</p>}
              </div>
              <div className="mt-6 text-center">
                <p className="font-body text-void/40 text-[14px]">
                  Don&apos;t have an affiliate code yet?{' '}
                  <Link href="/affiliate" className="text-teal font-bold hover:underline">Apply now →</Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Dashboard (shown after lookup) ─────────────────────────── */}
          {affiliate && (
            <>
              {/* Profile header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-void/8"
              >
                <div>
                  <h2 className="font-display text-void font-bold text-[28px]">Welcome, {affiliate.name}!</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-teal text-[15px] font-bold bg-teal/10 px-3 py-1 rounded-full">{affiliate.code}</span>
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-display font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${STATUS_COLORS[affiliate.status] || 'bg-gray-100 text-gray-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {affiliate.status}
                    </span>
                  </div>
                  <p className="font-body text-void/40 text-[13px] mt-2">
                    Member since {new Date(affiliate.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => { setAffiliate(null); setCode(''); setInputCode(''); setClicks([]); }}
                  className="text-[13px] font-body text-void/40 hover:text-teal transition-colors underline"
                >
                  Switch account
                </button>
              </motion.div>

              {/* Status warning */}
              {affiliate.status !== 'active' && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3"
                >
                  <span className="text-xl">⏳</span>
                  <div>
                    <p className="font-display font-bold text-amber-800 text-[15px]">
                      {affiliate.status === 'pending' ? 'Application Under Review' : `Account ${affiliate.status}`}
                    </p>
                    <p className="font-body text-amber-700 text-[13px] mt-1">
                      {affiliate.status === 'pending'
                        ? 'Your application is being reviewed. Once approved, your links will start tracking clicks.'
                        : 'Please contact support for assistance with your account status.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    custom={i} initial="hidden" animate="show" variants={fadeUp}
                    className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 border border-void/5`}
                  >
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <p className="font-display text-void font-bold text-[28px] leading-none mb-1">{s.value}</p>
                    <p className="font-body text-void/50 text-[13px]">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Your Links */}
              <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp} className="mb-10">
                <h3 className="font-display text-void font-bold text-[22px] mb-5">Your Tracking Links</h3>
                <div className="space-y-3">
                  {[
                    { label: 'All Packages', url: affiliateBaseUrl },
                    { label: 'Homepage', url: `${baseUrl}?ref=${affiliate.code}` },
                  ].map(({ label, url }) => (
                    <div key={label} className="flex items-center gap-3 bg-ice/50 rounded-2xl border border-void/8 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-void/50 text-[11px] font-bold tracking-widest uppercase mb-1">{label}</p>
                        <p className="font-mono text-teal text-[13px] truncate">{url}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(url, label)}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 bg-teal text-white font-display font-bold text-[11px] tracking-widest uppercase rounded-xl hover:bg-void transition-colors"
                      >
                        {copied === label ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="font-body text-void/40 text-[13px] mt-4">
                  💡 <strong>Tip:</strong> You can also link to any specific package by adding <span className="font-mono text-teal">?ref={affiliate.code}</span> to any page URL.
                </p>
              </motion.div>

              {/* Recent Clicks */}
              <motion.div custom={5} initial="hidden" animate="show" variants={fadeUp}>
                <h3 className="font-display text-void font-bold text-[22px] mb-5">Recent Clicks</h3>
                {clicks.length === 0 ? (
                  <div className="bg-ice/40 rounded-2xl border border-void/8 p-10 text-center">
                    <p className="text-3xl mb-3">👁️</p>
                    <p className="font-body text-void/50 text-[15px]">No clicks yet. Start sharing your link to see activity here.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-void/8">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-ice/60 border-b border-void/8">
                          <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/50">Page</th>
                          <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/50 hidden sm:table-cell">Package</th>
                          <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/50">Lead?</th>
                          <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/50 hidden md:table-cell">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-void/5">
                        {clicks.map((c, i) => (
                          <tr key={i} className="hover:bg-teal/[0.02] transition-colors">
                            <td className="px-5 py-3 font-body text-void/60 text-[13px] max-w-[200px] truncate">{c.pageUrl}</td>
                            <td className="px-5 py-3 font-body text-void/60 text-[13px] hidden sm:table-cell">{c.packageSlug || '—'}</td>
                            <td className="px-5 py-3">
                              {c.convertedToEnquiry
                                ? <span className="text-[12px] font-display font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">Yes</span>
                                : <span className="text-[12px] font-body text-void/30">—</span>}
                            </td>
                            <td className="px-5 py-3 font-body text-void/40 text-[12px] hidden md:table-cell">
                              {new Date(c.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function AffiliateDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-display text-teal/60 text-sm tracking-widest uppercase">Loading…</span>
        </div>
      </div>
    }>
      <AffiliateDashboard />
    </Suspense>
  );
}
