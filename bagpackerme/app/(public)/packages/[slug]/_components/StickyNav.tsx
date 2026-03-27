'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'included', label: "What's Included" },
  { id: 'gallery', label: 'Gallery' },
  { id: 'book', label: 'Book Now' }
];

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Check if sticky
    const handleScroll = () => {
      // The hero section is 100svh. We become sticky roughly after passing it.
      setIsSticky(window.scrollY > window.innerHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // offset for sticky nav (approx 80px)
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`w-full z-40 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 bg-void/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'absolute bottom-0 translate-y-full bg-void'}`}
      style={{ opacity: isSticky ? 1 : 0, pointerEvents: isSticky ? 'auto' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => scrollToSection(section.id, e)}
              className={`font-display text-sm uppercase tracking-widest transition-colors duration-300 ${
                activeSection === section.id
                  ? 'text-lime font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile active indicator */}
        <div className="md:hidden flex items-center">
            {SECTIONS.map(s => s.id === activeSection && (
               <span key={s.id} className="text-lime font-display text-sm font-bold uppercase tracking-widest leading-none">{s.label}</span>
            ))}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => scrollToSection('book', e as unknown as React.MouseEvent)}
          className="bg-lime hover:bg-lime/90 text-void font-display font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full transition-all flex items-center gap-2"
        >
          Enquire Now <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
