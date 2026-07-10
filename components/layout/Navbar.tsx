'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isBlogDetail = pathname?.startsWith('/blog/') && pathname !== '/blog';
  const isIndiaRoute = pathname === '/in' || pathname?.startsWith('/in/');
  const marketBase = isIndiaRoute ? '/in' : '';
  const menuItems = [
    { name: 'Destinations', href: `${marketBase}/packages` },
    { name: isIndiaRoute ? 'Global' : 'India', href: isIndiaRoute ? '/' : '/in' },
    { name: 'Journal', href: '/blog' },
    { name: 'About Us', href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isBlogDetail) {
    return null;
  }

  const menuContainerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.25 } },
  };

  return (
    <header>
      <nav className="fixed top-0 left-0 z-[100] w-full px-4 group transition-all duration-300 pointer-events-none">
        <div className={cn(
          'mx-auto mt-4 max-w-6xl transition-all duration-500 pointer-events-auto',
          isScrolled 
            ? 'bg-teal/90 max-w-4xl rounded-full border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(40,80,86,0.18)] px-6' 
            : 'bg-transparent px-4'
        )}>
          <div className="relative flex items-center justify-between py-4">
            <Link
              href={isIndiaRoute ? '/in' : '/'}
              aria-label="home"
              className="flex items-center space-x-2 transition-opacity hover:opacity-85 z-[101]"
            >
              <Image
                src="/logo_w.webp"
                alt="BagPackerMe Logo"
                width={150}
                height={30}
                priority
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav Links — Centered */}
            <div className="absolute inset-x-0 mx-auto hidden lg:block w-fit">
              <ul className="flex items-center gap-8 text-sm font-body">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                  return (
                    <li key={index} className="relative group/link">
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-2 transition-colors font-display text-[11px] font-bold tracking-[0.2em] uppercase",
                          isActive
                            ? "text-lime drop-shadow-[0_0_6px_rgba(193,234,0,0.4)]"
                            : "text-white/75 hover:text-white"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                      {/* Active indicator bar */}
                      <div className={cn(
                        "absolute -bottom-0.5 left-0 h-[1.5px] bg-lime transition-all duration-300", 
                        isActive ? "w-full" : "w-0 group-hover/link:w-full"
                      )} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Desktop CTA & Mobile Toggle */}
            <div className="flex items-center gap-4 z-[101]">
              <Button
                asChild
                size="sm"
                className="hidden lg:inline-flex bg-lime text-void hover:bg-lime/90 rounded-full px-6 font-bold font-display tracking-widest text-[11px] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(193,234,0,0.25)] active:scale-[0.98] active:translate-y-0 border-none"
              >
                <Link href="/contact?intent=trip">Book Now</Link>
              </Button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                className="relative block lg:hidden p-2 text-white hover:text-lime transition-colors"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span className={cn("w-full h-[1.5px] bg-white rounded transition-all duration-300 origin-left", menuOpen ? "rotate-45 translate-x-1" : "")} />
                  <span className={cn("w-full h-[1.5px] bg-white rounded transition-all duration-300", menuOpen ? "opacity-0" : "")} />
                  <span className={cn("w-full h-[1.5px] bg-white rounded transition-all duration-300 origin-left", menuOpen ? "-rotate-45 translate-x-1" : "")} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuContainerVariants}
              className="fixed inset-0 top-0 bg-void/95 backdrop-blur-2xl transition-all duration-300 lg:hidden pointer-events-auto z-[99] flex flex-col justify-center px-8 md:px-16"
            >
              {/* Grain pattern background */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '128px 128px',
                }}
              />

              <div className="flex flex-col max-w-md w-full mx-auto relative z-10 pt-16">
                <ul className="flex flex-col gap-6 text-2xl font-display font-bold uppercase tracking-[0.15em]">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                    return (
                      <motion.li key={index} variants={menuItemVariants}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-2 transition-colors",
                            isActive ? "text-lime" : "text-white/80 hover:text-white"
                          )}
                        >
                          {item.name}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
                <motion.div className="mt-12 w-full" variants={menuItemVariants}>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-lime text-void hover:bg-lime/90 rounded-full font-bold font-display tracking-widest text-[12px] uppercase transition-all duration-300 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
                  >
                    <Link href="/contact?intent=trip">Book Now</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
