'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAffiliate, updateAffiliate, deleteAffiliate, getClicksByAffiliate } from '@/lib/firestore';
import { Affiliate, AffiliateClick, AffiliateStatus } from '@/types';
import { ArrowLeft, Save, Trash2, Calendar, Link as LinkIcon, Globe, Phone, Mail } from 'lucide-react';

const STATUS_OPTIONS: AffiliateStatus[] = ['active', 'pending', 'paused', 'rejected'];

export default function AffiliateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Editable fields
  const [editStatus, setEditStatus] = useState<AffiliateStatus>('pending');
  const [editCommission, setEditCommission] = useState(10);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getAffiliate(params.id);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Affiliate;
          setAffiliate(data);
          setEditStatus(data.status);
          setEditCommission(data.commissionRate || 10);
          setEditNotes(data.notes || '');

          const clicksSnap = await getClicksByAffiliate(data.code);
          setClicks(clicksSnap.docs.map(d => ({ id: d.id, ...d.data() } as AffiliateClick)));
        } else {
          router.push('/admin/affiliates');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, router]);

  const handleSave = async () => {
    if (!affiliate) return;
    setSaving(true);
    try {
      const updates = {
        status: editStatus,
        commissionRate: editCommission,
        notes: editNotes,
      };
      await updateAffiliate(affiliate.id, updates);
      setAffiliate({ ...affiliate, ...updates });
      alert('Affiliate updated successfully.');
    } catch (err) {
      alert('Failed to update affiliate.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!affiliate) return;
    if (!confirm(`Are you sure you want to delete ${affiliate.name}? This action cannot be undone.`)) return;
    try {
      await deleteAffiliate(affiliate.id);
      router.push('/admin/affiliates');
    } catch (err) {
      alert('Failed to delete affiliate.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin w-8 h-8 text-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!affiliate) return null;

  return (
    <div className="max-w-[1000px] mx-auto pb-12">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/admin/affiliates"
          className="flex items-center gap-2 text-void/50 hover:text-teal font-display text-[13px] font-bold tracking-widest uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Affiliates
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg font-display text-[12px] font-bold tracking-widest uppercase transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg font-display text-[12px] font-bold tracking-widest uppercase hover:bg-void transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Profile & Edit ────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-void/8 dark:border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-[24px] text-void dark:text-white mb-1">{affiliate.name}</h2>
            <div className="flex items-center gap-2 mb-6 text-void/50 dark:text-white/40 font-body text-[13px]">
              <Calendar className="w-4 h-4" /> Joined {new Date(affiliate.createdAt).toLocaleDateString()}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 font-body text-[14px]">
                <Mail className="w-4 h-4 text-void/40" />
                <a href={`mailto:${affiliate.email}`} className="text-teal hover:underline break-all">{affiliate.email}</a>
              </div>
              {affiliate.phone && (
                <div className="flex items-center gap-3 font-body text-[14px]">
                  <Phone className="w-4 h-4 text-void/40" />
                  <span className="text-void/80 dark:text-white/80">{affiliate.phone}</span>
                </div>
              )}
              {affiliate.socialHandle && (
                <div className="flex items-center gap-3 font-body text-[14px]">
                  <Globe className="w-4 h-4 text-void/40" />
                  <span className="text-void/80 dark:text-white/80">{affiliate.socialHandle}</span>
                </div>
              )}
              <div className="flex items-center gap-3 font-body text-[14px]">
                <LinkIcon className="w-4 h-4 text-void/40" />
                <span className="font-mono bg-teal/10 text-teal px-2 py-0.5 rounded text-[13px] font-bold">{affiliate.code}</span>
              </div>
            </div>

            <div className="space-y-5 pt-6 border-t border-void/8 dark:border-white/10">
              <div>
                <label className="block font-display text-[12px] font-bold tracking-widest uppercase text-void/40 dark:text-white/40 mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as AffiliateStatus)}
                  className="w-full px-4 py-2.5 bg-void/[0.02] dark:bg-white/[0.02] border border-void/10 dark:border-white/10 rounded-xl font-body text-[14px] outline-none focus:border-teal"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-display text-[12px] font-bold tracking-widest uppercase text-void/40 dark:text-white/40 mb-2">Commission Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editCommission}
                  onChange={e => setEditCommission(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-void/[0.02] dark:bg-white/[0.02] border border-void/10 dark:border-white/10 rounded-xl font-body text-[14px] outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block font-display text-[12px] font-bold tracking-widest uppercase text-void/40 dark:text-white/40 mb-2">Admin Notes (Hidden from affiliate)</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-void/[0.02] dark:bg-white/[0.02] border border-void/10 dark:border-white/10 rounded-xl font-body text-[14px] outline-none focus:border-teal resize-none"
                  placeholder="Private notes about this affiliate..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Stats & Clicks ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Clicks', value: affiliate.totalClicks },
              { label: 'Total Leads', value: affiliate.totalLeads },
              { label: 'Total Bookings', value: affiliate.totalBookings },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-white/5 border border-void/8 dark:border-white/10 rounded-2xl p-5 text-center">
                <p className="font-display font-bold text-[32px] text-void dark:text-white leading-none mb-1">{s.value}</p>
                <p className="font-body text-void/50 dark:text-white/40 text-[12px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-white/5 border border-void/8 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-void/8 dark:border-white/10 flex justify-between items-center">
              <h3 className="font-display font-bold text-[18px] text-void dark:text-white">Click History</h3>
              <span className="font-body text-[13px] text-void/40 dark:text-white/40">{clicks.length} total events</span>
            </div>
            
            {clicks.length === 0 ? (
              <div className="p-8 text-center text-void/40 dark:text-white/40 font-body text-[14px]">
                No tracked clicks yet.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white dark:bg-[#1A1625] z-10">
                    <tr className="border-b border-void/8 dark:border-white/10">
                      <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/40 dark:text-white/30">Date</th>
                      <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/40 dark:text-white/30">Page</th>
                      <th className="px-5 py-3 font-display text-[11px] font-bold tracking-widest uppercase text-void/40 dark:text-white/30 text-center">Lead?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-void/5 dark:divide-white/5">
                    {clicks.map(c => (
                      <tr key={c.id} className="hover:bg-void/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-body text-void/60 dark:text-white/60 text-[13px] whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-body text-void/80 dark:text-white/80 text-[13px]">
                          <div className="truncate max-w-[250px]">{c.pageUrl}</div>
                          {c.packageSlug && (
                            <div className="text-[11px] text-void/40 dark:text-white/40 mt-0.5">Package: {c.packageSlug}</div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {c.convertedToEnquiry ? (
                            <span className="inline-block bg-teal/10 text-teal text-[11px] font-bold px-2 py-0.5 rounded-full">YES</span>
                          ) : (
                            <span className="text-void/20 dark:text-white/20">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
