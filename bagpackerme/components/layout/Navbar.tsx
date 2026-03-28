"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../ui/Logo';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Trips', href: '/trips' },
  { name: 'Retreats', href: '/retreats', isDropdown: true },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const retreatsOptions = [
  { name: 'Half-Day Retreat', price: '₹4,000/person', href: '/retreats/half-day' },
  { name: '2-Day Retreat', price: '₹7,500/person', href: '/retreats/2-day' },
  { name: 'View All Retreats', price: '', href: '/retreats' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRetreatsOpen, setIsRetreatsOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Spec #7: interpolate bg and blur via useTransform at 80px threshold
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.95]);
  const blurPx    = useTransform(scrollY, [0, 80], [0, 12]);
  // Build CSS values from motion values
  const background      = useMotionTemplate`rgba(34,30,42,${bgOpacity})`;
  const backdropFilter  = useMotionTemplate`blur(${blurPx}px)`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 border-b"
        style={
          shouldReduceMotion
            ? { background: isScrolled ? 'rgba(34,30,42,0.95)' : 'transparent' }
            : { background, backdropFilter, WebkitBackdropFilter: backdropFilter,
                borderColor: isScrolled ? 'rgba(255,255,255,0.05)' : 'transparent' }
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-[60] relative origin-left scale-[0.65] md:scale-100">
              <Logo variant="light" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.isDropdown ? (
                    <div 
                      className="flex items-center space-x-1 cursor-pointer text-white hover:text-lime transition-colors duration-200 py-2"
                      onMouseEnter={() => setIsRetreatsOpen(true)}
                      onMouseLeave={() => setIsRetreatsOpen(false)}
                    >
                      <span className="text-sm font-medium tracking-wide">{link.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isRetreatsOpen ? 'rotate-180' : ''}`} />
                      
                      {/* Dropdown */}
                      <AnimatePresence>
                        {isRetreatsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-void border border-white/10 rounded-none shadow-2xl overflow-hidden"
                          >
                            <div className="py-2">
                              {retreatsOptions.map((option) => (
                                <Link
                                  key={option.name}
                                  href={option.href}
                                  className="block px-4 py-3 hover:bg-white/10 transition-colors"
                                >
                                  <div className="text-white text-sm font-medium">{option.name}</div>
                                  {option.price && <div className="text-white/50 text-xs mt-1">{option.price}</div>}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white hover:text-lime transition-colors duration-200 relative py-2 text-sm font-medium tracking-wide"
                    >
                      {link.name}
                      {pathname === link.href && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-lime rounded-full"
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Icons & CTA (Desktop) */}
            <div className="hidden md:flex items-center space-x-6 z-[60]">
              <div className="flex items-center space-x-4">
                <a href="https://instagram.com/bagpackerme" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lime transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://wa.me/919920992026" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lime transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              <Link 
                href="/contact" 
                className="bg-lime text-void px-6 py-3 rounded-none font-display font-bold text-[11px] tracking-[0.14em] uppercase hover:bg-white transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(193,234,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                Book a Trip &rarr;
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-[60]">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-lime transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-void flex flex-col justify-center items-center px-6 overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center space-y-8 text-center mt-12 w-full py-12 min-h-full">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.isDropdown ? (
                    <div className="flex flex-col space-y-4">
                      <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{link.name}</div>
                      {retreatsOptions.map((option) => (
                        <Link
                          key={option.name}
                          href={option.href}
                          className="text-white text-3xl font-heading font-medium hover:text-lime transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {option.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white text-4xl font-heading font-bold hover:text-lime transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                className="pt-8 flex flex-col items-center space-y-8"
              >
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-lime text-void px-8 py-4 rounded-none font-display font-bold text-[11px] tracking-[0.14em] uppercase w-full max-w-xs shadow-[0_0_20px_rgba(193,234,0,0.2)]"
                >
                  Book a Trip &rarr;
                </Link>
                
                <div className="flex space-x-6">
                  <a href="https://instagram.com/bagpackerme" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lime transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="https://wa.me/919920992026" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lime transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
