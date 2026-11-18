'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, ArrowRight, Sparkles, Ticket } from 'lucide-react';
import { TRENDING_TAGS, CITIES } from '@/data/mockData';

interface HeroProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCity,
  onSelectCity,
  onSearch,
  onTagClick,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Search Form */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                Good times, great seats
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08] mb-4 sm:mb-5">
              Your Next <br className="hidden sm:inline" />
              Experience <br className="hidden sm:inline" />
              Starts Here.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mb-7 sm:mb-9 font-normal leading-relaxed">
              Discover movies, concerts, sports and unforgettable events. Find your seat and book in seconds.
            </p>

            {/* Search Box Card */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-2xl bg-white rounded-2xl p-2 sm:p-2.5 border border-neutral-200 shadow-lg shadow-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4"
            >
              {/* Search input */}
              <div className="relative flex-1 flex items-center min-w-0 px-3 py-1.5">
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search movies, events & more"
                  className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

              {/* City Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{currentCity}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 p-1.5 z-40">
                    {CITIES.slice(0, 6).map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          onSelectCity(city.name);
                          setIsCityDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-100 font-medium text-neutral-700"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Action Button */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Trending tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-6">
              <span className="text-neutral-400 font-medium">Trending:</span>
              {TRENDING_TAGS.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput(tag);
                      onTagClick(tag);
                    }}
                    className="hover:text-neutral-950 transition-colors font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                  {idx < TRENDING_TAGS.length - 1 && (
                    <span className="text-neutral-300">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Explore Events Button */}
            <a
              href="#live-events"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-xs"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Column: Composite Visuals (Overlapping Modern Floating Cards) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-none">
              
              {/* Back Overlapping Card: Orbit Movie Poster */}
              <div className="relative -top-3 left-4 sm:left-6 w-40 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                  alt="Orbit - Only in Cinemas"
                  fill
                  sizes="(max-width: 640px) 160px, 200px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                  <span className="text-white font-extrabold text-sm sm:text-base tracking-widest uppercase">
                    ORBIT
                  </span>
                  <span className="text-[10px] text-white/70 tracking-wider font-semibold uppercase">
                    Only in Cinemas
                  </span>
                </div>
              </div>

              {/* Main Overlapping Card: Live Concert */}
              <div className="relative -mt-24 sm:-mt-28 ml-10 sm:ml-16 rounded-3xl overflow-hidden shadow-2xl z-20 border border-neutral-100 group">
                <div className="relative aspect-[16/11] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=900&auto=format&fit=crop"
                    alt="Live Music Concert"
                    fill
                    sizes="(max-width: 640px) 100vw, 450px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Top Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] sm:text-xs font-bold text-neutral-900 tracking-wider uppercase">
                      Live Music
                    </span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-5 sm:p-6 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1">
                      A little less routine. A lot more live.
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300">
                      Book your front-row seat today.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Pill Card (Bottom) */}
              <div className="relative -mt-4 sm:-mt-6 mx-auto sm:ml-24 max-w-[340px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-neutral-100 flex items-center gap-3 z-30 card-hover">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    One city. Endless possibilities.
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 truncate">
                    Your next story is waiting outdoors.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
