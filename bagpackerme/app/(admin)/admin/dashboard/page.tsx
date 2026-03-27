'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Enquiry } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// ─── types ───────────────────────────────────────────────────────────────────
interface StatsCard {
  label: string;
  value: number | string;
  icon: string;
  loading: boolean;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function todayString() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function StatusBadge({ status }: { status: Enquiry['status'] }) {
  const map: Record<Enquiry['status'], { label: string; bg: string; text: string }> = {
    new: { label: 'New', bg: '#E0F7FA', text: '#006064' },
    in_progress: { label: 'In Progress', bg: '#FFF8E1', text: '#E65100' },
    responded: { label: 'Responded', bg: '#E8F5E9', text: '#1B5E20' },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ─── slide-over panel ────────────────────────────────────────────────────────
function EnquiryPanel({ enquiry, onClose }: { enquiry: Enquiry | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {enquiry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Enquiry Detail
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Status */}
              <div>
                <StatusBadge status={enquiry.status} />
              </div>

              {/* Name + Email */}
              <div className="space-y-3">
                <Row label="Name" value={enquiry.name} />
                <Row label="Email" value={enquiry.email} />
                <Row label="Phone" value={enquiry.phone || '—'} />
                <Row label="Type" value={enquiry.inquiryType} />
                {enquiry.packageSlug && <Row label="Package" value={enquiry.packageSlug} />}
                {enquiry.groupSize && <Row label="Group Size" value={String(enquiry.groupSize)} />}
                {enquiry.travelDate && <Row label="Travel Date" value={enquiry.travelDate} />}
                <Row label="Received" value={formatDate(enquiry.createdAt)} />
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <a
                href={`mailto:${enquiry.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#285056' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Reply
              </a>
              <Link
                href="/admin/enquiries"
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                View All
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 text-right">{value}</span>
    </div>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, loading }: StatsCard) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4"
      style={{ borderLeft: '4px solid #285056' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: '#E9F5F7' }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-gray-100 rounded-md animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0]?.replace(/\./g, ' ') ?? 'Kevin';

  const [statsLoading, setStatsLoading] = useState(true);
  const [packages, setPackages] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [enquiryLoading, setEnquiryLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pkgSnap, blogSnap, subSnap, enquirySnap] = await Promise.all([
          getDocs(query(collection(db, 'packages'), where('status', '==', 'published'))),
          getDocs(query(collection(db, 'blogs'), where('status', '==', 'published'))),
          getDocs(collection(db, 'subscribers')),
          getDocs(query(collection(db, 'enquiries'), where('status', '==', 'new'))),
        ]);

        // New enquiries this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoISO = weekAgo.toISOString();
        const newThisWeek = enquirySnap.docs.filter((d) => {
          const data = d.data();
          const createdAt = data.createdAt;
          if (!createdAt) return false;
          // Support both string ISO and Firestore Timestamp
          let dateStr: string;
          if (typeof createdAt === 'string') {
            dateStr = createdAt;
          } else if (createdAt instanceof Timestamp) {
            dateStr = createdAt.toDate().toISOString();
          } else {
            return false;
          }
          return dateStr >= weekAgoISO;
        }).length;

        setPackages(pkgSnap.size);
        setBlogs(blogSnap.size);
        setSubscribers(subSnap.size);
        setNewEnquiries(newThisWeek);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }

    async function loadRecentEnquiries() {
      try {
        const snap = await getDocs(
          query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(5))
        );
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry));
        setRecentEnquiries(data);
      } catch (err) {
        console.error('Error loading enquiries:', err);
      } finally {
        setEnquiryLoading(false);
      }
    }

    loadStats();
    loadRecentEnquiries();
  }, []);

  const stats: StatsCard[] = [
    { label: 'Published Packages', value: packages, icon: '🧳', loading: statsLoading },
    { label: 'Published Blog Posts', value: blogs, icon: '✍️', loading: statsLoading },
    { label: 'New Enquiries (7d)', value: newEnquiries, icon: '📬', loading: statsLoading },
    { label: 'Newsletter Subscribers', value: subscribers, icon: '📧', loading: statsLoading },
  ];

  return (
    <div className="min-h-full">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-8 py-4 flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Welcome back, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{todayString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: '#285056' }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="px-8 py-8 max-w-[1100px] space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/packages/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: '#C1EA00', color: '#221E2A' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Package
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: '#285056' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Blog Post
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-medium hover:underline"
              style={{ color: '#285056' }}
            >
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {enquiryLoading ? (
              <div className="p-8 flex justify-center">
                <svg className="animate-spin w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No enquiries yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {['Name', 'Email', 'Package', 'Type', 'Date', 'Status'].map((col) => (
                        <th
                          key={col}
                          className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnquiries.map((enq, i) => (
                      <tr
                        key={enq.id}
                        onClick={() => setSelectedEnquiry(enq)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          i !== recentEnquiries.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{enq.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{enq.email}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 max-w-[150px] truncate">
                          {enq.packageSlug || '—'}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 capitalize">{enq.inquiryType}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(enq.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={enq.status} />
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

      {/* Slide-over detail panel */}
      <EnquiryPanel enquiry={selectedEnquiry} onClose={() => setSelectedEnquiry(null)} />
    </div>
  );
}
