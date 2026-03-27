'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { createEnquiry } from '@/lib/firestore';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
const SuccessState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center py-16 gap-6"
  >
    <div className="relative flex items-center justify-center w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full bg-teal/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
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
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </svg>
    </div>
    <div>
      <h3 className="font-display text-void text-2xl mb-2">Message Received!</h3>
      <p className="font-body text-void/60 text-base max-w-sm">
        Thanks for reaching out. Kevin will get back to you personally within 24 hours.
      </p>
    </div>
    <a
      href="https://wa.me/919920992026"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-body text-sm rounded-full hover:bg-green-600 transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
      Or chat on WhatsApp
    </a>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await createEnquiry({
        ...data,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again or reach out via WhatsApp.');
    }
  };

  const fieldCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border font-body text-sm text-void placeholder-void/40 bg-white outline-none transition-all focus:ring-2 ${
      hasError
        ? 'border-red-400 ring-red-200 animate-[shake_0.3s_ease-in-out]'
        : 'border-void/15 focus:border-teal focus:ring-teal/20'
    }`;

  return (
    <>
      {/* Global shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>

      <main className="min-h-screen bg-white">
        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="bg-void py-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-display tracking-widest text-sm uppercase text-cyan mb-3">Contact</p>
            <h1 className="font-display text-white text-4xl md:text-6xl">Get in Touch</h1>
          </motion.div>
        </div>

        {/* ── Two-column Layout ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── Left: Contact Form (60%) ─────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="font-display text-teal text-3xl md:text-4xl mb-2">
                Let&apos;s Start a Conversation
              </h2>
              <p className="font-body text-void/60 text-base">
                Fill in the form below and Kevin will personally respond within 24 hours.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessState key="success" />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  {/* Name */}
                  <div>
                    <label className="block font-body text-sm font-medium text-void mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Aakash Sharma"
                      {...register('name')}
                      className={fieldCls(!!errors.name)}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 font-body">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-body text-sm font-medium text-void mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      className={fieldCls(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-body">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-body text-sm font-medium text-void mb-1.5">
                      Phone (Indian) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className={fieldCls(!!errors.phone)}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 font-body">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block font-body text-sm font-medium text-void mb-1.5">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      {...register('inquiryType')}
                      className={`${fieldCls(!!errors.inquiryType)} cursor-pointer`}
                      defaultValue=""
                    >
                      <option value="" disabled>Select an inquiry type…</option>
                      {['Group Trip', 'Personalised Itinerary', 'Corporate Retreat', 'Media & Partnership', 'Other'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-1 text-xs text-red-500 font-body">{errors.inquiryType.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-body text-sm font-medium text-void mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your travel dream, group size, dates, or any questions…"
                      {...register('message')}
                      className={`${fieldCls(!!errors.message)} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500 font-body">{errors.message.message}</p>
                    )}
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm font-body">
                      {serverError}
                    </div>
                  )}

                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-teal text-white font-display text-sm tracking-widest uppercase rounded-xl hover:bg-void transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Info Panel (40%) ──────────────────────────────────── */}
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <div className="bg-teal rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8">
                <h3 className="font-display text-white text-2xl mb-6">Contact Info</h3>

                {/* Info rows */}
                <div className="space-y-5 mb-8">
                  {/* Email */}
                  <a
                    href="mailto:partnerships@bagpackerme.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-0.5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-white/50 text-xs uppercase tracking-wider mb-0.5">Email</p>
                      <p className="font-body text-white text-sm group-hover:text-cyan transition-colors">
                        partnerships@bagpackerme.com
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-white/50 text-xs uppercase tracking-wider mb-0.5">Location</p>
                      <p className="font-body text-white text-sm">Mumbai, India</p>
                    </div>
                  </div>

                  {/* Website */}
                  <a
                    href="https://www.bagpackerme.com"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-0.5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-white/50 text-xs uppercase tracking-wider mb-0.5">Website</p>
                      <p className="font-body text-white text-sm group-hover:text-cyan transition-colors">
                        www.bagpackerme.com
                      </p>
                    </div>
                  </a>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/919920992026"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-body font-semibold text-sm rounded-xl transition-colors mb-6"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp — +91 99209 92026
                </a>

                {/* Social Icons */}
                <div className="flex gap-3 border-t border-white/10 pt-6">
                  <a
                    href="https://www.instagram.com/bagpackerme/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@BagpackerMe"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="h-52 w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Mumbai,India&t=&z=11&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mumbai, India"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
