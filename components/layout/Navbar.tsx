import Link from 'next/link';
import Image from 'next/image';
import { NavbarScrollChrome } from './NavbarScrollChrome';

const MENU_ITEMS = [
  { name: 'Destinations', href: '/packages' },
  { name: 'India', href: '/in' },
  { name: 'The Club', href: '/curious-club' },
  { name: 'Journal', href: '/blog' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

/**
 * Navigation is server-rendered so the logo, route links and primary contact
 * action are available before JavaScript. The native details disclosure keeps
 * the mobile menu usable on slow connections; the tiny client helper only
 * applies the visual scroll treatment after first paint.
 */
export function Navbar() {
  return (
    <header>
      <nav className="fixed left-0 top-0 z-[1000] w-full px-[max(1rem,env(safe-area-inset-left))] pt-[env(safe-area-inset-top)] pr-[max(1rem,env(safe-area-inset-right))]">
        <NavbarScrollChrome />
        <div
          data-nav-surface
          data-scrolled="false"
          className="mx-auto mt-4 max-w-6xl rounded-full bg-transparent px-4 transition-all duration-300 data-[scrolled=true]:border data-[scrolled=true]:border-white/10 data-[scrolled=true]:bg-teal/90 data-[scrolled=true]:px-6 data-[scrolled=true]:shadow-[0_8px_32px_rgba(40,80,86,0.18)] data-[scrolled=true]:backdrop-blur-xl"
        >
          <div className="relative flex items-center justify-between py-4">
            <Link
              href="/"
              aria-label="BagPackerMe home"
              className="-mx-2 flex min-h-[44px] items-center rounded-full px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <Image
                src="/logo_w.webp"
                alt="BagPackerMe"
                width={512}
                height={512}
                sizes="36px"
                loading="eager"
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />
            </Link>

            <ul className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-8 font-body text-sm xl:flex">
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded py-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-content-inverse-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="z-[101] flex items-center gap-4">
              <Link
                href="/contact#trip"
                className="hidden rounded-full bg-lime px-6 py-3 font-display text-[11px] font-bold uppercase tracking-widest text-void transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void xl:inline-flex"
              >
                Start Planning
              </Link>

              <details className="group relative xl:hidden">
                <summary
                  aria-label="Toggle site navigation"
                  aria-controls="mobile-navigation"
                  className="mobile-menu-toggle relative z-[100] -mr-2 flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full text-white transition-colors hover:text-lime group-open:bg-void/80 group-open:text-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <span className="relative h-5 w-6" aria-hidden="true">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-[7px] rounded bg-current transition-transform duration-200 group-open:translate-y-0 group-open:rotate-45" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded bg-current transition-opacity duration-200 group-open:opacity-0" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full translate-y-[6px] rounded bg-current transition-transform duration-200 group-open:translate-y-0 group-open:-rotate-45" />
                  </span>
                </summary>
                <div
                  id="mobile-navigation"
                  className="mobile-menu-panel fixed inset-x-0 top-0 z-[99] flex h-[100dvh] overflow-y-auto overscroll-contain bg-void/95 px-8 py-24 backdrop-blur-2xl md:px-16"
                >
                  <div className="m-auto w-full max-w-md">
                    <ul className="flex flex-col gap-4 font-display text-2xl font-bold uppercase tracking-[0.15em]">
                      {MENU_ITEMS.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded py-3 text-content-inverse-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact#trip"
                      className="mt-12 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-lime px-6 py-3 font-display text-[12px] font-bold uppercase tracking-widest text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                    >
                      Start Planning
                    </Link>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
