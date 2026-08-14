'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  deleteClubApplication,
  getClubApplications,
  updateClubApplication,
} from '@/lib/firestore';
import {
  CLUB_QUESTIONS,
  CLUB_QUESTION_LABELS,
  CLUB_STATUS_LABELS,
  CLUB_STATUS_ORDER,
  instagramUrl,
  linkedinUrl,
  type ClubQuestionId,
} from '@/lib/club-application';
import { getClubTrip } from '@/lib/club-trips';
import type { ClubApplication, ClubApplicationStatus } from '@/types';

type StatusFilter = 'all' | ClubApplicationStatus;

const STATUS_STYLES: Record<ClubApplicationStatus, string> = {
  new: 'bg-[#E0F7FF] dark:bg-[#E0F7FF]/20 text-[#0369a1] dark:text-[#38bdf8]',
  shortlisted: 'bg-[#EDE9FE] dark:bg-[#EDE9FE]/20 text-[#5b21b6] dark:text-[#c4b5fd]',
  invited: 'bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-[#166534] dark:text-[#4ade80]',
  declined: 'bg-[#FEE2E2] dark:bg-[#FEE2E2]/20 text-[#991b1b] dark:text-[#fca5a5]',
};

// Short-answer questions read fine on one line; the long ones need room and the
// multi-selects render as chips. Everything else is derived from CLUB_QUESTIONS
// so adding a question to the form adds it here too.
const LONG_ANSWER_IDS = new Set<ClubQuestionId>(
  CLUB_QUESTIONS.filter((q) => q.type === 'long-text').map((q) => q.id)
);
const MULTI_ANSWER_IDS = new Set<ClubQuestionId>(
  CLUB_QUESTIONS.filter((q) => q.type === 'multi-choice').map((q) => q.id)
);

// Shown in the compact detail grid at the top of the panel, before the answers.
const SUMMARY_IDS: ClubQuestionId[] = ['ageBand', 'city', 'work', 'holidayBudget', 'discoverySource'];

function tripLabel(slug: string) {
  if (!slug) return 'Direct';
  return getClubTrip(slug)?.name ?? slug;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.1)]" />
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
  application: ClubApplication;
  onClose: () => void;
  onStatusChange: (id: string, status: ClubApplicationStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (application: ClubApplication) => void;
}) {
  const [notes, setNotes] = useState(application.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-seed when the panel switches to a different applicant.
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

  useEffect(() => {
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
    };
  }, []);

  const instagram = instagramUrl(application.instagram);
  const linkedin = linkedinUrl(application.linkedin);

  const mailtoUrl = `mailto:${application.email}?subject=${encodeURIComponent(
    'Your Curious Club application'
  )}&body=${encodeURIComponent(`Hi ${application.fullName.split(' ')[0]},\n\n`)}`;

  const whatsappUrl = application.phone
    ? `https://wa.me/${application.phone.replace(/\D/g, '')}`
    : null;

  // Every question in form order, minus the ones already shown above.
  const answerQuestions = CLUB_QUESTIONS.filter(
    (question) =>
      !SUMMARY_IDS.includes(question.id) &&
      !['fullName', 'email', 'phone', 'instagram', 'linkedin'].includes(question.id)
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-[#FFFFFF] shadow-2xl dark:border-l dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1A1625]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 bg-[#F7F9FA] px-6 py-4 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
              {application.fullName}
            </h2>
            <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-[rgba(255,255,255,0.6)]">
              {application.email}
            </p>
            <p className="mt-1 truncate text-xs text-gray-500 dark:text-[rgba(255,255,255,0.5)]">
              {application.city} · {application.ageBand} · via {tripLabel(application.trip)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Pipeline */}
          <div>
            <label
              htmlFor="club-status"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Pipeline
            </label>
            <select
              id="club-status"
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value as ClubApplicationStatus)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1A1625] dark:text-white"
            >
              {CLUB_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {CLUB_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Socials — the reason the review step exists at all. */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Profiles
            </label>
            {instagram || linkedin ? (
              <div className="space-y-2">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-teal hover:underline dark:text-[#C1EA00]"
                  >
                    Instagram — {application.instagram}
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-teal hover:underline dark:text-[#C1EA00]"
                  >
                    LinkedIn — {application.linkedin}
                  </a>
                )}
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm italic text-gray-400 dark:bg-[rgba(255,255,255,0.02)]">
                No profiles shared — both questions are optional.
              </p>
            )}
            {(instagram || linkedin) && (
              <p className="mt-2 text-xs text-gray-400">
                {application.consent
                  ? 'Consented to a public-profile review.'
                  : 'No consent recorded — do not review these profiles.'}
              </p>
            )}
          </div>

          {/* At a glance */}
          <div className="grid grid-cols-2 gap-3">
            {SUMMARY_IDS.map((id) => (
              <div
                key={id}
                className="rounded-xl border border-transparent bg-gray-50 p-3 dark:border-[rgba(255,255,255,0.04)] dark:bg-[rgba(255,255,255,0.02)]"
              >
                <p className="mb-0.5 text-xs font-medium text-gray-400 dark:text-[rgba(255,255,255,0.5)]">
                  {CLUB_QUESTION_LABELS[id]}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-[rgba(255,255,255,0.9)]">
                  {(application[id] as string) || '—'}
                </p>
              </div>
            ))}
            <div className="rounded-xl border border-transparent bg-gray-50 p-3 dark:border-[rgba(255,255,255,0.04)] dark:bg-[rgba(255,255,255,0.02)]">
              <p className="mb-0.5 text-xs font-medium text-gray-400 dark:text-[rgba(255,255,255,0.5)]">
                Applied
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-[rgba(255,255,255,0.9)]">
                {application.createdAt ? format(new Date(application.createdAt), 'd MMM yyyy') : '—'}
              </p>
            </div>
          </div>

          {/* Every remaining answer, in form order */}
          {answerQuestions.map((question) => {
            const value = application[question.id];
            const isMulti = MULTI_ANSWER_IDS.has(question.id);
            const list = Array.isArray(value) ? value : [];

            return (
              <div key={question.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {CLUB_QUESTION_LABELS[question.id]}
                </p>

                {isMulti ? (
                  list.length ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {list.map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal dark:bg-[#C1EA00]/10 dark:text-[#C1EA00]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-gray-300">No answer</p>
                  )
                ) : (
                  <div
                    className={`rounded-xl border border-transparent bg-gray-50 p-4 text-sm text-gray-700 dark:border-[rgba(255,255,255,0.04)] dark:bg-[rgba(255,255,255,0.02)] dark:text-[rgba(255,255,255,0.8)] ${
                      LONG_ANSWER_IDS.has(question.id) ? 'whitespace-pre-wrap leading-relaxed' : ''
                    }`}
                  >
                    {(value as string) || <span className="italic text-gray-300">No answer</span>}
                  </div>
                )}
              </div>
            );
          })}

          {/* Internal notes */}
          <div>
            <label
              htmlFor="club-notes"
              className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Internal Notes
              <span className="font-normal normal-case tracking-normal text-gray-300">
                {savingNotes ? 'Saving…' : 'Only visible here'}
              </span>
            </label>
            <textarea
              id="club-notes"
              value={notes}
              onChange={(e) => handleNotesInput(e.target.value)}
              rows={4}
              placeholder="Vibe call notes, who referred them, next steps…"
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1A1625] dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-gray-100 bg-[#F7F9FA] px-6 py-4 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
          <div className="flex gap-2">
            <a
              href={mailtoUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-[rgba(255,255,255,0.1)] dark:text-[rgba(255,255,255,0.8)] dark:hover:bg-[rgba(255,255,255,0.05)]"
            >
              Email
            </a>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
              >
                WhatsApp
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDelete(application)}
            className="w-full rounded-xl py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            Delete application
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportToCSV(data: ClubApplication[]) {
  const escape = (value: string | number | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const headers = [
    ...CLUB_QUESTIONS.map((question) => CLUB_QUESTION_LABELS[question.id]),
    'Came from',
    'Status',
    'Applied',
    'Notes',
  ];

  const rows = data.map((application) => [
    ...CLUB_QUESTIONS.map((question) => {
      const value = application[question.id];
      return escape(Array.isArray(value) ? value.join('; ') : (value as string));
    }),
    escape(tripLabel(application.trip)),
    escape(CLUB_STATUS_LABELS[application.status] ?? application.status),
    escape(application.createdAt ? format(new Date(application.createdAt), 'd MMM yyyy') : ''),
    escape(application.notes),
  ]);

  const csv = [headers.map(escape), ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `curious-club-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminClubPage() {
  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClubApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClubApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getClubApplications();
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClubApplication)));
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = useCallback(
    async (id: string, status: ClubApplicationStatus) => {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      try {
        await updateClubApplication(id, { status, updatedAt: new Date().toISOString() });
        toast.success(`Moved to ${CLUB_STATUS_LABELS[status]}`);
      } catch {
        toast.error('Failed to update status');
        fetchApplications();
      }
    },
    [fetchApplications]
  );

  const handleNotesChange = useCallback(async (id: string, notes: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)));
    try {
      await updateClubApplication(id, { notes, updatedAt: new Date().toISOString() });
    } catch {
      toast.error('Failed to save notes');
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClubApplication(deleteTarget.id);
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Application deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((application) => {
      if (filter !== 'all' && application.status !== filter) return false;
      if (!term) return true;
      return (
        application.fullName.toLowerCase().includes(term) ||
        application.email.toLowerCase().includes(term) ||
        application.city.toLowerCase().includes(term)
      );
    });
  }, [applications, filter, search]);

  const counts = useMemo(
    () => ({
      all: applications.length,
      new: applications.filter((a) => a.status === 'new').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      invited: applications.filter((a) => a.status === 'invited').length,
      declined: applications.filter((a) => a.status === 'declined').length,
    }),
    [applications]
  );

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CLUB_STATUS_ORDER.map((status) => ({ id: status, label: CLUB_STATUS_LABELS[status] })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-void dark:text-white">Curious Club</h1>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)]">
            {applications.length} applications · {counts.new} to review
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportToCSV(filtered)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-[rgba(255,255,255,0.1)] dark:text-[rgba(255,255,255,0.8)] dark:hover:bg-[rgba(255,255,255,0.05)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <label htmlFor="club-search" className="sr-only">
            Search by name, email or city
          </label>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            id="club-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or city…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3.5 text-sm text-gray-900 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1A1625] dark:text-white"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)]">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                filter === tab.id
                  ? 'bg-teal/10 text-teal dark:text-[#C1EA00]'
                  : 'bg-gray-100 text-gray-400 dark:bg-[rgba(255,255,255,0.1)]'
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[rgba(34,30,42,0.06)] bg-[#FFFFFF] dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1A1625]">
        <table className="w-full">
          <thead>
            <tr className="border-b-[2px] border-[#E9F5F7] bg-[#F7F9FA] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
              {[
                { id: 'name', label: 'Applicant', class: 'text-left' },
                { id: 'city', label: 'City', class: 'text-left hidden md:table-cell' },
                { id: 'work', label: 'What they do', class: 'text-left hidden lg:table-cell' },
                { id: 'trip', label: 'Came from', class: 'text-left hidden xl:table-cell' },
                { id: 'status', label: 'Status', class: 'text-left' },
              ].map((col) => (
                <th
                  key={col.id}
                  className={`px-[16px] py-[12px] font-display text-[11px] font-bold uppercase tracking-widest text-[#718096] dark:text-[rgba(255,255,255,0.6)] ${col.class}`}
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
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg className="mb-4 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                      />
                    </svg>
                    <p className="font-medium text-gray-500">
                      {search || filter !== 'all'
                        ? 'No applications match these filters.'
                        : 'No applications yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((application) => (
                <tr
                  key={application.id}
                  onClick={() => setSelected(application)}
                  className="h-[56px] cursor-pointer border-b border-[#F3F4F6] align-middle transition-colors hover:bg-[#F7F9FA] dark:border-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <td className="px-[16px] py-[8px]">
                    <p className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                      {application.fullName}
                    </p>
                    <p className="mt-0.5 max-w-[220px] truncate font-body text-[12px] text-[#718096] dark:text-[rgba(255,255,255,0.55)]">
                      {application.email}
                    </p>
                    <p className="mt-0.5 font-body text-[11px] text-[#718096] md:hidden">{application.city}</p>
                  </td>
                  <td className="hidden px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] md:table-cell">
                    {application.city}
                  </td>
                  <td className="hidden max-w-[220px] truncate px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] lg:table-cell">
                    {application.work}
                  </td>
                  <td className="hidden whitespace-nowrap px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] xl:table-cell">
                    {tripLabel(application.trip)}
                  </td>
                  <td className="px-[16px]">
                    <span
                      className={`inline-flex min-w-[88px] items-center justify-center rounded-full px-[10px] py-[3px] font-body text-[12px] font-medium ${
                        STATUS_STYLES[application.status] ?? 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {CLUB_STATUS_LABELS[application.status] ?? application.status}
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
          onDelete={(application) => setDeleteTarget(application)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-[rgba(255,255,255,0.1)] dark:bg-[#1A1625]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete application</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Permanently delete{' '}
                  <strong className="text-gray-700 dark:text-gray-300">{deleteTarget.fullName}</strong>&apos;s
                  application and every answer they wrote? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-[rgba(255,255,255,0.1)] dark:bg-[rgba(255,255,255,0.05)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {deleting && (
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
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
