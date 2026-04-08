'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      const { subscribeToNewsletter } = await import('@/lib/firestore');
      await subscribeToNewsletter(email);
      toast.success("Thanks for subscribing!");
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="bg-[#285056] p-[32px] md:p-[48px] shadow-xl border border-white/10 text-white my-[48px] relative overflow-hidden group">
      <div className="absolute -top-[40px] -right-[40px] w-[160px] h-[160px] bg-white/10 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-lime/20"></div>
      <div className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] bg-[#221E2A]/20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-cyan/20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-[32px]">
        <div className="flex-grow text-center md:text-left">
          <Mail className="mb-[16px] text-lime opacity-90 mx-auto md:mx-0 drop-shadow-sm" size={36} />
          <h3 className="font-display font-bold text-[28px] mb-[8px] tracking-tight">Join Our Newsletter</h3>
          <p className="font-body text-[#E6FFFA] text-[15px] max-w-md font-light">
            Get destination guides, tips, and inspiration delivered straight to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-[12px]">
          <input 
            type="email" 
            placeholder="Your email address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-[256px] px-[24px] py-[14px] bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan focus:bg-white/10 transition-all font-body text-[15px]"
          />
          <button 
            type="submit" 
            disabled={isSubscribing}
            className="btn-lime w-full sm:w-auto whitespace-nowrap disabled:opacity-70"
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
}
