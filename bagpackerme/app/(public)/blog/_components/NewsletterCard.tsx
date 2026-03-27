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
    <div className="bg-brand-teal p-8 md:p-12 rounded-2xl shadow-md text-white my-12 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-void/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-grow text-center md:text-left">
          <Mail className="mb-4 opacity-80 mx-auto md:mx-0" size={36} />
          <h3 className="font-heading font-bold text-3xl mb-2">Join Our Newsletter</h3>
          <p className="font-sans text-teal-50 text-base max-w-md">
            Get destination guides, tips, and inspiration delivered straight to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Your email address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-64 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors font-sans text-base"
          />
          <button 
            type="submit" 
            disabled={isSubscribing}
            className="w-full sm:w-auto bg-[#18151D] text-white font-sans font-bold py-3 px-6 rounded-lg hover:bg-black transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
}
