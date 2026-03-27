'use client';

import { Package } from '@/types';

export default function OverviewSection({ pkg }: { pkg: Package }) {
  const scrollToForm = () => {
    const el = document.getElementById('book');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/919920992026?text=${encodeURIComponent(`Hi, I'm interested in the ${pkg.title} trip.`)}`;

  return (
    <section id="overview" className="w-full bg-white py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
          
          {/* Main Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-teal font-display block uppercase tracking-widest font-bold">About This Journey</span>
              <div className="h-px w-12 bg-teal/30"></div>
            </div>
            
            {/* The overview HTML content from Firestore */}
            <div 
              className="prose prose-lg prose-teal max-w-none font-body text-void/80 leading-relaxed marker:text-teal"
              dangerouslySetInnerHTML={{ __html: pkg.overviewHtml }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-teal rounded-3xl p-8 lg:p-12 text-white shadow-xl">
              <div className="mb-8">
                <span className="block text-white/70 font-display text-sm uppercase tracking-widest mb-2">Price From</span>
                <div className="font-display font-bold text-4xl lg:text-5xl">
                   ₹{pkg.priceInr.toLocaleString('en-IN')}
                   <span className="text-xl text-white/70 font-light ml-2">/person</span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <span className="font-body text-white/70">Duration</span>
                  <span className="font-display font-bold">{pkg.duration}</span>
                </div>
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <span className="font-body text-white/70">Group Size</span>
                  <span className="font-display font-bold">{pkg.groupSize}</span>
                </div>
                <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
                  <span className="font-body text-white/70">Destinations</span>
                  <div className="flex flex-wrap gap-2">
                    {pkg.destinations?.map(d => (
                      <span key={d} className="bg-white/10 px-3 py-1 rounded-full text-sm font-display">{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={scrollToForm}
                  className="w-full bg-lime text-void font-display font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-lime/90 transition-colors"
                >
                  Book This Trip <span>&rarr;</span>
                </button>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-transparent border border-white/30 text-white font-display font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors text-center"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
