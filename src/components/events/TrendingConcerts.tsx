'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { LiveEvent } from '@/types/event';
import { EventCard } from './EventCard';

interface TrendingConcertsProps {
  trendingEvents: LiveEvent[];
}

export const TrendingConcerts: React.FC<TrendingConcertsProps> = ({ trendingEvents }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!trendingEvents || trendingEvents.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10 sm:mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950">
              Trending Concerts & Shows
            </h2>
            <p className="text-xs text-neutral-500 font-medium hidden sm:block">
              Hottest selling live entertainment tickets in your city
            </p>
          </div>
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 shadow-xs transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 shadow-xs transition-all active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {trendingEvents.map((event) => (
          <div
            key={event.id}
            className="w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 snap-start"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
};
