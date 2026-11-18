'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { LiveEvent } from '@/types';

interface StepOutTuneInProps {
  events: LiveEvent[];
  currentCity: string;
  onSelectEvent: (event: LiveEvent) => void;
}

export const StepOutTuneIn: React.FC<StepOutTuneInProps> = ({
  events,
  currentCity,
  onSelectEvent,
}) => {
  return (
    <section id="live-events" className="py-12 sm:py-16 lg:py-20 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-400 tracking-widest uppercase mb-1 block">
              Music, plays, races and more
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
              Step out. Tune in.
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              The best of {currentCity}, beyond the everyday.
            </p>
          </div>

          <a
            href="#live-events"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors self-start sm:self-auto"
          >
            <span>Explore all events</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="group cursor-pointer rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:border-neutral-300 card-hover flex flex-col"
            >
              {/* Event Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-neutral-900 shadow-xs">
                    {event.badgeText || event.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-neutral-500 tracking-wide uppercase mb-1.5">
                    {event.date} · {event.time}
                  </div>
                  <h3 className="font-bold text-base text-neutral-950 group-hover:text-neutral-700 transition-colors line-clamp-1 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {event.venue}
                  </p>
                </div>

                {/* Price and Arrow Action */}
                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {event.currency}{event.startingPrice.toLocaleString('en-IN')} onwards
                  </span>
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
