import type { Metadata } from 'next';
import { Josefin_Sans, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';

// ── DESIGN-SYSTEM FONT STACK ──────────────────────────────────────────────────
// MASTER.md §2 — Font Families
// Josefin Sans → --font-display  (headings, nav, labels, badges, buttons)
// DM Sans      → --font-body     (body paragraphs, card descriptions, UI copy)
// Cormorant Garamond → --font-accent (pull quotes, taglines, italic script ONLY)
// ─────────────────────────────────────────────────────────────────────────────

const josefinSans = Josefin_Sans({
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
    default: 'BagPackerMe — Experiential Journeys Through India',
    template: '%s | BagPackerMe',
  },
  description: 'Curated experiential journeys through India — small groups, deep immersion, real India. Culinary, Spiritual, Adventure, Heritage and more.',
  icons: {
    icon: '/logo.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bagpackerme.com',
    siteName: 'BagPackerMe',
    title: 'BagPackerMe — Experiential Journeys Through India',
    description: 'Curated experiential journeys through India — small groups, deep immersion, real India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BagPackerMe — Experiential Journeys Through India',
    description: 'Curated experiential journeys through India — small groups, deep immersion, real India.',
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
      className={`${josefinSans.variable} ${dmSans.variable} ${cormorantGaramond.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
