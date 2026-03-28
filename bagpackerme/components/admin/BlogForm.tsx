'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, updateBlog } from '@/lib/firestore';
import { BlogPost } from '@/types';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

const CATEGORIES = ['Adventure', 'Culture', 'Food', 'Spiritual', 'Tips & Guides', 'Corporate Travel'];

type Tab = 'content' | 'seo';

interface BlogFormProps {
  initialData?: BlogPost;
  blogId?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-body text-[13px] font-medium text-[#374151] mb-[6px]">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      {children}
      {hint && <p className="font-body text-[12px] text-[#9CA3AF] mt-[4px]">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-[14px] py-[10px] rounded-[2px] border border-[#D1D5DB] font-body text-[14px] text-[#221E2A] bg-[#FFFFFF] outline-none transition-all focus:border-[#285056] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,80,86,0.12)] placeholder:text-[#9CA3AF]';

const defaultPost: Omit<BlogPost, 'id'> = {
  title: '',
  slug: '',
  category: 'Adventure',
  featuredImageUrl: '',
  excerpt: '',
  author: 'Kevin',
  publishDate: format(new Date(), 'yyyy-MM-dd'),
  readTimeMinutes: 5,
  contentHtml: '',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
  createdAt: new Date().toISOString(),
};

export default function BlogForm({ initialData, blogId }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!blogId;
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<Omit<BlogPost, 'id'>>({
    ...defaultPost,
    ...(initialData ? {
      title: initialData.title,
      slug: initialData.slug,
      category: initialData.category,
      featuredImageUrl: initialData.featuredImageUrl,
      excerpt: initialData.excerpt,
      author: initialData.author,
      publishDate: initialData.publishDate,
      readTimeMinutes: initialData.readTimeMinutes,
      contentHtml: initialData.contentHtml,
      status: initialData.status,
      metaTitle: initialData.metaTitle ?? '',
      metaDescription: initialData.metaDescription ?? '',
      createdAt: initialData.createdAt,
    } : {}),
  });

  const set = useCallback(<K extends keyof typeof form>(key: K, val: typeof form[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
  }, []);

  const handleTitleChange = (val: string) => {
    set('title', val);
    if (!isEditing || !form.slug) {
      set('slug', slugify(val));
    }
  };

  const handleFeaturedImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      set('featuredImageUrl', url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return false; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return false; }
    if (!form.category) { toast.error('Category is required'); return false; }
    return true;
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Omit<BlogPost, 'id'> = {
        ...form,
        status: statusOverride ?? form.status,
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
      };
      if (isEditing && blogId) {
        await updateBlog(blogId, payload);
        toast.success('Post updated');
      } else {
        await createBlog({ ...payload, createdAt: new Date().toISOString() });
        toast.success('Post created');
        router.push('/admin/blog');
      }
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'seo', label: 'SEO & Meta' },
  ];

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push('/admin/blog')}
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[#718096] hover:text-[#221E2A] mb-[8px] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Blog Posts
          </button>
          <h1 className="font-display text-[24px] font-bold text-[#221E2A]">
            {isEditing ? 'Edit Post' : 'New Blog Post'}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#285056] text-[#285056]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <FormField label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="My Amazing Travel Story"
                className={inputClass}
              />
            </FormField>

            {/* Slug */}
            <FormField label="Slug" hint="Auto-generated from title. Edit to customize the URL.">
              <div className="flex items-center gap-0">
                <span className="px-[14px] py-[10px] bg-[#F7F9FA] border border-r-0 border-[#D1D5DB] rounded-l-[2px] font-body text-[14px] text-[#718096]">
                  /blog/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  className={`${inputClass} rounded-l-none border-l-0`}
                />
              </div>
            </FormField>

            {/* Excerpt */}
            <FormField label="Excerpt" hint={`${form.excerpt.length}/200 characters`}>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Brief description shown on the blog listing page..."
                className={inputClass}
              />
            </FormField>

            {/* Full Content */}
            <FormField label="Content">
              <RichTextEditor
                value={form.contentHtml}
                onChange={(html) => set('contentHtml', html)}
                placeholder="Write your blog post content here..."
              />
            </FormField>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Featured Image */}
            <div className="bg-[#FFFFFF] rounded-[4px] border border-[#E9F5F7] p-[24px] shadow-sm">
              <h3 className="font-display text-[14px] font-bold text-[#221E2A] mb-[12px]">Featured Image</h3>
              {form.featuredImageUrl ? (
                <div className="relative group overflow-hidden rounded-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.featuredImageUrl}
                    alt="Featured"
                    className="w-full h-[160px] object-cover"
                  />
                  <div className="absolute inset-0 bg-[#285056]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => set('featuredImageUrl', '')}
                      className="font-body text-[14px] font-bold text-white uppercase tracking-widest hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className={`relative flex flex-col items-center justify-center min-h-[160px] border-[2px] border-dashed border-[#D1D5DB] rounded-[4px] bg-[#F7F9FA] p-[24px] cursor-pointer hover:border-[#285056] hover:bg-[rgba(40,80,86,0.04)] transition-colors overflow-hidden ${uploadingImage ? 'opacity-60' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFeaturedImageUpload(file);
                    }}
                  />
                  {uploadingImage ? (
                    <svg className="w-[32px] h-[32px] animate-spin text-[#285056]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-[12px] text-[#718096]">
                      <svg className="w-[32px] h-[32px] text-[#285056]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <div className="text-center">
                        <p className="font-body text-[14px] font-medium text-[#221E2A] mb-[4px]">Drop image here or click to upload</p>
                        <p className="font-body text-[12px] text-[#9CA3AF]">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Post Details */}
            <div className="bg-[#FFFFFF] rounded-[4px] border border-[#E9F5F7] p-[24px] shadow-sm space-y-[16px]">
              <h3 className="font-display text-[14px] font-bold text-[#221E2A]">Post Details</h3>

              {/* Category */}
              <FormField label="Category" required>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>

              {/* Author */}
              <FormField label="Author">
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* Publish Date */}
              <FormField label="Publish Date">
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => set('publishDate', e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* Read Time */}
              <FormField label="Read Time (minutes)">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readTimeMinutes}
                  onChange={(e) => set('readTimeMinutes', Number(e.target.value))}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <strong>SEO Preview</strong> — These fields control how your post appears in search engines. If left blank, the title and excerpt will be used.
          </div>

          <FormField label="Meta Title" hint={`${(form.metaTitle ?? '').length}/60 characters recommended`}>
            <input
              type="text"
              value={form.metaTitle ?? ''}
              onChange={(e) => set('metaTitle', e.target.value)}
              placeholder={form.title || 'Your post title for search engines'}
              className={inputClass}
            />
          </FormField>

          <FormField label="Meta Description" hint={`${(form.metaDescription ?? '').length}/160 characters recommended`}>
            <textarea
              value={form.metaDescription ?? ''}
              onChange={(e) => set('metaDescription', e.target.value)}
              rows={4}
              placeholder={form.excerpt || 'Brief description for search engines (150-160 characters)'}
              className={inputClass}
            />
          </FormField>

          {/* Preview Card */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-3">Search Preview</p>
            <p className="text-[#1a0dab] text-base font-medium leading-snug truncate">
              {form.metaTitle || form.title || 'Post Title'}
            </p>
            <p className="text-[#006621] text-xs mt-0.5">bagpackerme.com/blog/{form.slug || 'post-slug'}</p>
            <p className="text-[#545454] text-sm mt-1 leading-relaxed line-clamp-2">
              {form.metaDescription || form.excerpt || 'Post description will appear here...'}
            </p>
          </div>

        </div>
      )}

      {/* Sticky Footer Actions */}
      <div className="sticky bottom-0 bg-[#FFFFFF] p-[16px] border-t border-[#E9F5F7] flex items-center justify-between z-20 mt-8 shadow-[0_-4px_16px_rgba(34,30,42,0.04)]">
        <label className="flex items-center cursor-pointer gap-2">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={form.status === 'published'}
              onChange={(e) => set('status', e.target.checked ? 'published' : 'draft')}
            />
            <div
              className={`block w-[44px] h-[24px] rounded-full transition-colors ${
                form.status === 'published' ? 'bg-[#285056]' : 'bg-[#D1D5DB]'
              }`}
            />
            <div
              className={`dot absolute left-[2px] top-[2px] bg-white w-[20px] h-[20px] rounded-full transition-transform ${
                form.status === 'published' ? 'translate-x-[20px]' : ''
              }`}
            />
          </div>
          <span className="font-body text-[13px] font-medium text-[#221E2A] uppercase tracking-widest">
            {form.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </label>
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-[24px] py-[14px] font-display text-[13px] font-semibold tracking-[0.14em] uppercase text-[#4a5568] border border-[#d1d5db] transition-colors hover:bg-[#F7F9FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-[8px] bg-[#C1EA00] text-[#221E2A] font-display text-[13px] font-bold tracking-[0.14em] uppercase px-[40px] py-[16px] border-none cursor-pointer transition-all hover:bg-[#afd100] disabled:opacity-60 relative overflow-hidden"
          >
            {saving && (
              <svg className="w-[16px] h-[16px] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving…' : isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
