'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Heart,
  ShieldCheck,
  Tag,
  AlertCircle,
  Users,
  CheckCircle2,
  Ticket,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { LiveEvent } from '@/types/event';

interface EventDetailsProps {
  event: LiveEvent;
  relatedEvents?: LiveEvent[];
  onBookClick?: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  relatedEvents = [],
  onBookClick,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const getBookingTypeDetails = () => {
    switch (event.bookingType) {
      case 'reserved-seating':
        return {
          title: 'Reserved Stadium Seating',
          desc: 'Interactive 3D stadium map with stands, blocks, rows, and individual numbered seats.',
          badgeColor: 'bg-emerald-600 text-white',
          icon: Layers,
        };
      case 'zone-based':
        return {
          title: 'Interactive Zone Standing',
          desc: 'Select preferred standing zone (Fan Pit, VIP, General Admission) on interactive SVG map.',
          badgeColor: 'bg-indigo-600 text-white',
          icon: Users,
        };
      case 'general-admission':
      default:
        return {
          title: 'General Admission',
          desc: 'Standard category admission with instant tier selection.',
          badgeColor: 'bg-neutral-800 text-white',
          icon: Ticket,
        };
    }
  };

  const bookingInfo = getBookingTypeDetails();
  const BookingIcon = bookingInfo.icon;

  const handleProceedBooking = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      router.push(`/events/${event.id}/book`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pb-28 lg:pb-20">
      {/* 1. TOP BREADCRUMB & BACK NAVIGATION */}
      <div className="bg-white border-b border-neutral-200/80 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium truncate">
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-neutral-800 hover:text-[#85142f] font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              <span>Back to Live Events</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-400 truncate">{event.category}</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {event.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors relative"
              aria-label="Share Event"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -bottom-8 right-0 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full hover:bg-neutral-100 transition-colors ${
                isLiked ? 'text-[#85142f]' : 'text-neutral-600'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#85142f]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. EVENT HERO SECTION WITH VIBRANT BACKDROP */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        {/* Blurred ambient background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.bannerImage || event.image}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Event Poster Card */}
            <div className="w-full sm:w-[320px] lg:w-[340px] shrink-0 mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900 group">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 340px"
                  className={`object-cover ${event.isSoldOut ? 'grayscale contrast-125' : ''}`}
                />

                {/* Overlays */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${bookingInfo.badgeColor} shadow-md`}>
                    {bookingInfo.title}
                  </span>

                  {event.isSoldOut ? (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      SOLD OUT
                    </span>
                  ) : event.isPromoted ? (
                    <span className="px-3 py-1 rounded-full bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      PROMOTED
                    </span>
                  ) : event.isFastFilling ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      FAST FILLING
                    </span>
                  ) : null}
                </div>

                {event.badgeText && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#85142f]/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{event.badgeText}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Header Information */}
            <div className="flex-1 min-w-0">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-rose-300 border border-white/10">
                  {event.category}
                </span>
                {event.language && (
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-neutral-300 border border-white/10">
                    {event.language}
                  </span>
                )}
                {event.ageRestriction && (
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-neutral-300 border border-white/10">
                    {event.ageRestriction}
                  </span>
                )}
                {event.isOutdoor && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    Outdoor Venue
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
                {event.title}
              </h1>

              {/* Artist Spotlight (if available) */}
              {event.artist && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md mb-6">
                  {event.artist.image ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                      <Image
                        src={event.artist.image}
                        alt={event.artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#85142f] text-white flex items-center justify-center font-black text-sm shrink-0">
                      {event.artist.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      {event.artist.name}
                    </h4>
                    <p className="text-xs text-rose-200/90 font-medium">
                      {event.artist.role}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Info Grid: Date, Time, Venue, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-200 font-medium mb-6">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#85142f]/30 text-rose-300 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                      Date & Time
                    </span>
                    <span className="font-extrabold text-white">
                      {event.date} {event.time ? `• ${event.time}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#85142f]/30 text-rose-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                      Venue
                    </span>
                    <span className="font-extrabold text-white truncate block">
                      {event.venue}
                    </span>
                  </div>
                </div>

                {event.duration && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                        Duration
                      </span>
                      <span className="font-extrabold text-white">
                        {event.duration}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                    <BookingIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                      Format
                    </span>
                    <span className="font-extrabold text-white">
                      {bookingInfo.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT: LEFT DETAILS + RIGHT STICKY BOOKING PANEL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="lg:flex lg:gap-12 items-start">
          
          {/* LEFT COLUMN: ABOUT, TERMS & ARTIST BIO */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* Booking Mode Informational Callout */}
            <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#85142f]/10 text-[#85142f] flex items-center justify-center shrink-0">
                <BookingIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 mb-1 flex items-center gap-2">
                  <span>Booking Mode: {bookingInfo.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 uppercase">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {bookingInfo.desc}
                </p>
              </div>
            </div>

            {/* About the Event */}
            <section className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-neutral-950 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span>About The Event</span>
                <Sparkles className="w-4 h-4 text-[#85142f]" />
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {event.about && event.about.length > 0 ? (
                  event.about.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))
                ) : (
                  <p>
                    Experience an unforgettable live evening filled with energy, music, and shared excitement at {event.venue}. Book your passes now for the ultimate live entertainment experience.
                  </p>
                )}
              </div>

              {/* Supported Delivery Methods */}
              {event.deliveryOptions && event.deliveryOptions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Available Delivery Modes
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {event.deliveryOptions.includes('digital') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>M-Ticket (Digital QR)</span>
                      </span>
                    )}
                    {event.deliveryOptions.includes('home_delivery') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Home Delivery (Physical Band/Pass)</span>
                      </span>
                    )}
                    {event.deliveryOptions.includes('venue_pickup') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Box Office Venue Pickup</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Terms and Conditions */}
            <section className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-neutral-950 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span>Terms & Conditions</span>
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
              </h2>

              <ul className="space-y-2.5 text-xs text-neutral-600 list-disc list-inside leading-relaxed">
                {event.terms && event.terms.length > 0 ? (
                  event.terms.map((term, idx) => (
                    <li key={idx} className="marker:text-[#85142f]">
                      {term}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="marker:text-[#85142f]">
                      Tickets once booked cannot be exchanged, cancelled, or refunded.
                    </li>
                    <li className="marker:text-[#85142f]">
                      Valid government photo ID is mandatory at the security gates.
                    </li>
                    <li className="marker:text-[#85142f]">
                      Outside eatables, beverages, professional cameras, and inflammable items are prohibited.
                    </li>
                  </>
                )}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING PANEL (DESKTOP) */}
          <aside className="hidden lg:block w-96 shrink-0 sticky top-28">
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-md space-y-6">
              
              {/* Pricing & Status */}
              <div>
                <span className="block text-xs uppercase font-extrabold text-neutral-400 tracking-wider mb-1">
                  {event.isSoldOut ? 'Event Status' : 'Ticket Prices Starting At'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black ${
                      event.isSoldOut ? 'text-neutral-500 line-through' : 'text-neutral-950'
                    }`}
                  >
                    {event.isSoldOut ? 'Sold Out' : `${event.currency} ${event.startingPrice.toLocaleString('en-IN')}`}
                  </span>
                  {!event.isSoldOut && (
                    <span className="text-xs font-semibold text-neutral-500">
                      onwards
                    </span>
                  )}
                </div>
              </div>

              {/* Status pill */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs">
                {event.isSoldOut ? (
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>All tickets are currently sold out for this event.</span>
                  </div>
                ) : event.isFastFilling ? (
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Selling out rapidly! Reserve your passes now.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tickets available across tiers. Instant confirmation.</span>
                  </div>
                )}
              </div>

              {/* Booking Mode Summary */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-bold">City</span>
                  <span className="text-neutral-900 font-extrabold">{event.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-bold">Seating Type</span>
                  <span className="text-[#85142f] font-extrabold">{bookingInfo.title}</span>
                </div>
                {event.ageRestriction && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-bold">Age Limit</span>
                    <span className="text-neutral-900 font-extrabold">{event.ageRestriction}</span>
                  </div>
                )}
              </div>

              {/* Big CTA Button */}
              <button
                type="button"
                disabled={event.isSoldOut}
                onClick={handleProceedBooking}
                className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                  event.isSoldOut
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                    : 'bg-[#85142f] hover:bg-[#6e1026] text-white shadow-[#85142f]/30'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>{event.isSoldOut ? 'Sold Out' : 'Select Tickets'}</span>
                {!event.isSoldOut && <ArrowRight className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-neutral-400 font-semibold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>100% Verified Live Booking with BookKaro</span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. MOBILE STICKY BOTTOM BOOKING BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 p-3.5 z-40 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {event.isSoldOut ? 'Status' : 'Starting From'}
            </span>
            <span
              className={`text-lg font-black ${
                event.isSoldOut ? 'text-neutral-500 line-through' : 'text-neutral-950'
              }`}
            >
              {event.isSoldOut ? 'Sold Out' : `${event.currency} ${event.startingPrice.toLocaleString('en-IN')}`}
            </span>
          </div>

          <button
            type="button"
            disabled={event.isSoldOut}
            onClick={handleProceedBooking}
            className={`py-3 px-6 rounded-full font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
              event.isSoldOut
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-[#85142f] text-white shadow-[#85142f]/30'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>{event.isSoldOut ? 'Sold Out' : 'Book Now'}</span>
            {!event.isSoldOut && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
