'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, ArrowRight, Zap, Ticket } from 'lucide-react';
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Search Form */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Pill Tag with yellow lightning */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/60 mb-5 sm:mb-6 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-semibold tracking-tight text-neutral-800">
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
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mb-7 sm:mb-8 font-normal leading-relaxed">
              Discover movies, concerts, sports and unforgettable events. Find your seat and book in seconds.
            </p>

            {/* Search Box Card */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-xl bg-white rounded-2xl p-2 sm:p-2.5 border border-neutral-200/90 shadow-lg shadow-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4"
            >
              {/* Search input */}
              <div className="relative flex-1 flex items-center min-w-0 px-3 py-1.5">
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search movies, concerts, artists or events..."
                  className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

              {/* City Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer"
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
                className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Trending tags as rounded pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-6">
              <span className="text-neutral-500 font-medium mr-1">Trending:</span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchInput(tag);
                    onTagClick(tag);
                  }}
                  className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/60 text-neutral-800 text-xs font-medium transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Explore Events Button */}
            <a
              href="#live-events"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all shadow-md active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Column: 3 Fanned / Angled Overlapping Cards with Floating Badge */}
          <div className="lg:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-[500px] h-[340px] sm:h-[400px] flex items-center justify-center">
              
              {/* Card 1: Cinema Popcorn & Clapperboard (Left rotated) */}
              <div className="absolute left-2 sm:left-4 top-6 w-44 sm:w-56 aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border-2 border-white transform -rotate-12 hover:-rotate-6 transition-transform duration-300 z-10 bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=700&auto=format&fit=crop"
                  alt="Cinema Popcorn and Movies"
                  fill
                  sizes="(max-width: 640px) 180px, 240px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Card 2: Live Concert Crowd (Center elevated) */}
              <div className="absolute z-20 w-52 sm:w-64 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-300 bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=900&auto=format&fit=crop"
                  alt="Concert Stage and Lights"
                  fill
                  sizes="(max-width: 640px) 220px, 280px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Card 3: Cricket / Sports Stadium (Right rotated) */}
              <div className="absolute right-2 sm:right-4 top-8 w-44 sm:w-56 aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border-2 border-white transform rotate-12 hover:rotate-6 transition-transform duration-300 z-10 bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=700&auto=format&fit=crop"
                  alt="Sports Stadium Floodlights"
                  fill
                  sizes="(max-width: 640px) 180px, 240px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Floating Pill Card Overlapping Bottom */}
              <div className="absolute -bottom-2 sm:bottom-0 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-neutral-100 flex items-center gap-3.5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0 border border-neutral-200/50">
                  <Ticket className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-950 leading-tight">
                    One city. Endless possibilities.
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">
                    Movies, concerts, sports and more.
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
