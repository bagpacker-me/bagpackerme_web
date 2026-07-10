'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

const companyLinks = [
  { name: 'Global Trips', href: '/packages' },
  { name: 'India Trips', href: '/in/packages' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Corporate Retreats', href: '/contact?intent=corporate' },
  { name: 'Affiliate Program', href: '/affiliate' },
  { name: 'Contact', href: '/contact' },
];

export function Footer() {
  const settings = useSiteSettings();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const instagramUrl = settings.instagramUrl;
  const youtubeUrl = settings.youtubeUrl;
  const twitterUrl = settings.twitterUrl;
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}`;
  const address = settings.address;
  const contactEmail = settings.contactEmail;
  const contactPhone = settings.contactPhone;

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      const { toast } = await import('react-hot-toast');
      setIsSubscribing(true);
      const { subscribeToNewsletter } = await import('@/lib/firestore');
      await subscribeToNewsletter(email);
      toast.success("Thanks for subscribing! We'll be in touch.");
      setEmail('');
    } catch (error) {
      const { toast } = await import('react-hot-toast');
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="section-dark-grain pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          
          {/* Column 1 - Brand & Socials (5 columns on large screen) */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4">
              <Logo variant="text" className="origin-left scale-[1.05]" />
              <p className="text-white/60 text-sm font-body max-w-sm leading-relaxed">
                We craft intentional journeys across the world, connecting travelers with local insight and human planning.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-lime hover:border-lime transition-all duration-300 hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-lime hover:border-lime transition-all duration-300 hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-lime hover:border-lime transition-all duration-300 hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-lime hover:border-lime transition-all duration-300 hover:-translate-y-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
            
            <p className="text-white/40 text-xs font-body">
              Reach us from {address}
            </p>
          </div>

          {/* Column 2 - Quick Links (3 columns on large screen) */}
          <div className="space-y-6 lg:col-span-3">
            <h3 className="font-display text-[10px] tracking-[0.25em] text-white/40 uppercase font-bold">
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm font-body transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Newsletter & Contact (4 columns on large screen) */}
          <div className="space-y-8 lg:col-span-4">
            <div className="space-y-4">
              <h3 className="font-display text-[10px] tracking-[0.25em] text-white/40 uppercase font-bold">
                Get In Touch
              </h3>
              <div className="space-y-2 text-sm font-body text-white/75">
                <a href={`mailto:${contactEmail}`} className="hover:text-lime transition-colors block truncate">
                  {contactEmail}
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-lime transition-colors block">
                  {contactPhone}
                </a>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="font-display text-sm font-semibold text-white mb-1">
                  Join our newsletter
                </h4>
                <p className="text-xs text-white/50 font-body">
                  Weekly curations, local insights, and custom deals.
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="flex-1 relative rounded-full bg-white/5 border border-white/10 focus-within:border-lime/40 focus-within:ring-1 focus-within:ring-lime/40 transition-all p-1 flex items-center">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                    className="w-full bg-transparent text-white text-xs px-4 py-2.5 focus:outline-none placeholder:text-white/30"
                  />
                  <button 
                    type="submit" 
                    aria-label="Subscribe"
                    disabled={isSubscribing}
                    className="bg-lime text-void w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-white/35">
          <p>© {new Date().getFullYear()} BAGPACKERME. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
