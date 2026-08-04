import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// page.tsx is a client component and cannot export metadata, so the noindex
// lives here. This route shows one partner's own click/lead/booking totals,
// reached via a shareable ?code= query — there is nothing here for search, and
// leaving it indexable exposes partner performance data. robots.ts also
// disallows the path; this header is what actually keeps it out of the index
// if a URL is discovered through a link rather than a crawl.
export const metadata: Metadata = {
  title: 'Affiliate Dashboard',
  robots: { index: false, follow: false },
};

export default function AffiliateDashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
