'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  MapPin,
  Calendar,
  X,
  Filter,
} from 'lucide-react';
import { SPORTS_CATEGORIES, SPORTS_FILTER_OPTIONS } from '@/data/mockSportsEvents';
import { SportFilterState } from '@/types/sports';

interface SportsFiltersProps {
  filters: SportFilterState;
  onUpdateFilters: (newFilters: Partial<SportFilterState>) => void;
  onResetFilters: () => void;
  onOpenVenueBrowser: () => void;
  totalEventsCount: number;
  filteredEventsCount: number;
}

export const SportsFilters: React.FC<SportsFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  onOpenVenueBrowser,
  totalEventsCount,
  filteredEventsCount,
}) => {
  // Accordion open/close states
  const [isSportTypeOpen, setIsSportTypeOpen] = useState(true);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Toggle multi-select sports
  const toggleSport = (sport: string) => {
    const next = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport];
    onUpdateFilters({ sports: next });
  };

  // Toggle multi-select more filters
  const toggleMoreFilter = (mf: string) => {
    const next = filters.moreFilters.includes(mf)
      ? filters.moreFilters.filter((f) => f !== mf)
      : [...filters.moreFilters, mf];
    onUpdateFilters({ moreFilters: next });
  };

  // Active filter counters
  const activeFiltersCount =
    filters.sports.length +
    (filters.dateOption ? 1 : 0) +
    filters.moreFilters.length +
    (filters.venueCategory ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.venueId ? 1 : 0);

  return (
    <aside className="w-full space-y-3.5 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#85142f] text-white text-[11px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-[#85142f] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Accordion 1: Sports Type (Multi-selection rectangular chips) */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer"
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
            {filters.sports.length > 0 && (
              <span className="text-[11px] font-black text-[#85142f] bg-rose-50 px-1.5 py-0.2 rounded-sm">
                ({filters.sports.length})
              </span>
            )}
          </div>
          {filters.sports.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateFilters({ sports: [] });
              }}
              className="text-[11px] text-neutral-400 hover:text-[#85142f] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {isSportTypeOpen && (
          <div className="mt-3 flex flex-wrap gap-2 pt-1 border-t border-neutral-100 animate-in fade-in duration-150">
            {SPORTS_CATEGORIES.map((sport) => {
              const isSelected = filters.sports.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleSport(sport)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white shadow-xs font-bold'
                      : 'bg-white text-[#85142f] border border-rose-200/90 hover:border-[#85142f] hover:bg-rose-50/50'
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: Date (Collapsible + Custom Date Picker) */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDateOpen(!isDateOpen)}
        >
          <div className="flex items-center gap-2">
            {isDateOpen ? (
              <ChevronUp className="w-4 h-4 text-[#85142f]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
            <span className="text-sm font-bold text-[#85142f]">Date</span>
            {filters.dateOption && (
              <span className="text-[11px] font-black text-[#85142f] bg-rose-50 px-1.5 py-0.2 rounded-sm">
                (1)
              </span>
            )}
          </div>
          {filters.dateOption && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateFilters({
                  dateOption: null,
                  customStartDate: null,
                  customEndDate: null,
                });
              }}
              className="text-[11px] text-neutral-400 hover:text-[#85142f] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {isDateOpen && (
          <div className="mt-3 space-y-2.5 pt-1 border-t border-neutral-100 animate-in fade-in duration-150">
            <div className="flex flex-wrap gap-2">
              {SPORTS_FILTER_OPTIONS.dates.map((d) => {
                const isSelected = filters.dateOption === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onUpdateFilters({
                        dateOption: isSelected ? null : d,
                        customStartDate: isSelected ? null : filters.customStartDate,
                        customEndDate: isSelected ? null : filters.customEndDate,
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#85142f] text-white font-bold shadow-xs'
                        : 'bg-white text-[#85142f] border border-rose-200/90 hover:border-[#85142f] hover:bg-rose-50/50'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Custom Date Range Picker Inputs */}
            {filters.dateOption === 'Custom Date Range' && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2 mt-2">
                <span className="text-[11px] font-bold text-neutral-700 block">
                  Select Custom Date Window:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.customStartDate || ''}
                      onChange={(e) =>
                        onUpdateFilters({ customStartDate: e.target.value })
                      }
                      className="w-full text-xs p-1.5 rounded-md border border-neutral-300 bg-white focus:outline-none focus:border-[#85142f]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-semibold block mb-0.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.customEndDate || ''}
                      onChange={(e) =>
                        onUpdateFilters({ customEndDate: e.target.value })
                      }
                      className="w-full text-xs p-1.5 rounded-md border border-neutral-300 bg-white focus:outline-none focus:border-[#85142f]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: More Filters (Indoor/Outdoor, Family Friendly, Free, Venue Type) */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer"
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
            {(filters.moreFilters.length > 0 || filters.venueCategory) && (
              <span className="text-[11px] font-black text-[#85142f] bg-rose-50 px-1.5 py-0.2 rounded-sm">
                ({filters.moreFilters.length + (filters.venueCategory ? 1 : 0)})
              </span>
            )}
          </div>
          {(filters.moreFilters.length > 0 || filters.venueCategory) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateFilters({ moreFilters: [], venueCategory: null });
              }}
              className="text-[11px] text-neutral-400 hover:text-[#85142f] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {isMoreFiltersOpen && (
          <div className="mt-3 space-y-3 pt-1 border-t border-neutral-100 animate-in fade-in duration-150">
            {/* General Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {SPORTS_FILTER_OPTIONS.moreFilters.map((mf) => {
                const isSelected = filters.moreFilters.includes(mf);
                return (
                  <button
                    key={mf}
                    type="button"
                    onClick={() => toggleMoreFilter(mf)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#85142f] text-white font-bold shadow-xs'
                        : 'bg-white text-[#85142f] border border-rose-200/90 hover:border-[#85142f] hover:bg-rose-50/50'
                    }`}
                  >
                    {mf}
                  </button>
                );
              })}
            </div>

            {/* Venue Type Sub-Chips */}
            <div className="pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-bold text-neutral-600 block mb-1.5">
                Event Venue Type:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SPORTS_FILTER_OPTIONS.venueCategories.map((vc) => {
                  const isSelected = filters.venueCategory === vc;
                  return (
                    <button
                      key={vc}
                      type="button"
                      onClick={() =>
                        onUpdateFilters({ venueCategory: isSelected ? null : vc })
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#85142f] text-white font-bold'
                          : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {vc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Price */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <div className="flex items-center gap-2">
            {isPriceOpen ? (
              <ChevronUp className="w-4 h-4 text-[#85142f]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
            <span className="text-sm font-bold text-[#85142f]">Price</span>
            {filters.priceRange && (
              <span className="text-[11px] font-black text-[#85142f] bg-rose-50 px-1.5 py-0.2 rounded-sm">
                (1)
              </span>
            )}
          </div>
          {filters.priceRange && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateFilters({ priceRange: null });
              }}
              className="text-[11px] text-neutral-400 hover:text-[#85142f] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {isPriceOpen && (
          <div className="mt-3 flex flex-wrap gap-2 pt-1 border-t border-neutral-100 animate-in fade-in duration-150">
            {SPORTS_FILTER_OPTIONS.priceRanges.map((pr) => {
              const isSelected = filters.priceRange === pr;
              return (
                <button
                  key={pr}
                  type="button"
                  onClick={() =>
                    onUpdateFilters({ priceRange: isSelected ? null : pr })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#85142f] text-white font-bold shadow-xs'
                      : 'bg-white text-[#85142f] border border-rose-200/90 hover:border-[#85142f] hover:bg-rose-50/50'
                  }`}
                >
                  {pr}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 5 / Button: Browse by Venues */}
      <button
        type="button"
        onClick={onOpenVenueBrowser}
        className="w-full py-3 px-4 rounded-xl border border-rose-200/90 bg-white hover:bg-rose-50/60 text-[#85142f] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
      >
        <MapPin className="w-4 h-4 text-[#85142f]" />
        <span>Browse by Venues</span>
        {filters.venueId && (
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#85142f] text-white text-[10px]">
            Active
          </span>
        )}
      </button>
    </aside>
  );
};
