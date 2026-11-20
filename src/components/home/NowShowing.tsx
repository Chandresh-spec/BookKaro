'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, ArrowRight, Film } from 'lucide-react';
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [movies]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="movies" className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#85142f] uppercase mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>THE BIG SCREEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950">
              Now Showing
            </h2>
          </div>
          <Link
            href="/movies"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#85142f] hover:text-[#6e1026] transition-colors"
          >
            <span>View all movies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth -webkit-overflow-scrolling-touch"
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="w-[180px] sm:w-[210px] lg:w-[225px] shrink-0 flex flex-col justify-between group/card cursor-pointer rounded-xl bg-white border border-neutral-200/70 p-2 sm:p-2.5 shadow-2xs hover:border-[#85142f]/30 hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Poster Card (True 2:3 Cinematic Ratio) */}
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-950 mb-2.5 shadow-xs">
                    <Image
                      src={movie.posterImage}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 180px, 225px"
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />

                    {/* Rating Badge Top Right */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-black shadow-xs border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Format pill in bottom left */}
                    {movie.formats && movie.formats.length > 0 && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider border border-white/10">
                          {movie.formats[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="px-0.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate leading-snug group-hover/card:text-[#85142f] transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-medium mt-0.5 truncate">
                      {movie.genre}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium truncate">
                      {movie.languages.slice(0, 2).join(', ')}
                      {movie.languages.length > 2 ? ` +${movie.languages.length - 2}` : ''}
                    </p>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="mt-2.5 pt-1">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onBookMovie(movie);
                    }}
                    className="w-full py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold tracking-tight transition-all active:scale-98 shadow-xs cursor-pointer text-center block btn-press"
                  >
                    Book Tickets
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Carousel Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white border border-neutral-200/90 shadow-md text-neutral-800 hover:text-[#85142f] hover:scale-105 items-center justify-center transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Carousel Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white border border-neutral-200/90 shadow-md text-neutral-800 hover:text-[#85142f] hover:scale-105 items-center justify-center transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-[#85142f]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
