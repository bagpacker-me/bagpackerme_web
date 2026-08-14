'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const MOBILE_MENU_ID = 'mobile-navigation';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isBlogDetail = pathname?.startsWith('/blog/') && pathname !== '/blog';
  const isIndiaRoute = pathname === '/in' || pathname?.startsWith('/in/');
  const marketBase = isIndiaRoute ? '/in' : '';
  const menuItems = [
    { name: 'Destinations', href: `${marketBase}/packages` },
    { name: isIndiaRoute ? 'Global' : 'India', href: isIndiaRoute ? '/' : '/in' },
    { name: 'The Club', href: '/curious-club' },
    { name: 'Journal', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // A full-screen overlay that leaves the page scrolling underneath is the
  // classic mobile drawer bug: the visitor swipes to reach the last link and
  // the content behind moves instead. Locking the body — and compensating for
  // the scrollbar width so desktop doesn't shift — keeps the drawer static.
  useEffect(() => {
    if (!menuOpen) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [menuOpen]);

  // Escape to dismiss, and Tab held inside the panel. Without the trap, tabbing
  // past the last link walks into the page behind the overlay, where focus is
  // invisible and every stop is a link the visitor cannot see.
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Move focus into the panel so a keyboard or screen-reader user lands on the
    // menu they just opened rather than staying behind it.
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  if (isBlogDetail) {
    return null;
  }

  return (
    <header>
      {/* The horizontal padding tracks the safe-area insets so the bar clears the
          rounded corners and the notch when a phone is held in landscape. */}
      <nav className="fixed top-0 left-0 z-[100] w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)] group transition-all duration-300 pointer-events-none">
        <div className={cn(
          'mx-auto mt-4 max-w-6xl transition-all duration-500 pointer-events-auto',
          isScrolled 
            ? 'bg-teal/90 max-w-4xl rounded-full border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(40,80,86,0.18)] px-6' 
            : 'bg-transparent px-4'
        )}>
          <div className="relative flex items-center justify-between py-4">
            <Link
              href={isIndiaRoute ? '/in' : '/'}
              aria-label="BagPackerMe home"
              // The mark itself stays 32px; the link box is padded out to a
              // 44px target and pulled back by the same amount so the logo does
              // not visually shift.
              className="flex min-h-[44px] items-center -mx-2 px-2 space-x-2 transition-opacity hover:opacity-85 z-[101] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <Image
                src="/logo_w.webp"
                alt="BagPackerMe"
                // The real asset is a 512×512 backpack mark. It was declared
                // 150×30 — wordmark proportions — so `w-auto` resolved against
                // the *intrinsic* 1:1 ratio and the mark rendered as a 24px
                // stamp inside a box reserved for something five times wider.
                width={512}
                height={512}
                // Eager, but deliberately not `priority`: a preload hint here
                // put the logo in front of the hero image in the browser's
                // early fetch queue, delaying the LCP for nothing.
                loading="eager"
                // Without this Next served a 256px-wide file for a 36px mark.
                sizes="36px"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
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
                <Link href="/contact?intent=trip">Start Planning</Link>
              </Button>

              <button
                ref={toggleRef}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls={MOBILE_MENU_ID}
                // 44×44, negatively margined so the icon keeps its original
                // optical position while the target reaches finger size.
                className="relative flex h-11 w-11 -mr-2 items-center justify-center lg:hidden text-white hover:text-lime transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-full"
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
        {menuOpen && (
            <div
              ref={panelRef}
              id={MOBILE_MENU_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              // `dvh` rather than `inset-0`: on iOS the URL bar collapses as the
              // page scrolls and a viewport-height panel measured in `vh` gets
              // clipped by it. `overflow-y-auto` plus vertical padding means the
              // menu still reaches every link in landscape, where five items and
              // a button do not fit a 390px-tall screen at all.
              className="mobile-menu-panel fixed inset-x-0 top-0 h-[100dvh] overflow-y-auto overscroll-contain bg-void/95 backdrop-blur-2xl transition-all duration-300 lg:hidden pointer-events-auto z-[99] flex flex-col justify-center px-8 py-24 md:px-16"
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

              <div className="flex flex-col max-w-md w-full mx-auto relative z-10 my-auto">
                <ul className="flex flex-col gap-4 text-2xl font-display font-bold uppercase tracking-[0.15em]">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                    return (
                      <li
                        key={index}
                        className="mobile-menu-item"
                        style={{ animationDelay: `${100 + index * 70}ms` }}
                      >
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            "block py-3 transition-colors focus-visible:outline-none focus-visible:text-lime",
                            isActive ? "text-lime" : "text-white/80 hover:text-white"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mobile-menu-item mt-12 w-full" style={{ animationDelay: '380ms' }}>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-lime text-void hover:bg-lime/90 rounded-full font-bold font-display tracking-widest text-[12px] uppercase transition-all duration-300 hover:shadow-[0_8px_32px_rgba(193,234,0,0.3)] active:scale-[0.98]"
                  >
                    <Link href="/contact?intent=trip">Start Planning</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
      </nav>
    </header>
  );
}
