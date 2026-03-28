'use client';

import React from 'react';

const STATS = [
  { value: '1,200+', label: 'Travelers Hosted' },
  { value: '25+', label: 'Destinations' },
  { value: '4.5 \u2605', label: 'Satisfaction' },
  { value: '2020', label: 'Founded' },
];

export default function StatsSection() {
  return (
    <section className="relative z-[20] w-full container px-4 -mt-[60px] pb-16">
      <div className="bg-teal text-white w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        {/* Subtle top border/accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan" />
        
        {STATS.map((stat, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col items-center justify-center p-8 md:p-12 text-center 
              ${idx !== 0 && idx !== 2 ? 'border-l border-white/10' : ''} 
              ${idx < 2 ? 'border-b border-white/10 md:border-b-0' : ''}
              ${idx === 2 ? 'md:border-l border-white/10' : ''}
            `}
          >
            <span className="font-display font-bold text-3xl md:text-4xl text-white tracking-wide">{stat.value}</span>
            <span className="font-body text-xs md:text-sm text-white/65 mt-2">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
