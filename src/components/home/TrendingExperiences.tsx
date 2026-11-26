'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, ChevronRight, ArrowRight } from 'lucide-react';
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
    <section id="trending" className="py-8 sm:py-12 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950 flex items-center gap-2">
            <span>Trending Experiences</span>
            <span>🔥</span>
          </h2>
          <a
            href="#trending"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#85142f] hover:text-[#5f0d22] transition-colors"
          >
            <span>View all events</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 3 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:border-neutral-300 card-hover flex flex-col justify-between"
            >
              {/* Event Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-neutral-900 shadow-xs">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Content Row */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-[#85142f] transition-colors truncate mb-1.5">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-neutral-500 font-medium">
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

                {/* Right Circle Arrow Button */}
                <div className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-[#85142f] group-hover:border-[#85142f] group-hover:text-white transition-all shrink-0">
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
