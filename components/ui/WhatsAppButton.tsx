'use client';

/**
 * WhatsAppButton — Spec #10
 * Pulse ring: CSS keyframe animation, scale(1)→scale(1.5), opacity(0.6)→opacity(0), 2s infinite
 * Button: Framer Motion whileHover={{ scale: 1.1 }}, whileTap={{ scale: 0.95 }}
 * Spec #9: useReducedMotion guard
 */

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/firestore';

export function WhatsAppButton() {
  const pathname = usePathname();
  const isPackagePage = pathname?.startsWith('/packages/');
  const message = encodeURIComponent("Hi, I'm interested in a Bagpackerme trip!");
  
  const [whatsappNumber, setWhatsappNumber] = useState('919920992026');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data?.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      } catch (error) {
        console.error('Error fetching site settings', error);
      }
    };
    fetchSettings();
  }, []);

  const waLink = `https://wa.me/${whatsappNumber}?text=${message}`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Pulse ring keyframe */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .wa-pulse-ring {
          animation: ${shouldReduceMotion ? 'none' : 'wa-pulse 2s ease-out infinite'};
        }
      `}</style>

      <div className={`fixed right-6 z-[999] transition-all duration-300 ${isPackagePage ? 'bottom-[96px] lg:bottom-6' : 'bottom-6'}`}>
        <div className="relative group flex items-center">
          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-4 py-2 bg-void text-white text-sm font-medium shadow-lg opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
            Chat with us on WhatsApp
            <div className="absolute top-1/2 -mt-1.5 -right-1.5 w-3 h-3 bg-void transform rotate-45" />
          </div>

          {/* Pulse Ring */}
          <span
            className="wa-pulse-ring absolute inset-0 rounded-full bg-[#25D366]"
            aria-hidden="true"
          />

          {/* Button with Framer Motion scale */}
          <motion.a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg cursor-pointer"
            aria-label="Chat with us on WhatsApp"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </motion.a>
        </div>
      </div>
    </>
  );
}
