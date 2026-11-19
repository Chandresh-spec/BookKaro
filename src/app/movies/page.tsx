'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Star,
  ThumbsUp,
  MapPin,
  X,
  Clock,
  Check,
  RotateCcw,
  Film,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  MOVIES,
  CINEMAS_LIST,
  CITIES,
  STREAM_PROMO_BANNER,
  FILTER_SECTIONS,
} from '@/data/mockData';
import { Movie, User } from '@/types';

export default function MoviesPage() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  // Active filter states
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedReleaseType, setSelectedReleaseType] = useState<string | null>(null);

  // Desktop accordion collapse states
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(true);
  const [isGenresOpen, setIsGenresOpen] = useState(true);
  const [isFormatOpen, setIsFormatOpen] = useState(true);

  // Temporary filter states for the mobile full-screen filter sheet
  const [tempReleaseType, setTempReleaseType] = useState<string | null>(null);
  const [tempLanguage, setTempLanguage] = useState<string | null>(null);
  const [tempGenre, setTempGenre] = useState<string | null>(null);
  const [tempFormat, setTempFormat] = useState<string | null>(null);

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  // Top quick filter pills matching mockups:
  const quickLanguagePills = [
    'English',
    'Hindi',
    'Kannada',
    'Tamil',
    'Telugu',
    'Japanese',
    'Malayalam',
    'Korean',
  ];

  // Open mobile filter modal and sync temp state
  const handleOpenFilterModal = () => {
    setTempReleaseType(selectedReleaseType);
    setTempLanguage(selectedLanguage);
    setTempGenre(selectedGenre);
    setTempFormat(selectedFormat);
    setIsFilterModalOpen(true);
  };

  // Apply filters from mobile modal
  const handleApplyFilters = () => {
    setSelectedReleaseType(tempReleaseType);
    setSelectedLanguage(tempLanguage);
    setSelectedGenre(tempGenre);
    setSelectedFormat(tempFormat);
    setIsFilterModalOpen(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedReleaseType(null);
    setSelectedLanguage(null);
    setSelectedGenre(null);
    setSelectedFormat(null);
    setTempReleaseType(null);
    setTempLanguage(null);
    setTempGenre(null);
    setTempFormat(null);
    setShowUpcomingOnly(false);
    setSearchQuery('');
  };

  // Quick toggle language pill
  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguage((prev) => (prev === lang ? null : lang));
  };

  // Quick toggle genre pill
  const handleGenreToggle = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
  };

  // Quick toggle format pill
  const handleFormatToggle = (format: string) => {
    setSelectedFormat((prev) => (prev === format ? null : format));
  };

  // Filter movies logic
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Upcoming toggle
      if (showUpcomingOnly) {
        if (!movie.isUpcoming) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query) || (movie.nativeTitle && movie.nativeTitle.includes(query));
        const matchesGenre = movie.genre.toLowerCase().includes(query);
        const matchesLang = movie.languages.some((l) => l.toLowerCase().includes(query));
        if (!matchesTitle && !matchesGenre && !matchesLang) return false;
      }

      // Release type filter
      if (selectedReleaseType === 'New Releases') {
        if (movie.isUpcoming || movie.rating < 8.4) return false;
      } else if (selectedReleaseType === 'Re-releases') {
        if (!movie.title.includes('2') && !movie.genre.includes('Sci-Fi')) return false;
      }

      // Language filter
      if (selectedLanguage) {
        if (!movie.languages.includes(selectedLanguage)) return false;
      }

      // Genre filter
      if (selectedGenre) {
        if (!movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return false;
      }

      // Format filter
      if (selectedFormat) {
        if (!movie.formats || !movie.formats.includes(selectedFormat)) return false;
      }

      return true;
    });
  }, [searchQuery, showUpcomingOnly, selectedReleaseType, selectedLanguage, selectedGenre, selectedFormat]);

  const activeFiltersCount =
    (selectedReleaseType ? 1 : 0) +
    (selectedLanguage ? 1 : 0) +
    (selectedGenre ? 1 : 0) +
    (selectedFormat ? 1 : 0) +
    (showUpcomingOnly ? 1 : 0);

  const handleOpenBooking = (movie: Movie) => {
    setSelectedMovieForBooking(movie);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 pb-28 lg:pb-16 selection:bg-[#85142f] selection:text-white">
      {/* ============================================================ */}
      {/* 1. DESKTOP / LAPTOP NAVBAR                                   */}
      {/* ============================================================ */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={(city) => setCurrentCity(city)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE HEADER (Matches Mobile Mockup)                     */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors active:scale-95"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 leading-tight">
              Now Showing
            </h1>
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="text-xs text-neutral-500 font-medium hover:text-neutral-800 flex items-center gap-1 transition-colors text-left"
            >
              <span>{currentCity}</span>
              <span>|</span>
              <span className="font-semibold text-neutral-700">{filteredMovies.length} Movies</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSearchActive((prev) => !prev)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isSearchActive || searchQuery
              ? 'bg-[#85142f] text-white shadow-xs'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
          aria-label="Search movies"
        >
          <Search className="w-5 h-5 stroke-[2.2px]" />
        </button>
      </header>

      {/* Mobile Search Input Bar */}
      {isSearchActive && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-2.5 animate-in fade-in slide-in-from-top-2 duration-150 sticky top-16 z-30 shadow-sm">
          <div className="relative flex items-center bg-neutral-100 rounded-full px-3.5 py-1.5">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, genre, or language..."
              className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MOBILE STREAM BANNER & QUICK FILTERS (< lg)               */}
      {/* ============================================================ */}
      <div className="lg:hidden px-3 pt-3">
        {/* Stream Banner */}
        <section className="mb-4">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm flex flex-row items-stretch bg-neutral-950 aspect-[21/9] max-h-[170px]">
            <div className="relative z-10 w-[55%] bg-gradient-to-r from-[#85142f] via-[#751128] to-[#5d0e20] text-white p-3.5 flex flex-col justify-center items-start">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-black tracking-tight text-white/90">
                  {STREAM_PROMO_BANNER.brand}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1 py-0.2 bg-white text-[#85142f] rounded font-mono">
                  {STREAM_PROMO_BANNER.tag}
                </span>
              </div>
              <h3 className="text-xs font-extrabold tracking-tight text-white line-clamp-1">
                {STREAM_PROMO_BANNER.title}
              </h3>
              <p className="text-[10px] text-rose-100 font-medium line-clamp-1 mb-2">
                {STREAM_PROMO_BANNER.subtitle}
              </p>
              <button
                type="button"
                onClick={() => handleOpenBooking(MOVIES[0])}
                className="px-3 py-1 rounded-full bg-white text-[#85142f] text-[10px] font-bold tracking-tight shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {STREAM_PROMO_BANNER.actionText}
              </button>
            </div>
            <div className="relative w-[45%] h-full bg-neutral-900">
              <Image
                src={STREAM_PROMO_BANNER.bannerImage}
                alt={STREAM_PROMO_BANNER.title}
                fill
                priority
                sizes="50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#5d0e20] to-transparent z-10" />
            </div>
          </div>
        </section>

        {/* Mobile Horizontal Filter Pill Row (Sticky below header) */}
        <section className="sticky top-16 z-20 bg-white/95 backdrop-blur-md py-2 -mx-3 px-3 mb-3 border-b border-neutral-200/80 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {/* Prominent Filters Button with active count */}
            <button
              type="button"
              onClick={handleOpenFilterModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeFiltersCount > 0
                  ? 'border-[#85142f] bg-[#85142f] text-white'
                  : 'border-[#85142f] bg-white text-[#85142f] hover:bg-rose-50/60'
              }`}
              aria-label="Open Filters"
            >
              <Filter className="w-3.5 h-3.5 stroke-[2.2px]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#85142f] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Release Type Pills (Matches BMS Mobile Mockup: New Releases, Re-releases) */}
            {FILTER_SECTIONS.releaseTypes.map((type) => {
              const isActive = selectedReleaseType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedReleaseType(isActive ? null : type)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {type}
                </button>
              );
            })}

            {/* Quick Language Pills */}
            {quickLanguagePills.map((pill) => {
              const isActive = selectedLanguage === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleLanguageToggle(pill)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {pill}
                </button>
              );
            })}

            {/* Quick Format Pills */}
            {['IMAX 2D', '3D', '4DX'].map((fmt) => {
              const isActive = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleFormatToggle(fmt)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {fmt}
                </button>
              );
            })}

            {/* Quick Clear All Pill if filters active */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-[#85142f] bg-rose-50 border border-[#85142f]/30 hover:bg-rose-100 whitespace-nowrap transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* Mobile Coming Soon Ribbon */}
        <section className="mb-4">
          <div
            onClick={() => setShowUpcomingOnly((prev) => !prev)}
            className={`relative w-full rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-xs ${
              showUpcomingOnly
                ? 'bg-gradient-to-r from-[#701027] to-[#85142f] text-white ring-2 ring-[#85142f]'
                : 'bg-gradient-to-r from-[#e11d48] via-[#e53e3e] to-[#ef4444] text-white hover:brightness-105'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs tracking-tight">
                Coming Soon
              </span>
              <span className="text-white/90 text-[11px] font-medium">
                {showUpcomingOnly ? 'Showing Upcoming Movies • Tap to view all' : 'Explore Upcoming Movies'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 transition-transform text-white" />
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* 4. MAIN LAYOUT CONTAINER (LAPTOP & TABLET)                    */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-6">
        <div className="lg:flex lg:gap-8 items-start">
          
          {/* ========================================================== */}
          {/* 4A. LEFT SIDEBAR: "FILTERS" (Matching Laptop Mockup)       */}
          {/* ========================================================== */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#85142f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Card 1: Languages Accordion */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsLanguagesOpen(!isLanguagesOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isLanguagesOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Languages
                    </span>
                  </div>
                  {selectedLanguage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLanguage(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isLanguagesOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FILTER_SECTIONS.languages.map((lang) => {
                      const isSelected = selectedLanguage === lang;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold shadow-xs'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f] hover:bg-rose-50/50'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card 2: Genres Accordion */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsGenresOpen(!isGenresOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isGenresOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Genres
                    </span>
                  </div>
                  {selectedGenre && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGenre(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isGenresOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FILTER_SECTIONS.genres.map((genre) => {
                      const isSelected = selectedGenre === genre;
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold shadow-xs'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f] hover:bg-rose-50/50'
                          }`}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card 3: Format Accordion */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsFormatOpen(!isFormatOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isFormatOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Format
                    </span>
                  </div>
                  {selectedFormat && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFormat(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isFormatOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FILTER_SECTIONS.formats.map((fmt) => {
                      const isSelected = selectedFormat === fmt;
                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => handleFormatToggle(fmt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold shadow-xs'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f] hover:bg-rose-50/50'
                          }`}
                        >
                          {fmt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cinema Selector Card in Sidebar (Laptop convenience) */}
              <button
                type="button"
                onClick={() => setIsCinemaModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-[#85142f]/40 bg-white hover:bg-rose-50/40 text-[#85142f] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-4 h-4" />
                <span>Browse by Cinemas in {currentCity}</span>
              </button>
            </div>
          </aside>

          {/* ========================================================== */}
          {/* 4B. RIGHT CONTENT: MOVIES IN {CITY} (Laptop Mockup)        */}
          {/* ========================================================== */}
          <div className="flex-1 min-w-0">
            
            {/* Desktop Section Header: "Movies In Bengaluru" */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
                Movies In {currentCity}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-500">
                  {filteredMovies.length} Movies Available
                </span>
                {filteredMovies.length === 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#85142f] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Top Quick Language Pills (Matching Laptop Mockup) */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              {quickLanguagePills.map((lang) => {
                const isActive = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                        : 'bg-white text-[#85142f] border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            {/* Desktop "Coming Soon" Clean White Card (Matching Laptop Mockup) */}
            <div
              onClick={() => setShowUpcomingOnly((prev) => !prev)}
              className="hidden lg:flex items-center justify-between p-4 px-6 bg-white rounded-xl border border-neutral-200/80 mb-6 shadow-2xs hover:shadow-xs cursor-pointer transition-all"
            >
              <span className="text-base font-extrabold text-neutral-900 tracking-tight">
                {showUpcomingOnly ? 'Currently Showing: Upcoming Movies' : 'Coming Soon'}
              </span>
              <span className="text-xs font-bold text-[#85142f] hover:underline flex items-center gap-1">
                <span>{showUpcomingOnly ? 'View Now Showing' : 'Explore Upcoming Movies'}</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            {/* ======================================================== */}
            {/* 4C. MOVIE GRID: 4 COLUMNS ON LAPTOP (2 on Mobile)        */}
            {/* ======================================================== */}
            <section className="mb-12">
              {filteredMovies.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs p-6 sm:p-10 text-center flex flex-col items-center animate-in fade-in duration-200">
                  {/* Cinema Marquee Graphic matching mockup */}
                  <div className="relative w-full max-w-md aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-6 shadow-sm border border-neutral-100 bg-neutral-950">
                    <Image
                      src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop"
                      alt="Cinema Marquee"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end justify-center p-4">
                      <span className="text-white text-[11px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
                        CINEMA
                      </span>
                    </div>
                  </div>

                  {/* Empty State Titles */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
                    Oops! No Movies Found
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-5 leading-relaxed">
                    We couldn't find any movies matching your current filter selection in{' '}
                    <span className="font-bold text-neutral-800">{currentCity}</span>. Clear your active filters to explore all available shows.
                  </p>

                  {/* Active Filter Chips */}
                  {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-lg">
                      {selectedLanguage && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold border border-rose-200">
                          <span>Language: {selectedLanguage}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedLanguage(null)}
                            className="p-0.5 hover:bg-rose-200/60 rounded-full cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedGenre && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold border border-rose-200">
                          <span>Genre: {selectedGenre}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedGenre(null)}
                            className="p-0.5 hover:bg-rose-200/60 rounded-full cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedFormat && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold border border-rose-200">
                          <span>Format: {selectedFormat}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFormat(null)}
                            className="p-0.5 hover:bg-rose-200/60 rounded-full cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedReleaseType && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#85142f] text-xs font-bold border border-rose-200">
                          <span>Release: {selectedReleaseType}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedReleaseType(null)}
                            className="p-0.5 hover:bg-rose-200/60 rounded-full cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Primary Reset Filters Action Button */}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white text-xs sm:text-sm font-bold tracking-tight shadow-md shadow-[#85142f]/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                  {filteredMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleOpenBooking(movie)}
                      className="group flex flex-col justify-between cursor-pointer rounded-2xl bg-white border border-neutral-200/60 p-2 sm:p-2.5 shadow-2xs hover:shadow-md hover:border-[#85142f]/30 transition-all duration-200"
                    >
                      <div>
                        {/* Movie Poster with Rounded Corners */}
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-2.5 shadow-inner">
                          <Image
                            src={movie.posterImage}
                            alt={movie.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-104 transition-transform duration-500"
                          />

                          {/* PROMOTED Badge on Top-Right (Matching Laptop Mockup) */}
                          {movie.isPromoted && (
                            <div className="absolute top-2 right-2 z-10">
                              <span className="px-2 py-0.5 rounded bg-[#e11d48] text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                                PROMOTED
                              </span>
                            </div>
                          )}

                          {/* Bottom Dark Overlay with Likes / Rating (Matching Laptop Mockup) */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-2.5 pt-6">
                            {movie.likes ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <ThumbsUp className="w-3.5 h-3.5 fill-emerald-400" />
                                  <span>{movie.likes}</span>
                                </span>
                                <span className="text-neutral-300 font-medium text-[11px]">Likes</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                <span className="flex items-center gap-1 text-rose-400">
                                  <Star className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                                  <span>{movie.rating}/10</span>
                                </span>
                                {movie.votesCount && (
                                  <span className="text-neutral-300 font-medium text-[11px]">
                                    {movie.votesCount} Votes
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title, Certificate & Languages (Matching Laptop Mockup) */}
                        <div className="px-1">
                          <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 truncate leading-snug group-hover:text-[#85142f] transition-colors">
                            {movie.title}
                          </h3>
                          
                          {/* Certificate Badge e.g. UA16+, A, U */}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {movie.certificate && (
                              <span className="text-[11px] text-neutral-500 font-medium">
                                {movie.certificate}
                              </span>
                            )}
                          </div>

                          {/* Languages */}
                          <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
                            {movie.languages.join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* Quick Book Button */}
                      <div className="mt-2.5 px-1 pb-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(movie);
                          }}
                          className="w-full py-1.5 sm:py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold tracking-tight transition-all active:scale-95 shadow-xs text-center cursor-pointer"
                        >
                          Book Tickets
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* 5. MOBILE FLOATING ACTION PILLS: Cinemas & Filters           */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-18 inset-x-0 z-40 flex justify-center items-center gap-2 pointer-events-none px-4">
        <button
          type="button"
          onClick={() => setIsCinemaModalOpen(true)}
          className="pointer-events-auto flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#85142f] text-white text-xs font-bold shadow-xl shadow-[#85142f]/35 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 fill-white/20" />
          <span>Browse by Cinemas</span>
        </button>

        <button
          type="button"
          onClick={handleOpenFilterModal}
          className="pointer-events-auto flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#85142f] text-[#85142f] text-xs font-bold shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 stroke-[2.2px]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#85142f] text-white text-[10px] font-extrabold flex items-center justify-center ml-0.5">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 6. MOBILE FULL-SCREEN FILTERS MODAL                          */}
      {/* ============================================================ */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          <div className="h-14 px-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1 rounded-full text-neutral-800 hover:bg-neutral-100 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-6 h-6 stroke-[2px]" />
            </button>
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">
              Filters
            </h2>
            <button
              type="button"
              onClick={() => {
                setTempReleaseType(null);
                setTempLanguage(null);
                setTempGenre(null);
                setTempFormat(null);
              }}
              className="text-xs font-semibold text-[#85142f] hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Release Type
              </div>
              <div className="divide-y divide-neutral-100">
                {FILTER_SECTIONS.releaseTypes.map((type) => {
                  const isSelected = tempReleaseType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTempReleaseType(isSelected ? null : type)}
                      className={`w-full px-4 py-3.5 text-left text-sm font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-rose-50/60 text-[#85142f] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{type}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#85142f] stroke-[2.5px]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Languages
              </div>
              <div className="divide-y divide-neutral-100">
                {FILTER_SECTIONS.languages.map((lang) => {
                  const isSelected = tempLanguage === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setTempLanguage(isSelected ? null : lang)}
                      className={`w-full px-4 py-3.5 text-left text-sm font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-rose-50/60 text-[#85142f] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{lang}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#85142f] stroke-[2.5px]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Genres
              </div>
              <div className="divide-y divide-neutral-100">
                {FILTER_SECTIONS.genres.map((genre) => {
                  const isSelected = tempGenre === genre;
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setTempGenre(isSelected ? null : genre)}
                      className={`w-full px-4 py-3.5 text-left text-sm font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-rose-50/60 text-[#85142f] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{genre}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#85142f] stroke-[2.5px]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Format
              </div>
              <div className="divide-y divide-neutral-100">
                {FILTER_SECTIONS.formats.map((fmt) => {
                  const isSelected = tempFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setTempFormat(isSelected ? null : fmt)}
                      className={`w-full px-4 py-3.5 text-left text-sm font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-rose-50/60 text-[#85142f] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{fmt}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#85142f] stroke-[2.5px]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-200">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full py-3.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white text-sm font-bold tracking-tight shadow-md transition-all active:scale-98 cursor-pointer text-center"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: BROWSE BY CINEMAS                                  */}
      {/* ============================================================ */}
      {isCinemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#85142f]/10 text-[#85142f] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">
                    Cinemas in {currentCity}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Select a cinema to view showtimes and fast-track booking
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCinemaModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-neutral-100 py-2 space-y-1">
              {CINEMAS_LIST.map((cinema) => (
                <div
                  key={cinema.id}
                  className="py-3 px-2 rounded-xl hover:bg-neutral-50 flex items-center justify-between transition-colors group cursor-pointer"
                  onClick={() => {
                    setIsCinemaModalOpen(false);
                    handleOpenBooking(MOVIES[0]);
                  }}
                >
                  <div className="pr-3">
                    <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#85142f] transition-colors">
                      {cinema.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {cinema.location}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>M-Ticket Available</span>
                      </span>
                      <span className="text-[11px] font-bold text-neutral-400">
                        {cinema.distance}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#85142f]/10 text-[#85142f] text-xs font-bold group-hover:bg-[#85142f] group-hover:text-white transition-colors cursor-pointer"
                  >
                    Shows
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsCinemaModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. MODAL: CITY SELECTOR                                      */}
      {/* ============================================================ */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                Select Your City
              </h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 py-4">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setCurrentCity(city.name);
                    setIsCityModalOpen(false);
                  }}
                  className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    currentCity.toLowerCase() === city.name.toLowerCase()
                      ? 'bg-[#85142f] text-white shadow-xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. MODALS: BOOKING & AUTH                                    */}
      {/* ============================================================ */}
      <BookingModal
        isOpen={isBookingModalOpen}
        item={selectedMovieForBooking}
        currentCity={currentCity}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedMovieForBooking(null);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />

      {/* ============================================================ */}
      {/* 10. MOBILE BOTTOM NAV (Movies Active)                        */}
      {/* ============================================================ */}
      <MobileBottomNav
        activeTab="movies"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}