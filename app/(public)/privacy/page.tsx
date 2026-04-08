import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — BagPackerMe',
  description: 'Learn how BagPackerMe collects, uses, and protects your personal information when you use our travel services.',
};

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Information You Provide',
        text: 'When you enquire about a trip, make a booking, or subscribe to our newsletter, we collect information such as your name, email address, phone number, travel preferences, and payment details. We only collect what is necessary to provide you with our services.',
      },
      {
        subtitle: 'Automatically Collected Information',
        text: 'When you visit our website, we automatically collect certain information about your device, including your IP address, browser type, pages visited, and time spent on our site. This helps us improve our website and understand how visitors use it.',
      },
      {
        subtitle: 'Cookies',
        text: 'We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our site.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'We use your information to process bookings, respond to enquiries, send trip confirmations, and provide customer support throughout your journey with us.',
      },
      {
        subtitle: 'Communications',
        text: 'With your consent, we may send you newsletters, travel inspiration, and promotional offers. You can unsubscribe at any time using the link in any email we send, or by contacting us directly.',
      },
      {
        subtitle: 'Improving Our Services',
        text: 'We analyse usage patterns and feedback to improve our website, packages, and overall service quality. Any analysis is conducted on aggregated, anonymised data wherever possible.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing Your Information',
    content: [
      {
        subtitle: 'Trusted Partners',
        text: 'To deliver your travel experience, we share necessary information with trusted accommodation providers, local guides, and transport operators. These partners are contractually obligated to protect your data and use it only to fulfil the services you have booked.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information when required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect the rights and safety of our users or the public.',
      },
      {
        subtitle: 'No Selling of Data',
        text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes. Your trust is fundamental to our business.',
      },
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: [
      {
        subtitle: 'How We Protect Your Data',
        text: 'We implement appropriate technical and organisational measures to safeguard your personal information against unauthorised access, alteration, disclosure, or destruction. Our systems use industry-standard encryption for data in transit and at rest.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including for legal, accounting, or reporting requirements. Booking records are typically retained for seven years in accordance with financial regulations.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to access the personal information we hold about you and to request corrections if it is inaccurate or incomplete. Contact us at bagpackerme.world@gmail.com to make such a request.',
      },
      {
        subtitle: 'Deletion',
        text: 'You may request that we delete your personal data, subject to certain legal obligations. We will honour such requests within 30 days, unless we are required to retain the data.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of marketing communications at any time. Functional communications related to your bookings cannot be opted out of while your booking is active.',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: [
      {
        subtitle: 'Questions or Concerns',
        text: 'If you have any questions about this Privacy Policy or how we handle your personal information, please reach out to us at bagpackerme.world@gmail.com or via WhatsApp at +91 9920992026. We aim to respond within 2 business days.',
      },
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = 'April 2025';

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative bg-teal pt-[160px] md:pt-[200px] pb-[120px] md:pb-[160px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-[800px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime font-display text-sm font-bold tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            Legal
          </div>
          <h1 className="font-display text-white text-[44px] md:text-[64px] font-bold leading-[1.1] mb-6">
            Privacy Policy
          </h1>
          <p className="font-body text-white/70 text-[16px] md:text-[18px] leading-relaxed max-w-[560px] mx-auto">
            We respect your privacy and are committed to protecting your personal information. Here&apos;s how we handle your data.
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
              <p className="font-display text-[12px] tracking-widest text-teal/70 uppercase mb-3">Questions?</p>
              <p className="text-sm text-void/70 leading-relaxed mb-4">
                Reach out — we&apos;re always happy to help.
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
            <div className="p-8 rounded-3xl bg-teal/5 border border-teal/10">
              <p className="font-body text-void/70 text-[16px] leading-relaxed">
                At <strong className="text-teal">BagpackerMe</strong>, your privacy is important to us. This Privacy Policy explains what personal information we collect, how we use it, and your rights regarding that information. By using our website or services, you agree to the practices described in this policy.
              </p>
            </div>

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-px bg-lime flex-shrink-0" />
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
                <Link href="/terms" className="text-teal hover:text-lime transition-colors font-display tracking-wide">
                  Terms of Service →
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
