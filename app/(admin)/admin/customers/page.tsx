'use client';

import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '@/lib/firestore';
import { Customer } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[160, 200, 120, 100, 120, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Slide-over detail panel ─────────────────────────────────────────────────
function CustomerSlideOver({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {

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
            <h2 className="text-base font-semibold text-gray-900">{customer.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{customer.email}</p>
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
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Customer ID', value: customer.id.slice(0, 8).toUpperCase() },
              { label: 'Phone', value: customer.phone || '—' },
              { label: 'Total Bookings', value: customer.totalBookings },
              { label: 'Joined Date', value: customer.createdAt ? format(new Date(customer.createdAt), 'd MMM yyyy') : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
             <p className="text-sm text-gray-500 italic">
               Note: To view all specific bookings for this customer, use the Bookings page and search or filter by their name.
             </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const snap = await getCustomers();
      setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer)));
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Customer deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Bookings', 'Joined Date'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone || '',
      c.totalBookings,
      c.createdAt ? format(new Date(c.createdAt), 'yyyy-MM-dd') : '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#221E2A] font-heading">
            Customers
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} total customers</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FA] border-b-[2px] border-[#E9F5F7]">
                {[
                  { id: 'Name', label: 'Name', class: 'text-left' },
                  { id: 'Email', label: 'Email', class: 'text-left hidden sm:table-cell' },
                  { id: 'Phone', label: 'Phone', class: 'text-left hidden lg:table-cell' },
                  { id: 'Bookings', label: 'Total Bookings', class: 'text-left' },
                  { id: 'Joined', label: 'Joined', class: 'text-left hidden lg:table-cell' },
                  { id: 'Actions', label: 'Actions', class: 'text-right' },
                ].map((col) => (
                  <th key={col.id} className={`px-[16px] py-[12px] font-display text-[11px] font-bold text-[#718096] tracking-widest uppercase ${col.class}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354l-4.596 4.596a5.5 5.5 0 107.778 0L12 4.354z" />
                      </svg>
                      <p className="font-medium text-gray-500">No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelected(customer)}
                    className="border-b border-[#F3F4F6] hover:bg-[#F7F9FA] transition-colors group h-[56px] align-middle cursor-pointer"
                  >
                    <td className="px-[16px]">
                      <p className="font-body text-[14px] font-medium text-[#221E2A]">{customer.name}</p>
                      <p className="font-body text-[12px] text-[#718096] sm:hidden mt-0.5">{customer.email}</p>
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] truncate max-w-[200px] hidden sm:table-cell">
                      {customer.email}
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] hidden lg:table-cell">
                      {customer.phone || '—'}
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A]">
                      {customer.totalBookings}
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] whitespace-nowrap hidden lg:table-cell">
                      {customer.createdAt ? format(new Date(customer.createdAt), 'd MMM yyyy') : '—'}
                    </td>
                    <td className="px-[16px]">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(customer); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Customer"
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

      {/* Slide-over */}
      {selected && (
        <CustomerSlideOver
          customer={selected}
          onClose={() => setSelected(null)}
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
                <h3 className="text-base font-semibold text-gray-900">Delete Customer</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Delete customer <strong className="text-gray-700">{deleteTarget.name}</strong>? This cannot be undone and might leave orphaned bookings.
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
