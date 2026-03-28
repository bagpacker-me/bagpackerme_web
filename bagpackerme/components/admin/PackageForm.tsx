'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createPackage, updatePackage } from '@/lib/firestore';
import { Package, ItineraryDay, Inclusions } from '@/types';
import RichTextEditor from './RichTextEditor';
import TagInput from './TagInput';
import toast from 'react-hot-toast';
import slugify from 'slugify';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'basic' | 'content' | 'itinerary' | 'inclusions';

type FormState = Omit<Package, 'id' | 'createdAt'>;

const CATEGORIES: Package['category'][] = [
  'Culinary',
  'Spiritual',
  'Adventure',
  'Heritage',
  'Hippy Trail',
  'Corporate Retreat',
];

const DEFAULT_INCLUSIONS: Inclusions = {
  accommodation: false,
  meals: false,
  transfers: false,
  guides: false,
  flights: false,
  activities: false,
};

const DEFAULT_FORM: FormState = {
  title: '',
  slug: '',
  category: 'Adventure',
  subTheme: '',
  tagline: '',
  heroImageUrl: '',
  galleryUrls: [],
  duration: '',
  groupSize: '',
  priceInr: 0,
  priceUsd: undefined,
  destinations: [],
  overviewHtml: '',
  itinerary: [],
  inclusions: { ...DEFAULT_INCLUSIONS },
  exclusions: [],
  vibe: '',
  locationIdea: '',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
};

// ─── Upload helpers ───────────────────────────────────────────────────────────

async function uploadFile(file: File, path: string, onProgress?: (p: number) => void): Promise<string> {
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function inputCls(err?: boolean) {
  return `w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 bg-white outline-none transition-all
    focus:ring-2 focus:ring-lime focus:border-teal
    ${err ? 'border-red-400' : 'border-gray-200'} placeholder-gray-400`;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-teal' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function ImageUploadBox({
  label,
  value,
  onUpload,
  uploading,
  progress,
}: {
  label: string;
  value: string;
  onUpload: (file: File) => void;
  uploading: boolean;
  progress: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>{label}</Label>
      <div
        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 cursor-pointer hover:border-teal transition-colors"
        style={{ minHeight: 140 }}
        onClick={() => fileRef.current?.click()}
      >
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="preview" className="w-full h-48 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-36 gap-2 text-gray-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm">Click to upload</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
            <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-lime transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white text-xs">{progress}%</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
      </div>
    </div>
  );
}

// ─── Tab Components ───────────────────────────────────────────────────────────

function TabBasicInfo({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const handleTitle = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugify(v, { lower: true, strict: true }),
    }));
  };

  const isCorporate = form.category === 'Corporate Retreat';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field>
        <Label required>Title</Label>
        <input className={inputCls()} value={form.title} onChange={(e) => handleTitle(e.target.value)} placeholder="e.g. Sacred Himalayan Journey" />
      </Field>

      <Field>
        <Label required>Slug</Label>
        <input
          className={inputCls()}
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          placeholder="auto-generated from title"
        />
      </Field>

      <Field>
        <Label required>Category</Label>
        <select
          className={inputCls()}
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Package['category'] }))}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      {isCorporate && (
        <Field>
          <Label>Sub-theme</Label>
          <input
            className={inputCls()}
            value={form.subTheme ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, subTheme: e.target.value }))}
            placeholder="e.g. Leadership Immersion"
          />
        </Field>
      )}

      <Field>
        <Label>Tagline <span className="text-gray-400 font-normal text-xs">(max 100 chars)</span></Label>
        <input
          className={inputCls()}
          maxLength={100}
          value={form.tagline}
          onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
          placeholder="A short, punchy tagline"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.tagline.length}/100</p>
      </Field>

      <Field>
        <Label>Duration</Label>
        <input
          className={inputCls()}
          value={form.duration}
          onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          placeholder="e.g. 10 Days / 9 Nights"
        />
      </Field>

      <Field>
        <Label>Group Size</Label>
        <input
          className={inputCls()}
          value={form.groupSize}
          onChange={(e) => setForm((f) => ({ ...f, groupSize: e.target.value }))}
          placeholder="e.g. 8–14 travelers"
        />
      </Field>

      <Field>
        <Label required>Price (INR)</Label>
        <input
          type="number"
          className={inputCls()}
          value={form.priceInr || ''}
          onChange={(e) => setForm((f) => ({ ...f, priceInr: Number(e.target.value) }))}
          placeholder="e.g. 85000"
        />
      </Field>

      <Field>
        <Label>Price (USD) <span className="text-gray-400 font-normal text-xs">optional</span></Label>
        <input
          type="number"
          className={inputCls()}
          value={form.priceUsd ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, priceUsd: e.target.value ? Number(e.target.value) : undefined }))}
          placeholder="e.g. 1099"
        />
      </Field>

      <div className="md:col-span-2">
        <Label>Destinations</Label>
        <TagInput
          value={form.destinations}
          onChange={(v) => setForm((f) => ({ ...f, destinations: v }))}
          placeholder="Type a destination and press Enter"
        />
      </div>

      <Field>
        <Label>Status</Label>
        <div className="flex items-center gap-4 mt-1">
          <Toggle
            checked={form.status === 'published'}
            onChange={(v) => setForm((f) => ({ ...f, status: v ? 'published' : 'draft' }))}
            label={form.status === 'published' ? 'Published' : 'Draft'}
          />
        </div>
      </Field>
    </div>
  );
}

function TabContent({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const isCorporate = form.category === 'Corporate Retreat';

  const handleHeroUpload = async (file: File) => {
    setHeroUploading(true);
    try {
      const url = await uploadFile(file, `packages/hero/${Date.now()}_${file.name}`, setHeroProgress);
      setForm((f) => ({ ...f, heroImageUrl: url }));
      toast.success('Hero image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setHeroUploading(false);
      setHeroProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <ImageUploadBox
        label="Hero Image"
        value={form.heroImageUrl}
        onUpload={handleHeroUpload}
        uploading={heroUploading}
        progress={heroProgress}
      />

      <Field>
        <Label>Overview / Description</Label>
        <RichTextEditor
          value={form.overviewHtml}
          onChange={(html) => setForm((f) => ({ ...f, overviewHtml: html }))}
          placeholder="Write a compelling overview of this package..."
        />
      </Field>

      {isCorporate && (
        <>
          <Field>
            <Label>Vibe</Label>
            <textarea
              className={`${inputCls()} resize-none`}
              rows={3}
              value={form.vibe ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, vibe: e.target.value }))}
              placeholder="Describe the atmosphere and energy of this corporate retreat..."
            />
          </Field>

          <Field>
            <Label>Location Idea</Label>
            <input
              className={inputCls()}
              value={form.locationIdea ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, locationIdea: e.target.value }))}
              placeholder="e.g. Coorg, Karnataka"
            />
          </Field>
        </>
      )}
    </div>
  );
}

function TabItinerary({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [twoCol, setTwoCol] = useState(false);
  const [dayUploading, setDayUploading] = useState<Record<number, boolean>>({});
  const isCorporate = form.category === 'Corporate Retreat';

  const addDay = () => {
    setForm((f) => ({
      ...f,
      itinerary: [
        ...f.itinerary,
        { day: f.itinerary.length + 1, location: '', description: '', imageUrl: '' },
      ],
    }));
  };

  const updateDay = (index: number, patch: Partial<ItineraryDay>) => {
    setForm((f) => {
      const updated = [...f.itinerary];
      updated[index] = { ...updated[index], ...patch };
      return { ...f, itinerary: updated };
    });
  };

  const removeDay = (index: number) => {
    setForm((f) => {
      const updated = f.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
      return { ...f, itinerary: updated };
    });
  };

  const moveDay = (index: number, dir: 'up' | 'down') => {
    setForm((f) => {
      const arr = [...f.itinerary];
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return f;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...f, itinerary: arr.map((d, i) => ({ ...d, day: i + 1 })) };
    });
  };

  const handleDayImageUpload = async (index: number, file: File) => {
    setDayUploading((p) => ({ ...p, [index]: true }));
    try {
      const url = await uploadFile(file, `packages/itinerary/${Date.now()}_${file.name}`);
      updateDay(index, { imageUrl: url });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setDayUploading((p) => ({ ...p, [index]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{form.itinerary.length} day{form.itinerary.length !== 1 ? 's' : ''} added</p>
        <div className="flex items-center gap-3">
          {isCorporate && (
            <Toggle checked={twoCol} onChange={setTwoCol} label="2-Column Day View" />
          )}
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal text-white text-sm rounded-lg hover:bg-teal/90 transition-colors"
          >
            + Add Day
          </button>
        </div>
      </div>

      {form.itinerary.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
          <p className="text-sm">No days yet. Click [+ Add Day] to begin building your itinerary.</p>
        </div>
      )}

      <div className="space-y-4">
        {form.itinerary.map((day, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl bg-white p-4">
            <div className={`grid gap-4 ${twoCol && isCorporate ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-[80px_1fr_1fr_160px_auto]'}`}>
              {!twoCol && (
                <div className="flex flex-col items-center justify-start pt-6">
                  <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center text-sm font-bold">
                    {day.day}
                  </div>
                </div>
              )}

              {twoCol && isCorporate ? (
                <>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Day {day.day} — Column 1</p>
                    <input className={inputCls()} value={day.location} onChange={(e) => updateDay(idx, { location: e.target.value })} placeholder="Location" />
                    <textarea className={`${inputCls()} resize-none`} rows={3} value={day.description} onChange={(e) => updateDay(idx, { description: e.target.value })} placeholder="Description" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Column 2</p>
                    <input className={inputCls()} placeholder="Activity / Breakout" />
                    <textarea className={`${inputCls()} resize-none`} rows={3} placeholder="Details" />
                  </div>
                </>
              ) : (
                <>
                  <input className={inputCls()} value={day.location} onChange={(e) => updateDay(idx, { location: e.target.value })} placeholder="Location" />
                  <textarea
                    className={`${inputCls()} resize-none`}
                    rows={3}
                    value={day.description}
                    onChange={(e) => updateDay(idx, { description: e.target.value })}
                    placeholder="Description"
                  />
                  {/* Thumbnail */}
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Thumbnail</label>
                    <div
                      className="border border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-teal transition-colors"
                      style={{ height: 80 }}
                      onClick={() => document.getElementById(`day-img-${idx}`)?.click()}
                    >
                      {day.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={day.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          {dayUploading[idx] ? 'Uploading…' : '+ Image'}
                        </div>
                      )}
                    </div>
                    <input
                      id={`day-img-${idx}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDayImageUpload(idx, file);
                      }}
                    />
                  </div>
                </>
              )}

              {/* Controls */}
              <div className="flex flex-col items-center justify-start gap-1 pt-1 md:pt-6">
                <button type="button" onClick={() => moveDay(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move up">
                  ↑
                </button>
                <button type="button" onClick={() => moveDay(idx, 'down')} disabled={idx === form.itinerary.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move down">
                  ↓
                </button>
                <button type="button" onClick={() => removeDay(idx)} className="p-1 text-red-400 hover:text-red-600" title="Remove day">
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabInclusionsGallery({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);

  const INCLUSION_KEYS: (keyof Inclusions)[] = ['accommodation', 'meals', 'transfers', 'guides', 'flights', 'activities'];
  const LABELS: Record<keyof Inclusions, string> = {
    accommodation: 'Accommodation',
    meals: 'Meals',
    transfers: 'Transfers',
    guides: 'Guides',
    flights: 'Flights',
    activities: 'Activities',
  };

  const handleGalleryUpload = async (files: FileList) => {
    setGalleryUploading(true);
    try {
      const uploads = Array.from(files).map((file) =>
        uploadFile(file, `packages/gallery/${Date.now()}_${file.name}`)
      );
      const urls = await Promise.all(uploads);
      setForm((f) => ({ ...f, galleryUrls: [...f.galleryUrls, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch {
      toast.error('Gallery upload failed');
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = async (url: string) => {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch {
      // ignore if already deleted
    }
    setForm((f) => ({ ...f, galleryUrls: f.galleryUrls.filter((u) => u !== url) }));
  };

  return (
    <div className="space-y-8">
      {/* Inclusions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">What&apos;s Included</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INCLUSION_KEYS.map((key) => (
            <div key={key} className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
              <Toggle
                checked={form.inclusions[key]}
                onChange={(v) => setForm((f) => ({ ...f, inclusions: { ...f.inclusions, [key]: v } }))}
                label={LABELS[key]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Exclusions */}
      <div>
        <Label>Exclusions</Label>
        <TagInput
          value={form.exclusions}
          onChange={(v) => setForm((f) => ({ ...f, exclusions: v }))}
          placeholder="Type an exclusion and press Enter"
        />
      </div>

      {/* Gallery */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Gallery</h3>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 cursor-pointer hover:border-teal transition-colors"
          onClick={() => galleryRef.current?.click()}
        >
          {galleryUploading ? (
            <p className="text-center text-sm text-gray-500 py-4">Uploading images…</p>
          ) : (
            <p className="text-center text-sm text-gray-400 py-4">Click to upload images (multi-select supported)</p>
          )}
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleGalleryUpload(e.target.files);
            }}
          />
        </div>
        {form.galleryUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.galleryUrls.map((url) => (
              <div key={url} className="relative group rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-28 object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">SEO</h3>
        <Field>
          <Label>Meta Title</Label>
          <input
            className={inputCls()}
            value={form.metaTitle ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            placeholder="SEO title (defaults to package title if empty)"
          />
        </Field>
        <Field>
          <Label>Meta Description</Label>
          <textarea
            className={`${inputCls()} resize-none`}
            rows={3}
            value={form.metaDescription ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
            placeholder="150–160 character description for search engines"
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Main PackageForm ─────────────────────────────────────────────────────────

interface PackageFormProps {
  initialData?: Package;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'content', label: 'Content' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'inclusions', label: 'Inclusions & Gallery' },
];

export default function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('basic');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>(() => {
    if (!initialData) return { ...DEFAULT_FORM };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = initialData;
    return rest;
  });

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      setTab('basic');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required');
      setTab('basic');
      return;
    }
    if (!form.priceInr) {
      toast.error('Price (INR) is required');
      setTab('basic');
      return;
    }

    setSaving(true);
    try {
      if (initialData?.id) {
        await updatePackage(initialData.id, form);
        toast.success('Package updated!');
      } else {
        const data = { ...form, createdAt: new Date().toISOString() };
        await createPackage(data);
        toast.success('Package saved!');
      }
      router.push('/admin/packages');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save — check console');
    } finally {
      setSaving(false);
    }
  }, [form, initialData, router]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === key
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tab === 'basic' && <TabBasicInfo form={form} setForm={setForm} />}
        {tab === 'content' && <TabContent form={form} setForm={setForm} />}
        {tab === 'itinerary' && <TabItinerary form={form} setForm={setForm} />}
        {tab === 'inclusions' && <TabInclusionsGallery form={form} setForm={setForm} />}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/packages')}
          className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Back to Packages
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
          style={{ background: '#C1EA00', color: '#1a2e1e' }}
        >
          {saving && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? 'Saving…' : initialData ? 'Update Package' : 'Save Package'}
        </button>
      </div>
    </div>
  );
}
