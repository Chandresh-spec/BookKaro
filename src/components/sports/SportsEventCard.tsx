'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Trophy } from 'lucide-react';
import { SportEvent } from '@/types/sports';

interface SportsEventCardProps {
  event: SportEvent;
  onQuickBook?: (event: SportEvent) => void;
}

export const SportsEventCard: React.FC<SportsEventCardProps> = ({ event }) => {
  return (
    <Link
      href={`/sports/${event.id}`}
      className="group flex flex-col justify-between cursor-pointer rounded-2xl bg-white border border-neutral-200/80 p-2 sm:p-2.5 shadow-2xs hover:shadow-xl hover:border-[#85142f]/40 transition-all duration-300"
    >
      <div>
        {/* Poster Container - Tall Portrait Poster (~2:3 Aspect Ratio matching BookMyShow) */}
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-neutral-900 mb-2.5 shadow-inner">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />

          {/* Top Status Badges (Fast Filling / Free) */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            {event.isFastFilling ? (
              <span className="px-2 py-0.5 rounded-md bg-[#85142f]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                Fast Filling
              </span>
            ) : event.isFree ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                Free Entry
              </span>
            ) : (
              <span />
            )}

            {event.isFamilyFriendly && (
              <span className="px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-neutral-100 text-[10px] font-bold shadow-xs">
                Family
              </span>
            )}
          </div>

          {/* Dark Date Strip Overlay at Bottom of Poster (Matching BookMyShow screenshot) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-6 pb-2 px-2.5 text-left">
            <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight drop-shadow-xs">
              {event.date}
            </span>
          </div>
        </div>

        {/* Event Details (Matching BookMyShow layout) */}
        <div className="px-1 space-y-0.5">
          {/* Title with 2-line clamp */}
          <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#85142f] transition-colors min-h-[2.25rem]">
            {event.title}
          </h3>

          {/* Venue & City */}
          <p className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate pt-0.5">
            {event.venue}
          </p>

          {/* Sports Category / Distance */}
          <p className="text-[11px] text-neutral-400 font-semibold truncate">
            {event.distanceOrCategory || event.sportType}
          </p>

          {/* Starting Ticket Price */}
          <p className="text-xs sm:text-sm font-extrabold text-neutral-950 pt-1">
            {event.startingPrice === 0 ? (
              <span className="text-emerald-700">Free</span>
            ) : (
              <span>
                {event.currency} {event.startingPrice}{' '}
                <span className="text-[10px] sm:text-xs font-normal text-neutral-500">
                  onwards
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};
