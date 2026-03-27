'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Thanks for subscribing! We'll be in touch.");
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#221E2A] py-[80px]">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-4">
            Travel Stories. Destination Guides. Delivered Weekly.
          </h2>
          
          <p className="text-white/65 font-sans text-lg mb-10">
            Join 2,000+ engaged travelers across India and the world.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-[480px] mx-auto flex flex-col sm:flex-row gap-0 sm:gap-2 mb-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-white/10 border border-white/20 text-white placeholder-white/50 px-6 py-4 outline-none focus:border-brand-lime transition-colors duration-300 font-sans sm:rounded-l-md sm:rounded-r-none rounded-md mb-2 sm:mb-0"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-lime hover:bg-brand-lime/90 text-[#221E2A] font-sans font-bold text-sm tracking-widest uppercase px-8 py-4 transition-colors duration-300 sm:rounded-r-md sm:rounded-l-none rounded-md disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#221E2A] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          
          <p className="text-white/40 font-sans text-sm">
            No spam. Just real travel.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
