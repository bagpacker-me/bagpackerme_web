'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/lib/firestore';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Testimonial, PackageMarket } from '@/types';
import { MessageSquareQuote, Plus, Trash2, X, Star, Pencil, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type MarketChoice = PackageMarket | 'both';

interface DraftState {
  authorName: string;
  location: string;
  quote: string;
  rating: number;
  market: MarketChoice;
  status: Testimonial['status'];
  avatarUrl: string;
}

const emptyDraft: DraftState = {
  authorName: '',
  location: '',
  quote: '',
  rating: 5,
  market: 'both',
  status: 'draft',
  avatarUrl: '',
};

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1A1625] text-[#221E2A] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:border-transparent';
const labelCls =
  'block text-sm font-semibold text-gray-700 dark:text-[rgba(255,255,255,0.8)] mb-1';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const snap = await getTestimonials();
      setTestimonials(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial)));
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const publishedCount = useMemo(
    () => testimonials.filter((t) => t.status === 'published').length,
    [testimonials]
  );

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setDraft({
      authorName: t.authorName,
      location: t.location,
      quote: t.quote,
      rating: t.rating,
      market: t.market ?? 'both',
      status: t.status,
      avatarUrl: t.avatarUrl ?? '',
    });
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadAvatarIfNeeded = async (): Promise<string> => {
    if (!avatarFile) return draft.avatarUrl.trim();
    const storageRef = ref(storage, `testimonials/${Date.now()}_${avatarFile.name}`);
    const snapshot = await uploadBytes(storageRef, avatarFile);
    return getDownloadURL(snapshot.ref);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.authorName.trim() || !draft.quote.trim() || !draft.location.trim()) {
      toast.error('Name, location, and quote are required');
      return;
    }

    setSaving(true);
    try {
      const avatarUrl = await uploadAvatarIfNeeded();
      // Firestore rejects `undefined`; only include optional fields when set.
      const base = {
        authorName: draft.authorName.trim(),
        location: draft.location.trim(),
        quote: draft.quote.trim(),
        rating: Math.max(1, Math.min(5, Math.round(draft.rating))),
        status: draft.status,
        ...(draft.market !== 'both' ? { market: draft.market } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
      };

      if (editingId) {
        // Explicitly clear fields that were removed during the edit.
        await updateTestimonial(editingId, {
          ...base,
          ...(draft.market === 'both' ? { market: undefined } : {}),
          ...(avatarUrl ? {} : { avatarUrl: undefined }),
        } as Partial<Testimonial>);
        toast.success('Testimonial updated');
      } else {
        await createTestimonial({ ...base, createdAt: new Date().toISOString() });
        toast.success('Testimonial added');
      }

      closeModal();
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (t: Testimonial) => {
    const next = t.status === 'published' ? 'draft' : 'published';
    try {
      await updateTestimonial(t.id, { status: next });
      setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
      toast.success(next === 'published' ? 'Published' : 'Unpublished');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Delete the testimonial from "${t.authorName}"?`)) return;
    try {
      await deleteTestimonial(t.id);
      if (t.avatarUrl) {
        try {
          const match = new URL(t.avatarUrl).pathname.match(/o\/(.+?)\?alt=/) ??
            new URL(t.avatarUrl).search.match(/o\/(.+?)\?alt=/);
          if (match?.[1]) await deleteObject(ref(storage, decodeURIComponent(match[1])));
        } catch (storageErr) {
          console.warn('Could not delete avatar from storage:', storageErr);
        }
      }
      setTestimonials((prev) => prev.filter((x) => x.id !== t.id));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#221E2A] dark:text-white font-heading">Testimonials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real customer reviews shown on the homepage. {publishedCount} published — the homepage
            section stays hidden until at least one is live.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C1EA00] text-[#221E2A] rounded-xl text-sm font-bold hover:bg-[#aacc00] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="h-48 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.06)] animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white dark:bg-[#1A1625] rounded-2xl border border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
          <MessageSquareQuote className="w-12 h-12 mb-4 text-gray-200 dark:text-[rgba(255,255,255,0.1)]" />
          <p className="font-medium text-gray-500 dark:text-gray-400">No testimonials yet.</p>
          <p className="text-sm mt-1">Add a real customer review to show it on the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative bg-white dark:bg-[#1A1625] rounded-2xl border border-gray-100 dark:border-[rgba(255,255,255,0.06)] p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                {t.avatarUrl ? (
                  <Image src={t.avatarUrl} alt={t.authorName} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#C1EA00]/20 text-[#221E2A] dark:text-white flex items-center justify-center font-bold">
                    {t.authorName.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-[#221E2A] dark:text-white truncate">{t.authorName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t.location}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: Math.max(1, Math.min(5, Math.round(t.rating))) }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#C1EA00] text-[#C1EA00]" />
                ))}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-4 flex-1">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
                      t.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-[rgba(255,255,255,0.08)] dark:text-gray-400'
                    }`}
                  >
                    {t.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">{t.market ?? 'both'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePublish(t)} title={t.status === 'published' ? 'Unpublish' : 'Publish'} className="p-1.5 text-gray-500 hover:text-[#221E2A] dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.06)]">
                    {t.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(t)} title="Edit" className="p-1.5 text-gray-500 hover:text-[#221E2A] dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.06)]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t)} title="Delete" className="p-1.5 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-[#1A1625] dark:border dark:border-[rgba(255,255,255,0.1)] rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#221E2A] dark:text-white">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name <span className="text-red-500">*</span></label>
                  <input className={inputCls} value={draft.authorName} onChange={(e) => setDraft((d) => ({ ...d, authorName: e.target.value }))} placeholder="e.g. Priya S." />
                </div>
                <div>
                  <label className={labelCls}>Location <span className="text-red-500">*</span></label>
                  <input className={inputCls} value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} placeholder="e.g. Kerala, India" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Quote <span className="text-red-500">*</span></label>
                <textarea className={`${inputCls} resize-none`} rows={4} value={draft.quote} onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))} placeholder="What the traveller said, in their own words." />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Rating</label>
                  <select className={inputCls} value={draft.rating} onChange={(e) => setDraft((d) => ({ ...d, rating: Number(e.target.value) }))}>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Shows on</label>
                  <select className={inputCls} value={draft.market} onChange={(e) => setDraft((d) => ({ ...d, market: e.target.value as MarketChoice }))}>
                    <option value="both">Both</option>
                    <option value="global">Global</option>
                    <option value="india">India</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Testimonial['status'] }))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Avatar <span className="text-gray-400 font-normal">(optional — a monogram is shown if omitted)</span></label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className={inputCls} />
                {draft.avatarUrl && !avatarFile && (
                  <p className="text-xs text-gray-400 mt-1">Current avatar kept unless you choose a new file.</p>
                )}
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded-xl font-medium border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-gray-600 dark:text-[rgba(255,255,255,0.8)] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-xl font-bold bg-[#221E2A] dark:bg-[rgba(255,255,255,0.1)] text-white hover:bg-[#322c3e] dark:hover:bg-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
