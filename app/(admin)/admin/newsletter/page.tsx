'use client';

import { useEffect, useState, useMemo } from 'react';
import { getSubscribers, deleteSubscriber } from '@/lib/firestore';
import { Subscriber } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportToCSV(data: Subscriber[]) {
  const headers = ['Email', 'Subscribed On'];
  const rows = data.map((s) => [
    s.email,
    s.createdAt ? format(new Date(s.createdAt), 'd MMM yyyy') : '',
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bagpackerme-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
      {[260, 140, 100].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.1)] rounded animate-pulse"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const snap = await getSubscribers();
      setSubscribers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscriber)));
    } catch {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  // Rolling counts for last 7 days and 30 days
  const stats = useMemo(() => {
    const now = Date.now();
    const day7 = subscribers.filter(
      (s) => s.createdAt && now - new Date(s.createdAt).getTime() < 7 * 86400_000
    ).length;
    const day30 = subscribers.filter(
      (s) => s.createdAt && now - new Date(s.createdAt).getTime() < 30 * 86400_000
    ).length;
    return { total: subscribers.length, day7, day30 };
  }, [subscribers]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSubscriber(deleteTarget.id);
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success('Subscriber removed');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete subscriber');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-void dark:text-white font-heading">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">
            {stats.total} total subscriber{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportToCSV(filtered)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-gray-700 dark:text-[rgba(255,255,255,0.8)] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Subscribers', value: stats.total, icon: '👥' },
          { label: 'Last 7 Days', value: stats.day7, icon: '📈' },
          { label: 'Last 30 Days', value: stats.day30, icon: '📅' },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#1A1625] rounded-2xl border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)] px-5 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9F5F7] dark:bg-[rgba(14,210,233,0.1)] flex items-center justify-center text-lg">
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-void dark:text-white font-display">{value}</p>
              <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.5)] font-body mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[rgba(255,255,255,0.4)] pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1A1625] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[rgba(255,255,255,0.35)] focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal transition-shadow"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1625] overflow-x-auto rounded-xl border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border-b-2 border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)]">
              {[
                { label: 'Email', cls: 'text-left' },
                { label: 'Subscribed On', cls: 'text-left hidden sm:table-cell' },
                { label: 'Actions', cls: 'text-right' },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-3 font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase ${col.cls}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                    </svg>
                    <p className="font-medium text-gray-500">
                      {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors group h-[54px] align-middle"
                >
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className="w-8 h-8 rounded-full bg-[#E9F5F7] dark:bg-[rgba(14,210,233,0.15)] flex items-center justify-center text-[11px] font-bold text-teal dark:text-[#0ED2E9] flex-shrink-0 uppercase">
                        {sub.email.charAt(0)}
                      </div>
                      <span className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                        {sub.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.7)] hidden sm:table-cell">
                    {sub.createdAt ? format(new Date(sub.createdAt), 'd MMM yyyy') : '—'}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(sub)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove subscriber"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Subscriber count footer */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.4)] mt-3 text-right">
          Showing {filtered.length} of {subscribers.length} subscribers
        </p>
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white dark:bg-[#1A1625] dark:border dark:border-[rgba(255,255,255,0.1)] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Remove Subscriber</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Remove <strong className="text-gray-700 dark:text-gray-300">{deleteTarget.email}</strong> from the newsletter? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {deleting && (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
