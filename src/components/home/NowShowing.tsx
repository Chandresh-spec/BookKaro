'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie } from '@/types';

interface NowShowingProps {
  movies: Movie[];
  onBookMovie: (movie: Movie) => void;
}

export const NowShowing: React.FC<NowShowingProps> = ({
  movies,
  onBookMovie,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="movies" className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-neutral-400 uppercase block mb-1">
              THE BIG SCREEN
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-950">
              Now Showing
            </h2>
          </div>
          <Link
            href="/movies"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#85142f] hover:text-[#5f0d22] transition-colors"
          >
            <span>View all movies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="w-[200px] sm:w-[220px] lg:w-[230px] shrink-0 flex flex-col justify-between group/card cursor-pointer"
                onClick={() => onBookMovie(movie)}
              >
                {/* Poster Card */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 mb-3 shadow-sm card-hover">
                  <Image
                    src={movie.posterImage}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 200px, 240px"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge Top Right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mb-3">
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 truncate leading-snug">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">
                    {movie.genre} • {movie.languages.join(', ')}
                  </p>
                </div>

                {/* Book Now Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookMovie(movie);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#85142f] hover:bg-[#701027] text-white text-xs sm:text-sm font-bold tracking-tight transition-all active:scale-98 shadow-xs cursor-pointer text-center"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>

          {/* Right Floating Arrow Carousel Button (Desktop) */}
          <button
            type="button"
            onClick={handleScrollRight}
            className="hidden lg:flex absolute -right-4 top-1/3 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-lg text-neutral-700 hover:text-neutral-950 hover:scale-105 items-center justify-center transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-[#85142f]" />
          </button>
        </div>

      </div>
    </section>
  );
};
