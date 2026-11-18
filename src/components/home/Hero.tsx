'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Play } from 'lucide-react';
import { FEATURED_HERO } from '@/data/mockData';

interface HeroProps {
  currentCity: string;
  onBookTickets: () => void;
  onWatchTrailer: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCity,
  onBookTickets,
  onWatchTrailer,
}) => {
  return (
    <section className="pt-4 sm:pt-6 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-neutral-950 text-white shadow-xl shadow-neutral-900/10 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          
          {/* Background Image with Dark Vignette Gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src={FEATURED_HERO.bgImage}
              alt={FEATURED_HERO.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center opacity-85"
              priority
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/40" />
          </div>

          {/* Top Tag & Main Info */}
          <div className="relative z-10 max-w-xl">
            {/* Featured Event Badge */}
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#85142f] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              {FEATURED_HERO.tag}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] mb-3 sm:mb-4">
              Your next <br />
              unforgettable moment.
            </h1>

            {/* Subhead */}
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-md mb-6">
              {FEATURED_HERO.subtitle}
            </p>

            {/* Event Metadata (Date & Venue) */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 mb-6 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{FEATURED_HERO.date} · {FEATURED_HERO.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e67389]" />
                <span>{FEATURED_HERO.venue}, {currentCity}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBookTickets}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#85142f] hover:bg-[#701227] text-white text-xs sm:text-sm font-bold tracking-tight transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Book Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onWatchTrailer}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">Watch Trailer</span>
              </button>
            </div>
          </div>

          {/* Right Brand Showcase & Carousel Indicators */}
          <div className="relative z-10 flex items-end justify-between lg:justify-end gap-6 mt-8 lg:mt-0">
            {/* Neon Calligraphy Accent on Desktop */}
            <div className="hidden lg:block text-right mb-2">
              <div className="text-3xl sm:text-4xl font-serif italic text-rose-300 drop-shadow-[0_2px_12px_rgba(244,63,94,0.6)]">
                {FEATURED_HERO.badgeName}
              </div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase mt-1">
                {FEATURED_HERO.badgeSub}
              </div>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-1.5 rounded-full bg-white transition-all" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
