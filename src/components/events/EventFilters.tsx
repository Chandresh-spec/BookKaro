'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  X,
  Check,
  Tag,
  Calendar,
  Sparkles,
  MapPin,
  Layers,
} from 'lucide-react';
import {
  EVENT_CATEGORIES,
  EVENT_DATES_FILTER,
  EVENT_PRICE_RANGES,
  EVENT_LANGUAGES,
  EVENT_BOOKING_MODES,
} from '@/data/mockEvents';
import { ConcertBookingMode } from '@/types/event';

interface EventFiltersProps {
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  selectedPriceRange: string | null;
  onSelectPriceRange: (price: string | null) => void;
  selectedLanguage: string | null;
  onSelectLanguage: (lang: string | null) => void;
  selectedBookingMode: ConcertBookingMode | 'all';
  onSelectBookingMode: (mode: ConcertBookingMode | 'all') => void;
  selectedMoreFilter: string | null;
  onSelectMoreFilter: (filter: string | null) => void;
  activeCount: number;
  onResetAll: () => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDate,
  onSelectDate,
  selectedPriceRange,
  onSelectPriceRange,
  selectedLanguage,
  onSelectLanguage,
  selectedBookingMode,
  onSelectBookingMode,
  selectedMoreFilter,
  onSelectMoreFilter,
  activeCount,
  onResetAll,
}) => {
  // Accordion open/close states
  const [isModeOpen, setIsModeOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreFilterOptions = ['Fast Filling', 'Outdoor Events', 'Must Attend', 'Promoted'];

  return (
    <div className="space-y-3.5">
      {/* Filters Title & Reset */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#85142f]" />
          <h2 className="text-lg font-black tracking-tight text-neutral-900">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#85142f] text-white text-[11px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-bold text-[#85142f] hover:text-[#5f0d22] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Accordion 1: Booking Mode (Key Architectural Feature) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsModeOpen(!isModeOpen)}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#85142f]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Booking Type
            </span>
          </div>
          {isModeOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </div>

        {isModeOpen && (
          <div className="mt-3 flex flex-col gap-1.5">
            {EVENT_BOOKING_MODES.map((mode) => {
              const isSelected = selectedBookingMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectBookingMode(mode.id as any)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-50 border border-transparent'
                  }`}
                >
                  <span>{mode.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5px]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: Categories */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            Categories
          </span>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <span className="text-[10px] font-bold text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            {isCategoryOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </div>
        </div>

        {isCategoryOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENT_CATEGORIES.map((cat) => {
              const isSelected =
                cat.id === 'all'
                  ? selectedCategory === null
                  : selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50/60 hover:text-[#85142f] border border-neutral-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 3: Date */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsDateOpen(!isDateOpen)}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            Date
          </span>
          <div className="flex items-center gap-2">
            {selectedDate && (
              <span className="text-[10px] font-bold text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            {isDateOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </div>
        </div>

        {isDateOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENT_DATES_FILTER.map((d) => {
              const isSelected =
                d === 'All Dates' ? selectedDate === null : selectedDate === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onSelectDate(d === 'All Dates' ? null : d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50/60 hover:text-[#85142f] border border-neutral-200/70'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 4: Price Range */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            Price Range
          </span>
          <div className="flex items-center gap-2">
            {selectedPriceRange && (
              <span className="text-[10px] font-bold text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            {isPriceOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </div>
        </div>

        {isPriceOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENT_PRICE_RANGES.map((p) => {
              const isSelected =
                p === 'All Prices'
                  ? selectedPriceRange === null
                  : selectedPriceRange === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    onSelectPriceRange(p === 'All Prices' ? null : p)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50/60 hover:text-[#85142f] border border-neutral-200/70'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 5: Languages */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            Language
          </span>
          {isLanguageOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </div>

        {isLanguageOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENT_LANGUAGES.map((lang) => {
              const isSelected =
                lang === 'All Languages'
                  ? selectedLanguage === null
                  : selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() =>
                    onSelectLanguage(lang === 'All Languages' ? null : lang)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50/60 hover:text-[#85142f] border border-neutral-200/70'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 6: More Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsMoreOpen(!isMoreOpen)}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            More Filters
          </span>
          {isMoreOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </div>

        {isMoreOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {moreFilterOptions.map((opt) => {
              const isSelected = selectedMoreFilter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    onSelectMoreFilter(isSelected ? null : opt)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50/60 hover:text-[#85142f] border border-neutral-200/70'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
