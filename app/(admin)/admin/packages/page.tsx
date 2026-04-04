'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPackages, deletePackage, updatePackage } from '@/lib/firestore';
import { Package } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[40, 160, 100, 80, 80, 100, 100].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.1)] rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({
  status,
  onToggle,
}: {
  status: 'draft' | 'published';
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Click to ${status === 'published' ? 'unpublish' : 'publish'}`}
      className={`inline-flex items-center gap-1.5 px-[10px] py-[3px] rounded-full font-body text-[12px] font-medium transition-colors cursor-pointer
        ${
          status === 'published'
            ? 'bg-[#DCFCE7] dark:bg-[rgba(22,101,52,0.3)] text-[#166534] dark:text-[#4ADE80] hover:bg-green-200 dark:hover:bg-[rgba(22,101,52,0.5)]'
            : 'bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.05)] text-[#6B7280] dark:text-[rgba(255,255,255,0.6)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]'
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-[#166534] dark:bg-[#4ADE80]' : 'bg-[#6B7280] dark:bg-[rgba(255,255,255,0.6)]'}`}
      />
      {status === 'published' ? 'Published' : 'Draft'}
    </button>
  );
}

export default function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const snap = await getPackages();
      const pkgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Package));
      pkgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPackages(pkgs);
    } catch {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const newStatus = pkg.status === 'published' ? 'draft' : 'published';
    // Optimistic update
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, status: newStatus } : p))
    );
    try {
      await updatePackage(pkg.id, { status: newStatus });
      toast.success(`Package ${newStatus === 'published' ? 'published' : 'moved to draft'}`);
    } catch {
      // Revert
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, status: pkg.status } : p))
      );
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePackage(deleteTarget.id);
      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Package deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1
            className="text-2xl font-bold text-void dark:text-white font-heading"
          >
            Packages
          </h1>
          <p className="text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">
            {packages.length} package{packages.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-lime text-void"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1625] overflow-x-auto rounded-lg border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border-b-[2px] border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)]">
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase w-14">
                Image
              </th>
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase">
                Title
              </th>
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase hidden md:table-cell">
                Category
              </th>
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase">
                Status
              </th>
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase hidden sm:table-cell">
                Price (INR)
              </th>
              <th className="px-[16px] py-[12px] text-left font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase hidden lg:table-cell">
                Created
              </th>
              <th className="px-[16px] py-[12px] text-right font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-7v4m0 0l-2-2m2 2l2-2" />
                      </svg>
                      <p className="font-medium text-gray-500 mb-1">No packages yet.</p>
                      <Link
                        href="/admin/packages/new"
                        className="text-sm text-teal hover:underline font-medium"
                      >
                        Create your first one →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors group h-[56px] align-middle"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      {pkg.heroImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={pkg.heroImageUrl}
                          alt={pkg.title}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 3.75H3 M6.75 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-[16px]">
                      <p className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] truncate max-w-[220px]">{pkg.title}</p>
                      <p className="font-body text-[12px] text-[#718096] dark:text-[rgba(255,255,255,0.6)] truncate max-w-[220px] pt-[2px]">/{pkg.slug}</p>
                    </td>

                    {/* Category */}
                    <td className="px-[16px] hidden md:table-cell font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                      <span>{pkg.category}</span>
                    </td>

                    {/* Status */}
                    <td className="px-[16px]">
                      <StatusBadge status={pkg.status} onToggle={() => handleToggleStatus(pkg)} />
                    </td>

                    {/* Price */}
                    <td className="px-[16px] hidden sm:table-cell font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                      <span>
                        ₹{pkg.priceInr.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-[16px] hidden lg:table-cell font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                      <span>
                        {pkg.createdAt
                          ? format(new Date(pkg.createdAt), 'd MMM yyyy')
                          : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-[16px]">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/packages/${pkg.id}`)}
                          className="p-2 text-gray-400 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(pkg)}
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

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          {/* Modal */}
          <div className="relative bg-white dark:bg-[#1A1625] dark:border dark:border-[rgba(255,255,255,0.1)] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Package</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Are you sure you want to delete{' '}
                  <strong className="text-gray-700 dark:text-gray-300">&quot;{deleteTarget.title}&quot;</strong>? This action
                  cannot be undone.
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
