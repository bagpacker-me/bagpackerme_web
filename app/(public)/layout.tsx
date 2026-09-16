import { ReactNode } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';
import { SiteSettingsProvider } from '../../components/providers/SiteSettingsProvider';
import { AffiliateTrackingProvider } from '../../components/providers/AffiliateTrackingProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { resolveSiteSettings } from '@/lib/site-settings';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/structured-data';

export default function PublicLayout({ children }: { children: ReactNode }) {
  // These production contact details are part of the initial document. Waiting
  // for a public Firestore read here turns a cold third-party connection into
  // slower HTML/TTFB. The provider can refresh edited values after visitor
  // intent, outside the landing page's critical path.
  const settings = resolveSiteSettings(null);

  return (
    <SiteSettingsProvider initialSettings={settings}>
      <JsonLd data={buildOrganizationSchema(settings)} />
      <JsonLd data={buildWebSiteSchema()} />
      <AffiliateTrackingProvider />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* A plain div, not <main>: every public page already renders its own
            <main>, and two of them per document is invalid HTML — screen
            readers offer a "main landmark" jump that lands in the wrong place. */}
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    </SiteSettingsProvider>
  );
}
