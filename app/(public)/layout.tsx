import { ReactNode } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';
import { PageTransition } from '../../components/layout/PageTransition';
import { SiteSettingsProvider } from '../../components/providers/SiteSettingsProvider';
import { AffiliateTrackingProvider } from '../../components/providers/AffiliateTrackingProvider';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SiteSettingsProvider>
      <AffiliateTrackingProvider />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SiteSettingsProvider>
  );
}
