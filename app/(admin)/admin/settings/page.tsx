'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getSiteSettings, updateSiteSettings } from '@/lib/firestore';
import type { SiteSettings } from '@/types';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<SiteSettings>();

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings();
        
        const defaultSettings = {
          contactEmail: 'partnerships@bagpackerme.com',
          contactPhone: '+91 9920992026',
          whatsappNumber: '919920992026',
          workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM (IST)',
          address: 'Mumbai, India',
          instagramUrl: 'https://instagram.com/bagpackerme',
          facebookUrl: 'https://facebook.com/bagpackerme',
          twitterUrl: 'https://twitter.com/bagpackerme',
          youtubeUrl: 'https://youtube.com/@bagpackerme',
        };

        if (settings) {
          reset({ ...defaultSettings, ...settings });
        } else {
          reset(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [reset]);

  const onSubmit = async (data: SiteSettings) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSiteSettings(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#285056] dark:text-white" />
      </div>
    );
  }

  const sectionCls = "bg-[#FFFFFF] dark:bg-[#1A1625] border border-[rgba(34,30,42,0.06)] dark:border-[rgba(255,255,255,0.06)] p-[24px] mb-[24px] rounded-[4px]";
  const labelCls = "block font-display text-[12px] font-bold text-[#718096] dark:text-[rgba(255,255,255,0.6)] uppercase tracking-widest mb-[8px]";
  const inputCls = "w-full h-[48px] px-[16px] font-body text-[14px] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.1)] text-[#221E2A] dark:text-white placeholder:text-[#A0AEC0] dark:placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C1EA00] focus:ring-1 focus:ring-[#C1EA00] outline-none transition-all rounded-[2px]";
  const textareaCls = "w-full px-[16px] py-[12px] font-body text-[14px] bg-[#F7F9FA] dark:bg-[rgba(255,255,255,0.02)] border border-[rgba(34,30,42,0.08)] dark:border-[rgba(255,255,255,0.1)] text-[#221E2A] dark:text-white placeholder:text-[#A0AEC0] dark:placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C1EA00] focus:ring-1 focus:ring-[#C1EA00] outline-none transition-all resize-none rounded-[2px]";

  return (
    <div className="max-w-[800px] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] font-bold text-[#221E2A] dark:text-white uppercase tracking-wider">
            Site Settings
          </h1>
          <p className="font-body text-[14px] text-[#718096] dark:text-[rgba(255,255,255,0.6)] mt-[4px]">
            Manage global configuration and contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
        {/* Contact Information */}
        <div className={sectionCls}>
          <div className="mb-[24px] flex items-center gap-[12px]">
            <span className="block w-[24px] h-[1px] bg-[#0ED2E9] shrink-0" />
            <h2 className="font-display text-[11px] font-bold text-[#0ED2E9] uppercase tracking-[0.22em]">
              Contact Information
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div>
              <label className={labelCls}>Contact Email</label>
              <input
                type="email"
                placeholder="partnerships@bagpackerme.com"
                className={inputCls}
                {...register('contactEmail')}
              />
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              <input
                type="text"
                placeholder="+91 99209 92026"
                className={inputCls}
                {...register('contactPhone')}
              />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <input
                type="text"
                placeholder="919920992026"
                className={inputCls}
                {...register('whatsappNumber')}
              />
              <p className="text-[11px] font-body text-[#718096] dark:text-[rgba(255,255,255,0.4)] mt-[6px]">
                Include country code without +, e.g. 919920992026
              </p>
            </div>
            <div>
              <label className={labelCls}>Working Hours</label>
              <input
                type="text"
                placeholder="Mon-Fri: 9:00 AM - 6:00 PM (IST)"
                className={inputCls}
                {...register('workingHours')}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Address</label>
              <textarea
                placeholder="Mumbai, India"
                className={textareaCls}
                rows={3}
                {...register('address')}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={sectionCls}>
          <div className="mb-[24px] flex items-center gap-[12px]">
            <span className="block w-[24px] h-[1px] bg-[#0ED2E9] shrink-0" />
            <h2 className="font-display text-[11px] font-bold text-[#0ED2E9] uppercase tracking-[0.22em]">
              Social Links
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input
                type="url"
                placeholder="https://instagram.com/bagpackerme"
                className={inputCls}
                {...register('instagramUrl')}
              />
            </div>
            <div>
              <label className={labelCls}>Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/bagpackerme"
                className={inputCls}
                {...register('facebookUrl')}
              />
            </div>
            <div>
              <label className={labelCls}>Twitter / X URL</label>
              <input
                type="url"
                placeholder="https://twitter.com/bagpackerme"
                className={inputCls}
                {...register('twitterUrl')}
              />
            </div>
            <div>
              <label className={labelCls}>YouTube URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/@bagpackerme"
                className={inputCls}
                {...register('youtubeUrl')}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[16px] pt-[8px]">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-[8px] text-[#4ade80] dark:text-[#4ade80] font-body text-[14px]"
              >
                <CheckCircle2 className="w-[18px] h-[18px]" />
                Saved successfully
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-[8px] h-[48px] px-[32px] bg-[#C1EA00] text-[#221E2A] font-body text-[14px] font-bold tracking-[0.05em] uppercase hover:bg-[#A3C700] transition-colors focus:ring-2 focus:ring-[#C1EA00] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-[2px]"
          >
            {isSaving ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Save className="w-[18px] h-[18px]" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
