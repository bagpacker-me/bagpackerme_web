'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  FieldHint,
  FieldError,
} from '@/components/ui/form';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { cn } from '@/lib/utils';
import {
  jobApplicationSchema,
  type JobApplicationFormData,
  NOTICE_PERIOD_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
  CV_ACCEPT,
  CV_MAX_BYTES,
  CV_MAX_LABEL,
} from '@/lib/careers';
import type { JobOpening } from '@/types';

const labelCls = 'mb-3 ml-2 block font-display text-[14px] font-bold tracking-wide text-void';

function fieldCls(hasError: boolean) {
  return cn(
    'w-full rounded-[20px] border px-[20px] py-[18px] font-body text-[15px] text-void outline-none transition-all duration-300',
    hasError
      ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500'
      : 'border-void/5 bg-ice/40 shadow-sm placeholder-void/40 hover:bg-ice/70 focus:border-teal/40 focus:bg-white focus:ring-4 focus:ring-teal/10'
  );
}

export default function ApplyForm({ job }: { job: JobOpening }) {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: { jobId: job.id, linkedinUrl: '', portfolioUrl: '' },
  });

  // The file input sits outside react-hook-form: a FileList cannot round-trip
  // through zod cleanly, and the real validation happens on the server anyway.
  const handleCvChange = () => {
    const file = cvRef.current?.files?.[0];
    setServerError(null);

    if (!file) {
      setCvName(null);
      setCvError(null);
      return;
    }

    // A courtesy check so the candidate isn't told off after a long upload. The
    // server enforces this for real — a curl -F ignores everything here.
    if (file.size > CV_MAX_BYTES) {
      setCvName(null);
      setCvError(`That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please keep it under ${CV_MAX_LABEL}.`);
      if (cvRef.current) cvRef.current.value = '';
      return;
    }

    setCvName(file.name);
    setCvError(null);
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    setServerError(null);

    const file = cvRef.current?.files?.[0];
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value == null ? '' : String(value));
    });
    formData.append(HONEYPOT_FIELD, honeypotRef.current?.value ?? '');
    if (file) formData.append('cv', file);

    try {
      // No Content-Type header on purpose — the browser must set the multipart
      // boundary itself.
      const response = await fetch('/api/careers/apply', { method: 'POST', body: formData });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Something went wrong. Please try again.');
      }

      setIsSuccess(true);
      toast.success('Application sent.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-void/5 bg-ice/40 p-[32px] md:p-[48px] text-center">
        <div className="mx-auto mb-[20px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-lime">
          <svg className="h-7 w-7 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-display text-[24px] font-bold text-void mb-[12px]">Application received</h3>
        <p className="font-body text-[15px] text-void/70 leading-relaxed max-w-[420px] mx-auto">
          Thanks for applying for {job.title}. We read every application ourselves, so give us a few
          days — you will hear from us either way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-[24px]">
      <HoneypotField inputRef={honeypotRef} />
      <input type="hidden" {...register('jobId')} />

      {serverError && (
        <div
          role="alert"
          className="rounded-[20px] border border-red-200 bg-red-50 px-[20px] py-[16px] font-body text-[14px] text-red-800"
        >
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <Field required error={errors.fullName?.message}>
          <FieldLabel className={labelCls}>Full name *</FieldLabel>
          <FieldInput
            {...register('fullName')}
            autoComplete="name"
            placeholder="Priya Nair"
            className={fieldCls(Boolean(errors.fullName))}
          />
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>

        <Field required error={errors.email?.message}>
          <FieldLabel className={labelCls}>Email *</FieldLabel>
          <FieldInput
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldCls(Boolean(errors.email))}
          />
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <Field required error={errors.phone?.message}>
          <FieldLabel className={labelCls}>Phone / WhatsApp *</FieldLabel>
          <FieldInput
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className={fieldCls(Boolean(errors.phone))}
          />
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>

        <Field required error={errors.yearsExperience?.message}>
          <FieldLabel className={labelCls}>Years of experience *</FieldLabel>
          <FieldSelect
            {...register('yearsExperience')}
            defaultValue=""
            className={fieldCls(Boolean(errors.yearsExperience))}
          >
            <option value="" disabled>Select…</option>
            {YEARS_EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </FieldSelect>
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>
      </div>

      <Field required error={errors.noticePeriod?.message}>
        <FieldLabel className={labelCls}>When could you start? *</FieldLabel>
        <FieldSelect
          {...register('noticePeriod')}
          defaultValue=""
          className={fieldCls(Boolean(errors.noticePeriod))}
        >
          <option value="" disabled>Select…</option>
          {NOTICE_PERIOD_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </FieldSelect>
        <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <Field error={errors.linkedinUrl?.message}>
          <FieldLabel className={labelCls}>LinkedIn</FieldLabel>
          <FieldInput
            {...register('linkedinUrl')}
            type="url"
            placeholder="https://linkedin.com/in/…"
            className={fieldCls(Boolean(errors.linkedinUrl))}
          />
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>

        <Field error={errors.portfolioUrl?.message} hint="A site, a deck, anything that shows your work.">
          <FieldLabel className={labelCls}>Portfolio</FieldLabel>
          <FieldInput
            {...register('portfolioUrl')}
            type="url"
            placeholder="https://…"
            className={fieldCls(Boolean(errors.portfolioUrl))}
          />
          <FieldHint className="mt-2 ml-2 font-body text-[13px] text-void/50" />
          <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
        </Field>
      </div>

      {/* CV upload — outside RHF, see handleCvChange. */}
      <div>
        <label htmlFor="cv" className={labelCls}>
          CV / Resume
        </label>
        <label
          htmlFor="cv"
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed px-[20px] py-[32px] text-center transition-all duration-300',
            cvError
              ? 'border-red-400 bg-red-50'
              : 'border-void/15 bg-ice/40 hover:border-teal/40 hover:bg-ice/70'
          )}
        >
          <input
            id="cv"
            ref={cvRef}
            type="file"
            accept={CV_ACCEPT}
            onChange={handleCvChange}
            className="sr-only"
            aria-describedby="cv-hint"
          />
          <svg
            className="mb-[12px] h-7 w-7 text-teal" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="font-body text-[15px] font-medium text-void">
            {cvName ?? 'Click to upload your CV'}
          </span>
          <span id="cv-hint" className="mt-[4px] font-body text-[13px] text-void/50">
            PDF or DOCX, up to {CV_MAX_LABEL}. Optional if you have shared a link above.
          </span>
        </label>
        {cvError && (
          <p role="alert" className="mt-2 ml-2 font-body text-[13px] text-red-600">
            {cvError}
          </p>
        )}
      </div>

      <Field required error={errors.coverNote?.message} hint="No cover letter formalities — just tell us why this role, and why you.">
        <FieldLabel className={labelCls}>Why this role? *</FieldLabel>
        <FieldTextarea
          {...register('coverNote')}
          rows={6}
          placeholder="What draws you to this work, and what you would bring to it…"
          className={cn(fieldCls(Boolean(errors.coverNote)), 'resize-y')}
        />
        <FieldHint className="mt-2 ml-2 font-body text-[13px] text-void/50" />
        <FieldError className="mt-2 ml-2 font-body text-[13px] text-red-600" />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-[8px] rounded-full bg-teal px-[40px] py-[18px] font-display text-[13px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-teal/90 disabled:opacity-60 md:w-auto"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? 'Sending…' : 'Send application'}
      </button>

      <p className="font-body text-[13px] text-void/50 leading-relaxed">
        We use what you send here only to consider you for this role. Your CV is stored privately and
        is never shared outside our team.
      </p>
    </form>
  );
}
