import { ReactNode } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';
import { PageTransition } from '../../components/layout/PageTransition';
import { SiteSettingsProvider } from '../../components/providers/SiteSettingsProvider';
import { AffiliateTrackingProvider } from '../../components/providers/AffiliateTrackingProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSettingsServer } from '@/lib/site-settings-server';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/structured-data';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettingsServer();

  return (
    <SiteSettingsProvider initialSettings={settings}>
      <JsonLd data={buildOrganizationSchema(settings)} />
      <JsonLd data={buildWebSiteSchema()} />
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
