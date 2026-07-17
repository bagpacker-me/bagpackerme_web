'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getJobOpenings, getJobApplications, updateJobOpening, deleteJobOpening } from '@/lib/firestore';
import { JobOpening, JobOpeningStatus } from '@/types';
import { JOB_TYPE_LABELS, JOB_LOCATION_TYPE_LABELS, formatSalaryRange } from '@/lib/careers';
import toast from 'react-hot-toast';

type StatusFilter = 'all' | JobOpeningStatus;

const STATUS_LABELS: Record<JobOpeningStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  closed: 'Closed',
};

const STATUS_STYLES: Record<JobOpeningStatus, string> = {
  draft: 'bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.08)] text-[#6b7280] dark:text-[rgba(255,255,255,0.6)]',
  published: 'bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-[#166534] dark:text-[#4ade80]',
  closed: 'bg-[#FEF9C3] dark:bg-[#FEF9C3]/20 text-[#854d0e] dark:text-[#fde047]',
};

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

export default function AdminJobOpeningsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<JobOpening | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Applications are counted here so the list can warn before a delete
      // strands them — see the confirm dialog below.
      const [jobSnap, appSnap] = await Promise.all([getJobOpenings(), getJobApplications()]);

      setJobs(jobSnap.docs.map((d) => ({ id: d.id, ...d.data() } as JobOpening)));

      const counts: Record<string, number> = {};
      appSnap.docs.forEach((d) => {
        const jobId = (d.data() as { jobId?: string }).jobId;
        if (jobId) counts[jobId] = (counts[jobId] ?? 0) + 1;
      });
      setApplicationCounts(counts);
    } catch {
      toast.error('Failed to load job openings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: JobOpeningStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    try {
      await updateJobOpening(id, { status, updatedAt: new Date().toISOString() });
      toast.success(status === 'published' ? 'Role published' : `Role marked ${STATUS_LABELS[status].toLowerCase()}`);
    } catch {
      toast.error('Failed to update status');
      fetchJobs();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJobOpening(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success('Role deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(
    () => (filter === 'all' ? jobs : jobs.filter((j) => j.status === filter)),
    [jobs, filter]
  );

  const counts = useMemo(
    () => ({
      all: jobs.length,
      draft: jobs.filter((j) => j.status === 'draft').length,
      published: jobs.filter((j) => j.status === 'published').length,
      closed: jobs.filter((j) => j.status === 'closed').length,
    }),
    [jobs]
  );

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Draft' },
    { id: 'closed', label: 'Closed' },
  ];

  const deleteTargetApplications = deleteTarget ? applicationCounts[deleteTarget.id] ?? 0 : 0;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-void dark:text-white font-heading">Job Openings</h1>
          <p className="text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">
            {counts.published} published · {jobs.length} total
          </p>
        </div>
        <Link
          href="/admin/careers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#C1EA00] text-[#221E2A] hover:bg-[#afd100] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Role
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)] mb-5 flex gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
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
                { id: 'role', label: 'Role', class: 'text-left' },
                { id: 'location', label: 'Location', class: 'text-left hidden md:table-cell' },
                { id: 'type', label: 'Type', class: 'text-left hidden lg:table-cell' },
                { id: 'salary', label: 'Salary', class: 'text-left hidden xl:table-cell' },
                { id: 'applications', label: 'Applications', class: 'text-left hidden sm:table-cell' },
                { id: 'status', label: 'Status', class: 'text-left' },
                { id: 'actions', label: 'Actions', class: 'text-right' },
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
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.31-1.01 2.4-2.32 2.49a48 48 0 01-11.86 0A2.5 2.5 0 013.75 18.4v-4.25m16.5 0a2.18 2.18 0 00.75-1.66V8.7c0-1.28-.96-2.36-2.23-2.48a41 41 0 00-2.02-.16m4.5 6.09a2.18 2.18 0 01-.75.44 48 48 0 01-15 0 2.19 2.19 0 01-.75-.44m0 0A2.18 2.18 0 013 12.49V8.7c0-1.28.96-2.36 2.23-2.48.67-.06 1.35-.11 2.02-.16m9.5 0V5.25A2.25 2.25 0 0014.5 3h-5a2.25 2.25 0 00-2.25 2.25v.81m9.5 0a48 48 0 00-9.5 0" />
                    </svg>
                    <p className="font-medium text-gray-500">
                      No {filter !== 'all' ? STATUS_LABELS[filter].toLowerCase() : ''} roles yet.
                    </p>
                    {filter === 'all' && (
                      <Link href="/admin/careers/new" className="text-sm text-teal hover:underline mt-2">
                        Create your first role
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((job) => {
                const salary = formatSalaryRange(job);
                const appCount = applicationCounts[job.id] ?? 0;
                return (
                  <tr
                    key={job.id}
                    onClick={() => router.push(`/admin/careers/${job.id}`)}
                    className="border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors group h-[56px] align-middle cursor-pointer"
                  >
                    <td className="px-[16px] py-[8px]">
                      <p className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">{job.title}</p>
                      <p className="font-body text-[11px] text-[#718096] dark:text-[rgba(255,255,255,0.55)] mt-0.5">
                        {job.department || 'No department'} · /{job.slug}
                      </p>
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] hidden md:table-cell">
                      {job.location}
                      <span className="text-[#718096] dark:text-[rgba(255,255,255,0.55)]">
                        {' '}· {JOB_LOCATION_TYPE_LABELS[job.locationType]}
                      </span>
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] hidden lg:table-cell">
                      {JOB_TYPE_LABELS[job.type]}
                    </td>
                    <td className="px-[16px] font-body text-[13px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap hidden xl:table-cell">
                      {salary ?? '—'}
                    </td>
                    <td className="px-[16px] hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                      {appCount > 0 ? (
                        <Link
                          href={`/admin/careers/applications?job=${encodeURIComponent(job.id)}`}
                          className="font-body text-[14px] text-teal dark:text-[#C1EA00] hover:underline"
                        >
                          {appCount} {appCount === 1 ? 'application' : 'applications'}
                        </Link>
                      ) : (
                        <span className="font-body text-[14px] text-[#718096]">—</span>
                      )}
                    </td>
                    <td className="px-[16px]" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value as JobOpeningStatus)}
                        aria-label={`Status for ${job.title}`}
                        className={`appearance-none cursor-pointer px-[10px] py-[3px] rounded-full font-body text-[12px] font-medium border-none outline-none transition-colors ${STATUS_STYLES[job.status]}`}
                      >
                        {(Object.keys(STATUS_LABELS) as JobOpeningStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-[16px]">
                      <div
                        className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.status === 'published' && (
                          <a
                            href={`/careers/${job.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-teal hover:bg-teal/5 rounded-lg transition-colors"
                            title="View live"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Role</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Delete <strong className="text-gray-700 dark:text-gray-300">{deleteTarget.title}</strong>? This cannot be undone.
                </p>
                {deleteTargetApplications > 0 && (
                  <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3 mt-3">
                    {deleteTargetApplications} {deleteTargetApplications === 1 ? 'person has' : 'people have'} applied
                    to this role. Their applications and CVs are kept — but delete the role and you lose the only
                    link back to what they applied for. Consider marking it <strong>Closed</strong> instead.
                  </p>
                )}
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
