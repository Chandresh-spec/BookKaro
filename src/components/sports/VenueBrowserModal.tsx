'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, MapPin, Trophy, Train, Users, Check, Filter } from 'lucide-react';
import { MOCK_SPORTS_VENUES } from '@/data/mockSportsVenues';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
import { SportVenue } from '@/types/sports';

interface VenueBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string | null) => void;
  currentCity: string;
}

export const VenueBrowserModal: React.FC<VenueBrowserModalProps> = ({
  isOpen,
  onClose,
  selectedVenueId,
  onSelectVenue,
  currentCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredVenues = MOCK_SPORTS_VENUES.filter((venue) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      venue.name.toLowerCase().includes(q) ||
      venue.area.toLowerCase().includes(q) ||
      venue.sportsSupported.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#85142f] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                Browse Sports Venues
              </h2>
              <p className="text-xs text-neutral-500">
                Explore sporting grounds & arenas across {currentCity}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Active venue indicator */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/70 flex flex-col gap-2 shrink-0">
          <input
            type="text"
            placeholder="Search venue name, area, or sport (e.g. Kanteerava, Cubbon Park, Karting)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#85142f]"
          />

          {selectedVenueId && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-[#85142f] font-semibold">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Filtered by venue
              </span>
              <button
                type="button"
                onClick={() => onSelectVenue(null)}
                className="underline hover:text-[#6e1026] cursor-pointer"
              >
                Clear venue filter
              </button>
            </div>
          )}
        </div>

        {/* Venues List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredVenues.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs sm:text-sm">
              No sporting venues matched your search.
            </div>
          ) : (
            filteredVenues.map((venue) => {
              const venueEvents = MOCK_SPORTS_EVENTS.filter(
                (e) => e.venueId === venue.id || e.venue.toLowerCase().includes(venue.name.toLowerCase())
              );
              const isSelected = selectedVenueId === venue.id;

              return (
                <div
                  key={venue.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#85142f] bg-rose-50/30 ring-1 ring-[#85142f]/30'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                    {/* Venue Image */}
                    <div className="relative w-full sm:w-32 h-28 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider">
                        {venue.category}
                      </span>
                    </div>

                    {/* Venue Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-neutral-900">
                            {venue.name}
                          </h3>
                          <p className="text-xs text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#85142f] shrink-0" />
                            <span>{venue.area}, {venue.city}</span>
                          </p>
                        </div>

                        {venue.capacity && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md shrink-0">
                            <Users className="w-3 h-3 text-neutral-500" />
                            {venue.capacity}
                          </span>
                        )}
                      </div>

                      {/* Metro & Address */}
                      {venue.metroConnectivity && (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1 truncate">
                          <Train className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span>{venue.metroConnectivity}</span>
                        </p>
                      )}

                      {/* Sports supported tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {venue.sportsSupported.map((sport) => (
                          <span
                            key={sport}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-bold"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>

                      {/* Associated events count & filter action */}
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-neutral-100">
                        <span className="text-xs font-semibold text-neutral-600">
                          {venueEvents.length} sport event{venueEvents.length === 1 ? '' : 's'} scheduled
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              onSelectVenue(null);
                            } else {
                              onSelectVenue(venue.id);
                              onClose();
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-800 text-white hover:bg-neutral-900'
                              : 'bg-[#85142f] text-white hover:bg-[#6e1026] shadow-xs active:scale-95'
                          }`}
                        >
                          {isSelected ? 'Remove Filter' : 'View Events Here'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
