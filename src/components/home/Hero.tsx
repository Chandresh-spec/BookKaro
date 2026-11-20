'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Play, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { FEATURED_HEROES } from '@/data/mockData';

interface HeroProps {
  currentCity: string;
  onBookTickets: (heroIndex?: number) => void;
  onWatchTrailer: (trailerTitle?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCity,
  onBookTickets,
  onWatchTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_HEROES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentHero = FEATURED_HEROES[currentIndex] || FEATURED_HEROES[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_HEROES.length) % FEATURED_HEROES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_HEROES.length);
  };

  return (
    <section className="pt-3 sm:pt-5 pb-5 sm:pb-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[440px] lg:min-h-[480px] bg-neutral-950 text-white shadow-xl shadow-neutral-950/20 flex flex-col justify-between p-6 sm:p-10 lg:p-12 border border-neutral-800/80 group"
        >
          {/* Background Image with Cinematic Multi-Stop Gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentHero.bgImage}
              alt={currentHero.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center opacity-75 group-hover:scale-102 transition-transform duration-1000 ease-out"
              priority
            />
            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 to-neutral-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-transparent to-neutral-950/40" />
            <div className="absolute inset-0 hero-vignette pointer-events-none" />
          </div>

          {/* Top Tag & Main Info */}
          <div className="relative z-10 max-w-xl">
            {/* Featured Event Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#85142f] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-4 shadow-sm border border-rose-400/20">
              <Sparkles className="w-3 h-3 text-rose-300" />
              <span>{currentHero.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.08] mb-3 sm:mb-4 drop-shadow-sm whitespace-pre-line">
              {currentHero.title}
            </h1>

            {/* Subhead */}
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-lg mb-6">
              {currentHero.subtitle}
            </p>

            {/* Event Metadata (Date, Time & Venue in sleek glassmorphic pill) */}
            <div className="inline-flex flex-wrap items-center gap-3 sm:gap-4 px-3.5 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-neutral-200 mb-6 font-medium shadow-xs">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#ec5e7b]" />
                <span>{currentHero.date}</span>
                {currentHero.time && (
                  <span className="text-neutral-400 font-normal">• {currentHero.time}</span>
                )}
              </div>
              <span className="hidden sm:inline text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-[#ec5e7b]" />
                <span className="truncate">{currentHero.venue}, {currentCity}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onBookTickets(currentIndex)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs sm:text-sm font-bold tracking-tight transition-all shadow-md active:scale-98 cursor-pointer btn-press"
              >
                <span>Book Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onWatchTrailer(currentHero.badgeName)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold transition-all active:scale-98 cursor-pointer btn-press"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>

          {/* Right Brand Showcase Card & Interactive Carousel Indicators */}
          <div className="relative z-10 flex items-end justify-between lg:justify-end gap-6 mt-8 lg:mt-0">
            {/* Elegant Glassmorphic Showcase Badge on Desktop */}
            <div className="hidden lg:block text-right mb-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg min-w-[200px]">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {currentHero.badgeName}
              </div>
              <div className="text-[10px] font-extrabold tracking-[0.2em] text-[#ec5e7b] uppercase mt-0.5">
                {currentHero.badgeSub}
              </div>
            </div>

            {/* Interactive Carousel Indicators */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
              {FEATURED_HEROES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Hover Prev / Next Arrow Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden lg:flex opacity-0 group-hover:opacity-100 absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="hidden lg:flex opacity-0 group-hover:opacity-100 absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
