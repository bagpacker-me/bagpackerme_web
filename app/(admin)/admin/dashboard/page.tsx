'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Enquiry } from '@/types';

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

function StatusBadge({ status }: { status: Enquiry['status'] }) {
  const map: Record<Enquiry['status'], { label: string; classes: string }> = {
    new: { label: 'New', classes: 'bg-[#E0F7FF] dark:bg-[#E0F7FF]/20 text-[#0369a1] dark:text-[#38bdf8]' },
    in_progress: { label: 'In Progress', classes: 'bg-[#FEF9C3] dark:bg-[#FEF9C3]/20 text-[#854d0e] dark:text-[#fde047]' },
    responded: { label: 'Responded', classes: 'bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-[#166534] dark:text-[#4ade80]' },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center min-w-[80px] justify-center px-[10px] py-[3px] rounded-full font-body text-[12px] font-medium ${s.classes}`}
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
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-[#FFFFFF] dark:bg-[#1A1625] shadow-2xl z-50 flex flex-col border-l border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)]">
              <h2 className="font-display text-[16px] font-bold text-[#221E2A] dark:text-white uppercase tracking-[0.1em]">
                Enquiry Detail
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-[#718096] dark:text-[rgba(255,255,255,0.6)] hover:text-[#285056] dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:ring-offset-2"
              >
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[24px] py-[24px] space-y-[24px]">
              {/* Status */}
              <div>
                <StatusBadge status={enquiry.status} />
              </div>

              {/* Name + Email */}
              <div className="space-y-[16px]">
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
                <p className="font-body text-[11px] font-semibold text-[#718096] dark:text-[rgba(255,255,255,0.5)] uppercase tracking-[0.06em] mb-[8px]">Message</p>
                <div className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)] p-[16px] font-body text-[14px] text-[#221E2A] dark:text-white leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-[24px] py-[16px] border-t border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex gap-[12px] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)]">
              <a
                href={`mailto:${enquiry.email}`}
                className="flex-1 flex items-center justify-center h-[44px] font-body text-[14px] font-bold tracking-[0.05em] uppercase bg-[#C1EA00] text-[#221E2A] transition-colors hover:bg-[#A3C700] focus:ring-2 focus:ring-[#C1EA00] focus:ring-offset-2"
              >
                <svg className="w-[18px] h-[18px] mr-[8px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Reply
              </a>
              <Link
                href="/admin/enquiries"
                className="flex items-center justify-center h-[44px] px-[20px] font-body text-[14px] font-bold tracking-[0.05em] uppercase border border-[rgba(34,30,42,0.1)] dark:border-[rgba(255,255,255,0.2)] text-[#285056] dark:text-[rgba(255,255,255,0.8)] hover:bg-[#FFFFFF] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors focus:ring-2 focus:ring-[#C1EA00] focus:ring-offset-2"
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
    <div className="flex justify-between items-start gap-[16px] border-b border-[rgba(34,30,42,0.04)] dark:border-[rgba(255,255,255,0.04)] pb-[8px]">
      <span className="font-body text-[12px] font-medium text-[#718096] dark:text-[rgba(255,255,255,0.6)] pt-[2px]">{label}</span>
      <span className="font-body text-[14px] font-medium text-[#221E2A] dark:text-white text-right">{value}</span>
    </div>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, loading }: StatsCard) {
  return (
    <div className="relative bg-[#FFFFFF] dark:bg-[#1A1625] border border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] rounded-[4px] p-[24px] shadow-sm flex flex-col justify-between items-start transition-all hover:shadow-md hover:-translate-y-[2px] overflow-hidden group">
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-[4px] h-full bg-[#285056]" />
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col pl-[8px]">
          {loading ? (
            <div className="h-[43px] w-[64px] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.05)] rounded-sm animate-pulse" />
          ) : (
            <p className="font-display text-[36px] font-bold text-[#285056] dark:text-white leading-none mb-1">
              {value}
            </p>
          )}
          <p className="font-body text-[13px] text-[#718096] dark:text-[rgba(255,255,255,0.6)] mt-[4px]">{label}</p>
        </div>
        <div className="w-[40px] h-[40px] bg-[rgba(40,80,86,0.08)] dark:bg-[rgba(255,255,255,0.08)] rounded-[8px] flex items-center justify-center shrink-0">
          <span className="text-[20px] leading-none select-none">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
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
    <div className="max-w-[1100px] space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#FFFFFF] dark:bg-[#1A1625] border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)] p-[24px]">
          <h2 className="font-display text-[14px] font-semibold text-[#221E2A] dark:text-white mb-[16px]">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/packages/new"
              className="flex items-center h-[44px] px-[16px] font-body text-[14px] font-normal border border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.1)] rounded-[2px] transition-colors hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] text-[#221E2A] dark:text-white"
            >
              <svg className="w-[16px] h-[16px] mr-[10px] text-[#285056] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Package
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center h-[44px] px-[16px] font-body text-[14px] font-normal border border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.1)] rounded-[2px] transition-colors hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] text-[#221E2A] dark:text-white"
            >
              <svg className="w-[16px] h-[16px] mr-[10px] text-[#285056] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              New Blog Post
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[11px] font-bold text-[#0ED2E9] uppercase tracking-[0.22em] flex items-center gap-[12px]">
              <span className="block w-[32px] h-[1px] bg-[#0ED2E9] shrink-0" />
              Recent Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="font-body text-[13px] text-[#285056] dark:text-[rgba(255,255,255,0.8)] hover:text-[#0ED2E9] dark:hover:text-[#0ED2E9] transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#1A1625] rounded-none overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border-b-[2px] border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)]">
                  {['Name', 'Email', 'Package', 'Type', 'Date', 'Status'].map((col) => (
                    <th
                      key={col}
                      className="text-left px-[16px] py-[12px] font-display text-[11px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] tracking-widest uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiryLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="flex justify-center">
                        <svg className="animate-spin w-5 h-5 text-[#285056] dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-[64px] text-center">
                      <svg className="w-[40px] h-[40px] text-[#0ED2E9] mx-auto mb-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="font-body text-[14px] text-[#718096] dark:text-[rgba(255,255,255,0.6)]">No enquiries yet.</p>
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enq, i) => (
                    <tr
                      key={enq.id}
                      onClick={() => setSelectedEnquiry(enq)}
                      className={`cursor-pointer h-[56px] transition-colors hover:bg-[#F7F9FA] dark:hover:bg-[rgba(255,255,255,0.05)] align-middle ${
                        i !== recentEnquiries.length - 1 ? 'border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)]' : ''
                      }`}
                    >
                      <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap">{enq.name}</td>
                      <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap">{enq.email}</td>
                      <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] max-w-[150px] truncate whitespace-nowrap">
                        {enq.packageSlug || '—'}
                      </td>
                      <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] capitalize whitespace-nowrap">{enq.inquiryType}</td>
                      <td className="px-[16px] font-body text-[14px] text-[#221E2A] dark:text-[rgba(255,255,255,0.9)] whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="px-[16px] whitespace-nowrap">
                        <StatusBadge status={enq.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Slide-over detail panel */}
      <EnquiryPanel enquiry={selectedEnquiry} onClose={() => setSelectedEnquiry(null)} />
    </div>
  );
}
