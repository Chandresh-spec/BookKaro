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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl mb-8 group border border-neutral-800/80">
      {/* Background Banner Image */}
      <div className="relative h-[420px] sm:h-[460px] lg:h-[480px] w-full">
        <Image
          src={current.bannerImage || current.image}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 group-hover:scale-102 transition-transform duration-1000 ease-out"
        />

        {/* Multi-layered Gradients for BookKaro Wine Aesthetic & Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#85142f]/30 via-transparent to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-12 z-10 max-w-4xl">
          {/* Spotlight Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#85142f] text-white text-[10px] font-black uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badgeText || 'SPOTLIGHT CONCERT'}</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md text-neutral-200 text-[10px] font-bold uppercase tracking-wider">
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
            <p className="text-xs sm:text-sm font-semibold text-rose-200/90 mb-3 flex items-center gap-2">
              <span>Featuring {current.artist.name}</span>
              <span>•</span>
              <span className="text-neutral-300 font-normal">{current.artist.role}</span>
            </p>
          )}

          {/* Meta row: Date, Venue, Starting Price */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-300 mb-6 font-medium">
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/events/${current.id}`}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#85142f]/40 hover:bg-[#6c0f25] active:scale-98 transition-all cursor-pointer btn-press"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href={`/events/${current.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/15 transition-all cursor-pointer btn-press"
            >
              <span>Event Details</span>
            </Link>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {featuredEvents.length > 1 && (
          <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Featured Event"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {featuredEvents.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#85142f]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Featured Event"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
