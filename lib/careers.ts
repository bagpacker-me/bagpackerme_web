import { z } from 'zod';
import type { JobOpening, JobType, JobLocationType, ApplicationStatus } from '@/types';

// Shared by the public apply form and app/api/careers/apply/route.ts, so the
// client and the server agree on what a valid application is. Must stay free of
// `server-only`.

export const NOTICE_PERIOD_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  '1 month',
  '2 months',
  '3 months or more',
] as const;

export const YEARS_EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–8 years',
  '8+ years',
] as const;

// Optional, and it has to accept all three shapes a URL field arrives in:
// a real URL, '' from an empty <input type="url">, and absent entirely when a
// caller simply omits the field. Without .optional() the last case is a
// validation error — the form always sends '' so it would look fine, and any
// other caller would get a 400 for leaving an optional field out.
//
// Deliberately no .transform() to null: that would make the schema's input and
// output types diverge, and react-hook-form types useForm against the input
// while zodResolver reports the output — they stop being assignable and the
// form no longer typechecks. The API route normalizes to null instead, at the
// one boundary that cares (Firestore rejects undefined).
const optionalUrl = z
  .union([z.literal(''), z.string().url('Please enter a valid URL (including https://)')])
  .optional();

export const jobApplicationSchema = z.object({
  jobId: z.string().trim().min(1),
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  yearsExperience: z.enum(YEARS_EXPERIENCE_OPTIONS, { error: 'Please select your experience level' }),
  noticePeriod: z.enum(NOTICE_PERIOD_OPTIONS, { error: 'Please select your notice period' }),
  coverNote: z
    .string()
    .trim()
    .min(30, 'Please tell us a little more — at least 30 characters')
    .max(3000, 'Please keep this under 3000 characters'),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

// Vercel caps a serverless request body at 4.5MB. 4MB leaves headroom for the
// multipart envelope and the text fields alongside the file.
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT = '.pdf,.docx';
export const CV_MAX_LABEL = '4MB';

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export const JOB_LOCATION_TYPE_LABELS: Record<JobLocationType, string> = {
  onsite: 'On-site',
  hybrid: 'Hybrid',
  remote: 'Remote',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  shortlisted: 'Shortlisted',
  interviewing: 'Interviewing',
  hired: 'Hired',
  rejected: 'Rejected',
};

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'new',
  'shortlisted',
  'interviewing',
  'hired',
  'rejected',
];

type SalaryFields = Pick<JobOpening, 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'salaryPeriod'>;

/**
 * Human-readable salary range, or null when the range is incomplete — callers
 * hide the field entirely rather than rendering a half-range.
 */
export function formatSalaryRange(job: SalaryFields): string | null {
  const { salaryMin, salaryMax, salaryCurrency, salaryPeriod } = job;
  if (typeof salaryMin !== 'number' || typeof salaryMax !== 'number') return null;

  const format = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: salaryCurrency || 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const period = salaryPeriod === 'MONTH' ? 'month' : 'year';
  return `${format(salaryMin)} – ${format(salaryMax)} per ${period}`;
}
