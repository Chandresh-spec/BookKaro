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
  MapPin,
  Calendar,
  X,
  RotateCcw,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  EVENTS_LIST,
  EVENTS_FILTERS,
  CITIES,
} from '@/data/mockData';
import { LiveEvent, User } from '@/types';

export default function EventsPage() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Active Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedMoreFilter, setSelectedMoreFilter] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  // Sidebar accordions
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(true);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string | null>(null);
  const [tempLanguage, setTempLanguage] = useState<string | null>(null);
  const [tempMoreFilter, setTempMoreFilter] = useState<string | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState<string | null>(null);

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<LiveEvent | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const handleOpenFilterModal = () => {
    setTempCategory(selectedCategory);
    setTempDate(selectedDate);
    setTempLanguage(selectedLanguage);
    setTempMoreFilter(selectedMoreFilter);
    setTempPriceRange(selectedPriceRange);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedDate(tempDate);
    setSelectedLanguage(tempLanguage);
    setSelectedMoreFilter(tempMoreFilter);
    setSelectedPriceRange(tempPriceRange);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedDate(null);
    setSelectedLanguage(null);
    setSelectedMoreFilter(null);
    setSelectedPriceRange(null);
    setTempCategory(null);
    setTempDate(null);
    setTempLanguage(null);
    setTempMoreFilter(null);
    setTempPriceRange(null);
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (selectedLanguage ? 1 : 0) +
    (selectedMoreFilter ? 1 : 0) +
    (selectedPriceRange ? 1 : 0);

  // Filter events
  const filteredEvents = useMemo(() => {
    return EVENTS_LIST.filter((event) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesCat = event.category.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesVenue) return false;
      }

      // Category
      if (selectedCategory) {
        if (event.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Language
      if (selectedLanguage) {
        if (!event.language || event.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
      }

      // More Filters
      if (selectedMoreFilter === 'Outdoor Events' && !event.isOutdoor) return false;
      if (selectedMoreFilter === 'Fast Filling' && !event.isFastFilling) return false;
      if (selectedMoreFilter === 'Must Attend' && !event.mustAttend) return false;

      // Price Range
      if (selectedPriceRange === 'Free' && event.startingPrice > 0) return false;
      if (selectedPriceRange === '0 - 500' && (event.startingPrice < 0 || event.startingPrice > 500)) return false;
      if (selectedPriceRange === '501 - 2000' && (event.startingPrice <= 500 || event.startingPrice > 2000)) return false;
      if (selectedPriceRange === 'Above 2000' && event.startingPrice <= 2000) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDate, selectedLanguage, selectedMoreFilter, selectedPriceRange]);

  const handleOpenBooking = (event: LiveEvent) => {
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
          onSelectCity={(c) => setCurrentCity(c)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 leading-tight">
              Live Events
            </h1>
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="text-xs text-neutral-500 font-medium hover:text-neutral-800 flex items-center gap-1 transition-colors"
            >
              <span>{currentCity}</span>
              <span>|</span>
              <span className="font-semibold text-neutral-700">{filteredEvents.length} Events</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSearchActive((p) => !p)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isSearchActive || searchQuery
              ? 'bg-[#85142f] text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
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
              placeholder="Search concerts, comedy shows, workshops..."
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

      {/* Mobile Sticky Quick Horizontal Pills Bar (Matches BMS Mobile Experience) */}
      <section className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-3 py-2 shadow-xs">
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

          {/* Quick Categories Pills */}
          {EVENTS_FILTERS.categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(isActive ? null : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Quick Date Pills */}
          {EVENTS_FILTERS.dates.slice(0, 3).map((d) => {
            const isActive = selectedDate === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(isActive ? null : d)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {d}
              </button>
            );
          })}

          {/* Quick Language Pills */}
          {EVENTS_FILTERS.languages.slice(0, 4).map((l) => {
            const isActive = selectedLanguage === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLanguage(isActive ? null : l)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {l}
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

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-6">
        <div className="lg:flex lg:gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS (Matching Images 2 & 3) */}
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
              {/* Accordion 1: Categories */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isCategoriesOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Categories
                    </span>
                  </div>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isCategoriesOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EVENTS_FILTERS.categories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(isSelected ? null : cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold shadow-xs'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f] hover:bg-rose-50/50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Date */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsDateOpen(!isDateOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isDateOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Date
                    </span>
                  </div>
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isDateOpen && (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {EVENTS_FILTERS.dates.map((d) => {
                        const isSelected = selectedDate === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDate(isSelected ? null : d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#85142f] text-white font-bold'
                                : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-neutral-600 font-medium cursor-pointer pt-1">
                      <input type="checkbox" className="rounded accent-[#85142f]" />
                      <span>Date Range</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Accordion 3: Languages */}
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
                    {EVENTS_FILTERS.languages.map((lang) => {
                      const isSelected = selectedLanguage === lang;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setSelectedLanguage(isSelected ? null : lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: More Filters */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isMoreFiltersOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      More Filters
                    </span>
                  </div>
                  {selectedMoreFilter && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMoreFilter(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isMoreFiltersOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EVENTS_FILTERS.moreFilters.map((mf) => {
                      const isSelected = selectedMoreFilter === mf;
                      return (
                        <button
                          key={mf}
                          type="button"
                          onClick={() => setSelectedMoreFilter(isSelected ? null : mf)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                          }`}
                        >
                          {mf}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 5: Price */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isPriceOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Price
                    </span>
                  </div>
                  {selectedPriceRange && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPriceRange(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isPriceOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EVENTS_FILTERS.priceRanges.map((pr) => {
                      const isSelected = selectedPriceRange === pr;
                      return (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setSelectedPriceRange(isSelected ? null : pr)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                          }`}
                        >
                          {pr}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Browse by Venues */}
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200/90 bg-white hover:bg-rose-50/50 text-[#85142f] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Browse by Venues</span>
              </button>
            </div>
          </aside>

          {/* RIGHT CONTENT: EVENTS IN BENGALURU */}
          <div className="flex-1 min-w-0">
            {/* Header: Title + Events Count */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
                Events In {currentCity}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-500">
                  {filteredEvents.length} Events Available
                </span>
                {filteredEvents.length === 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#85142f] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Top Quick Horizontal Category Pills */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              {EVENTS_FILTERS.categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(isActive ? null : cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#85142f] text-white shadow-xs font-bold'
                        : 'bg-white text-[#85142f] border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* EVENTS GRID: 4 COLUMNS ON DESKTOP */}
            <section className="mb-12">
              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900 mb-2">
                    No Events Found
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-5">
                    We couldn't find any events matching your selected filters in {currentCity}.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#85142f] text-white text-xs font-bold shadow-md hover:bg-[#6e1026] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleOpenBooking(event)}
                      className="group flex flex-col justify-between cursor-pointer rounded-2xl bg-white border border-neutral-200/60 p-2 sm:p-2.5 shadow-2xs hover:shadow-md hover:border-[#85142f]/30 transition-all duration-200"
                    >
                      <div>
                        {/* Event Poster Container */}
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 mb-2.5 shadow-inner">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-104 transition-transform duration-500"
                          />

                          {/* PROMOTED Badge on Top-Right (Matching Mockup 2) */}
                          {event.isPromoted && (
                            <div className="absolute top-2 right-2 z-10">
                              <span className="px-2 py-0.5 rounded bg-[#e11d48] text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                                PROMOTED
                              </span>
                            </div>
                          )}

                          {/* Date Badge on Bottom Overlay (Matching Mockups 2 & 3) */}
                          <div className="absolute inset-x-0 bottom-0 bg-black/90 p-2 text-left">
                            <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight">
                              {event.date}
                            </span>
                          </div>
                        </div>

                        {/* Title, Venue, Category & Price */}
                        <div className="px-1">
                          <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate leading-snug group-hover:text-[#85142f] transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                            {event.venue}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-medium truncate">
                            {event.category}
                          </p>
                          <p className="text-xs font-extrabold text-neutral-900 mt-1">
                            {event.currency} {event.startingPrice} onwards
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 px-1 pb-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(event);
                          }}
                          className="w-full py-1.5 sm:py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-[11px] sm:text-xs font-bold tracking-tight transition-all active:scale-95 shadow-xs text-center cursor-pointer"
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

      {/* City Modal */}
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
                  className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm ${
                    currentCity.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-[#85142f] text-white'
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

      {/* Mobile Filter Modal */}
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
                setTempCategory(null);
                setTempDate(null);
                setTempLanguage(null);
                setTempMoreFilter(null);
                setTempPriceRange(null);
              }}
              className="text-xs font-semibold text-[#85142f] hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            {/* Categories */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Categories
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {EVENTS_FILTERS.categories.map((cat) => {
                  const isSelected = tempCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTempCategory(isSelected ? null : cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Date
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {EVENTS_FILTERS.dates.map((d) => {
                  const isSelected = tempDate === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTempDate(isSelected ? null : d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Languages
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {EVENTS_FILTERS.languages.map((l) => {
                  const isSelected = tempLanguage === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTempLanguage(isSelected ? null : l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* More Filters */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                More Filters
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {EVENTS_FILTERS.moreFilters.map((mf) => {
                  const isSelected = tempMoreFilter === mf;
                  return (
                    <button
                      key={mf}
                      type="button"
                      onClick={() => setTempMoreFilter(isSelected ? null : mf)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {mf}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Price
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {EVENTS_FILTERS.priceRanges.map((pr) => {
                  const isSelected = tempPriceRange === pr;
                  return (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setTempPriceRange(isSelected ? null : pr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {pr}
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        item={selectedEventForBooking}
        currentCity={currentCity}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedEventForBooking(null);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Floating Mobile Filter Pill Button (Always accessible on mobile) */}
      <div className="lg:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={handleOpenFilterModal}
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

      {/* Master BMS Footer */}
      <Footer currentCity={currentCity} />

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab="live-events"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}