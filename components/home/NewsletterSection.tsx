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
      const { createSubscriber } = await import('@/lib/firestore');
      await createSubscriber({
        email,
        createdAt: new Date().toISOString()
      });

      toast.success("Thanks for subscribing! We'll be in touch.");
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-teal py-[80px] relative overflow-hidden">
      {/* Grain overlay for dark section */}
      <div className="grain absolute inset-0 z-0 pointer-events-none" />
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="section-label justify-center mb-[16px]">✦ JOIN THE COMMUNITY</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-4" style={{ textWrap: 'balance', letterSpacing: '-0.02em' }}>
            Travel Stories. Destination Guides. Delivered Weekly.
          </h2>
          
          <p className="text-white/65 font-sans text-lg mb-10">
            Join 2,000+ engaged travelers across India and the world.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-[480px] mx-auto flex flex-col sm:flex-row gap-0 mb-4">
            <input
              aria-label="Email address"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            className="flex-grow bg-white/[0.07] border border-white/20 text-white placeholder-white/50 px-6 py-4 outline-none focus:border-lime focus:shadow-[0_4px_16px_rgba(193,234,0,0.15)] transition-all duration-300 font-sans rounded-none mb-2 sm:mb-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-lime hover:bg-lime/90 text-void font-display font-bold text-[13px] tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 rounded-none disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin"></div>
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
