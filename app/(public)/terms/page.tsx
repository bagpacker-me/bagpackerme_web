import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — BagPackerMe',
  description: 'Read the terms and conditions that govern your use of BagPackerMe\'s travel services and website.',
};

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing our website or using any of our services, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our website or services.',
      },
      {
        subtitle: 'Changes to Terms',
        text: 'BagpackerMe reserves the right to modify these terms at any time. We will notify you of significant changes via email or a prominent notice on our website. Continued use of our services after changes are posted constitutes your acceptance of the revised terms.',
      },
    ],
  },
  {
    id: 'bookings',
    title: 'Bookings & Payments',
    content: [
      {
        subtitle: 'Booking Confirmation',
        text: 'A booking is confirmed only upon receipt of the required deposit and written confirmation from BagpackerMe. We reserve the right to decline any booking at our discretion. All prices are quoted in Indian Rupees (INR) unless stated otherwise.',
      },
      {
        subtitle: 'Deposit & Full Payment',
        text: 'A non-refundable deposit (typically 25–30% of the package price) is required to confirm your booking. The remaining balance is due no later than 30 days before your departure date. Bookings made within 30 days of departure must be paid in full at the time of booking.',
      },
      {
        subtitle: 'Pricing',
        text: 'All package prices are as listed at the time of booking. We reserve the right to adjust prices prior to confirmation due to currency fluctuations, fuel surcharges, or other factors outside our control. Once your booking is confirmed and deposit received, the price is guaranteed.',
      },
    ],
  },
  {
    id: 'cancellations',
    title: 'Cancellations & Refunds',
    content: [
      {
        subtitle: 'Cancellation by You',
        text: 'Cancellations must be made in writing to bagpackerme.world@gmail.com. The following charges apply: More than 45 days before departure — loss of deposit only. 30–44 days before departure — 50% of the total package cost. 15–29 days before departure — 75% of the total package cost. Less than 15 days before departure — 100% of the total package cost (no refund).',
      },
      {
        subtitle: 'Cancellation by BagpackerMe',
        text: 'In the unlikely event that we must cancel your trip due to circumstances beyond our control (e.g. natural disasters, political unrest, or insufficient bookings), we will offer you either a full refund of all payments made or an alternative trip of equivalent value.',
      },
      {
        subtitle: 'Travel Insurance',
        text: 'We strongly recommend that all travellers purchase comprehensive travel insurance that covers cancellation, medical expenses, and personal liability. BagpackerMe is not responsible for any costs incurred due to inadequate travel insurance.',
      },
    ],
  },
  {
    id: 'responsibilities',
    title: 'Traveller Responsibilities',
    content: [
      {
        subtitle: 'Health & Fitness',
        text: 'You are responsible for ensuring you are physically fit to undertake the activities in your chosen package. We recommend consulting a medical professional before participating in physically demanding itineraries. You must inform us of any relevant medical conditions at the time of booking.',
      },
      {
        subtitle: 'Documentation',
        text: 'You are solely responsible for ensuring you have valid travel documents, including passports, visas, and any required permits. BagpackerMe accepts no liability for any issues arising from invalid or missing documentation.',
      },
      {
        subtitle: 'Conduct',
        text: 'We expect all travellers to behave respectfully towards fellow travellers, local communities, and the natural environment. BagpackerMe reserves the right to remove any traveller from a trip without refund if their conduct is deemed disruptive, dangerous, or culturally disrespectful.',
      },
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: [
      {
        subtitle: 'Force Majeure',
        text: 'BagpackerMe shall not be liable for any failure or delay in performance resulting from circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, government actions, civil unrest, or infrastructure failures.',
      },
      {
        subtitle: 'Third-Party Services',
        text: 'We act as an organiser and coordinator for your travel experience. While we carefully select our partners, we are not liable for the acts or omissions of third-party service providers such as airlines, hotels, or local guides.',
      },
      {
        subtitle: 'Maximum Liability',
        text: 'To the maximum extent permitted by law, BagpackerMe\'s total liability for any claim arising from our services shall not exceed the total amount you paid for the specific package that is the subject of the claim.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Our Content',
        text: 'All content on this website — including text, images, videos, logos, and itineraries — is the property of BagpackerMe and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content without prior written permission.',
      },
      {
        subtitle: 'User-Generated Content',
        text: 'By sharing photos, reviews, or other content with us (e.g., via social media tags or direct submission), you grant BagpackerMe a non-exclusive, royalty-free licence to use, display, and promote such content in connection with our services.',
      },
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: [
      {
        subtitle: 'Jurisdiction',
        text: 'These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.',
      },
      {
        subtitle: 'Dispute Resolution',
        text: 'We encourage you to contact us directly before pursuing any formal legal action. We are committed to resolving disputes fairly and efficiently. Most issues can be resolved through a straightforward conversation with our team.',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    content: [
      {
        subtitle: 'Get in Touch',
        text: 'If you have any questions about these Terms of Service, please contact us at bagpackerme.world@gmail.com or via WhatsApp at +91 9920992026. We are here to help and aim to respond to all enquiries within 2 business days.',
      },
    ],
  },
];

export default function TermsPage() {
  const lastUpdated = 'April 2025';

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative bg-void pt-[160px] md:pt-[200px] pb-[120px] md:pb-[160px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal/20 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-[800px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            Legal
          </div>
          <h1 className="font-display text-white text-[44px] md:text-[64px] font-bold leading-[1.1] mb-6">
            Terms of Service
          </h1>
          <p className="font-body text-white/70 text-[16px] md:text-[18px] leading-relaxed max-w-[560px] mx-auto">
            These terms outline the rules and guidelines governing your use of BagpackerMe&apos;s services. Please read them carefully.
          </p>
          <p className="mt-6 text-white/40 text-sm font-display tracking-widest uppercase">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 py-[80px] md:py-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16 items-start">

          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <p className="font-display text-[11px] tracking-widest text-void/40 uppercase mb-5">
              On this page
            </p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group flex items-center gap-3 py-2 text-sm font-body text-void/60 hover:text-teal transition-colors"
                >
                  <span className="w-5 h-px bg-void/20 group-hover:bg-teal group-hover:w-8 transition-all duration-300 flex-shrink-0" />
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="mt-10 p-5 rounded-2xl bg-ice border border-teal/10">
              <p className="font-display text-[12px] tracking-widest text-teal/70 uppercase mb-3">Need Help?</p>
              <p className="text-sm text-void/70 leading-relaxed mb-4">
                Questions about our terms? We&apos;re happy to clarify.
              </p>
              <a
                href="mailto:bagpackerme.world@gmail.com"
                className="block text-sm font-bold text-teal hover:text-lime transition-colors break-all"
              >
                bagpackerme.world@gmail.com
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-16">
            {/* Intro */}
            <div className="p-8 rounded-3xl bg-void/5 border border-void/10">
              <p className="font-body text-void/70 text-[16px] leading-relaxed">
                Welcome to <strong className="text-teal">BagpackerMe</strong>. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website and travel services. By booking a trip or accessing our website, you enter into a binding agreement with BagpackerMe. Please read these terms carefully before making any booking.
              </p>
            </div>

            {sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-teal text-[11px] font-bold">{idx + 1}</span>
                  </div>
                  <h2 className="font-display text-void text-[26px] md:text-[32px] font-bold">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl border border-void/5 bg-[#fafafa] hover:border-teal/10 hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                      <h3 className="font-display text-teal text-[15px] font-bold tracking-wide mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="font-body text-void/70 text-[15px] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Footer links */}
            <div className="pt-8 border-t border-void/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-sm text-void/40 font-body">
                © {new Date().getFullYear()} BagpackerMe. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy" className="text-teal hover:text-lime transition-colors font-display tracking-wide">
                  Privacy Policy →
                </Link>
                <Link href="/contact" className="text-void/50 hover:text-teal transition-colors font-display tracking-wide">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
