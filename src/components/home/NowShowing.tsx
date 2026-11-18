'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { Movie } from '@/types';
import { MOVIE_LANGUAGES } from '@/data/mockData';

interface NowShowingProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onFilterChange?: (lang: string) => void;
}

export const NowShowing: React.FC<NowShowingProps> = ({
  movies,
  onSelectMovie,
  onFilterChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const handleLanguageClick = (lang: string) => {
    setSelectedLanguage(lang);
    onFilterChange?.(lang);
  };

  const filteredMovies =
    selectedLanguage === 'All'
      ? movies
      : movies.filter((m) =>
          m.languages.some(
            (l) => l.toLowerCase() === selectedLanguage.toLowerCase()
          )
        );

  return (
    <section id="movies" className="py-12 sm:py-16 lg:py-20 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-bold text-neutral-400 tracking-widest uppercase mb-1">
            The Big Screen
          </span>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
              Now Showing
            </h2>
            <a
              href="#movies"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <span>View all movies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {MOVIE_LANGUAGES.map((lang) => {
            const isActive = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageClick(lang)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Poster Container */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 mb-3 shadow-sm card-hover">
                <Image
                  src={movie.posterImage}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info (Title in all caps + ONLY IN CINEMAS) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                  <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wider uppercase leading-snug">
                    {movie.originalTitle || movie.title}
                  </h3>
                  {movie.isCinemaExclusive && (
                    <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">
                      Only in Cinemas
                    </span>
                  )}
                </div>
              </div>

              {/* Movie Details Below Card */}
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-xs text-neutral-500 font-medium">
                  {movie.genres.join(' · ')}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {movie.languages.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
