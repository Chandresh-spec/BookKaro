'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Ticket, Sparkles, ArrowRight } from 'lucide-react';
import { LiveEvent } from '@/types/event';

interface FeaturedEventBannerProps {
  featuredEvents: LiveEvent[];
}

export const FeaturedEventBanner: React.FC<FeaturedEventBannerProps> = ({ featuredEvents }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  if (!featuredEvents || featuredEvents.length === 0) return null;

  const current = featuredEvents[currentIndex];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl sm:rounded-4xl bg-neutral-950 text-white shadow-xl mb-8 group select-none">
      {/* Background Banner Image */}
      <div className="relative min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] w-full flex flex-col justify-end">
        <Image
          src={current.bannerImage || current.image}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 group-hover:scale-102 transition-transform duration-1000 ease-out"
        />

        {/* Multi-layered Gradients for BookKaro Wine Aesthetic & High Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#85142f]/35 via-transparent to-transparent pointer-events-none" />

        {/* TOP-RIGHT CAROUSEL CONTROLLER WIDGET (Never overlaps bottom actions) */}
        {featuredEvents.length > 1 && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-1.5 sm:gap-2 bg-neutral-900/85 hover:bg-neutral-900 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/15 text-white shadow-xl transition-all">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Featured Event"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Count Indicator & Dots */}
            <div className="flex items-center gap-1.5 px-1.5">
              <span className="text-[11px] font-black text-white font-mono">
                {currentIndex + 1}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">/</span>
              <span className="text-[11px] font-medium text-neutral-400 font-mono">
                {featuredEvents.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Featured Event"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SIDE FLOATING ARROWS (Visible on Tablet & Desktop) */}
        {featuredEvents.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Featured Event"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-950/70 hover:bg-[#85142f] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all shadow-xl opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Featured Event"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-950/70 hover:bg-[#85142f] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all shadow-xl opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Content Container (Dedicated bottom area with zero overlap) */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 max-w-3xl">
          {/* Spotlight Pill Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85142f] text-white text-[11px] font-extrabold uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badgeText || 'SPOTLIGHT CONCERT'}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-neutral-200 text-[11px] font-bold uppercase tracking-wider">
              {current.bookingType === 'reserved-seating'
                ? 'Stadium Seating'
                : current.bookingType === 'zone-based'
                ? 'Zone Standing'
                : 'General Admission'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-2 sm:mb-3">
            {current.title}
          </h1>

          {/* Subtitle / Artist */}
          {current.artist && (
            <p className="text-xs sm:text-sm font-semibold text-rose-200/90 mb-3 flex items-center gap-2 truncate">
              <span>Featuring {current.artist.name}</span>
              <span>•</span>
              <span className="text-neutral-300 font-normal truncate">{current.artist.role}</span>
            </p>
          )}

          {/* Meta row: Date, Venue, Starting Price */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-300 mb-5 sm:mb-6 font-medium">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{current.date}</span>
              {current.time && <span className="text-neutral-400">• {current.time}</span>}
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-4 h-4 text-[#85142f]" />
              <span className="truncate">{current.venue}</span>
            </div>

            <div className="text-white font-extrabold flex items-center gap-1">
              <span className="text-neutral-400 font-normal">From</span>
              <span className="text-rose-300 text-base sm:text-lg">
                {current.currency} {current.startingPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions (Completely free of any overlapping elements) */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/events/${current.id}`}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#85142f]/40 hover:bg-[#6c0f25] active:scale-95 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href={`/events/${current.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/15 transition-all cursor-pointer"
            >
              <span>Event Details</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
