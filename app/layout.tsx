import type { Metadata, Viewport } from 'next';
import { Outfit, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import { SITE_URL } from '@/lib/site-url';
import { DeferredAnalytics } from '@/components/providers/DeferredAnalytics';
import { ToastViewport } from '@/components/ui/ToastViewport';
import '@/styles/globals.css';

// ── DESIGN-SYSTEM FONT STACK ──────────────────────────────────────────────────
// MASTER.md §2 — Font Families
// Outfit         → --font-display  (headings, nav, labels, badges, buttons)
// DM Sans      → --font-body     (body paragraphs, card descriptions, UI copy)
// Cormorant Garamond → --font-accent (pull quotes, taglines, italic script ONLY)
// ─────────────────────────────────────────────────────────────────────────────

const outfit = Outfit({
  subsets: ['latin'],
  // The interface uses regular and bold for the initial shell. A distinct 600
  // face was fetched for a handful of below-the-fold labels, so let the browser
  // synthesize that intermediate weight rather than blocking first paint on it.
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
  // Not preloaded: the accent face is for occasional pull quotes and taglines,
  // never for anything above the fold. Preloading it put a third ~38 KB woff2
  // into the highest-priority fetch queue on every route, alongside the LCP
  // image. `display: swap` covers the brief fallback render.
  preload: false,
});

// Next's default viewport tag omits `viewport-fit`, which leaves every
// `env(safe-area-inset-*)` in the stylesheet resolving to 0 on notched phones —
// the fixed WhatsApp button, the package page's sticky enquiry bar and the hero
// controls all sat under the home indicator because of it. `cover` is what makes
// those insets report real values.
//
// No `maximumScale` / `userScalable: false`: pinch-zoom is an accessibility
// affordance and suppressing it is a WCAG 1.4.4 failure.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    // The chrome sits above a dark hero on every public route.
    { media: '(prefers-color-scheme: light)', color: '#221E2A' },
    { media: '(prefers-color-scheme: dark)', color: '#221E2A' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BagPackerMe - Curated Global Journeys',
    template: '%s | BagPackerMe',
  },
  // Destinations here mirror the actual catalogue (majority Europe and Japan,
  // plus Vietnam, Thailand, Kenya, and India), not an aspirational subset.
  description: 'Private, tailor-made journeys across Europe, Japan, Vietnam, Thailand, Kenya, and India — planned end to end by people who have run the routes.',
  // Icons come from the app/ file convention (favicon.ico, icon.png, apple-icon.png).
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'BagPackerMe',
    title: 'BagPackerMe - Curated Global Journeys',
    description: 'Private, tailor-made journeys across Europe, Japan, Vietnam, Thailand, Kenya, and India.',
  },
  // Only `card` here: hardcoding twitter.title/description stops Next from
  // auto-filling them from each page's og:title, leaving them stale sitewide.
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Document-level prefetch via the Speculation Rules API. Next already prefetches
// the RSC payload for links in the viewport; this adds the full document fetch
// on top, which is what removes the remaining navigation latency in Chromium.
//
// Deliberately `prefetch` and not `prerender`: prerender executes the target
// page's JavaScript before the user commits to the navigation, which fires
// analytics for visits that never happen and runs Firestore reads we would pay
// for regardless. `eagerness: moderate` triggers on hover/pointer-down rather
// than on sight, so it does not fan out across a 30-card listing grid.
//
// The exclusions matter: /api/ must never be speculatively fetched (side
// effects), and /admin/ plus /affiliate/dashboard are authenticated routes
// where a background fetch is wasted work at best.
const SPECULATION_RULES = JSON.stringify({
  prefetch: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/api/*' } },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/affiliate/dashboard*' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
});

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${cormorantGaramond.variable}`}
    >
      <body>
        {children}
        <ToastViewport />
        <DeferredAnalytics />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: SPECULATION_RULES }}
        />
      </body>
    </html>
  );
}
