'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Package } from '@/types';
import Image from 'next/image';
import { CheckCircle2, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredAffiliateCode, getStoredAffiliateSessionId } from '@/hooks/useAffiliateTracking';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { Field, FieldLabel, FieldInput, FieldTextarea, FieldError } from '@/components/ui/form';
import { shortPackageTitle } from '@/lib/seo';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  travelDate: z.string().min(1, 'Please select a preferred date'),
  groupSize: z.string().min(1, 'Group size must be at least 1'),
  message: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm({ pkg }: { pkg: Package }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const settings = useSiteSettings();
  const contactPhone = settings.contactPhone;
  const contactEmail = settings.contactEmail;
  const whatsappNumber = settings.whatsappNumber;
  const instagramUrl = settings.instagramUrl;
  const address = settings.address;

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { groupSize: '2' }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    // Claim the tab now, while the click still confers transient user activation.
    // Calling window.open() after the await is treated as unsolicited and gets
    // swallowed by popup blockers — which is what used to happen on this form.
    const popup = window.open('', '_blank');

    try {
      const affiliateCode = getStoredAffiliateCode();
      const affiliateSessionId = getStoredAffiliateSessionId();
      const response = await fetch('/api/package-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          packageSlug: pkg.slug,
          packageTitle: pkg.title,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          ...(affiliateCode ? { affiliateCode } : {}),
          ...(affiliateSessionId ? { affiliateSessionId } : {}),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'Something went wrong. Please try again or contact us directly on WhatsApp.');
      }

      const waText = encodeURIComponent(`Hi! I'm ${data.name} and I'm interested in the "${pkg.title}" trip for ${data.groupSize} people around ${data.travelDate}.${data.message ? `\n\nExtra Info: ${data.message}` : ''}`);
      const url = `https://wa.me/${whatsappNumber}?text=${waText}`;
      setWhatsappUrl(url);

      if (popup && !popup.closed) {
        popup.location.href = url;
      }

      setIsSuccess(true);
      toast.success('Your enquiry has been sent.');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      // Don't strand a blank tab if the submission failed.
      popup?.close();
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or contact us directly on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#F4F4F4] border border-transparent rounded-none px-[16px] py-[16px] text-[#221E2A] placeholder:text-[rgba(34,30,42,0.4)] focus:border-[#221E2A] focus:outline-none focus:ring-0 font-body text-[15px] transition-colors duration-300";
  const labelClasses = "block text-[11px] font-display uppercase tracking-widest text-[#221E2A] font-bold mb-[8px]";

  return (
    <section id="book" className="relative w-full bg-[#221E2A] py-16 md:py-24 flex items-center min-h-[800px]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
         <Image
           src={pkg.heroImageUrl}
           alt={`${pkg.title} travel landscape`}
           width={1920}
           height={1080}
           sizes="100vw"
           className="absolute inset-0 h-full w-full object-cover object-bottom"
         />
         <div className="absolute inset-0 bg-[#221E2A]/80 backdrop-blur-sm" />
         <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '256px 256px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[64px] items-center">
        
        {/* Form Card */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-none p-[32px] md:p-[48px] shadow-none">
          
          <div className="mb-[40px] text-center md:text-left">
            <h2 className="text-[#221E2A] font-display font-bold text-[clamp(2rem,3vw,2.5rem)] uppercase mb-[16px] tracking-tight leading-[1.1]">Plan {shortPackageTitle(pkg.title)}</h2>
            <p className="font-body text-[rgba(34,30,42,0.6)] text-[16px]">Leave your details and a trip expert will personally tailor this journey to you. It&apos;s a no-obligation enquiry — no payment now, no pressure to book.</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center p-[48px] bg-[#F4F4F4] rounded-none">
               <CheckCircle2 size={64} className="text-[#22c55e] mb-[24px]" />
               <h3 className="text-[#221E2A] font-display font-bold text-[24px] uppercase mb-[12px]">We&apos;ll Reach Out Shortly</h3>
               <p className="font-body text-[rgba(34,30,42,0.7)] max-w-sm text-[15px] mb-[24px]">
                 Thank you — your enquiry is saved and a trip expert will be in touch. We&apos;ve opened WhatsApp in a new tab so you can start the conversation now.
               </p>
               <a
                 href={whatsappUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-[8px] bg-[#221E2A] text-white font-display font-bold uppercase tracking-widest text-[11px] px-[24px] h-[48px] hover:bg-lime hover:text-void transition-colors duration-300"
               >
                 Didn&apos;t open? Open WhatsApp
               </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
              <HoneypotField inputRef={honeypotRef} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <Field required error={errors.name?.message}>
                  <FieldLabel className={labelClasses}>Name *</FieldLabel>
                  <FieldInput {...register('name')} className={inputClasses} placeholder="Your full name" />
                  <FieldError className="text-[#ef4444] text-[12px] font-body mt-[4px] block" />
                </Field>
                <Field required error={errors.email?.message}>
                  <FieldLabel className={labelClasses}>Email *</FieldLabel>
                  <FieldInput {...register('email')} type="email" className={inputClasses} placeholder="john@example.com" />
                  <FieldError className="text-[#ef4444] text-[12px] font-body mt-[4px] block" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <Field required error={errors.phone?.message}>
                  <FieldLabel className={labelClasses}>Phone / WhatsApp *</FieldLabel>
                  <FieldInput {...register('phone')} className={inputClasses} placeholder="Include country code, e.g. +1 555 123 4567" />
                  <FieldError className="text-[#ef4444] text-[12px] font-body mt-[4px] block" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <Field required error={errors.travelDate?.message}>
                      <FieldLabel className={labelClasses}>Date *</FieldLabel>
                      <FieldInput {...register('travelDate')} type="month" className={`${inputClasses} min-h-[56px]`} />
                      <FieldError className="text-[#ef4444] text-[12px] font-body mt-[4px] block" />
                    </Field>
                    <Field required error={errors.groupSize?.message}>
                      <FieldLabel className={labelClasses}>Size *</FieldLabel>
                      <FieldInput {...register('groupSize')} type="number" min="1" className={`${inputClasses} min-h-[56px]`} />
                      <FieldError className="text-[#ef4444] text-[12px] font-body mt-[4px] block" />
                    </Field>
                </div>
              </div>

              <Field error={errors.message?.message}>
                <FieldLabel className={labelClasses}>Message (Optional)</FieldLabel>
                <FieldTextarea {...register('message')} rows={4} className={`${inputClasses} resize-none`} placeholder="Any special requirements, dietary preferences, or questions?" />
              </Field>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#D4E839] text-[#221E2A] font-display font-bold uppercase tracking-widest text-[13px] py-[20px] px-[32px] rounded-none flex items-center justify-center gap-[12px] hover:bg-black hover:text-white disabled:opacity-70 transition-colors duration-300 group"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Enquiry via WhatsApp'}
                {!isSubmitting && <span className="group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>}
              </button>
            </form>
          )}

        </div>

        {/* Contact Info */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left text-white mt-[48px] lg:mt-0">
          <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-display font-bold uppercase mb-[40px] leading-[1.1]">Or Reach Out<br />Directly</h3>
          
          <div className="space-y-[32px] font-body text-[rgba(255,255,255,0.8)] w-full max-w-sm mx-auto lg:mx-0">
            <a href={`tel:${contactPhone}`} className="flex items-center gap-[24px] p-[16px] rounded-none hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.1)] group">
              <div className="w-[48px] h-[48px] bg-[#D4E839]/10 group-hover:bg-[#D4E839] text-[#D4E839] group-hover:text-[#221E2A] flex items-center justify-center transition-colors duration-300">
                <Phone size={24} />
              </div>
              <span className="font-display text-[16px] group-hover:text-white transition-colors duration-300">{contactPhone}</span>
            </a>
            
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-[24px] p-[16px] rounded-none hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.1)] group">
              <div className="w-[48px] h-[48px] bg-[#D4E839]/10 group-hover:bg-[#D4E839] text-[#D4E839] group-hover:text-[#221E2A] flex items-center justify-center transition-colors duration-300">
                <Mail size={24} />
              </div>
              <span className="font-display text-[16px] group-hover:text-white transition-colors duration-300">{contactEmail}</span>
            </a>
            
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[24px] p-[16px] rounded-none hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.1)] group">
              <div className="w-[48px] h-[48px] bg-[#D4E839]/10 group-hover:bg-[#D4E839] text-[#D4E839] group-hover:text-[#221E2A] flex items-center justify-center transition-colors duration-300 font-display font-bold text-xl">
                Ig
              </div>
              <span className="font-display text-[16px] group-hover:text-white transition-colors duration-300">@bagpackerme</span>
            </a>

            <div className="flex items-center gap-[24px] p-[16px] rounded-none border border-transparent">
              <div className="w-[48px] h-[48px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <span className="font-display text-[16px] text-[rgba(255,255,255,0.5)]">{address}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
