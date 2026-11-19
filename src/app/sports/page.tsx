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
  Trophy,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  SPORTS_EVENTS,
  SPORTS_FILTERS,
  CITIES,
} from '@/data/mockData';
import { SportEvent, User } from '@/types';

export default function SportsPage() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filters
  const [selectedSportType, setSelectedSportType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMoreFilter, setSelectedMoreFilter] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  // Sidebar accordion states
  const [isSportTypeOpen, setIsSportTypeOpen] = useState(true);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSportType, setTempSportType] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string | null>(null);
  const [tempMoreFilter, setTempMoreFilter] = useState<string | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState<string | null>(null);

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<any | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const handleOpenFilterModal = () => {
    setTempSportType(selectedSportType);
    setTempDate(selectedDate);
    setTempMoreFilter(selectedMoreFilter);
    setTempPriceRange(selectedPriceRange);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setSelectedSportType(tempSportType);
    setSelectedDate(tempDate);
    setSelectedMoreFilter(tempMoreFilter);
    setSelectedPriceRange(tempPriceRange);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedSportType(null);
    setSelectedDate(null);
    setSelectedMoreFilter(null);
    setSelectedPriceRange(null);
    setTempSportType(null);
    setTempDate(null);
    setTempMoreFilter(null);
    setTempPriceRange(null);
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedSportType ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (selectedMoreFilter ? 1 : 0) +
    (selectedPriceRange ? 1 : 0);

  // Filter logic
  const filteredSports = useMemo(() => {
    return SPORTS_EVENTS.filter((event) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesType = event.sportType.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        if (!matchesTitle && !matchesType && !matchesVenue) return false;
      }

      // Sport Type
      if (selectedSportType) {
        if (event.sportType.toLowerCase() !== selectedSportType.toLowerCase()) return false;
      }

      // More Filters
      if (selectedMoreFilter === 'Outdoor Events' && !event.isOutdoor) return false;
      if (selectedMoreFilter === 'Fast Filling' && !event.isFastFilling) return false;

      // Price Range
      if (selectedPriceRange === 'Free' && event.startingPrice > 0) return false;
      if (selectedPriceRange === '0 - 500' && (event.startingPrice < 0 || event.startingPrice > 500)) return false;
      if (selectedPriceRange === '501 - 2000' && (event.startingPrice <= 500 || event.startingPrice > 2000)) return false;
      if (selectedPriceRange === 'Above 2000' && event.startingPrice <= 2000) return false;

      return true;
    });
  }, [searchQuery, selectedSportType, selectedDate, selectedMoreFilter, selectedPriceRange]);

  const handleOpenBooking = (event: SportEvent) => {
    setSelectedEventForBooking({
      id: event.id,
      title: event.title,
      category: event.sportType,
      date: event.date,
      time: event.time || '6:00 AM',
      venue: event.venue,
      city: currentCity,
      startingPrice: event.startingPrice,
      currency: event.currency,
      image: event.image,
    });
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
              Sports
            </h1>
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="text-xs text-neutral-500 font-medium hover:text-neutral-800 flex items-center gap-1 transition-colors"
            >
              <span>{currentCity}</span>
              <span>|</span>
              <span className="font-semibold text-neutral-700">{filteredSports.length} Events</span>
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
          aria-label="Search sports"
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

      {/* Mobile Sticky Quick Pills Bar (Matches BMS Mobile Experience) */}
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

          {/* Quick Sport Type Pills */}
          {SPORTS_FILTERS.sportTypes.map((type) => {
            const isActive = selectedSportType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedSportType(isActive ? null : type)}
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

          {/* Quick Date Pills */}
          {SPORTS_FILTERS.dates.slice(0, 3).map((d) => {
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

          {/* Quick More Filter Pills */}
          {SPORTS_FILTERS.moreFilters.map((mf) => {
            const isActive = selectedMoreFilter === mf;
            return (
              <button
                key={mf}
                type="button"
                onClick={() => setSelectedMoreFilter(isActive ? null : mf)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {mf}
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

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-6">
        <div className="lg:flex lg:gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS (Matching Mockup 1) */}
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
              {/* Accordion 1: Sports Type */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsSportTypeOpen(!isSportTypeOpen)}
                >
                  <div className="flex items-center gap-2">
                    {isSportTypeOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#85142f]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-bold text-[#85142f]">
                      Sports Type
                    </span>
                  </div>
                  {selectedSportType && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSportType(null);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-[#85142f] font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {isSportTypeOpen && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SPORTS_FILTERS.sportTypes.map((type) => {
                      const isSelected = selectedSportType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedSportType(isSelected ? null : type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#85142f] text-white font-bold shadow-xs'
                              : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f] hover:bg-rose-50/50'
                          }`}
                        >
                          {type}
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
                      {SPORTS_FILTERS.dates.map((d) => {
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

              {/* Accordion 3: More Filters */}
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
                    {SPORTS_FILTERS.moreFilters.map((mf) => {
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

              {/* Accordion 4: Price */}
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
                    {SPORTS_FILTERS.priceRanges.map((pr) => {
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

              {/* Browse by Venues button */}
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200/90 bg-white hover:bg-rose-50/50 text-[#85142f] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Browse by Venues</span>
              </button>
            </div>
          </aside>

          {/* RIGHT CONTENT: SPORTS IN BENGALURU */}
          <div className="flex-1 min-w-0">
            {/* Header: Title + Event Count */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
                Sports In {currentCity}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-500">
                  {filteredSports.length} Events Available
                </span>
                {filteredSports.length === 0 && (
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

            {/* Desktop Top Quick Sports Pills */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              {SPORTS_FILTERS.sportTypes.map((type) => {
                const isActive = selectedSportType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedSportType(isActive ? null : type)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#85142f] text-white shadow-xs font-bold'
                        : 'bg-white text-[#85142f] border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* SPORTS GRID: 4 COLUMNS ON DESKTOP */}
            <section className="mb-12">
              {filteredSports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900 mb-2">
                    No Sports Events Found
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-5">
                    We couldn't find any sports events matching your current filters in {currentCity}.
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
                  {filteredSports.map((event) => (
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

                          {/* Date Badge on Bottom Overlay (Matching Image 1) */}
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
                            {event.distanceOrCategory || event.sportType}
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
                          Book Now
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
                setTempSportType(null);
                setTempDate(null);
                setTempMoreFilter(null);
                setTempPriceRange(null);
              }}
              className="text-xs font-semibold text-[#85142f] hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            {/* Section 1: Sports Type */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Sports Type
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {SPORTS_FILTERS.sportTypes.map((type) => {
                  const isSelected = tempSportType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTempSportType(isSelected ? null : type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-white text-[#85142f] border border-rose-200/80 hover:border-[#85142f]'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Date */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Date
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {SPORTS_FILTERS.dates.map((d) => {
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

            {/* Section 3: More Filters */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                More Filters
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {SPORTS_FILTERS.moreFilters.map((mf) => {
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

            {/* Section 4: Price */}
            <div>
              <div className="bg-[#ededed] px-4 py-2.5 text-xs font-bold text-neutral-800 tracking-tight">
                Price
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {SPORTS_FILTERS.priceRanges.map((pr) => {
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

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab="sports"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}