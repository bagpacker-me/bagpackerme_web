import { Package } from '@/types';
import { Check, X, Building, Utensils, Bus, Contact, Plane, Target } from 'lucide-react';

export default function WhatsIncluded({ pkg }: { pkg: Package }) {
  if (!pkg.inclusions) return null;
  const inc = pkg.inclusions;

  const items = [
    { key: 'accommodation', label: 'Accommodation', icon: Building, included: inc.accommodation },
    { key: 'meals', label: 'Meals', icon: Utensils, included: inc.meals },
    { key: 'transfers', label: 'Transfers', icon: Bus, included: inc.transfers },
    { key: 'guides', label: 'Guides', icon: Contact, included: inc.guides },
    { key: 'flights', label: 'Flights', icon: Plane, included: inc.flights },
    { key: 'activities', label: 'Activities', icon: Target, included: inc.activities }
  ];

  return (
    <section id="included" className="w-full bg-ice py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-teal font-display font-bold uppercase tracking-[0.3em] text-sm block mb-4">
            ✦ WHAT&apos;S INCLUDED
          </span>
          <h2 className="text-void font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Everything You Need
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.key} 
                className={`flex items-center gap-4 p-6 rounded-2xl border ${item.included ? 'bg-white border-white shadow-sm' : 'bg-transparent border-teal/10 opacity-70'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.included ? 'bg-ice text-teal' : 'bg-black/5 text-void/50'}`}>
                   <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-display font-bold text-lg ${item.included ? 'text-void' : 'text-void/50 line-through'}`}>
                    {item.label}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {item.included ? (
                      <><Check size={14} className="text-teal" /> <span className="text-xs font-body text-teal uppercase font-bold tracking-wider">Included</span></>
                    ) : (
                      <><X size={14} className="text-void/40" /> <span className="text-xs font-body text-void/40 uppercase tracking-wider">Not Included</span></>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exclusions Note */}
        {pkg.exclusions && pkg.exclusions.length > 0 && (
          <div className="mt-16 max-w-3xl mx-auto text-center border-t border-teal/10 pt-10">
             <h4 className="text-void font-display font-bold text-xl mb-6">Also Excluded</h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {pkg.exclusions.map((exclusion, i) => (
                  <li key={i} className="flex items-start gap-3 text-void/70 font-body">
                    <X size={16} className="text-void/40 shrink-0 mt-1" />
                    <span>{exclusion}</span>
                  </li>
                ))}
             </ul>
          </div>
        )}

      </div>
    </section>
  );
}
