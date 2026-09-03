import type { Metadata } from 'next';

// The dashboard displays affiliate-specific reporting after a code lookup. It
// is an operational tool, not a landing page, so it must never compete with
// public travel pages in search results. Keeping it crawlable lets Google read
// this directive; a robots.txt Disallow would prevent that and can leave the
// URL indexed without a snippet.
export const metadata: Metadata = {
  title: 'Affiliate Dashboard',
  robots: { index: false, follow: false },
};

export default function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
