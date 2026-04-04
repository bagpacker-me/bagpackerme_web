'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { createEnquiry, getSiteSettings } from '@/lib/firestore';
import { SiteSettings } from '@/types';
import Image from 'next/image';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, 'Enter a valid Indian phone number'),
  inquiryType: z.enum(
    ['Group Trip', 'Personalised Itinerary', 'Corporate Retreat', 'Media & Partnership', 'Other'] as const,
    { error: 'Please select an inquiry type' }
  ),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

// ─── Success Checkmark ────────────────────────────────────────────────────────
const SuccessState = ({ whatsappNumber = '919920992026' }: { whatsappNumber?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center py-16 gap-6"
  >
    <div className="relative flex items-center justify-center w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full bg-teal/10"
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 15 }}
      />
      <svg
        className="relative w-12 h-12 text-teal"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <motion.path
          d="M5 13l4 4L19 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
        />
      </svg>
    </div>
    <div>
      <h3 className="font-display text-void text-[28px] md:text-[32px] mb-[8px]">Message Received!</h3>
      <p className="font-body text-void/60 text-[15px] md:text-[16px] max-w-[400px]">
        Thanks for reaching out. One of our team members will get back to you shortly.
      </p>
    </div>
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-[8px] px-[24px] py-[16px] bg-[#25D366] text-white font-display font-bold text-[12px] tracking-widest uppercase rounded-full hover:bg-black transition-colors"
    >
      Or chat on WhatsApp
    </a>
  </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) setSettings(data);
      } catch (error) {
        console.error('Error fetching site settings', error);
      }
    };
    fetchSettings();
  }, []);

  const contactEmail = settings?.contactEmail || 'partnerships@bagpackerme.com';
  const contactPhone = settings?.contactPhone || '+91 9920992026';
  const whatsappNumber = settings?.whatsappNumber || '919920992026';
  const address = settings?.address || 'Mumbai, India';
  const workingHours = settings?.workingHours || 'Mon-Fri: 9:00 AM - 6:00 PM (IST)';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const { firstName, lastName, ...rest } = data;
      await createEnquiry({
        name: `${firstName} ${lastName}`,
        ...rest,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again or reach out via WhatsApp.');
    }
  };

  const fieldCls = (hasError: boolean) =>
    `w-full px-[16px] py-[16px] rounded-xl border font-body text-[15px] outline-none transition-all duration-200 ${
      hasError
        ? 'border-red-400 focus:border-red-500 animate-[shake_0.3s_ease-in-out] bg-red-50 text-red-900 placeholder-red-300'
        : 'border-void/10 bg-[#fafafa] hover:bg-white text-void placeholder-void/40 focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/5'
    }`;

  const labelCls = "block font-body text-[14px] font-medium text-void mb-2";

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>

      <main className="min-h-screen bg-white">
        {/* ── Top Header ──────────────────────────────────────────────────── */}
        <div className="relative bg-teal pt-[160px] md:pt-[200px] pb-[100px] md:pb-[140px] overflow-hidden rounded-b-[40px] md:rounded-b-[80px] mb-[60px] md:mb-[100px]">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative text-center max-w-[800px] mx-auto px-[24px]">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
                Contact Us
              </div>
              <h1 className="font-display text-white text-[44px] md:text-[72px] font-bold leading-[1.1] mb-6">
                Get in Touch with Us
              </h1>
              <p className="font-body text-white/80 text-[16px] md:text-[20px] leading-relaxed">
                Have questions about our outdoor adventures or looking to plan your next thrilling getaway? We&apos;re here to help! Reach out for any inquiries, rental assistance, or adventure advice
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Two-column Layout ────────────────────────────────────────────── */}
        <div className="max-w-[1200px] mx-auto px-[24px] pb-[80px] md:pb-[120px] grid grid-cols-1 lg:grid-cols-12 gap-[48px] md:gap-[80px] items-start">
          
          {/* ── Left: Contact Form (Takes 7 cols on layout) ───────────────── */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <h2 className="font-display text-void text-[32px] md:text-[40px] leading-tight mb-4 font-bold">
                Have Questions? We&apos;re Just a Message Away!
              </h2>
              <p className="font-body text-void/60 text-[16px]">
                Fill out the form below, and one of our team members will get back to you shortly.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessState key="success" whatsappNumber={whatsappNumber} />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        {...register('firstName')}
                        className={fieldCls(!!errors.firstName)}
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-xs text-red-500 font-body">{errors.firstName.message}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        {...register('lastName')}
                        className={fieldCls(!!errors.lastName)}
                      />
                      {errors.lastName && (
                        <p className="mt-2 text-xs text-red-500 font-body">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelCls}>E-mail</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      className={fieldCls(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-500 font-body">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 800234756"
                      {...register('phone')}
                      className={fieldCls(!!errors.phone)}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-500 font-body">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Inquiry Type (Subject) */}
                  <div>
                    <label className={labelCls}>Subject</label>
                    <select
                      id="inquiryType"
                      {...register('inquiryType')}
                      className={`${fieldCls(!!errors.inquiryType)} cursor-pointer appearance-none`}
                      defaultValue=""
                    >
                      <option value="" disabled>Choose message subject</option>
                      {['Group Trip', 'Personalised Itinerary', 'Corporate Retreat', 'Media & Partnership', 'Other'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-2 text-xs text-red-500 font-body">{errors.inquiryType.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Leave us a message..."
                      {...register('message')}
                      className={`${fieldCls(!!errors.message)} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-red-500 font-body">{errors.message.message}</p>
                    )}
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm font-body">
                      {serverError}
                    </div>
                  )}

                  <div className="flex justify-start sm:justify-end border-t border-void/5 pt-6 mt-4">
                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-[32px] py-[16px] bg-teal text-white font-body font-medium rounded-full hover:bg-teal/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-[12px]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Info Panel (Takes 5 cols) ─────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Image Banner */}
            <div className="bg-teal rounded-3xl overflow-hidden relative aspect-video md:aspect-[4/3] w-full isolate">
              <Image 
                src="/images/expert-support.png" 
                alt="Travel Expert" 
                fill 
                className="object-cover object-center mix-blend-luminosity opacity-40 z-0" 
              />
              <div className="absolute inset-0 bg-teal/40 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal/90 via-teal/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 z-20 flex flex-col p-8 md:p-10 justify-between pointer-events-none">
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4 6l8 4 8-4-8 3.5z" />
                    <path d="M2 12l10 5 10-5v5l-10 5-10-5v-5z" />
                  </svg>
                  <span className="font-display font-medium text-lg leading-none mt-1">BagPackerMe</span>
                </div>
                <h3 className="font-display text-white text-[32px] md:text-[36px] leading-[1.1] font-bold max-w-[280px]">
                  Our experts will always help you
                </h3>
              </div>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              
              {/* Email */}
              <a href={`mailto:${contactEmail}`} className="bg-teal/5 hover:bg-teal/10 transition-colors flex items-center gap-[20px] p-[20px] md:p-[24px] rounded-3xl group cursor-pointer">
                <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center text-teal shadow-sm shrink-0 transition-transform group-hover:scale-105">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-void text-[16px] mb-1">Email</p>
                  <p className="font-body text-void/60 text-[14px]">{contactEmail}</p>
                </div>
              </a>

              {/* Call */}
              <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="bg-teal/5 hover:bg-teal/10 transition-colors flex items-center gap-[20px] p-[20px] md:p-[24px] rounded-3xl group cursor-pointer">
                <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center text-teal shadow-sm shrink-0 transition-transform group-hover:scale-105">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-void text-[16px] mb-1">Call</p>
                  <p className="font-body text-void/60 text-[14px]">{contactPhone}</p>
                </div>
              </a>

              {/* Address */}
              <div className="bg-teal/5 flex items-center gap-[20px] p-[20px] md:p-[24px] rounded-3xl">
                <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center text-teal shadow-sm shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-void text-[16px] mb-1">Address</p>
                  <p className="font-body text-void/60 text-[14px]">{address}</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-teal/5 flex items-center gap-[20px] p-[20px] md:p-[24px] rounded-3xl">
                <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center text-teal shadow-sm shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-void text-[16px] mb-1">Working Hours</p>
                  <p className="font-body text-void/60 text-[14px]">{workingHours}</p>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}
