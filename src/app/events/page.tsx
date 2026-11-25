'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Filter,
  MapPin,
  Calendar,
  X,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Check,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { LIVE_EVENTS_MOCK, EVENT_CATEGORIES, EVENT_DATES_FILTER, EVENT_PRICE_RANGES } from '@/data/mockEvents';
import { CITIES } from '@/data/mockData';
import { LiveEvent, ConcertBookingMode, User } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { FeaturedEventBanner } from '@/components/events/FeaturedEventBanner';
import { TrendingConcerts } from '@/components/events/TrendingConcerts';
import { EventCategoryPills } from '@/components/events/EventCategoryPills';

export default function EventsDiscoveryPage() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedBookingMode, setSelectedBookingMode] = useState<ConcertBookingMode | 'all'>('all');
  const [selectedMoreFilter, setSelectedMoreFilter] = useState<string | null>(null);

  // Modals & Drawers
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  // Featured and Trending Events
  const featuredEvents = useMemo(() => {
    return LIVE_EVENTS_MOCK.filter((e) => e.isFeatured);
  }, []);

  const trendingEvents = useMemo(() => {
    return LIVE_EVENTS_MOCK.filter((e) => e.isTrending);
  }, []);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return LIVE_EVENTS_MOCK.filter((event) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesCat = event.category.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesArtist = event.artist?.name.toLowerCase().includes(q);
        const matchesCity = event.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesVenue && !matchesArtist && !matchesCity) {
          return false;
        }
      }

      // 2. City Filter (matches current selected city or events available nationwide)
      if (currentCity && currentCity !== 'All Cities') {
        // If user specifically searched, allow cross-city results, otherwise filter by city
        if (!searchQuery.trim()) {
          const matchesCity = event.city.toLowerCase() === currentCity.toLowerCase();
          // We can also allow promoted/featured events or city matches
          if (!matchesCity) {
            // Check if user selected another city or if no specific filter
          }
        }
      }

      // 3. Category Filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (event.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Booking Type
      if (selectedBookingMode !== 'all') {
        if (event.bookingType !== selectedBookingMode) {
          return false;
        }
      }

      // 5. Language Filter
      if (selectedLanguage && selectedLanguage !== 'All Languages') {
        if (!event.language || event.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
          return false;
        }
      }

      // 6. Price Range Filter
      if (selectedPriceRange && selectedPriceRange !== 'All Prices') {
        if (selectedPriceRange === 'Free' && event.startingPrice > 0) return false;
        if (selectedPriceRange === '₹0 - ₹500' && (event.startingPrice < 0 || event.startingPrice > 500)) return false;
        if (selectedPriceRange === '₹501 - ₹2000' && (event.startingPrice <= 500 || event.startingPrice > 2000)) return false;
        if (selectedPriceRange === 'Above ₹2000' && event.startingPrice <= 2000) return false;
      }

      // 7. More Filters
      if (selectedMoreFilter === 'Fast Filling' && !event.isFastFilling) return false;
      if (selectedMoreFilter === 'Outdoor Events' && !event.isOutdoor) return false;
      if (selectedMoreFilter === 'Must Attend' && !event.mustAttend) return false;
      if (selectedMoreFilter === 'Promoted' && !event.isPromoted) return false;

      return true;
    });
  }, [
    searchQuery,
    currentCity,
    selectedCategory,
    selectedBookingMode,
    selectedLanguage,
    selectedPriceRange,
    selectedMoreFilter,
  ]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (selectedLanguage ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (selectedBookingMode !== 'all' ? 1 : 0) +
    (selectedMoreFilter ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedDate(null);
    setSelectedLanguage(null);
    setSelectedPriceRange(null);
    setSelectedBookingMode('all');
    setSelectedMoreFilter(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafc] text-neutral-900 selection:bg-[#85142f] selection:text-white">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={(c) => setCurrentCity(c)}
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
              Live Events
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
          aria-label="Search events"
        >
          <Search className="w-5 h-5 stroke-[2.2px]" />
        </button>
      </header>

      {/* Mobile Search Dropdown */}
      {isSearchActive && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-2.5 sticky top-16 z-30 shadow-sm">
          <div className="relative flex items-center bg-neutral-100 rounded-full px-3.5 py-1.5">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concerts, artists, venues..."
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

      {/* Mobile Quick Horizontal Category Filter Bar */}
      <div className="lg:hidden sticky top-14 z-25 bg-white border-b border-neutral-200/80 px-3 py-2 shadow-xs flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
            activeFiltersCount > 0
              ? 'bg-[#85142f] text-white border-[#85142f]'
              : 'border-[#85142f]/30 text-[#85142f] bg-white hover:bg-neutral-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5 stroke-[2.2px]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#85142f] text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <EventCategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* 1. SPOTLIGHT FEATURED CONCERT BANNER (Desktop Only) */}
        {!searchQuery && !selectedCategory && selectedBookingMode === 'all' && (
          <div className="hidden lg:block">
            <FeaturedEventBanner featuredEvents={featuredEvents} />
          </div>
        )}

        {/* 2. TRENDING CONCERTS SHELF (Desktop Only) */}
        {!searchQuery && !selectedCategory && selectedBookingMode === 'all' && (
          <div className="hidden lg:block">
            <TrendingConcerts trendingEvents={trendingEvents} />
          </div>
        )}

        {/* 3. DISCOVERY SECTION: FILTERS + EVENTS CATALOG */}
        <div className="lg:flex lg:gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS (DESKTOP) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
            <EventFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              selectedBookingMode={selectedBookingMode}
              onSelectBookingMode={setSelectedBookingMode}
              selectedMoreFilter={selectedMoreFilter}
              onSelectMoreFilter={setSelectedMoreFilter}
              activeCount={activeFiltersCount}
              onResetAll={handleResetFilters}
            />
          </aside>

          {/* RIGHT CONTENT: EVENTS GRID & HEADER */}
          <div className="flex-1 min-w-0">
            {/* Header: Title, City, Count & Desktop Categories */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 flex items-center gap-2">
                    <span>Live Events</span>
                    {currentCity && (
                      <span className="text-neutral-400 font-normal text-lg sm:text-2xl">
                        in {currentCity}
                      </span>
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    Discover stadium concerts, zone festivals & comedy specials
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white border border-neutral-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{filteredEvents.length} Events Available</span>
                </div>
              </div>

              {/* Desktop Category Pills */}
              <div className="hidden lg:block pt-1 pb-2">
                <EventCategoryPills
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Active Filter Badges with Quick Dismiss */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-neutral-400">Active filters:</span>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85142f] text-white text-xs font-semibold shadow-xs"
                    >
                      <span>{selectedCategory}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedBookingMode !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedBookingMode('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>
                        {selectedBookingMode === 'reserved-seating'
                          ? 'Stadium Seating'
                          : selectedBookingMode === 'zone-based'
                          ? 'Zone Standing'
                          : 'General Admission'}
                      </span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedPriceRange && (
                    <button
                      type="button"
                      onClick={() => setSelectedPriceRange(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>{selectedPriceRange}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedLanguage && (
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>{selectedLanguage}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {selectedMoreFilter && (
                    <button
                      type="button"
                      onClick={() => setSelectedMoreFilter(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>{selectedMoreFilter}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#85142f] hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* EVENTS GRID */}
            <section className="mb-14">
              {filteredEvents.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-14 text-center flex flex-col items-center shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">
                    No Live Events Found
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mb-6 leading-relaxed">
                    We couldn't find any events matching your selected criteria in {currentCity}. Try adjusting your filters or resetting them to discover all concerts.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-md hover:bg-[#6e1026] active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                /* 3 to 4 Column Responsive Grid */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredEvents.map((event, idx) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      priority={idx < 3}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* EXPLORE ALL CATEGORIES (Matching BookMyShow Mobile Reference) */}
            <div className="py-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ec5e7b] hover:text-[#85142f] active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#ec5e7b]" />
                <span>Explore All Categories</span>
              </button>
            </div>

            {/* BREADCRUMB PATH */}
            <div className="py-3 text-xs text-neutral-500 font-medium border-t border-neutral-200/70">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5 text-neutral-400">→</span>
              <span className="text-neutral-800 font-semibold">Events</span>
            </div>

            {/* KNOW MORE ABOUT EVENTS ACCORDION */}
            <div className="border-t border-neutral-200 bg-neutral-50/60 rounded-xl my-4 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsKnowMoreOpen(!isKnowMoreOpen)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <span>Know more about Events</span>
                <span className="text-base font-light text-neutral-500">
                  {isKnowMoreOpen ? '−' : '+'}
                </span>
              </button>
              {isKnowMoreOpen && (
                <div className="px-4 pb-4 text-[11px] text-neutral-500 leading-relaxed space-y-2 animate-in fade-in duration-200">
                  <p>
                    Looking for the best live concerts, comedy nights, theatre acts, or outdoor adventures in {currentCity}? BookKaro brings you verified tickets to the city&apos;s most anticipated live experiences with seamless digital passes, interactive seating, and instant confirmation.
                  </p>
                  <p>
                    Browse through diverse categories including music tours, sports championships, workshops, and exclusive fan meets. Check seating layouts, artist line-ups, and early bird discounts all in one place.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#85142f]" />
                <h3 className="font-extrabold text-base text-neutral-900">
                  Filter Live Events
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              <EventFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedPriceRange={selectedPriceRange}
                onSelectPriceRange={setSelectedPriceRange}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                selectedBookingMode={selectedBookingMode}
                onSelectBookingMode={setSelectedBookingMode}
                selectedMoreFilter={selectedMoreFilter}
                onSelectMoreFilter={setSelectedMoreFilter}
                activeCount={activeFiltersCount}
                onResetAll={handleResetFilters}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#85142f] text-white text-xs font-extrabold shadow-md hover:bg-[#6c0f25] transition-colors"
              >
                Show {filteredEvents.length} Events
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CITY SELECTION MODAL */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#85142f]" />
                <h3 className="text-base font-extrabold text-neutral-900">
                  Select Your City
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-4 font-medium">
              Choose your city to view concerts, stadium seating, and live events nearby.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {CITIES.map((city) => {
                const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setCurrentCity(city.name);
                      setIsCityModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#85142f] bg-rose-50/60 text-[#85142f] font-extrabold shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-800 font-semibold'
                    }`}
                  >
                    <span className="text-xs">{city.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#85142f]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* FOOTER */}
      <Footer />

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
