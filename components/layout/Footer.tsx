import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

const exploreLinks = [
  { name: 'All Packages', href: '/packages' },
  { name: 'Culinary Trail', href: '/packages' },
  { name: 'Spiritual Circuit', href: '/packages' },
  { name: 'Adventure Route', href: '/packages' },
  { name: 'Heritage Walk', href: '/packages' },
  { name: 'Hippy Trail', href: '/packages' },
];

const companyLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Media', href: '/media' },
  { name: 'Partnerships', href: '/partnerships' },
  { name: 'Contact', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="bg-void text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1 - Brand */}
          <div className="space-y-6">
            <Logo variant="light" className="origin-left" />
            <p className="text-white/80 text-sm">
              Experiential Journeys Through India
            </p>
            <div className="flex items-center flex-wrap gap-2 text-white/80">
              <a href="https://instagram.com/bagpackerme" target="_blank" rel="noopener noreferrer" className="hover:text-cyan hover:-translate-y-0.5 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="https://youtube.com/@bagpackerme" target="_blank" rel="noopener noreferrer" className="hover:text-cyan hover:-translate-y-0.5 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a href="https://twitter.com/bagpackerme" target="_blank" rel="noopener noreferrer" className="hover:text-cyan hover:-translate-y-0.5 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://wa.me/919920992026" target="_blank" rel="noopener noreferrer" className="hover:text-cyan hover:-translate-y-0.5 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
            <p className="text-white/60 text-sm">
              Based in Mumbai, India
            </p>
          </div>

          {/* Column 2 - Trips */}
          <div className="space-y-6">
            <h3 className="font-heading text-[11px] tracking-widest text-white/50 uppercase">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link link-underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="space-y-6">
            <h3 className="font-heading text-[11px] tracking-widest text-white/50 uppercase">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link link-underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div className="space-y-6 flex flex-col items-start lg:col-span-1">
            <h3 className="font-heading text-[11px] tracking-widest text-white/50 uppercase">Get In Touch</h3>
            <div className="space-y-2 text-sm text-white/80 flex flex-col items-start w-full">
              <a href="mailto:partnerships@bagpackerme.com" className="hover:text-cyan transition-colors truncate w-full block">partnerships@bagpackerme.com</a>
              <a href="https://wa.me/919920992026" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors block">+91 9920992026</a>
              <a href="https://www.bagpackerme.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors block">www.bagpackerme.com</a>
            </div>
            
            <div className="pt-4 w-full">
              <p className="text-sm text-white/80 mb-3 block">Join 2,000+ travelers</p>
              <form className="relative flex items-center w-full max-w-sm rounded-none bg-white/5 border border-white/10 p-1 focus-within:border-lime/50 focus-within:ring-1 focus-within:ring-lime/50 transition-all">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  required
                  className="w-full bg-transparent text-white text-sm px-4 py-2 focus:outline-none placeholder:text-white/40"
                />
                <button 
                  type="submit" 
                  aria-label="Subscribe"
                  className="bg-lime/20 hover:bg-lime text-lime hover:text-void p-2 rounded-none transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} BAGPACKERME. All rights reserved.
          </p>
          <div className="flex space-x-6 text-white/50 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
