'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAffiliates, updateAffiliate, deleteAffiliate } from '@/lib/firestore';
import { Affiliate, AffiliateStatus } from '@/types';
import { Users, TrendingUp, Clock, XCircle, ChevronRight, Search, Filter } from 'lucide-react';

const STATUS_STYLES: Record<AffiliateStatus, string> = {
  active:   'bg-lime/20 text-teal border-lime/30',
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  paused:   'bg-void/10 text-void/50 border-void/20',
  rejected: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_OPTIONS: AffiliateStatus[] = ['active', 'pending', 'paused', 'rejected'];

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AffiliateStatus | 'all'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const snap = await getAffiliates();
      setAffiliates(snap.docs.map(d => ({ id: d.id, ...d.data() } as Affiliate)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAffiliates(); }, []);

  const handleStatusChange = async (id: string, status: AffiliateStatus) => {
    setUpdating(id);
    await updateAffiliate(id, { status });
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setUpdating(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete affiliate "${name}"? This cannot be undone.`)) return;
    await deleteAffiliate(id);
    setAffiliates(prev => prev.filter(a => a.id !== id));
  };

  const filtered = affiliates.filter(a => {
    const matchSearch = search === '' || [a.name, a.email, a.code].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending = affiliates.filter(a => a.status === 'pending').length;
  const active = affiliates.filter(a => a.status === 'active').length;
  const totalClicks = affiliates.reduce((s, a) => s + (a.totalClicks || 0), 0);
  const totalLeads = affiliates.reduce((s, a) => s + (a.totalLeads || 0), 0);

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-void dark:text-white font-bold text-[28px] md:text-[34px]">Affiliates</h1>
          <p className="font-body text-void/50 dark:text-white/40 text-[14px] mt-1">Manage your affiliate partners and track their performance.</p>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Affiliates', value: affiliates.length, icon: Users, color: 'text-teal', bg: 'bg-teal/10' },
          { label: 'Active', value: active, icon: TrendingUp, color: 'text-lime-700', bg: 'bg-lime/20' },
          { label: 'Pending Approval', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Leads', value: totalLeads, icon: ChevronRight, color: 'text-cyan-600', bg: 'bg-cyan/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-white/5 rounded-2xl border border-void/8 dark:border-white/10 p-6">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-display text-void dark:text-white font-bold text-[26px] leading-none mb-1">{value}</p>
            <p className="font-body text-void/50 dark:text-white/40 text-[13px]">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void/30 dark:text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-void/10 dark:border-white/10 bg-white dark:bg-white/5 font-body text-[14px] text-void dark:text-white placeholder-void/30 dark:placeholder-white/30 outline-none focus:border-teal/40 focus:ring-2 focus:ring-teal/10 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void/30 dark:text-white/30 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as AffiliateStatus | 'all')}
            className="pl-9 pr-8 py-3 rounded-xl border border-void/10 dark:border-white/10 bg-white dark:bg-white/5 font-body text-[14px] text-void dark:text-white outline-none focus:border-teal/40 appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-void/8 dark:border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-void/20 dark:text-white/20 mb-4" />
            <p className="font-display text-void/50 dark:text-white/40 text-[16px]">
              {search || filterStatus !== 'all' ? 'No affiliates match your filters.' : 'No affiliates yet. Share your program!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-void/8 dark:border-white/10 bg-void/[0.02] dark:bg-white/[0.02]">
                  {['Affiliate', 'Code', 'Status', 'Clicks', 'Leads', 'Commission', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 font-display text-[11px] font-bold tracking-widest uppercase text-void/40 dark:text-white/30 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-void/5 dark:divide-white/5">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-teal/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                    {/* Name / Email */}
                    <td className="px-5 py-4">
                      <p className="font-display text-void dark:text-white font-bold text-[14px]">{a.name}</p>
                      <p className="font-body text-void/40 dark:text-white/30 text-[12px] mt-0.5">{a.email}</p>
                    </td>

                    {/* Code */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-teal text-[13px] bg-teal/10 px-2.5 py-1 rounded-full font-bold">{a.code}</span>
                    </td>

                    {/* Status quick-change */}
                    <td className="px-5 py-4">
                      {updating === a.id ? (
                        <span className="font-body text-void/40 text-[12px]">Saving…</span>
                      ) : (
                        <select
                          value={a.status}
                          onChange={e => handleStatusChange(a.id, e.target.value as AffiliateStatus)}
                          className={`text-[12px] font-display font-bold uppercase tracking-wider border rounded-full px-3 py-1 cursor-pointer appearance-none outline-none ${STATUS_STYLES[a.status]}`}
                          aria-label={`Status for ${a.name}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </td>

                    {/* Stats */}
                    <td className="px-5 py-4 font-body text-void dark:text-white/80 text-[14px] text-center">{a.totalClicks}</td>
                    <td className="px-5 py-4 font-body text-void dark:text-white/80 text-[14px] text-center">{a.totalLeads}</td>
                    <td className="px-5 py-4 font-body text-void dark:text-white/80 text-[14px] text-center">{a.commissionRate}%</td>

                    {/* Joined */}
                    <td className="px-5 py-4 font-body text-void/40 dark:text-white/30 text-[12px] whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/affiliates/${a.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-teal/10 hover:bg-teal text-teal hover:text-white font-display text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          className="p-1.5 text-void/30 hover:text-red-500 transition-colors"
                          aria-label={`Delete ${a.name}`}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats footer */}
      {!loading && filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="font-body text-void/40 dark:text-white/30 text-[13px]">
            {filtered.length} of {affiliates.length} affiliates · {totalClicks} total clicks
          </p>
        </div>
      )}
    </div>
  );
}
