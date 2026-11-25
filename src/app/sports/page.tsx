'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Filter,
  X,
  RotateCcw,
  Trophy,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { SportsEventCard } from '@/components/sports/SportsEventCard';
import { SportsCategoryChips } from '@/components/sports/SportsCategoryChips';
import { SportsFilters } from '@/components/sports/SportsFilters';
import { VenueBrowserModal } from '@/components/sports/VenueBrowserModal';
import { MOCK_SPORTS_EVENTS, SPORTS_CATEGORIES, SPORTS_FILTER_OPTIONS } from '@/data/mockSportsEvents';
import { CITIES } from '@/data/mockData';
import { SportFilterState, SportEvent, User } from '@/types';

export default function SportsPage() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);

  // Unified Filter State
  const [filters, setFilters] = useState<SportFilterState>({
    sports: [],
    dateOption: null,
    customStartDate: null,
    customEndDate: null,
    moreFilters: [],
    venueCategory: null,
    priceRange: null,
    venueId: null,
  });

  // Modal States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<SportEvent | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const handleUpdateFilters = (updates: Partial<SportFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      sports: [],
      dateOption: null,
      customStartDate: null,
      customEndDate: null,
      moreFilters: [],
      venueCategory: null,
      priceRange: null,
      venueId: null,
    });
    setSearchQuery('');
  };

  const handleToggleSport = (sport: string) => {
    setFilters((prev) => {
      const exists = prev.sports.includes(sport);
      return {
        ...prev,
        sports: exists ? prev.sports.filter((s) => s !== sport) : [...prev.sports, sport],
      };
    });
  };

  // Active filters count for badge
  const activeFiltersCount =
    filters.sports.length +
    (filters.dateOption ? 1 : 0) +
    filters.moreFilters.length +
    (filters.venueCategory ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.venueId ? 1 : 0);

  // Filter Computation
  const filteredSports = useMemo(() => {
    return MOCK_SPORTS_EVENTS.filter((event) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesSport = event.sportType.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesDesc = event.description?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesSport && !matchesVenue && !matchesDesc) {
          return false;
        }
      }

      // 2. Sports Category Multi-Selection
      if (filters.sports.length > 0) {
        const matchesSport = filters.sports.some(
          (s) => s.toLowerCase() === event.sportType.toLowerCase()
        );
        if (!matchesSport) return false;
      }

      // 3. Venue Filter
      if (filters.venueId && event.venueId !== filters.venueId) {
        return false;
      }

      // 4. Date Filtering
      if (filters.dateOption) {
        if (filters.dateOption === 'This Weekend') {
          const isWeekend = event.date.includes('Sat') || event.date.includes('Sun');
          if (!isWeekend) return false;
        } else if (filters.dateOption === 'Custom Date Range') {
          if (filters.customStartDate && event.isoDate < filters.customStartDate) {
            return false;
          }
          if (filters.customEndDate && event.isoDate > filters.customEndDate) {
            return false;
          }
        }
      }

      // 5. More Filters
      if (filters.moreFilters.length > 0) {
        for (const mf of filters.moreFilters) {
          if (mf === 'Indoor' && event.venueType !== 'indoor' && event.isOutdoor) {
            return false;
          }
          if (mf === 'Outdoor' && event.venueType !== 'outdoor' && !event.isOutdoor) {
            return false;
          }
          if (mf === 'Family Friendly' && !event.isFamilyFriendly) {
            return false;
          }
          if (mf === 'Free Events' && event.startingPrice > 0 && !event.isFree) {
            return false;
          }
          if (mf === 'Available Tickets' && event.isAvailable === false) {
            return false;
          }
        }
      }

      // 6. Venue Category
      if (filters.venueCategory && event.venueCategory !== filters.venueCategory) {
        return false;
      }

      // 7. Price Range
      if (filters.priceRange) {
        const p = event.startingPrice;
        if (filters.priceRange === 'Free' && p > 0 && !event.isFree) return false;
        if (filters.priceRange === 'Under ₹500' && p >= 500) return false;
        if (filters.priceRange === '₹500–₹1,000' && (p < 500 || p > 1000)) return false;
        if (filters.priceRange === '₹1,000–₹3,000' && (p < 1000 || p > 3000)) return false;
        if (filters.priceRange === 'Above ₹3,000' && p <= 3000) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleQuickBook = (event: SportEvent) => {
    setSelectedEventForBooking(event);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 pb-28 lg:pb-16 selection:bg-[#85142f] selection:text-white">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={setCurrentCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. MOBILE HEADER (Matching BookMyShow Mobile Reference) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200/80 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="p-1 -ml-1 text-neutral-800 hover:text-[#85142f] transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </Link>
          <div>
            <h1 className="text-sm font-black text-neutral-950 leading-tight">
              Sports
            </h1>
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="text-[11px] text-neutral-500 font-medium hover:text-neutral-800 flex items-center gap-1 transition-colors"
            >
              <span>{currentCity}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSearchActive((p) => !p)}
          className={`p-2 rounded-full transition-colors ${
            isSearchActive || searchQuery
              ? 'bg-[#85142f] text-white'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
          aria-label="Search sports"
        >
          <Search className="w-5 h-5 stroke-[2.2px]" />
        </button>
      </header>

      {/* Mobile Search Dropdown */}
      {isSearchActive && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-2.5 sticky top-16 z-35 shadow-sm">
          <div className="relative flex items-center bg-neutral-100 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search running, football, car racing..."
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

      {/* Mobile Sticky Quick Category Bar */}
      <section className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-3 py-2 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {/* Filters Button with active count */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer shadow-xs active:scale-95 ${
              activeFiltersCount > 0
                ? 'border-[#85142f] bg-[#85142f] text-white'
                : 'border-[#85142f] bg-white text-[#85142f] hover:bg-rose-50/60'
            }`}
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.2px]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#85142f] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Sport Type Pills */}
          {SPORTS_CATEGORIES.map((type) => {
            const isSelected = filters.sports.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleSport(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {type}
              </button>
            );
          })}

          {/* Reset button if filters active */}
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

      {/* 3. MAIN CONTENT CONTAINER (TWO COLUMNS: 25% SIDEBAR + 75% CONTENT) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="lg:flex lg:gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS (~25% width on desktop) */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <SportsFilters
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              onOpenVenueBrowser={() => setIsVenueModalOpen(true)}
              totalEventsCount={MOCK_SPORTS_EVENTS.length}
              filteredEventsCount={filteredSports.length}
            />
          </div>

          {/* RIGHT CONTENT AREA: TITLE, CATEGORY CHIPS & EVENT GRID (~75% width) */}
          <div className="flex-1 min-w-0">
            {/* Main Title: "Sports In Bengaluru" (configurable city state) */}
            <div className="hidden lg:flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                  Sports In {currentCity}
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Explore running events, stadium matches, motorsports, and tournaments
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-500 bg-neutral-200/60 px-2.5 py-1 rounded-full">
                  {filteredSports.length} Event{filteredSports.length === 1 ? '' : 's'}
                </span>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#85142f] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Sports Category Chips Row */}
            <div className="hidden lg:block mb-5">
              <SportsCategoryChips
                selectedSports={filters.sports}
                onToggleSport={handleToggleSport}
                onClearSports={() => handleUpdateFilters({ sports: [] })}
              />
            </div>

            {/* Filter Pill Badges Indicator (when filters active) */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-500 font-semibold text-[11px]">
                  Active filters:
                </span>
                {filters.sports.map((sport) => (
                  <span
                    key={sport}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] font-bold text-[11px]"
                  >
                    <span>{sport}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleSport(sport)}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.dateOption && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] font-bold text-[11px]">
                    <span>{filters.dateOption}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateFilters({ dateOption: null })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.moreFilters.map((mf) => (
                  <span
                    key={mf}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] font-bold text-[11px]"
                  >
                    <span>{mf}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateFilters({
                          moreFilters: filters.moreFilters.filter((f) => f !== mf),
                        })
                      }
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.priceRange && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] font-bold text-[11px]">
                    <span>{filters.priceRange}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateFilters({ priceRange: null })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.venueId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] font-bold text-[11px]">
                    <span>Venue filter</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateFilters({ venueId: null })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-[#85142f] hover:underline ml-1"
                >
                  Reset
                </button>
              </div>
            )}

            {/* SPORTS EVENT GRID: 4 COLUMNS ON DESKTOP */}
            <section className="mb-14">
              {filteredSports.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-14 text-center flex flex-col items-center shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">
                    No Sports Events Found
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-6">
                    We couldn't find any sports matching your selected filters in {currentCity}. Try adjusting your sports types, price, or date filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-md hover:bg-[#6e1026] active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                /* 4-column responsive grid */
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {filteredSports.map((event) => (
                    <SportsEventCard
                      key={event.id}
                      event={event}
                      onQuickBook={handleQuickBook}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* EXPLORE ALL CATEGORIES (Matching BookMyShow Mobile Reference) */}
            <div className="py-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMobileFilterOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-bold text-[#85142f] shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#85142f]" />
                <span>Explore All Categories</span>
              </button>
            </div>

            {/* BREADCRUMB PATH */}
            <div className="py-3 text-xs text-neutral-500 font-medium border-t border-neutral-200/70">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5 text-neutral-400">→</span>
              <span className="text-neutral-800 font-semibold">Sports</span>
            </div>

            {/* KNOW MORE ABOUT SPORTS ACCORDION */}
            <div className="border-t border-neutral-200 bg-neutral-50/60 rounded-xl my-4 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsKnowMoreOpen(!isKnowMoreOpen)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <span>Know more about Sports</span>
                <span className="text-base font-light text-neutral-500">
                  {isKnowMoreOpen ? '−' : '+'}
                </span>
              </button>
              {isKnowMoreOpen && (
                <div className="px-4 pb-4 text-[11px] text-neutral-500 leading-relaxed space-y-2 animate-in fade-in duration-200">
                  <p>
                    Experience thrilling athletic competitions, grassroots marathons, and championship stadium matches in {currentCity}. BookKaro offers seamless online registrations for running marathons, football leagues, chess opens, motorsport track days, and more.
                  </p>
                  <p>
                    Whether you are an aspiring athlete looking to participate or a passionate supporter cheering from the grandstands, secure verified passes with instant confirmation and contactless entry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 4. MODALS */}

      {/* Venue Browser Modal */}
      <VenueBrowserModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        selectedVenueId={filters.venueId}
        onSelectVenue={(vId) => handleUpdateFilters({ venueId: vId })}
        currentCity={currentCity}
      />

      {/* City Selection Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                Select Your City
              </h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 py-4">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentCity(c.name);
                    setIsCityModalOpen(false);
                  }}
                  className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm transition-all ${
                    currentCity.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-[#85142f] text-white shadow-xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="h-14 px-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-1 rounded-full text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-6 h-6 stroke-[2px]" />
            </button>
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">
              Filters
            </h2>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#85142f] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-28">
            <SportsFilters
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              onOpenVenueBrowser={() => {
                setIsMobileFilterOpen(false);
                setIsVenueModalOpen(true);
              }}
              totalEventsCount={MOCK_SPORTS_EVENTS.length}
              filteredEventsCount={filteredSports.length}
            />
          </div>

          <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-200 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white text-sm font-extrabold tracking-tight shadow-md transition-all text-center"
            >
              Show {filteredSports.length} Event{filteredSports.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Mobile Filter Pill Button */}
      <div className="lg:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold tracking-tight shadow-xl shadow-[#85142f]/30 active:scale-95 transition-all cursor-pointer"
        >
          <Filter className="w-4 h-4 stroke-[2.2px]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#85142f] text-[10px] font-extrabold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          item={selectedEventForBooking}
          currentCity={currentCity}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedEventForBooking(null);
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Master BMS Footer */}
      <Footer currentCity={currentCity} />

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab="sports"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
