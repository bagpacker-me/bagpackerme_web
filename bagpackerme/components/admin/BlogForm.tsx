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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#285056]/25 focus:border-[#285056] transition-colors';

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
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Blog Posts
          </button>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {isEditing ? 'Edit Post' : 'New Blog Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Toggle */}
          <button
            type="button"
            onClick={() => set('status', form.status === 'published' ? 'draft' : 'published')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
              form.status === 'published'
                ? 'bg-lime-50 border-lime-200 text-lime-700'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${form.status === 'published' ? 'bg-lime-500' : 'bg-gray-400'}`} />
            {form.status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2 bg-[#285056] text-white"
          >
            {saving && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Post'}
          </button>
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
                <span className="px-3.5 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400">
                  /blog/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  className={`${inputClass} rounded-l-none`}
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
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Featured Image</h3>
              {form.featuredImageUrl ? (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.featuredImageUrl}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => set('featuredImageUrl', '')}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#285056]/40 transition-colors ${uploadingImage ? 'opacity-60' : ''}`}>
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
                    <svg className="w-5 h-5 animate-spin text-[#285056]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 3.75H3M6.75 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                      </svg>
                      <p className="text-xs text-gray-400">Click to upload image</p>
                      <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Post Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Post Details</h3>

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

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 bg-[#285056] text-white"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
