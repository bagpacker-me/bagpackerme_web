'use client';

import { useEffect, useState, useMemo } from 'react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '@/lib/firestore';
import { Enquiry } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type StatusFilter = 'all' | 'new' | 'in_progress' | 'responded';

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  responded: 'Responded',
};

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  responded: 'bg-lime-100 text-lime-700',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[120, 160, 100, 120, 120, 100, 80, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Slide-over detail panel ─────────────────────────────────────────────────
function EnquirySlideOver({
  enquiry,
  onClose,
  onStatusChange,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusChange: (id: string, status: Enquiry['status']) => void;
}) {
  const whatsappMsg = encodeURIComponent(
    `Hi ${enquiry.name}! Thank you for your enquiry${enquiry.packageSlug ? ` about "${enquiry.packageSlug}"` : ''}. We'd love to help you plan your trip. Here are some details...`
  );
  const whatsappUrl = enquiry.phone
    ? `https://wa.me/${enquiry.phone.replace(/\D/g, '')}?text=${whatsappMsg}`
    : null;

  const mailtoUrl = `mailto:${enquiry.email}?subject=Re: Your Enquiry with BagPackerMe&body=Hi ${encodeURIComponent(enquiry.name)},%0D%0A%0D%0AThank you for your enquiry...`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{enquiry.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{enquiry.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
            <select
              value={enquiry.status}
              onChange={(e) => onStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#285056]/25 focus:border-[#285056]"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Phone', value: enquiry.phone },
              { label: 'Inquiry Type', value: enquiry.inquiryType },
              { label: 'Package', value: enquiry.packageSlug ?? '—' },
              { label: 'Group Size', value: enquiry.groupSize ? `${enquiry.groupSize} people` : '—' },
              { label: 'Travel Date', value: enquiry.travelDate ? format(new Date(enquiry.travelDate), 'd MMM yyyy') : '—' },
              { label: 'Submitted', value: enquiry.createdAt ? format(new Date(enquiry.createdAt), 'd MMM yyyy, h:mm a') : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</label>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {enquiry.message || <span className="italic text-gray-300">No message</span>}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12.004 2C6.476 2 2 6.477 2 12.004c0 1.765.462 3.42 1.268 4.862L2 22l5.234-1.254A9.955 9.955 0 0012.004 22C17.53 22 22 17.524 22 12.004S17.53 2 12.004 2zm0 18.214a8.207 8.207 0 01-4.178-1.144l-.3-.178-3.107.744.784-3.023-.196-.31a8.178 8.178 0 01-1.246-4.3C3.76 6.898 7.434 3.786 12.004 3.786c4.57 0 8.214 3.658 8.214 8.218 0 4.558-3.68 8.21-8.214 8.21z"/>
              </svg>
              Reply on WhatsApp
            </a>
          )}
          <a
            href={mailtoUrl}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Send Email
          </a>
        </div>
      </div>
    </>
  );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportToCSV(data: Enquiry[]) {
  const headers = ['Name', 'Email', 'Phone', 'Inquiry Type', 'Package', 'Group Size', 'Travel Date', 'Status', 'Date Submitted', 'Message'];
  const rows = data.map((e) => [
    e.name,
    e.email,
    e.phone,
    e.inquiryType,
    e.packageSlug ?? '',
    e.groupSize ?? '',
    e.travelDate ?? '',
    STATUS_LABELS[e.status] ?? e.status,
    e.createdAt ? format(new Date(e.createdAt), 'd MMM yyyy') : '',
    `"${(e.message ?? '').replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bagpackerme-enquiries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const snap = await getEnquiries();
      setEnquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry)));
    } catch {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : p);
    try {
      await updateEnquiry(id, { status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
      fetchEnquiries();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEnquiry(deleteTarget.id);
      setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Enquiry deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return enquiries;
    return enquiries.filter((e) => e.status === filter);
  }, [enquiries, filter]);

  const counts = useMemo(() => ({
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    in_progress: enquiries.filter((e) => e.status === 'in_progress').length,
    responded: enquiries.filter((e) => e.status === 'responded').length,
  }), [enquiries]);

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'responded', label: 'Responded' },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Enquiries
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{enquiries.length} total enquiries</p>
        </div>
        <button
          type="button"
          onClick={() => exportToCSV(filtered)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 mb-5 flex gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              filter === tab.id
                ? 'border-[#285056] text-[#285056]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === tab.id ? 'bg-[#285056]/10 text-[#285056]' : 'bg-gray-100 text-gray-400'
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Name', 'Email', 'Phone', 'Inquiry Type', 'Package', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                      </svg>
                      <p className="font-medium text-gray-500">No {filter !== 'all' ? STATUS_LABELS[filter]?.toLowerCase() : ''} enquiries yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setSelected(enq)}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{enq.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[160px]">{enq.email}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.inquiryType || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[120px]">
                      {enq.packageSlug || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {enq.createdAt ? format(new Date(enq.createdAt), 'd MMM yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[enq.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {STATUS_LABELS[enq.status] ?? enq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(enq); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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
      </div>

      {/* Slide-over */}
      {selected && (
        <EnquirySlideOver
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Enquiry</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Delete enquiry from <strong className="text-gray-700">{deleteTarget.name}</strong>? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
