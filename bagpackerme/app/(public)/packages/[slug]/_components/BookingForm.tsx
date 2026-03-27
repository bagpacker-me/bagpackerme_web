'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Package } from '@/types';
import { createEnquiry } from '@/lib/firestore';
import Image from 'next/image';
import { CheckCircle2, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { groupSize: '2' }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Save to Firestore
      await createEnquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        inquiryType: 'Package Booking',
        packageSlug: pkg.slug,
        groupSize: Number(data.groupSize),
        travelDate: data.travelDate,
        message: data.message || '',
        status: 'new',
        createdAt: new Date().toISOString()
      });

      // 2. Open WhatsApp
      const waText = encodeURIComponent(`Hi! I'm ${data.name} and I'm interested in booking the "${pkg.title}" trip for ${data.groupSize} people around ${data.travelDate}.${data.message ? `\n\nExtra Info: ${data.message}` : ''}`);
      window.open(`https://wa.me/919920992026?text=${waText}`, '_blank');
      
      setIsSuccess(true);
      toast.success('Your enquiry has been sent!');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Something went wrong. Please try again or contact us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="relative w-full bg-void py-24 md:py-32 flex items-center min-h-[800px]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
         <Image src={pkg.heroImageUrl} alt="" fill className="object-cover object-bottom" />
         <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-teal font-display font-bold text-4xl md:text-5xl uppercase mb-4">Ready to Go?</h2>
            <p className="font-body text-void/60 text-lg">Leave your details and our trip experts will be in touch within 24 hours to help you plan.</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-ice rounded-2xl border border-teal/10">
               <CheckCircle2 size={64} className="text-lime mb-6" />
               <h3 className="text-teal font-display font-bold text-3xl uppercase mb-3">We&apos;ll Reach Out Shortly!</h3>
               <p className="font-body text-void/70 max-w-sm">
                 Thank you, your enquiry has been saved! You will also be redirected to WhatsApp to continue the conversation immediately.
               </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Name *</label>
                  <input {...register('name')} className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void placeholder:text-void/30 focus:ring-2 focus:ring-lime font-body" placeholder="John Doe" />
                  {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Email *</label>
                  <input {...register('email')} type="email" className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void placeholder:text-void/30 focus:ring-2 focus:ring-lime font-body" placeholder="john@example.com" />
                  {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Phone / WhatsApp *</label>
                  <input {...register('phone')} className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void placeholder:text-void/30 focus:ring-2 focus:ring-lime font-body" placeholder="+91 99209 92026" />
                  {errors.phone && <span className="text-red-500 text-sm mt-1 block">{errors.phone.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Date *</label>
                      <input {...register('travelDate')} type="month" className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void focus:ring-2 focus:ring-lime font-body min-h-[56px]" />
                      {errors.travelDate && <span className="text-red-500 text-sm mt-1 block">{errors.travelDate.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Size *</label>
                      <input {...register('groupSize')} type="number" min="1" className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void focus:ring-2 focus:ring-lime font-body min-h-[56px]" />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-display uppercase tracking-widest text-void/50 font-bold mb-2">Message (Optional)</label>
                <textarea {...register('message')} rows={4} className="w-full bg-ice border-none rounded-xl px-4 py-4 text-void placeholder:text-void/30 focus:ring-2 focus:ring-lime font-body resize-none" placeholder="Any special requirements, dietary preferences, or questions?" />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-void text-lime font-display font-bold uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-void/90 disabled:opacity-70 transition-all group"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Enquiry via WhatsApp'}
                {!isSubmitting && <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>}
              </button>
            </form>
          )}

        </div>

        {/* Contact Info */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left text-white mt-12 lg:mt-0">
          <h3 className="text-3xl font-display font-bold uppercase mb-10">Or Reach Out<br />Directly</h3>
          
          <div className="space-y-8 text-lg font-body text-white/80 w-full max-w-sm mx-auto lg:mx-0">
            <a href="tel:+919920992026" className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
              <div className="w-12 h-12 bg-lime/10 group-hover:bg-lime text-lime group-hover:text-void rounded-full flex items-center justify-center transition-colors">
                <Phone size={24} />
              </div>
              <span className="font-display group-hover:text-white">+91 99209 92026</span>
            </a>
            
            <a href="mailto:hello@bagpackerme.com" className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
              <div className="w-12 h-12 bg-lime/10 group-hover:bg-lime text-lime group-hover:text-void rounded-full flex items-center justify-center transition-colors">
                <Mail size={24} />
              </div>
              <span className="font-display group-hover:text-white">hello@bagpackerme.com</span>
            </a>
            
            <a href="https://instagram.com/bagpackerme" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
              <div className="w-12 h-12 bg-lime/10 group-hover:bg-lime text-lime group-hover:text-void rounded-full flex items-center justify-center transition-colors font-display font-bold text-xl">
                Ig
              </div>
              <span className="font-display group-hover:text-white">@bagpackerme</span>
            </a>

            <div className="flex items-center gap-6 p-4 rounded-xl">
              <div className="w-12 h-12 bg-white/5 text-white/50 rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <span className="font-display text-white/50">Mumbai, India</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
