'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createJobOpening, updateJobOpening } from '@/lib/firestore';
import { JobOpening, JobOpeningStatus } from '@/types';
import { JOB_TYPE_LABELS, JOB_LOCATION_TYPE_LABELS } from '@/lib/careers';
import TagInput from './TagInput';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface JobOpeningFormProps {
  initialData?: JobOpening;
  jobId?: string;
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

const defaultJob: Omit<JobOpening, 'id'> = {
  title: '',
  slug: '',
  department: '',
  location: '',
  locationType: 'onsite',
  type: 'full-time',
  descriptionHtml: '',
  responsibilities: [],
  requirements: [],
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: 'INR',
  salaryPeriod: 'MONTH',
  status: 'draft',
  order: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// '' must become null rather than 0 or NaN: Firestore rejects undefined, and a
// salary of 0 would render as a real number on the public page.
const toSalary = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export default function JobOpeningForm({ initialData, jobId }: JobOpeningFormProps) {
  const router = useRouter();
  const isEditing = !!jobId;
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Omit<JobOpening, 'id'>>({
    ...defaultJob,
    ...(initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          department: initialData.department,
          location: initialData.location,
          locationType: initialData.locationType,
          type: initialData.type,
          descriptionHtml: initialData.descriptionHtml,
          responsibilities: initialData.responsibilities ?? [],
          requirements: initialData.requirements ?? [],
          salaryMin: initialData.salaryMin,
          salaryMax: initialData.salaryMax,
          salaryCurrency: initialData.salaryCurrency || 'INR',
          salaryPeriod: initialData.salaryPeriod || 'MONTH',
          status: initialData.status,
          order: initialData.order ?? 0,
          createdAt: initialData.createdAt,
          updatedAt: initialData.updatedAt,
        }
      : {}),
  });

  const set = useCallback(<K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
  }, []);

  const handleTitleChange = (val: string) => {
    set('title', val);
    // Don't rewrite the slug of a live role — its URL may already be shared.
    if (!isEditing || !form.slug) {
      set('slug', slugify(val));
    }
  };

  const validate = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return false; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return false; }
    if (!form.location.trim()) { toast.error('Location is required'); return false; }
    if (!form.descriptionHtml.trim()) { toast.error('Description is required'); return false; }
    if (form.requirements.length === 0) { toast.error('Add at least one requirement'); return false; }
    if (
      typeof form.salaryMin === 'number' &&
      typeof form.salaryMax === 'number' &&
      form.salaryMin > form.salaryMax
    ) {
      toast.error('Minimum salary cannot be higher than the maximum');
      return false;
    }
    return true;
  };

  const handleSave = async (statusOverride?: JobOpeningStatus) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Omit<JobOpening, 'id'> = {
        ...form,
        status: statusOverride ?? form.status,
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && jobId) {
        await updateJobOpening(jobId, payload);
      } else {
        await createJobOpening({ ...payload, createdAt: new Date().toISOString() });
      }

      // Jobs are written directly to Firestore from this admin form. Refresh
      // the public route cache after the write so a published role appears on
      // /careers immediately rather than waiting for its five-minute TTL.
      const refreshResponse = await fetch('/api/admin/careers/revalidate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: payload.slug }),
      });

      if (!refreshResponse.ok) {
        throw new Error('The role was saved, but the public Careers listing could not be refreshed.');
      }

      toast.success(
        payload.status === 'published'
          ? 'Role saved and Careers listing refreshed'
          : 'Role saved and Careers cache refreshed'
      );
      router.push('/admin/careers');
    } catch (error) {
      // A Firestore write can have succeeded before the cache refresh failed.
      // Do not suggest that the role was discarded; the admin can safely retry
      // Update Role and the next cache revalidation will publish the change.
      toast.error(
        error instanceof Error && error.message.startsWith('The role was saved')
          ? error.message
          : 'Failed to save role'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push('/admin/careers')}
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[#718096] hover:text-[#221E2A] mb-[8px] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Job Openings
          </button>
          <h1 className="font-display text-[24px] font-bold text-[#221E2A] dark:text-white">
            {isEditing ? 'Edit Role' : 'New Role'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-5">
          <FormField label="Job Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Senior Trip Designer"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Slug"
            hint={
              isEditing
                ? 'Changing this breaks any link already shared for this role.'
                : 'Auto-generated from the title. Edit to customize the URL.'
            }
          >
            <div className="flex items-center gap-0">
              <span className="px-[14px] py-[10px] bg-[#F7F9FA] border border-r-0 border-[#D1D5DB] rounded-l-[2px] font-body text-[14px] text-[#718096]">
                /careers/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                className={`${inputClass} rounded-l-none border-l-0`}
              />
            </div>
          </FormField>

          <FormField label="About the Role" required>
            <RichTextEditor
              value={form.descriptionHtml}
              onChange={(html) => set('descriptionHtml', html)}
              placeholder="What this person will do, who they'll work with, why the role exists..."
            />
          </FormField>

          <FormField
            label="Requirements"
            required
            hint="Type each requirement and press Enter. These show as a list on the job page."
          >
            <TagInput
              value={form.requirements}
              onChange={(tags) => set('requirements', tags)}
              placeholder="3+ years planning bespoke travel"
            />
          </FormField>

          <FormField
            label="Responsibilities"
            hint="Optional. Type each responsibility and press Enter."
          >
            <TagInput
              value={form.responsibilities}
              onChange={(tags) => set('responsibilities', tags)}
              placeholder="Design itineraries with local partners"
            />
          </FormField>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] dark:bg-[#1A1625] rounded-[4px] border border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] p-[24px] shadow-sm space-y-[16px]">
            <h3 className="font-display text-[14px] font-bold text-[#221E2A] dark:text-white">Role Details</h3>

            <FormField label="Department">
              <input
                type="text"
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                placeholder="Operations"
                className={inputClass}
              />
            </FormField>

            <FormField label="Location" required>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Kochi, India"
                className={inputClass}
              />
            </FormField>

            <FormField label="Location Type">
              <select
                value={form.locationType}
                onChange={(e) => set('locationType', e.target.value as JobOpening['locationType'])}
                className={inputClass}
              >
                {Object.entries(JOB_LOCATION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Employment Type">
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as JobOpening['type'])}
                className={inputClass}
              >
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Sort Order" hint="Lower numbers appear first on /careers.">
              <input
                type="number"
                value={form.order}
                onChange={(e) => set('order', Number(e.target.value) || 0)}
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#1A1625] rounded-[4px] border border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] p-[24px] shadow-sm space-y-[16px]">
            <h3 className="font-display text-[14px] font-bold text-[#221E2A] dark:text-white">Salary Range</h3>
            <p className="font-body text-[12px] text-[#9CA3AF]">
              Optional. Leave both blank to hide salary — a range only shows when both ends are set.
            </p>

            <div className="grid grid-cols-2 gap-[12px]">
              <FormField label="Minimum">
                <input
                  type="number"
                  min={0}
                  value={form.salaryMin ?? ''}
                  onChange={(e) => set('salaryMin', toSalary(e.target.value))}
                  placeholder="40000"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Maximum">
                <input
                  type="number"
                  min={0}
                  value={form.salaryMax ?? ''}
                  onChange={(e) => set('salaryMax', toSalary(e.target.value))}
                  placeholder="60000"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <FormField label="Currency">
                <input
                  type="text"
                  value={form.salaryCurrency}
                  onChange={(e) => set('salaryCurrency', e.target.value.toUpperCase().slice(0, 3))}
                  placeholder="INR"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Per">
                <select
                  value={form.salaryPeriod}
                  onChange={(e) => set('salaryPeriod', e.target.value as JobOpening['salaryPeriod'])}
                  className={inputClass}
                >
                  <option value="MONTH">Month</option>
                  <option value="YEAR">Year</option>
                </select>
              </FormField>
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#1A1625] rounded-[4px] border border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] p-[24px] shadow-sm space-y-[16px]">
            <h3 className="font-display text-[14px] font-bold text-[#221E2A] dark:text-white">Status</h3>
            <FormField
              label="Visibility"
              hint="Only published roles appear on /careers and accept applications."
            >
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as JobOpeningStatus)}
                className={inputClass}
              >
                <option value="draft">Draft — not visible</option>
                <option value="published">Published — live and accepting applications</option>
                <option value="closed">Closed — hidden, applications kept</option>
              </select>
            </FormField>
          </div>
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="sticky bottom-0 bg-[#FFFFFF] dark:bg-[#1A1625] p-[16px] border-t border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-end gap-[12px] z-20 mt-8 shadow-[0_-4px_16px_rgba(34,30,42,0.04)]">
        <button
          type="button"
          onClick={() => router.push('/admin/careers')}
          className="px-[24px] py-[14px] font-display text-[13px] font-semibold tracking-[0.14em] uppercase text-[#4a5568] border border-[#d1d5db] transition-colors hover:bg-[#F7F9FA]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-[8px] bg-[#C1EA00] text-[#221E2A] font-display text-[13px] font-bold tracking-[0.14em] uppercase px-[40px] py-[16px] border-none cursor-pointer transition-all hover:bg-[#afd100] disabled:opacity-60"
        >
          {saving && (
            <svg className="w-[16px] h-[16px] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? 'Saving…' : isEditing ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </div>
  );
}
