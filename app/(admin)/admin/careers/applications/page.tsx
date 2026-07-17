'use client';

import { useEffect, useState, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJobApplications, updateJobApplication } from '@/lib/firestore';
import { JobApplication, ApplicationStatus } from '@/types';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER } from '@/lib/careers';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type StatusFilter = 'all' | ApplicationStatus;

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: 'bg-[#E0F7FF] dark:bg-[#E0F7FF]/20 text-[#0369a1] dark:text-[#38bdf8]',
  shortlisted: 'bg-[#EDE9FE] dark:bg-[#EDE9FE]/20 text-[#5b21b6] dark:text-[#c4b5fd]',
  interviewing: 'bg-[#FEF9C3] dark:bg-[#FEF9C3]/20 text-[#854d0e] dark:text-[#fde047]',
  hired: 'bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-[#166534] dark:text-[#4ade80]',
  rejected: 'bg-[#FEE2E2] dark:bg-[#FEE2E2]/20 text-[#991b1b] dark:text-[#fca5a5]',
};

function formatBytes(bytes: number | null) {
  if (typeof bytes !== 'number' || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.1)] rounded animate-pulse w-28" />
        </td>
      ))}
    </tr>
  );
}

// ─── Slide-over detail panel ─────────────────────────────────────────────────
function ApplicationSlideOver({
  application,
  onClose,
  onStatusChange,
  onNotesChange,
  onDelete,
}: {
  application: JobApplication;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (application: JobApplication) => void;
}) {
  const [notes, setNotes] = useState(application.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-seed when the panel switches to a different candidate.
  useEffect(() => {
    setNotes(application.notes ?? '');
  }, [application.id, application.notes]);

  // Debounced so typing a note isn't one write per keystroke.
  const handleNotesInput = (value: string) => {
    setNotes(value);
    setSavingNotes(true);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      onNotesChange(application.id, value);
      setSavingNotes(false);
    }, 800);
  };

  // Flush a pending note rather than losing it when the panel closes.
  useEffect(() => {
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
    };
  }, []);

  const mailtoUrl = `mailto:${application.email}?subject=${encodeURIComponent(
    `Your application for ${application.jobTitle} at BagPackerMe`
  )}&body=${encodeURIComponent(`Hi ${application.fullName.split(' ')[0]},\n\n`)}`;

  const whatsappUrl = application.phone
    ? `https://wa.me/${application.phone.replace(/\D/g, '')}`
    : null;

  const details: { label: string; value: string }[] = [
    { label: 'Role', value: application.jobTitle },
    { label: 'Phone', value: application.phone || '—' },
    { label: 'Experience', value: application.yearsExperience || '—' },
    { label: 'Notice Period', value: application.noticePeriod || '—' },
    {
      label: 'Applied',
      value: application.createdAt ? format(new Date(application.createdAt), 'd MMM yyyy, h:mm a') : '—',
    },
    { label: 'CV Size', value: formatBytes(application.cvSize) },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FFFFFF] dark:bg-[#1A1625] shadow-2xl flex flex-col dark:border-l dark:border-[rgba(255,255,255,0.06)]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)]">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">{application.fullName}</h2>
            <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5 truncate">{application.email}</p>
            <p className="text-xs text-gray-500 dark:text-[rgba(255,255,255,0.5)] mt-1 truncate">{application.jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Pipeline */}
          <div>
            <label
              htmlFor="application-status"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Pipeline
            </label>
            <select
              id="application-status"
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1A1625] focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal"
            >
              {APPLICATION_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>{APPLICATION_STATUS_LABELS[status]}</option>
              ))}
            </select>
          </div>

          {/* CV */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">CV</label>
            {application.cvPath ? (
              <a
                href={`/api/admin/applications/${application.id}/cv`}
                download
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors group"
              >
                <svg className="w-5 h-5 text-teal dark:text-[#C1EA00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-gray-800 dark:text-[rgba(255,255,255,0.9)] truncate">
                    {application.cvFilename ?? 'Download CV'}
                  </span>
                  <span className="block text-xs text-gray-400">{formatBytes(application.cvSize)}</span>
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic px-4 py-3 rounded-xl bg-gray-50 dark:bg-[rgba(255,255,255,0.02)]">
                No CV attached — check their links below.
              </p>
            )}
          </div>

          {/* Links */}
          {(application.linkedinUrl || application.portfolioUrl) && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Links</label>
              <div className="space-y-2">
                {application.linkedinUrl && (
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-teal dark:text-[#C1EA00] hover:underline truncate"
                  >
                    LinkedIn — {application.linkedinUrl}
                  </a>
                )}
                {application.portfolioUrl && (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-teal dark:text-[#C1EA00] hover:underline truncate"
                  >
                    Portfolio — {application.portfolioUrl}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            {details.map(({ label, value }) => (
              <div
                key={label}
                className="bg-gray-50 dark:bg-[rgba(255,255,255,0.02)] rounded-xl p-3 border border-transparent dark:border-[rgba(255,255,255,0.04)]"
              >
                <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.5)] font-medium mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 dark:text-[rgba(255,255,255,0.9)] font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Cover note */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Note</label>
            <div className="bg-gray-50 dark:bg-[rgba(255,255,255,0.02)] rounded-xl p-4 text-sm text-gray-700 dark:text-[rgba(255,255,255,0.8)] border border-transparent dark:border-[rgba(255,255,255,0.04)] leading-relaxed whitespace-pre-wrap">
              {application.coverNote || <span className="italic text-gray-300">No note</span>}
            </div>
          </div>

          {/* Internal notes */}
          <div>
            <label
              htmlFor="application-notes"
              className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Internal Notes
              <span className="normal-case tracking-normal font-normal text-gray-300">
                {savingNotes ? 'Saving…' : 'Only visible here'}
              </span>
            </label>
            <textarea
              id="application-notes"
              value={notes}
              onChange={(e) => handleNotesInput(e.target.value)}
              rows={4}
              placeholder="Interview feedback, next steps..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1A1625] focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal resize-y"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] space-y-2">
          <div className="flex gap-2">
            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-gray-700 dark:text-[rgba(255,255,255,0.8)] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Email
            </a>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDelete(application)}
            className="w-full py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            Delete application and CV
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
// Deliberately excludes the CV: a spreadsheet of candidate PII is already
// sensitive enough without shipping the resumes alongside it.
function exportToCSV(data: JobApplication[]) {
  const escape = (value: string | number | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const headers = ['Name', 'Email', 'Phone', 'Role', 'Experience', 'Notice Period', 'Status', 'Applied', 'LinkedIn', 'Portfolio'];
  const rows = data.map((a) => [
    escape(a.fullName),
    escape(a.email),
    escape(a.phone),
    escape(a.jobTitle),
    escape(a.yearsExperience),
    escape(a.noticePeriod),
    escape(APPLICATION_STATUS_LABELS[a.status] ?? a.status),
    escape(a.createdAt ? format(new Date(a.createdAt), 'd MMM yyyy') : ''),
    escape(a.linkedinUrl),
    escape(a.portfolioUrl),
  ]);
  const csv = [headers.map(escape), ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bagpackerme-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function AdminApplicationsPageInner() {
  const searchParams = useSearchParams();
  const jobFilterParam = searchParams.get('job') ?? 'all';

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [jobFilter, setJobFilter] = useState<string>(jobFilterParam);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    setJobFilter(jobFilterParam);
  }, [jobFilterParam]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const snap = await getJobApplications();
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobApplication)));
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = useCallback(async (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelected((p) => (p && p.id === id ? { ...p, status } : p));
    try {
      await updateJobApplication(id, { status, updatedAt: new Date().toISOString() });
      toast.success(`Moved to ${APPLICATION_STATUS_LABELS[status]}`);
    } catch {
      toast.error('Failed to update status');
      fetchApplications();
    }
  }, []);

  const handleNotesChange = useCallback(async (id: string, notes: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)));
    try {
      await updateJobApplication(id, { notes, updatedAt: new Date().toISOString() });
    } catch {
      toast.error('Failed to save notes');
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Through the API, not deleteDoc: the route removes the CV from Storage
      // too. A client-side delete would strand the file where nobody can reach
      // or erase it.
      const response = await fetch(`/api/admin/applications/${deleteTarget.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Failed to delete');
      }
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Application and CV deleted');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // Distinct roles, from whatever has actually been applied to.
  const roles = useMemo(() => {
    const byId = new Map<string, string>();
    applications.forEach((a) => {
      if (a.jobId) byId.set(a.jobId, a.jobTitle || 'Untitled role');
    });
    return Array.from(byId, ([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
  }, [applications]);

  const byRole = useMemo(
    () => (jobFilter === 'all' ? applications : applications.filter((a) => a.jobId === jobFilter)),
    [applications, jobFilter]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return byRole.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (!term) return true;
      return (
        a.fullName.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term)
      );
    });
  }, [byRole, filter, search]);

  // Counts follow the role filter so the tabs describe what you're looking at.
  const counts = useMemo(
    () => ({
      all: byRole.length,
      new: byRole.filter((a) => a.status === 'new').length,
      shortlisted: byRole.filter((a) => a.status === 'shortlisted').length,
      interviewing: byRole.filter((a) => a.status === 'interviewing').length,
      hired: byRole.filter((a) => a.status === 'hired').length,
      rejected: byRole.filter((a) => a.status === 'rejected').length,
    }),
    [byRole]
  );

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...APPLICATION_STATUS_ORDER.map((status) => ({ id: status, label: APPLICATION_STATUS_LABELS[status] })),
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-void dark:text-white font-heading">Applications</h1>
          <p className="text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">
            {applications.length} total · {counts.new} new
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

      {/* Role filter + search */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div>
          <label htmlFor="role-filter" className="sr-only">Filter by role</label>
          <select
            id="role-filter"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1A1625] focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal"
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.title}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <label htmlFor="application-search" className="sr-only">Search by name or email</label>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            id="application-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1A1625] focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)] mb-5 flex gap-1 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              filter === tab.id
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter === tab.id
                  ? 'bg-teal/10 text-teal dark:text-[#C1EA00]'
                  : 'bg-gray-100 dark:bg-[rgba(255,255,255,0.1)] text-gray-400'
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1625] overflow-x-auto rounded-lg border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border-b-[2px] border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)]">
              {[
                { id: 'name', label: 'Candidate', class: 'text-left' },
                { id: 'role', label: 'Role', class: 'text-left hidden md:table-cell' },
                { id: 'experience', label: 'Experience', class: 'text-left hidden lg:table-cell' },
                { id: 'cv', label: 'CV', class: 'text-left hidden sm:table-cell' },
                { id: 'applied', label: 'Applied', class: 'text-left hidden xl:table-cell' },
                { id: 'status', label: 'Status', class: 'text-left' },
              ].map((col) => (
                <th
                  key={col.id}
                  className={`px-[16px] py-[12px] font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase ${col.class}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <p className="font-medium text-gray-500">
                      {search || filter !== 'all' || jobFilter !== 'all'
                        ? 'No applications match these filters.'
                        : 'No applications yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className="border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors h-[56px] align-middle cursor-pointer"
                >
                  <td className="px-[16px] py-[8px]">
                    <p className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">{app.fullName}</p>
                    <p className="font-body text-[12px] text-[#718096] dark:text-[rgba(255,255,255,0.55)] mt-0.5 truncate max-w-[220px]">
                      {app.email}
                    </p>
                    <p className="font-body text-[11px] text-[#718096] md:hidden mt-0.5">{app.jobTitle}</p>
                  </td>
                  <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] truncate max-w-[180px] hidden md:table-cell">
                    {app.jobTitle}
                  </td>
                  <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap hidden lg:table-cell">
                    {app.yearsExperience || '—'}
                  </td>
                  <td className="px-[16px] hidden sm:table-cell">
                    {app.cvPath ? (
                      <span className="inline-flex items-center gap-1 font-body text-[13px] text-[#166534] dark:text-[#4ade80]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Attached
                      </span>
                    ) : (
                      <span className="font-body text-[13px] text-[#718096]">—</span>
                    )}
                  </td>
                  <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap hidden xl:table-cell">
                    {app.createdAt ? format(new Date(app.createdAt), 'd MMM yyyy') : '—'}
                  </td>
                  <td className="px-[16px]">
                    <span
                      className={`inline-flex items-center min-w-[88px] justify-center px-[10px] py-[3px] rounded-full font-body text-[12px] font-medium ${
                        STATUS_STYLES[app.status] ?? 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {APPLICATION_STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over */}
      {selected && (
        <ApplicationSlideOver
          application={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onNotesChange={handleNotesChange}
          onDelete={(app) => setDeleteTarget(app)}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white dark:bg-[#1A1625] dark:border dark:border-[rgba(255,255,255,0.1)] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Application</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Permanently delete{' '}
                  <strong className="text-gray-700 dark:text-gray-300">{deleteTarget.fullName}</strong>&apos;s
                  application{deleteTarget.cvPath ? ' and their CV' : ''}? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.1)] transition-colors disabled:opacity-50"
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

export default function AdminApplicationsPage() {
  // useSearchParams needs a Suspense boundary to avoid opting the whole route
  // into client-side bailout during the build.
  return (
    <Suspense fallback={<div className="px-6 py-8 text-sm text-gray-400">Loading applications…</div>}>
      <AdminApplicationsPageInner />
    </Suspense>
  );
}
