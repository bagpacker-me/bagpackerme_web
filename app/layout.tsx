import type { Metadata } from 'next';
import { Outfit, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/globals.css';

// ── DESIGN-SYSTEM FONT STACK ──────────────────────────────────────────────────
// MASTER.md §2 — Font Families
// Outfit         → --font-display  (headings, nav, labels, badges, buttons)
// DM Sans      → --font-body     (body paragraphs, card descriptions, UI copy)
// Cormorant Garamond → --font-accent (pull quotes, taglines, italic script ONLY)
// ─────────────────────────────────────────────────────────────────────────────

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bagpackerme.com'),
  title: {
    default: 'BagPackerMe - Curated Global Journeys',
    template: '%s | BagPackerMe',
  },
  description: 'Curated experiential journeys across Thailand, Vietnam, Kenya, India, and beyond with local expertise and human planning.',
  icons: {
    icon: '/logo_b.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bagpackerme.com',
    siteName: 'BagPackerMe',
    title: 'BagPackerMe - Curated Global Journeys',
    description: 'Curated experiential journeys across Thailand, Vietnam, Kenya, India, and beyond.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BagPackerMe - Curated Global Journeys',
    description: 'Curated experiential journeys across Thailand, Vietnam, Kenya, India, and beyond.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${cormorantGaramond.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
