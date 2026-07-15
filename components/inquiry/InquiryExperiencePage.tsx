'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Compass,
  Mail,
  MapPin,
  MessageSquareText,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { getStoredAffiliateCode, getStoredAffiliateSessionId } from '@/hooks/useAffiliateTracking';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import {
  buildContactWhatsAppMessage,
  contactFormSchema,
  CONTACT_INQUIRY_TYPE_OPTIONS,
  type ContactFormData,
} from '@/lib/contact-form';
import { cn } from '@/lib/utils';
import {
  B2C_DESTINATION_OPTIONS,
  B2C_DURATION_OPTIONS,
  B2C_TRAVELER_OPTIONS,
  B2C_TRIP_TYPE_OPTIONS,
  B2C_TRIP_VIBE_OPTIONS,
  CORPORATE_ACCOMMODATION_OPTIONS,
  CORPORATE_ACTIVITY_OPTIONS,
  CORPORATE_ATTENDEE_OPTIONS,
  CORPORATE_AV_OPTIONS,
  CORPORATE_BUDGET_OPTIONS,
  CORPORATE_DURATION_OPTIONS,
  CORPORATE_MEETING_SETUP_OPTIONS,
  CORPORATE_MEAL_STYLE_OPTIONS,
  CORPORATE_ROOMING_OPTIONS,
  CORPORATE_SOCIAL_PLAN_OPTIONS,
  CORPORATE_STEP_FIELDS,
  CORPORATE_STEPS,
  CORPORATE_TRANSFER_OPTIONS,
  CORPORATE_RETREAT_TYPE_OPTIONS,
  type B2CFormState,
  type ContactIntent,
  type CorporateFormState,
  type CorporateStepId,
  type InquiryOption,
  buildB2CEnquiryPayload,
  buildB2CWhatsAppMessage,
  buildCorporateEnquiryPayload,
  buildCorporateWhatsAppMessage,
  buildWhatsAppUrl,
  getCorporateStepErrors,
  initialB2CFormState,
  initialCorporateFormState,
  validateB2CForm,
  validateCorporateForm,
} from '@/lib/inquiry-form';

const intentCopy = {
  trip: {
    badge: 'Trip Inquiry',
    title: 'Plan your next journey in one conversation.',
    description:
      "Choose the trip path, share the essentials once, and we'll continue the conversation on WhatsApp with your brief already structured.",
    formTitle: 'Tell us what kind of trip you want',
    formDescription:
      'This form is built for fast planning. Fill it once, and your details open directly in WhatsApp.',
    successTitle: 'Your trip brief is ready',
    successDescription:
      "We opened WhatsApp in a new tab so you can keep the planning moving. If it didn't open, use the button below.",
    panelTitle: 'What we need from you',
    panelPoints: [
      'Where you want to go, or whether you want suggestions.',
      'The trip format, duration, and vibe you are chasing.',
      'Your preferred month, traveler count, and any extra context.',
    ],
  },
  corporate: {
    badge: 'Corporate Retreats',
    title: 'Brief us once. Plan the retreat without switching pages.',
    description:
      'A 7-step corporate and MICE intake that captures travel, rooming, meetings, food, activities, and budget in one flow.',
    formTitle: 'Build your retreat brief step by step',
    formDescription:
      'Each step validates before you continue, and the final summary opens in WhatsApp with your planning details already formatted.',
    successTitle: 'Your corporate brief is ready',
    successDescription:
      'We opened the WhatsApp summary in a new tab so your team can continue with a human conversation right away.',
    panelTitle: 'What this captures',
    panelPoints: [
      'Attendee count, rooming, destination direction, and timing.',
      'Meetings, AV, food, social plans, and activity preferences.',
      'Budget range plus a single point of contact for follow-up.',
    ],
  },
  general: {
    badge: 'General Enquiry',
    title: 'Ask the right question without hunting for the right page.',
    description:
      'Use the same contact hub for partnerships, custom ideas, media requests, or anything else that does not fit a standard trip brief.',
    formTitle: 'Tell us what you need',
    formDescription:
      'We will save your enquiry, route it to the team, and open WhatsApp so you can continue the conversation immediately.',
    successTitle: 'Your message is on its way',
    successDescription:
      'We saved your enquiry and opened WhatsApp so you can keep the conversation moving with the team.',
    panelTitle: 'Best for',
    panelPoints: [
      'Partnerships, collaborations, press, and media requests.',
      'Custom ideas that do not fit the trip or corporate flows.',
      'General questions when you want a quick human response.',
    ],
  },
} as const;

const defaultCopy = {
  badge: 'Enquiries',
  title: 'One contact page. The right form, based on what you need.',
  description:
    'Pick whether you are planning a trip, organizing a corporate retreat, or sending a general enquiry, and the page adapts in place.',
  formTitle: 'Choose your enquiry type',
  formDescription:
    'Start with the option that matches your intent. You can switch paths at any time without leaving the page.',
  panelTitle: 'Why this works better',
  panelPoints: [
    'Everyone starts in the same place, so the contact flow stays simple.',
    'Each path asks only for the details needed for that kind of enquiry.',
    'Every submission is still stored in Firebase and visible in admin.',
  ],
} as const;

const INTENT_OPTIONS: {
  intent: ContactIntent;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof Compass;
}[] = [
  {
    intent: 'trip',
    label: 'Plan a Trip',
    shortLabel: 'Trip',
    description: 'For personal travel planning, custom itineraries, and destination ideas.',
    icon: Compass,
  },
  {
    intent: 'corporate',
    label: 'Corporate Retreat',
    shortLabel: 'Corporate',
    description: 'For retreats, offsites, incentive trips, and MICE-style requirements.',
    icon: Building2,
  },
  {
    intent: 'general',
    label: 'General Enquiry',
    shortLabel: 'General',
    description: 'For partnerships, media requests, or anything else you want to ask.',
    icon: MessageSquareText,
  },
];

const emptyCorporateAttempts: Record<CorporateStepId, boolean> = {
  overview: false,
  attendees: false,
  'stay-travel': false,
  'meetings-av': false,
  'food-social': false,
  activities: false,
  'budget-contact': false,
};

const fieldToCorporateStep = Object.entries(CORPORATE_STEP_FIELDS).reduce(
  (acc, [stepId, fields]) => {
    for (const field of fields) {
      acc[field] = stepId as CorporateStepId;
    }

    return acc;
  },
  {} as Record<keyof CorporateFormState, CorporateStepId>
);

const labelCls = 'mb-3 ml-2 block font-display text-[14px] font-bold tracking-wide text-void';

function fieldCls(hasError: boolean) {
  return cn(
    'w-full rounded-[20px] border px-[20px] py-[18px] font-body text-[15px] text-void outline-none transition-all duration-300',
    hasError
      ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500'
      : 'border-void/5 bg-ice/40 shadow-sm placeholder-void/40 hover:bg-ice/70 focus:border-teal/40 focus:bg-white focus:ring-4 focus:ring-teal/10'
  );
}

function chipCls(active: boolean, hasError: boolean) {
  return cn(
    'rounded-full border px-[16px] py-[12px] text-left font-display text-[12px] font-bold uppercase tracking-widest transition-all duration-300',
    active
      ? 'border-teal bg-teal text-white shadow-[0_8px_24px_rgba(40,80,86,0.24)]'
      : 'border-void/10 bg-white text-void/70 hover:border-teal/30 hover:text-teal',
    hasError && !active ? 'border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:text-red-700' : ''
  );
}

function ErrorText({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="mt-2 text-xs font-body text-red-500">{error}</p>;
}

function FieldHint({ hint }: { hint?: string }) {
  if (!hint) {
    return null;
  }

  return <p className="mt-2 text-xs font-body text-void/50">{hint}</p>;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className={labelCls}>
      {label}
      {required ? ' *' : ''}
    </label>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'month';
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required,
  type = 'text',
}: TextFieldProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldCls(Boolean(error))}
      />
      <FieldHint hint={hint} />
      <ErrorText error={error} />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(fieldCls(Boolean(error)), 'resize-none')}
      />
      <FieldHint hint={hint} />
      <ErrorText error={error} />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: InquiryOption[];
  placeholder: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  hint,
  required,
}: SelectFieldProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldCls(Boolean(error)), 'cursor-pointer appearance-none')}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldHint hint={hint} />
      <ErrorText error={error} />
    </div>
  );
}

interface ChipGroupProps {
  label: string;
  options: InquiryOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple,
  error,
  hint,
  required,
}: ChipGroupProps) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = Array.isArray(value) ? value.includes(option.value) : value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (multiple && Array.isArray(value)) {
                  onChange(
                    active ? value.filter((item) => item !== option.value) : [...value, option.value]
                  );
                  return;
                }

                onChange(option.value);
              }}
              className={chipCls(active, Boolean(error))}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldHint hint={hint} />
      <ErrorText error={error} />
    </div>
  );
}

function InquirySuccessState({
  title,
  description,
  submittedUrl,
  onReset,
}: {
  title: string;
  description: string;
  submittedUrl: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
          <Check className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-[28px] font-bold text-void md:text-[32px]">{title}</h3>
        <p className="mx-auto max-w-[420px] font-body text-[15px] text-void/60 md:text-[16px]">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={submittedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-[24px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
        >
          <MessageCircle className="h-4 w-4" />
          Open WhatsApp Again
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-void/10 px-[24px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-void transition-colors hover:border-teal/30 hover:text-teal"
        >
          Start Another Brief
        </button>
      </div>
    </div>
  );
}

function IntentChooser({
  selectedIntent,
  onSelect,
}: {
  selectedIntent: ContactIntent | null;
  onSelect: (intent: ContactIntent) => void;
}) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {INTENT_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = selectedIntent === option.intent;

        return (
          <button
            key={option.intent}
            type="button"
            onClick={() => onSelect(option.intent)}
            className={cn(
              'rounded-[28px] border p-5 text-left transition-all duration-300',
              isActive
                ? 'border-teal bg-teal text-white shadow-[0_14px_34px_rgba(40,80,86,0.22)]'
                : 'border-void/8 bg-[#F7FBFC] text-void hover:-translate-y-1 hover:border-teal/20 hover:shadow-sm'
            )}
          >
            <div
              className={cn(
                'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors',
                isActive ? 'border-white/20 bg-white/10 text-white' : 'border-teal/10 bg-white text-teal'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p
              className={cn(
                'mb-2 font-display text-[12px] font-bold uppercase tracking-[0.18em]',
                isActive ? 'text-lime' : 'text-teal'
              )}
            >
              {option.shortLabel}
            </p>
            <h3 className="mb-2 font-display text-[20px] font-bold leading-tight">{option.label}</h3>
            <p className={cn('font-body text-[14px] leading-relaxed', isActive ? 'text-white/80' : 'text-void/65')}>
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function GeneralContactForm({
  whatsappNumber,
  onSuccess,
  honeypotRef,
}: {
  whatsappNumber: string;
  onSuccess: (submittedUrl: string) => void;
  honeypotRef: RefObject<HTMLInputElement>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    const popup = window.open('', '_blank');

    try {
      const affiliateCode = getStoredAffiliateCode();
      const affiliateSessionId = getStoredAffiliateSessionId();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          ...(affiliateCode ? { affiliateCode } : {}),
          ...(affiliateSessionId ? { affiliateSessionId } : {}),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'Something went wrong. Please try again or reach out via WhatsApp.');
      }

      const submittedUrl = buildWhatsAppUrl(whatsappNumber, buildContactWhatsAppMessage(data));
      if (popup && !popup.closed) {
        popup.location.href = submittedUrl;
      } else {
        window.location.href = submittedUrl;
      }

      onSuccess(submittedUrl);
    } catch (error) {
      popup?.close();
      setServerError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or reach out via WhatsApp.'
      );
    }
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel label="First Name" required />
          <input
            type="text"
            placeholder="First name"
            {...register('firstName')}
            className={fieldCls(Boolean(errors.firstName))}
          />
          <ErrorText error={errors.firstName?.message} />
        </div>
        <div>
          <FieldLabel label="Last Name" required />
          <input
            type="text"
            placeholder="Last name"
            {...register('lastName')}
            className={fieldCls(Boolean(errors.lastName))}
          />
          <ErrorText error={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <FieldLabel label="E-mail" required />
        <input
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={fieldCls(Boolean(errors.email))}
        />
        <ErrorText error={errors.email?.message} />
      </div>

      <div>
        <FieldLabel label="Phone Number" required />
        <input
          type="tel"
          placeholder="Include country code if needed, e.g. +1 555 123 4567"
          {...register('phone')}
          className={fieldCls(Boolean(errors.phone))}
        />
        <FieldHint hint="You can enter your number in any format. Adding your country code helps us reach you faster." />
        <ErrorText error={errors.phone?.message} />
      </div>

      <div>
        <FieldLabel label="Subject" required />
        <select
          defaultValue=""
          {...register('inquiryType')}
          className={cn(fieldCls(Boolean(errors.inquiryType)), 'cursor-pointer appearance-none')}
        >
          <option value="" disabled>
            Choose message subject
          </option>
          {CONTACT_INQUIRY_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ErrorText error={errors.inquiryType?.message} />
      </div>

      <div>
        <FieldLabel label="Message" required />
        <textarea
          rows={5}
          placeholder="Leave us a message..."
          {...register('message')}
          className={cn(fieldCls(Boolean(errors.message)), 'resize-none')}
        />
        <ErrorText error={errors.message?.message} />
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-body text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex justify-start border-t border-void/5 pt-8 sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-teal px-[40px] py-[18px] font-display text-[13px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(40,80,86,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-teal/90 hover:shadow-[0_12px_32px_rgba(40,80,86,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-teal"
        >
          <span className="absolute inset-0 w-[120%] -translate-x-[150%] skew-x-[30deg] bg-white/20 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
          <span className="relative z-10 flex items-center gap-3">
            {isSubmitting ? 'Saving Enquiry...' : 'Send Message'}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </form>
  );
}

function ProgressIndicator({ activeStep }: { activeStep: number }) {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <ol className="flex min-w-max gap-3">
        {CORPORATE_STEPS.map((step, index) => {
          const isCurrent = activeStep === index;
          const isPast = activeStep > index;

          return (
            <li
              key={step.id}
              className={cn(
                'rounded-full border px-4 py-3 transition-all duration-300',
                isCurrent
                  ? 'border-teal bg-teal text-white shadow-[0_10px_28px_rgba(40,80,86,0.22)]'
                  : isPast
                    ? 'border-lime/50 bg-lime/20 text-void'
                    : 'border-void/10 bg-white text-void/60'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-display font-bold',
                    isCurrent
                      ? 'border-white/30 bg-white/10 text-white'
                      : isPast
                        ? 'border-lime/60 bg-white/40 text-teal'
                        : 'border-void/10 bg-ice/70 text-void/60'
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Step {index + 1}
                  </p>
                  <p className="font-body text-[13px] font-medium">{step.label}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ContactRail({
  intent,
  contactEmail,
  contactPhone,
  whatsappNumber,
  address,
  workingHours,
}: {
  intent: ContactIntent | null;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
}) {
  const panel = intent ? intentCopy[intent] : defaultCopy;
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative isolate aspect-video w-full overflow-hidden rounded-3xl border border-void/8 bg-white shadow-sm md:aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/6 via-white to-lime/10" />
        <Image src="/logo_b.webp" alt="BagPackerMe logo" fill className="object-contain p-10 opacity-90" />
      </div>

      <div className="rounded-[28px] border border-void/8 bg-[#F7FBFC] p-6 shadow-sm">
        <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-widest text-teal">
          {panel.panelTitle}
        </p>
        <ul className="space-y-3">
          {panel.panelPoints.map((point) => (
            <li key={point} className="flex items-start gap-3 font-body text-[14px] leading-relaxed text-void/70">
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-lime" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`mailto:${contactEmail}`}
        className="group flex items-center gap-[20px] rounded-3xl bg-teal/5 p-[20px] transition-colors hover:bg-teal/10 md:p-[24px]"
      >
        <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-full bg-white text-teal shadow-sm transition-transform group-hover:scale-105">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <p className="mb-1 font-display text-[16px] font-bold text-void">Email</p>
          <p className="font-body text-[14px] text-void/60">{contactEmail}</p>
        </div>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-[20px] rounded-3xl bg-teal/5 p-[20px] transition-colors hover:bg-teal/10 md:p-[24px]"
      >
        <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-full bg-white text-teal shadow-sm transition-transform group-hover:scale-105">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <p className="mb-1 font-display text-[16px] font-bold text-void">Phone / WhatsApp</p>
          <p className="font-body text-[14px] text-void/60">{contactPhone}</p>
        </div>
      </a>

      <div className="flex items-center gap-[20px] rounded-3xl bg-teal/5 p-[20px] md:p-[24px]">
        <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-full bg-white text-teal shadow-sm">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <p className="mb-1 font-display text-[16px] font-bold text-void">Address</p>
          <p className="font-body text-[14px] text-void/60">{address}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-void p-6 text-white shadow-[0_18px_42px_rgba(34,30,42,0.18)]">
        <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-widest text-lime">
          Support Window
        </p>
        <p className="mb-3 font-display text-[22px] font-bold leading-tight">
          Real people, not a ticket queue.
        </p>
        <p className="font-body text-[14px] leading-relaxed text-white/75">{workingHours}</p>
      </div>
    </div>
  );
}

function B2CForm({
  form,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: {
  form: B2CFormState;
  errors: Partial<Record<keyof B2CFormState, string>>;
  isSubmitting: boolean;
  onChange: <K extends keyof B2CFormState>(field: K, value: B2CFormState[K]) => void;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={form.fullName}
          onChange={(value) => onChange('fullName', value)}
          placeholder="Your name"
          error={errors.fullName}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => onChange('email', value)}
          placeholder="you@example.com"
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          label="Phone / WhatsApp"
          type="tel"
          value={form.phone}
          onChange={(value) => onChange('phone', value)}
          placeholder="Include country code, e.g. +1 555 123 4567"
          error={errors.phone}
          hint="Include your country code if you can."
          required
        />
        <SelectField
          label="How many travelers?"
          value={form.travelers}
          onChange={(value) => onChange('travelers', value)}
          options={B2C_TRAVELER_OPTIONS}
          placeholder="Select your traveler count"
          error={errors.travelers}
          required
        />
      </div>

      <ChipGroup
        label="Where do you want to go?"
        options={B2C_DESTINATION_OPTIONS}
        value={form.destinationMode}
        onChange={(value) => onChange('destinationMode', value as string)}
        error={errors.destinationMode}
        required
      />

      {form.destinationMode === 'I have a destination in mind' && (
        <TextField
          label="Destination name"
          value={form.destinationName}
          onChange={(value) => onChange('destinationName', value)}
          placeholder="Tell us the place or route"
          error={errors.destinationName}
          required
        />
      )}

      <ChipGroup
        label="Trip type"
        options={B2C_TRIP_TYPE_OPTIONS}
        value={form.tripType}
        onChange={(value) => onChange('tripType', value as string)}
        error={errors.tripType}
        required
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ChipGroup
          label="Duration"
          options={B2C_DURATION_OPTIONS}
          value={form.duration}
          onChange={(value) => onChange('duration', value as string)}
          error={errors.duration}
          required
        />
        <TextField
          label="Preferred travel month"
          type="month"
          value={form.travelMonth}
          onChange={(value) => onChange('travelMonth', value)}
          placeholder=""
          error={errors.travelMonth}
          required
        />
      </div>

      <ChipGroup
        label="Trip vibe"
        options={B2C_TRIP_VIBE_OPTIONS}
        value={form.tripVibe}
        onChange={(value) => onChange('tripVibe', value as string[])}
        multiple
        error={errors.tripVibe}
        hint="Choose as many as you want."
        required
      />

      <TextAreaField
        label="Anything else we should know?"
        value={form.note}
        onChange={(value) => onChange('note', value)}
        placeholder="Special occasions, pace, must-sees, or anything that will help us shape the right trip."
        error={errors.note}
        rows={4}
      />

      <div className="flex justify-start border-t border-void/5 pt-8 sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-teal px-[40px] py-[18px] font-display text-[13px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(40,80,86,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-teal/90 hover:shadow-[0_12px_32px_rgba(40,80,86,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-teal"
        >
          <span className="absolute inset-0 w-[120%] -translate-x-[150%] skew-x-[30deg] bg-white/20 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
          <span className="relative z-10 flex items-center gap-3">
            {isSubmitting ? 'Saving Brief...' : 'Send Trip Brief'}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </form>
  );
}

function CorporateForm({
  form,
  activeStepIndex,
  getError,
  isSubmitting,
  onChange,
  onBack,
  onNext,
  onSubmit,
}: {
  form: CorporateFormState;
  activeStepIndex: number;
  getError: (field: keyof CorporateFormState) => string | undefined;
  isSubmitting: boolean;
  onChange: <K extends keyof CorporateFormState>(field: K, value: CorporateFormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void | Promise<void>;
}) {
  const activeStep = CORPORATE_STEPS[activeStepIndex];
  const isLastStep = activeStepIndex === CORPORATE_STEPS.length - 1;

  return (
    <form
      className="space-y-8"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (isLastStep) {
          onSubmit();
          return;
        }

        onNext();
      }}
    >
      <ProgressIndicator activeStep={activeStepIndex} />

      <div>
        <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-widest text-teal">
          Step {activeStepIndex + 1} of {CORPORATE_STEPS.length}
        </p>
        <h3 className="mb-2 font-display text-[28px] font-bold text-void">{activeStep.label}</h3>
      </div>

      {activeStep.id === 'overview' && (
        <div className="space-y-6">
          <TextField
            label="Company or organization"
            value={form.companyName}
            onChange={(value) => onChange('companyName', value)}
            placeholder="Company name"
            error={getError('companyName')}
            required
          />
          <ChipGroup
            label="What are you planning?"
            options={CORPORATE_RETREAT_TYPE_OPTIONS}
            value={form.retreatType}
            onChange={(value) => onChange('retreatType', value as string)}
            error={getError('retreatType')}
            required
          />
          <TextAreaField
            label="What should this retreat achieve?"
            value={form.primaryGoal}
            onChange={(value) => onChange('primaryGoal', value)}
            placeholder="Team bonding, leadership alignment, sales kickoff, rewards, or another core objective."
            error={getError('primaryGoal')}
            required
          />
          <ChipGroup
            label="Destination direction"
            options={B2C_DESTINATION_OPTIONS}
            value={form.destinationMode}
            onChange={(value) => onChange('destinationMode', value as string)}
            error={getError('destinationMode')}
            required
          />
          {form.destinationMode === 'I have a destination in mind' && (
            <TextField
              label="Preferred destination"
              value={form.destinationName}
              onChange={(value) => onChange('destinationName', value)}
              placeholder="City, region, or route"
              error={getError('destinationName')}
              required
            />
          )}
        </div>
      )}

      {activeStep.id === 'attendees' && (
        <div className="space-y-6">
          <SelectField
            label="Expected attendee count"
            value={form.attendeeCount}
            onChange={(value) => onChange('attendeeCount', value)}
            options={CORPORATE_ATTENDEE_OPTIONS}
            placeholder="Select attendee range"
            error={getError('attendeeCount')}
            required
          />
          <TextAreaField
            label="Who is attending?"
            value={form.attendeeProfile}
            onChange={(value) => onChange('attendeeProfile', value)}
            placeholder="Tell us the mix: leadership, sales, cross-functional teams, partners, or clients."
            error={getError('attendeeProfile')}
            required
          />
          <ChipGroup
            label="Rooming style"
            options={CORPORATE_ROOMING_OPTIONS}
            value={form.roomingStyle}
            onChange={(value) => onChange('roomingStyle', value as string)}
            error={getError('roomingStyle')}
            required
          />
        </div>
      )}

      {activeStep.id === 'stay-travel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Preferred travel month"
              type="month"
              value={form.preferredMonth}
              onChange={(value) => onChange('preferredMonth', value)}
              placeholder=""
              error={getError('preferredMonth')}
              required
            />
            <SelectField
              label="Stay duration"
              value={form.duration}
              onChange={(value) => onChange('duration', value)}
              options={CORPORATE_DURATION_OPTIONS}
              placeholder="Select duration"
              error={getError('duration')}
              required
            />
          </div>
          <TextAreaField
            label="Departure city or cities"
            value={form.originCities}
            onChange={(value) => onChange('originCities', value)}
            placeholder="Example: Dubai and London"
            error={getError('originCities')}
            required
          />
          <SelectField
            label="Accommodation style"
            value={form.accommodationStyle}
            onChange={(value) => onChange('accommodationStyle', value)}
            options={CORPORATE_ACCOMMODATION_OPTIONS}
            placeholder="Select accommodation style"
            error={getError('accommodationStyle')}
            required
          />
          <ChipGroup
            label="Transfer support"
            options={CORPORATE_TRANSFER_OPTIONS}
            value={form.transfersSupport}
            onChange={(value) => onChange('transfersSupport', value as string)}
            error={getError('transfersSupport')}
            required
          />
        </div>
      )}

      {activeStep.id === 'meetings-av' && (
        <div className="space-y-6">
          <ChipGroup
            label="Meeting setup"
            options={CORPORATE_MEETING_SETUP_OPTIONS}
            value={form.meetingSetup}
            onChange={(value) => onChange('meetingSetup', value as string)}
            error={getError('meetingSetup')}
            required
          />
          <ChipGroup
            label="AV needs"
            options={CORPORATE_AV_OPTIONS}
            value={form.avRequirements}
            onChange={(value) => onChange('avRequirements', value as string[])}
            multiple
            error={getError('avRequirements')}
            required
          />
          <TextAreaField
            label="Session notes"
            value={form.sessionNotes}
            onChange={(value) => onChange('sessionNotes', value)}
            placeholder="Optional notes on agenda flow, keynote requirements, or breakout expectations."
            error={getError('sessionNotes')}
          />
        </div>
      )}

      {activeStep.id === 'food-social' && (
        <div className="space-y-6">
          <ChipGroup
            label="Food style"
            options={CORPORATE_MEAL_STYLE_OPTIONS}
            value={form.mealStyle}
            onChange={(value) => onChange('mealStyle', value as string)}
            error={getError('mealStyle')}
            required
          />
          <TextAreaField
            label="Dietary requirements"
            value={form.dietaryRequirements}
            onChange={(value) => onChange('dietaryRequirements', value)}
            placeholder="Optional dietary notes, allergies, or preferences."
            error={getError('dietaryRequirements')}
          />
          <ChipGroup
            label="Social plans"
            options={CORPORATE_SOCIAL_PLAN_OPTIONS}
            value={form.socialPlans}
            onChange={(value) => onChange('socialPlans', value as string[])}
            multiple
            error={getError('socialPlans')}
            required
          />
        </div>
      )}

      {activeStep.id === 'activities' && (
        <div className="space-y-6">
          <ChipGroup
            label="Activity interests"
            options={CORPORATE_ACTIVITY_OPTIONS}
            value={form.activityTypes}
            onChange={(value) => onChange('activityTypes', value as string[])}
            multiple
            error={getError('activityTypes')}
            required
          />
          <TextAreaField
            label="Must-have experiences"
            value={form.activityNotes}
            onChange={(value) => onChange('activityNotes', value)}
            placeholder="Optional ideas or moments you want the trip to include."
            error={getError('activityNotes')}
          />
        </div>
      )}

      {activeStep.id === 'budget-contact' && (
        <div className="space-y-6">
          <ChipGroup
            label="Budget range"
            options={CORPORATE_BUDGET_OPTIONS}
            value={form.budgetRange}
            onChange={(value) => onChange('budgetRange', value as string)}
            error={getError('budgetRange')}
            required
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              label="Contact name"
              value={form.contactName}
              onChange={(value) => onChange('contactName', value)}
              placeholder="Primary point of contact"
              error={getError('contactName')}
              required
            />
            <TextField
              label="Work email"
              type="email"
              value={form.contactEmail}
              onChange={(value) => onChange('contactEmail', value)}
              placeholder="you@company.com"
              error={getError('contactEmail')}
              required
            />
          </div>
          <TextField
            label="Phone / WhatsApp"
            type="tel"
            value={form.contactPhone}
            onChange={(value) => onChange('contactPhone', value)}
            placeholder="Include country code, e.g. +1 555 123 4567"
            error={getError('contactPhone')}
            required
          />
          <TextAreaField
            label="Extra notes"
            value={form.extraNotes}
            onChange={(value) => onChange('extraNotes', value)}
            placeholder="Optional internal context, procurement notes, or deadline details."
            error={getError('extraNotes')}
          />
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-void/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={activeStepIndex === 0 || isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-void/10 px-5 py-3 font-display text-[12px] font-bold uppercase tracking-widest text-void transition-colors hover:border-teal/30 hover:text-teal disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal px-[28px] py-[16px] font-display text-[12px] font-bold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(40,80,86,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-teal/90 hover:shadow-[0_12px_32px_rgba(40,80,86,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-teal"
        >
          {isSubmitting ? 'Saving Brief...' : isLastStep ? 'Send Corporate Brief' : 'Next Step'}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

export function InquiryExperiencePage({
  initialIntent = null,
}: {
  initialIntent?: ContactIntent | null;
}) {
  const settings = useSiteSettings();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [selectedIntent, setSelectedIntent] = useState<ContactIntent | null>(initialIntent);
  const pageCopy = selectedIntent ? intentCopy[selectedIntent] : defaultCopy;
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalFormVersion, setGeneralFormVersion] = useState(0);
  const [b2cForm, setB2CForm] = useState(initialB2CFormState);
  const [b2cSubmitAttempted, setB2CSubmitAttempted] = useState(false);
  const [corporateForm, setCorporateForm] = useState(initialCorporateFormState);
  const [corporateStepIndex, setCorporateStepIndex] = useState(0);
  const [corporateAttempts, setCorporateAttempts] =
    useState<Record<CorporateStepId, boolean>>(emptyCorporateAttempts);
  const [corporateFinalAttempted, setCorporateFinalAttempted] = useState(false);

  useEffect(() => {
    setSelectedIntent(initialIntent);
    setSubmittedUrl(null);
  }, [initialIntent]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextUrl =
      selectedIntent === 'trip' || selectedIntent === 'corporate'
        ? `/contact?intent=${selectedIntent}`
        : '/contact';

    window.history.replaceState(window.history.state, '', nextUrl);
  }, [selectedIntent]);

  const b2cErrors = b2cSubmitAttempted ? validateB2CForm(b2cForm) : {};
  const corporateErrors = validateCorporateForm(corporateForm);

  const updateB2C = <K extends keyof B2CFormState>(field: K, value: B2CFormState[K]) => {
    setB2CForm((current) => {
      if (field === 'destinationMode' && value !== 'I have a destination in mind') {
        return { ...current, destinationMode: value as string, destinationName: '' };
      }

      return { ...current, [field]: value };
    });
  };

  const updateCorporate = <K extends keyof CorporateFormState>(
    field: K,
    value: CorporateFormState[K]
  ) => {
    setCorporateForm((current) => {
      if (field === 'destinationMode' && value !== 'I have a destination in mind') {
        return { ...current, destinationMode: value as string, destinationName: '' };
      }

      return { ...current, [field]: value };
    });
  };

  const openWhatsApp = (message: string, popup?: Window | null) => {
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);
    setSubmittedUrl(url);

    if (popup && !popup.closed) {
      popup.location.href = url;
      return;
    }

    const nextPopup = window.open(url, '_blank', 'noopener,noreferrer');

    if (!nextPopup) {
      window.location.href = url;
    }
  };

  const submitB2C = async () => {
    setB2CSubmitAttempted(true);

    const nextErrors = validateB2CForm(b2cForm);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const popup = window.open('', '_blank');
    setIsSubmitting(true);
    try {
      const affiliateCode = getStoredAffiliateCode();
      const affiliateSessionId = getStoredAffiliateSessionId();
      const message = buildB2CWhatsAppMessage(b2cForm);
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...buildB2CEnquiryPayload(b2cForm, affiliateCode),
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          ...(affiliateSessionId ? { affiliateSessionId } : {}),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'We could not save your trip brief right now. Please try again in a moment.');
      }

      openWhatsApp(message, popup);
    } catch (error) {
      popup?.close();
      console.error('Failed to save B2C enquiry:', error);
      toast.error('We could not save your trip brief right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCorporateStep = CORPORATE_STEPS[corporateStepIndex];

  const moveCorporateNext = () => {
    const currentStepErrors = getCorporateStepErrors(corporateForm, currentCorporateStep.id);
    setCorporateAttempts((current) => ({ ...current, [currentCorporateStep.id]: true }));

    if (Object.keys(currentStepErrors).length > 0) {
      return;
    }

    setCorporateStepIndex((current) => Math.min(current + 1, CORPORATE_STEPS.length - 1));
  };

  const submitCorporate = async () => {
    setCorporateFinalAttempted(true);
    setCorporateAttempts({
      overview: true,
      attendees: true,
      'stay-travel': true,
      'meetings-av': true,
      'food-social': true,
      activities: true,
      'budget-contact': true,
    });

    if (Object.keys(corporateErrors).length > 0) {
      const firstInvalidStepIndex = CORPORATE_STEPS.findIndex((step) => {
        const stepErrors = getCorporateStepErrors(corporateForm, step.id);
        return Object.keys(stepErrors).length > 0;
      });

      if (firstInvalidStepIndex >= 0) {
        setCorporateStepIndex(firstInvalidStepIndex);
      }

      return;
    }

    const popup = window.open('', '_blank');
    setIsSubmitting(true);
    try {
      const affiliateCode = getStoredAffiliateCode();
      const affiliateSessionId = getStoredAffiliateSessionId();
      const message = buildCorporateWhatsAppMessage(corporateForm);
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...buildCorporateEnquiryPayload(corporateForm, affiliateCode),
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          ...(affiliateSessionId ? { affiliateSessionId } : {}),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'We could not save your corporate brief right now. Please try again in a moment.');
      }

      openWhatsApp(message, popup);
    } catch (error) {
      popup?.close();
      console.error('Failed to save corporate enquiry:', error);
      toast.error('We could not save your corporate brief right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCorporateError = (field: keyof CorporateFormState) => {
    const stepId = fieldToCorporateStep[field];
    if (!corporateFinalAttempted && !corporateAttempts[stepId]) {
      return undefined;
    }

    return corporateErrors[field];
  };

  const selectIntent = (intent: ContactIntent) => {
    setSelectedIntent(intent);
    setSubmittedUrl(null);
  };

  const resetActiveIntent = () => {
    setSubmittedUrl(null);

    if (selectedIntent === 'trip') {
      setB2CForm(initialB2CFormState);
      setB2CSubmitAttempted(false);
      return;
    }

    if (selectedIntent === 'corporate') {
      setCorporateForm(initialCorporateFormState);
      setCorporateStepIndex(0);
      setCorporateAttempts(emptyCorporateAttempts);
      setCorporateFinalAttempted(false);
      return;
    }

    if (selectedIntent === 'general') {
      setGeneralFormVersion((current) => current + 1);
    }
  };

  const renderActiveForm = () => {
    if (submittedUrl && selectedIntent) {
      return (
        <InquirySuccessState
          title={intentCopy[selectedIntent].successTitle}
          description={intentCopy[selectedIntent].successDescription}
          submittedUrl={submittedUrl}
          onReset={resetActiveIntent}
        />
      );
    }

    if (selectedIntent === 'trip') {
      return (
        <B2CForm
          form={b2cForm}
          errors={b2cErrors}
          isSubmitting={isSubmitting}
          onChange={updateB2C}
          onSubmit={submitB2C}
        />
      );
    }

    if (selectedIntent === 'corporate') {
      return (
        <CorporateForm
          form={corporateForm}
          activeStepIndex={corporateStepIndex}
          getError={getCorporateError}
          isSubmitting={isSubmitting}
          onChange={updateCorporate}
          onBack={() => setCorporateStepIndex((current) => Math.max(current - 1, 0))}
          onNext={moveCorporateNext}
          onSubmit={submitCorporate}
        />
      );
    }

    if (selectedIntent === 'general') {
      return (
        <GeneralContactForm
          key={generalFormVersion}
          whatsappNumber={settings.whatsappNumber}
          onSuccess={setSubmittedUrl}
          honeypotRef={honeypotRef}
        />
      );
    }

    return (
      <div className="rounded-[28px] border border-dashed border-teal/20 bg-[#F7FBFC] px-6 py-10 text-center">
        <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
          Choose A Path
        </p>
        <h3 className="mb-3 font-display text-[28px] font-bold text-void">Start with your intent</h3>
        <p className="mx-auto max-w-[520px] font-body text-[15px] leading-relaxed text-void/65">
          Select the option that matches what you need and the form below will switch instantly. Every path still saves
          to Firebase and lands in your admin enquiries dashboard.
        </p>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(30deg); }
          100% { transform: translateX(150%) skewX(30deg); }
        }
      `}</style>

      <main className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-teal pb-32 pt-40 md:pb-48 md:pt-56">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/40 to-transparent" />
          <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-lime/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-cyan/20 blur-[100px]" />

          <div className="relative mx-auto max-w-[860px] px-[24px] text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest text-lime backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-lime" />
              {pageCopy.badge}
            </div>
            <h1 className="mb-6 font-display text-[44px] font-bold leading-[1.1] text-white md:text-[72px]">
              {pageCopy.title}
            </h1>
            <p className="font-body text-[16px] leading-relaxed text-white/80 md:text-[20px]">
              {pageCopy.description}
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-12 rounded-t-[40px] bg-white pt-16 shadow-[0_-20px_40px_rgba(0,0,0,0.04)] md:-mt-20 md:rounded-t-[60px] md:pt-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-6 pb-24 lg:grid-cols-12 lg:gap-20 md:pb-32">
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="mb-4 font-display text-[32px] font-bold leading-tight text-void md:text-[40px]">
                  {pageCopy.formTitle}
                </h2>
                <p className="font-body text-[16px] text-void/60">{pageCopy.formDescription}</p>
              </div>

              <IntentChooser selectedIntent={selectedIntent} onSelect={selectIntent} />

              {selectedIntent && (
                <div className="mb-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIntent(null);
                      setSubmittedUrl(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-void/10 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-widest text-void/70 transition-colors hover:border-teal/30 hover:text-teal"
                  >
                    Choose A Different Enquiry
                  </button>
                </div>
              )}

              <HoneypotField inputRef={honeypotRef} />
              {renderActiveForm()}
            </div>

            <div className="lg:col-span-5">
              <ContactRail
                intent={selectedIntent}
                contactEmail={settings.contactEmail}
                contactPhone={settings.contactPhone}
                whatsappNumber={settings.whatsappNumber}
                address={settings.address}
                workingHours={settings.workingHours}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
