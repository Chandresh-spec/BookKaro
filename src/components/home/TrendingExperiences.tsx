'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { LiveEvent } from '@/types';

interface TrendingExperiencesProps {
  events: LiveEvent[];
  onSelectEvent: (event: LiveEvent) => void;
}

export const TrendingExperiences: React.FC<TrendingExperiencesProps> = ({
  events,
  onSelectEvent,
}) => {
  return (
    <section id="trending" className="py-6 sm:py-10 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#85142f] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE EXPERIENCES</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 flex items-center gap-2">
              <span>Trending Experiences</span>
            </h2>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#85142f] hover:text-[#6e1026] transition-colors"
          >
            <span>View all live events</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="group cursor-pointer rounded-xl bg-white border border-neutral-200/80 overflow-hidden shadow-2xs hover:border-[#85142f]/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Event Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover group-hover:scale-104 transition-transform duration-500"
                />

                {/* Category Pill Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-black tracking-wider uppercase text-white shadow-xs border border-white/10">
                    {event.category}
                  </span>
                </div>

                {/* Price Tag in bottom right of image */}
                {event.startingPrice && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-black shadow-xs">
                      {event.currency || '₹'}{event.startingPrice} onwards
                    </span>
                  </div>
                )}
              </div>

              {/* Event Content Row */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-neutral-950 group-hover:text-[#85142f] transition-colors truncate mb-1">
                    {event.title}
                  </h3>

                  <div className="space-y-0.5 text-xs text-neutral-500 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#85142f] shrink-0" />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow Action */}
                <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-600 group-hover:bg-[#85142f] group-hover:border-[#85142f] group-hover:text-white transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
