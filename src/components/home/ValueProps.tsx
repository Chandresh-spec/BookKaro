'use client';

import React from 'react';
import { Ticket, ShieldCheck, Headphones } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '@/data/mockData';

export const ValueProps: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ticket':
        return <Ticket className="w-5 h-5 text-neutral-900" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-neutral-900" />;
      case 'headset':
      default:
        return <Headphones className="w-5 h-5 text-neutral-900" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mb-10 sm:mb-12">
          More experience. Less effort.
        </h2>

        {/* 3 Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {VALUE_PROPOSITIONS.map((prop) => (
            <div key={prop.id} className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center">
                {getIcon(prop.icon)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                {prop.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
