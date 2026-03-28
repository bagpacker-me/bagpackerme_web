'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      alert("Thanks for subscribing!");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <div className="bg-[#285056] p-[32px] md:p-[48px] rounded-none shadow-sm text-white my-[48px] relative overflow-hidden">
      <div className="absolute -top-[40px] -right-[40px] w-[160px] h-[160px] bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] bg-[#221E2A]/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-[32px]">
        <div className="flex-grow text-center md:text-left">
          <Mail className="mb-[16px] opacity-80 mx-auto md:mx-0" size={36} />
          <h3 className="font-display font-bold text-[28px] mb-[8px]">Join Our Newsletter</h3>
          <p className="font-body text-[#E6FFFA] text-[15px] max-w-md">
            Get destination guides, tips, and inspiration delivered straight to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-[8px]">
          <input 
            type="email" 
            placeholder="Your email address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-[256px] px-[16px] py-[12px] rounded-none bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#0ED2E9] transition-colors font-body text-[15px]"
          />
          <button 
            type="submit" 
            disabled={isSubscribing}
            className="w-full sm:w-auto bg-lime text-[#221E2A] font-display font-bold py-[12px] px-[24px] rounded-none hover:bg-white transition-colors disabled:opacity-70 whitespace-nowrap tracking-[0.14em] uppercase text-[12px]"
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
}
