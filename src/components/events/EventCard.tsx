'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Tag, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { LiveEvent } from '@/types/event';

interface EventCardProps {
  event: LiveEvent;
  priority?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, priority = false }) => {
  const getBookingTypeBadge = () => {
    switch (event.bookingType) {
      case 'reserved-seating':
        return { label: 'Stadium Seating', color: 'bg-emerald-600/95 text-white' };
      case 'zone-based':
        return { label: 'Zone Standing', color: 'bg-indigo-600/95 text-white' };
      case 'general-admission':
      default:
        return { label: 'General Admission', color: 'bg-neutral-800/95 text-white' };
    }
  };

  const bookingBadge = getBookingTypeBadge();

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:border-[#85142f]/40 card-hover transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-[#85142f]/40"
    >
      <div>
        {/* Poster Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out ${
              event.isSoldOut ? 'grayscale contrast-125 opacity-75' : 'group-hover:scale-105'
            }`}
          />

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            {/* Booking Mode Badge */}
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${bookingBadge.color}`}
            >
              {bookingBadge.label}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Promoted / Fast-filling badge */}
              {event.isSoldOut ? (
                <span className="px-2.5 py-1 rounded-full bg-neutral-900/90 text-white text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-xs">
                  SOLD OUT
                </span>
              ) : event.isPromoted ? (
                <span className="px-2.5 py-1 rounded-full bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  PROMOTED
                </span>
              ) : event.isFastFilling ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  FAST FILLING
                </span>
              ) : null}
            </div>
          </div>

          {/* Bottom Overlay with Date & Time */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-12 pb-3 px-3.5 sm:px-4 text-white">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </span>
              {event.time && (
                <span className="text-white/80 font-medium text-[11px]">{event.time}</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-2.5 sm:p-4 pb-2">
          {/* Category & Language */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-neutral-500 mb-1 truncate">
            <span className="text-[#85142f] font-bold">{event.category}</span>
            {event.language && (
              <>
                <span>•</span>
                <span>{event.language}</span>
              </>
            )}
            {event.isOutdoor && (
              <>
                <span>•</span>
                <span>Outdoor</span>
              </>
            )}
          </div>

          {/* Event Title */}
          <h3 className="text-xs sm:text-base font-extrabold text-neutral-950 group-hover:text-[#85142f] transition-colors leading-snug line-clamp-2 mb-1.5">
            {event.title}
          </h3>

          {/* Venue & City */}
          <div className="flex items-start gap-1 text-[11px] sm:text-xs text-neutral-600 font-medium truncate mb-1.5">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#85142f] shrink-0 mt-0.5" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="px-2.5 sm:px-4 py-2 sm:py-3 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between gap-1.5">
        <div>
          <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            {event.isSoldOut ? 'Status' : 'Starting From'}
          </span>
          <span
            className={`text-xs sm:text-base font-black ${
              event.isSoldOut ? 'text-neutral-500 line-through' : 'text-neutral-900'
            }`}
          >
            {event.isSoldOut ? 'Sold Out' : `${event.currency} ${event.startingPrice.toLocaleString('en-IN')}`}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-xs group-hover:bg-[#85142f] group-hover:text-white bg-white text-neutral-800 border border-neutral-200 shrink-0">
          <span>{event.isSoldOut ? 'Info' : 'Book'}</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
