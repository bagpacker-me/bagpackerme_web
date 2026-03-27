'use client';

import { Package } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ItineraryTimeline({ pkg }: { pkg: Package }) {
  const isCorporate = pkg.category === 'Corporate Retreat';

  if (!pkg.itinerary || pkg.itinerary.length === 0) return null;

  return (
    <section id="itinerary" className="w-full bg-void py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-cyan font-display font-bold uppercase tracking-[0.3em] text-sm block mb-4">
            ✦ THE JOURNEY
          </span>
          <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Day by Day
          </h2>
        </div>

        {isCorporate ? (
          <CorporateItinerary itinerary={pkg.itinerary} />
        ) : (
          <TimelineItinerary itinerary={pkg.itinerary} />
        )}
        
      </div>
    </section>
  );
}

function TimelineItinerary({ itinerary }: { itinerary: Package['itinerary'] }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Center Line for Desktop, Left Line for Mobile */}
      <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/15 -translate-x-1/2" />

      <div className="space-y-16 md:space-y-32">
        {itinerary.map((day, index) => {
          const isEven = index % 2 !== 0; // 0-indexed, so 0 is odd day (Day 1), 1 is even day (Day 2)
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-[24px] md:left-1/2 top-0 -translate-x-1/2 -translate-y-1 w-4 h-4 rounded-full bg-void border-[3px] border-teal z-10" />

              {/* Text Side */}
              <div className={`w-full md:w-1/2 pl-16 md:pl-0 flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                <div className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-4">
                  <span className="text-white/60 font-display text-sm uppercase tracking-widest">Day {day.day}</span>
                </div>
                <h3 className="text-white font-display text-2xl md:text-3xl font-bold mb-4">{day.location}</h3>
                <p className="text-white/70 font-body leading-relaxed md:max-w-md">
                  {day.description}
                </p>
              </div>

              {/* Image Side */}
              <div className={`w-full md:w-1/2 pl-16 md:pl-0 flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                {day.imageUrl && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full max-w-[280px] aspect-[5/4] rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl"
                    style={{ transform: `rotate(${isEven ? '-2deg' : '2deg'})` }}
                  >
                    <Image
                      src={day.imageUrl}
                      alt={day.location}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CorporateItinerary({ itinerary }: { itinerary: Package['itinerary'] }) {
  return (
    <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {itinerary.map((day, index) => (
          <div key={index} className="flex flex-col border-t border-white/10 pt-6 first:border-t-0 md:first:border-t-0 md:[&:nth-child(2)]:border-t-0">
            <span className="text-lime font-display text-sm font-bold uppercase tracking-widest mb-2">Day {day.day}</span>
            <h3 className="text-white font-display text-2xl font-bold mb-4">{day.location}</h3>
            <p className="text-white/70 font-body leading-relaxed">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
