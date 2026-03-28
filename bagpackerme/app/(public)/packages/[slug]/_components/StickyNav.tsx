'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Highlights' }, // Added according to spec
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'inclusions', label: 'Inclusions' }, // Renamed to spec
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
      // offset for sticky nav (approx 100px to account for main nav + anchor nav)
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`w-full z-40 transition-all duration-300 ${isSticky ? 'fixed top-[72px] left-0 bg-white border-b border-[rgba(34,30,42,0.08)]' : 'absolute bottom-0 translate-y-full bg-white border-b border-[rgba(34,30,42,0.08)]'}`}
      style={{ opacity: isSticky ? 1 : 0, pointerEvents: isSticky ? 'auto' : 'none' }}
    >
      <div className="w-full h-[52px] overflow-x-auto hide-scrollbar flex items-center bg-white px-mobile md:px-desktop max-w-7xl mx-auto">
        {/* Links */}
        <nav className="flex items-center whitespace-nowrap">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(section.id, e)}
                className={`font-body text-[13px] font-medium transition-colors duration-200 py-[16px] px-[20px] relative
                  ${isActive ? 'text-[#285056]' : 'text-[#4a5568] hover:text-[#285056]'}
                `}
              >
                {section.label}
                {/* Active marker border bottom */}
                {isActive && (
                  <div className="absolute bottom-0 left-[20px] right-[20px] h-[2px] bg-[#285056]" />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
