'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBookings, updateBooking, deleteBooking, getCustomer } from '@/lib/firestore';
import { Booking, Customer } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FEF9C3] dark:bg-[#FEF9C3]/20 text-[#854d0e] dark:text-[#fde047]',
  confirmed: 'bg-[#E0F7FF] dark:bg-[#E0F7FF]/20 text-[#0369a1] dark:text-[#38bdf8]',
  completed: 'bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-[#166534] dark:text-[#4ade80]',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[120, 160, 100, 120, 120, 100, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.1)] rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Slide-over detail panel ─────────────────────────────────────────────────
function BookingSlideOver({
  booking,
  customerData,
  onClose,
  onStatusChange,
}: {
  booking: Booking;
  customerData: Customer | null | undefined;
  onClose: () => void;
  onStatusChange: (id: string, status: Booking['status']) => void;
}) {

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FFFFFF] dark:bg-[#1A1625] shadow-2xl flex flex-col dark:border-l dark:border-[rgba(255,255,255,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)]">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Booking #{booking.id.slice(0, 8).toUpperCase()}</h2>
            <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">Package: {booking.packageName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
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
              value={booking.status}
              onChange={(e) => onStatusChange(booking.id, e.target.value as Booking['status'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1A1625] focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Travel Date', value: booking.travelDate ? format(new Date(booking.travelDate), 'd MMM yyyy') : '—' },
              { label: 'Group Size', value: `${booking.groupSize} people` },
              { label: 'Total Price', value: `₹${booking.totalPrice?.toLocaleString() || 0}` },
              { label: 'Booked On', value: booking.createdAt ? format(new Date(booking.createdAt), 'd MMM yyyy, h:mm a') : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-[rgba(255,255,255,0.02)] rounded-xl p-3 border border-transparent dark:border-[rgba(255,255,255,0.04)]">
                <p className="text-xs text-gray-400 dark:text-[rgba(255,255,255,0.5)] font-medium mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 dark:text-[rgba(255,255,255,0.9)] font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Customer Details */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Information</label>
            <div className="bg-gray-50 dark:bg-[rgba(255,255,255,0.02)] rounded-xl p-4 text-sm text-gray-700 dark:text-[rgba(255,255,255,0.8)] border border-transparent dark:border-[rgba(255,255,255,0.04)] space-y-2">
              {customerData ? (
                <>
                  <p><strong>Name:</strong> {customerData.name}</p>
                  <p><strong>Email:</strong> {customerData.email}</p>
                  <p><strong>Phone:</strong> {customerData.phone || '—'}</p>
                </>
              ) : (
                <p className="italic text-gray-400">Loading customer details or not found...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customersMap, setCustomersMap] = useState<Record<string, Customer>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const snap = await getBookings();
      const bookingsData = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      setBookings(bookingsData);
      
      // Fetch associated customers
      const uniqueCustomerIds = Array.from(new Set(bookingsData.map(b => b.customerId)));
      const custMap: Record<string, Customer> = {};
      
      await Promise.all(
        uniqueCustomerIds.map(async (cid) => {
          if (!cid) return;
          try {
            const cSnap = await getCustomer(cid);
            if (cSnap.exists()) {
              custMap[cid] = { id: cSnap.id, ...cSnap.data() } as Customer;
            }
          } catch (e) {
             console.error("Error fetching customer", cid, e);
          }
        })
      );
      setCustomersMap(custMap);
      
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : p);
    try {
      await updateBooking(id, { status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
      fetchBookings();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBooking(deleteTarget.id);
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Booking deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const counts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }), [bookings]);

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#221E2A] font-heading">
            Bookings
          </h1>
          <p className="text-sm text-gray-400 dark:text-[rgba(255,255,255,0.6)] mt-0.5">{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 mb-5 flex gap-1 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center whitespace-nowrap gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              filter === tab.id
                ? 'border-[#C1EA00] text-[#221E2A] dark:text-white'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === tab.id ? 'bg-[#C1EA00]/20 text-[#221E2A] dark:text-white' : 'bg-gray-100 dark:bg-[rgba(255,255,255,0.1)] text-gray-400'
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1625] overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border-b-[2px] border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)]">
                {[
                  { id: 'ID', label: 'Booking ID', class: 'text-left' },
                  { id: 'Customer', label: 'Customer', class: 'text-left' },
                  { id: 'Package', label: 'Package', class: 'text-left hidden lg:table-cell' },
                  { id: 'Date', label: 'Travel Date', class: 'text-left hidden lg:table-cell' },
                  { id: 'Price', label: 'Total Price', class: 'text-left hidden lg:table-cell' },
                  { id: 'Status', label: 'Status', class: 'text-left' },
                  { id: 'Actions', label: 'Actions', class: 'text-right' },
                ].map((col) => (
                  <th key={col.id} className={`px-[16px] py-[12px] font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase ${col.class}`}>
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
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium text-gray-500">No {filter !== 'all' ? STATUS_LABELS[filter]?.toLowerCase() : ''} bookings yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => setSelected(booking)}
                    className="border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors group h-[56px] align-middle cursor-pointer"
                  >
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">
                      #{booking.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-[16px]">
                      <p className="font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)]">{customersMap[booking.customerId]?.name || 'Unknown'}</p>
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] truncate max-w-[150px] hidden lg:table-cell">
                      {booking.packageName || '—'}
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] whitespace-nowrap hidden lg:table-cell">
                      {booking.travelDate ? format(new Date(booking.travelDate), 'd MMM yyyy') : '—'}
                    </td>
                    <td className="px-[16px] font-body text-[14px] text-[#221E2A] hidden lg:table-cell">
                       ₹{booking.totalPrice?.toLocaleString() || 0}
                    </td>
                    <td className="px-[16px]">
                      <span className={`inline-flex items-center min-w-[80px] justify-center px-[10px] py-[3px] rounded-full font-body text-[12px] font-medium transition-colors ${STATUS_STYLES[booking.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </td>
                    <td className="px-[16px]">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(booking); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Booking"
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
        <BookingSlideOver
          booking={selected}
          customerData={customersMap[selected.customerId]}
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
          <div className="relative bg-white dark:bg-[#1A1625] dark:border dark:border-[rgba(255,255,255,0.1)] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Booking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Delete booking <strong className="text-gray-700 dark:text-gray-300">#{deleteTarget.id.slice(0, 8).toUpperCase()}</strong>? This cannot be undone.
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
