'use client';

import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

export default function ShareButtons({ title, url }: { title: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-[16px] py-[32px] border-y border-[rgba(34,30,42,0.1)] my-[32px]">
      <span className="font-display text-[#718096] font-bold text-[12px] uppercase tracking-widest mr-[8px]">Share:</span>
      
      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-none border border-[rgba(34,30,42,0.15)] hover:border-[#25D366] hover:text-[#25D366] transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <span className="font-display text-[11px] font-bold uppercase tracking-widest">WhatsApp</span>
      </a>

      <button 
        onClick={handleCopy}
        className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-none border border-[rgba(34,30,42,0.15)] hover:border-[#285056] hover:text-[#285056] transition-colors group"
      >
        <Link2 size={16} className="opacity-70 group-hover:opacity-100" />
        <span className="font-display text-[11px] font-bold uppercase tracking-widest">
          {copied ? 'Copied!' : 'Copy Link'}
        </span>
      </button>

      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-none border border-[rgba(34,30,42,0.15)] hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
        <span className="font-display text-[11px] font-bold uppercase tracking-widest">Twitter</span>
      </a>
    </div>
  );
}
