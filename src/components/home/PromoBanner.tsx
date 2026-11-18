'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface PromoBannerProps {
  onDiscoverClick?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onDiscoverClick }) => {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0f0f12] text-white overflow-hidden shadow-2xl border border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-16 lg:col-span-6 z-10">
              <span className="inline-block text-[11px] font-bold text-neutral-400 tracking-widest uppercase mb-4">
                This Weekend&apos;s Pick
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-white mb-4">
                Less scrolling. <br />
                More living.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 font-normal max-w-md mb-8 leading-relaxed">
                Trade your usual plans for something worth talking about.
              </p>

              <button
                type="button"
                onClick={onDiscoverClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 text-xs sm:text-sm font-bold tracking-tight transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Discover this weekend</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Visual Image */}
            <div className="relative lg:col-span-6 h-64 sm:h-80 lg:h-full min-h-[300px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"
                alt="Concert stage atmosphere"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
              {/* Gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0f0f12] via-[#0f0f12]/30 to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
