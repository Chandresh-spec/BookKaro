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
  ChevronRight,
  TrendingUp,
  Check,
} from 'lucide-react';
import { LiveEvent } from '@/types/event';

interface EventDetailsProps {
  event: LiveEvent;
  relatedEvents?: LiveEvent[];
  onBookClick?: () => void;
}

const eventOffers = [
  {
    id: 'off-1',
    title: 'YES Private Debit Card Offer',
    subtitle: 'Tap to view details',
  },
  {
    id: 'off-2',
    title: 'Buy 1 get 1 live pass',
    subtitle: 'Tap to view details',
  },
  {
    id: 'off-3',
    title: 'Flat ₹150 Off with ICICI Netbanking',
    subtitle: 'Tap to view details',
  },
];

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  relatedEvents = [],
  onBookClick,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

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
    <div className="min-h-screen bg-[#fafafc]">
      {/* ========================================================= */}
      {/* MOBILE EVENT VIEW (BookMyShow Mobile Layout: lg:hidden)   */}
      {/* ========================================================= */}
      <div className="lg:hidden pb-24 bg-white">
        {/* 1. Hero Card: 16:9 Banner with Badges */}
        <div className="p-3">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-900 border border-neutral-100">
            <Image
              src={event.bannerImage || event.image}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover object-center"
            />

            {/* Badges Top Overlay */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${bookingInfo.badgeColor} shadow-md backdrop-blur-md`}>
                {bookingInfo.title}
              </span>

              {event.isSoldOut ? (
                <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  SOLD OUT
                </span>
              ) : event.isPromoted ? (
                <span className="px-2.5 py-1 rounded-md bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  PROMOTED
                </span>
              ) : event.isFastFilling ? (
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  FAST FILLING
                </span>
              ) : null}
            </div>

            {/* Bottom Highlight Badge */}
            {event.badgeText && (
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <span className="px-2.5 py-1 rounded-md bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{event.badgeText}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Event Title */}
        <div className="px-4 pt-1 pb-1">
          <h1 className="text-xl font-black text-neutral-950 tracking-tight leading-snug">
            {event.title}
          </h1>
        </div>

        {/* 3. Event Meta Tags Line (Category • Language • Age • Duration) */}
        <div className="px-4 py-1.5 text-xs text-neutral-600 font-medium flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-[#85142f]">{event.category}</span>
          {event.language && (
            <>
              <span>•</span>
              <span>{event.language}</span>
            </>
          )}
          {event.ageRestriction && (
            <>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-bold">
                {event.ageRestriction}
              </span>
            </>
          )}
          {event.duration && (
            <>
              <span>•</span>
              <span>{event.duration}</span>
            </>
          )}
        </div>

        {/* 4. Date & Venue Details Card (Clean BookMyShow Style) */}
        <div className="px-4 py-2 space-y-2">
          {/* Date & Time */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#85142f] flex items-center justify-center shrink-0 border border-rose-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Date & Time
              </span>
              <p className="text-xs font-black text-neutral-900 truncate">
                {event.date} {event.time ? `• ${event.time}` : ''}
              </p>
            </div>
          </div>

          {/* Venue & City */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-200">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Location
              </span>
              <p className="text-xs font-black text-neutral-900 truncate">
                {event.venue}
              </p>
              <p className="text-[11px] text-neutral-500 font-medium">
                {event.city}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Trending / Fast-filling Velocity Strip */}
        <div className="px-4 py-1.5">
          <div className="p-2.5 rounded-xl border border-neutral-200/80 bg-white flex items-center gap-2.5 shadow-2xs">
            <span className="px-2 py-1 rounded-md bg-[#387bf8] text-white text-[10px] font-black tracking-wide flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 truncate">
              {event.isFastFilling ? 'Selling out rapidly! Reserve passes now' : 'High demand: Over 10.5K passes booked'}
            </span>
          </div>
        </div>

        {/* 6. Top Offers For You */}
        <div className="pt-3 pb-2">
          <div className="px-4 mb-2">
            <h3 className="text-sm font-black text-neutral-900 tracking-tight">
              Top offers for you
            </h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {eventOffers.map((offer) => (
              <div
                key={offer.id}
                className="shrink-0 w-64 p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center gap-3 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#85142f] stroke-[2.5px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {offer.title}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    {offer.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Artist / Headliner Section */}
        {event.artist && (
          <div className="pt-3 pb-2 border-t border-neutral-100">
            <div className="px-4 mb-2">
              <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                Artist & Lineup
              </h3>
            </div>
            <div className="px-4">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
                {event.artist.image ? (
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 shadow-xs">
                    <Image
                      src={event.artist.image}
                      alt={event.artist.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#85142f] text-white flex items-center justify-center font-black text-base shrink-0">
                    {event.artist.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-neutral-900 truncate">
                    {event.artist.name}
                  </h4>
                  <p className="text-xs text-[#85142f] font-bold truncate">
                    {event.artist.role}
                  </p>
                  {event.artist.bio && (
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {event.artist.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. About The Event (Expandable) */}
        <div className="pt-3 pb-2 border-t border-neutral-100">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 tracking-tight">
              About The Event
            </h3>
          </div>
          <div className="px-4 text-xs text-neutral-600 leading-relaxed font-normal">
            <p>
              {isAboutExpanded
                ? (event.about?.join(' ') ||
                    'Experience an unforgettable live event with premium sound, stage lighting, and timeless performances. Book passes now.')
                : (event.about?.[0] ||
                    'Experience an unforgettable live event with premium sound, stage lighting, and timeless performances.')}
              <button
                type="button"
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="font-bold text-[#85142f] ml-1 hover:underline cursor-pointer"
              >
                {isAboutExpanded ? ' Show less' : '...Read more'}
              </button>
            </p>
          </div>

          {/* Delivery Mode Badges */}
          {event.deliveryOptions && event.deliveryOptions.length > 0 && (
            <div className="px-4 pt-3 flex items-center gap-2 flex-wrap">
              {event.deliveryOptions.includes('digital') && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>M-Ticket (Digital QR)</span>
                </span>
              )}
              {event.deliveryOptions.includes('home_delivery') && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>Home Delivery</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 9. Terms and Conditions Guide */}
        <div className="pt-3 pb-2 border-t border-neutral-100">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
              <span>Terms & Guidelines</span>
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            </h3>
            <button
              type="button"
              onClick={() => setIsTermsExpanded(!isTermsExpanded)}
              className="text-xs font-bold text-[#85142f] cursor-pointer"
            >
              {isTermsExpanded ? 'Collapse' : 'View all'}
            </button>
          </div>
          <div className="px-4">
            <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
              {(isTermsExpanded ? (event.terms || []) : (event.terms?.slice(0, 2) || [
                'Tickets once booked cannot be exchanged, cancelled, or refunded.',
                'Valid government photo ID is mandatory at the security gates.'
              ])).map((term, idx) => (
                <li key={idx} className="marker:text-[#85142f]">
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10. You Might Also Like / Related Events */}
        {relatedEvents.length > 0 && (
          <div className="pt-4 pb-2 border-t border-neutral-100">
            <div className="px-4 flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                You might also like
              </h3>
              <Link
                href="/events"
                className="text-xs font-bold text-[#85142f] flex items-center cursor-pointer"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto px-4 pb-3 scrollbar-none">
              {relatedEvents.map((item) => (
                <Link
                  key={item.id}
                  href={`/events/${item.id}`}
                  className="flex flex-col shrink-0 w-44 group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900 mb-2 shadow-xs">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 group-hover:text-[#85142f] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-medium truncate mt-0.5">
                    {item.date} • {item.venue}
                  </p>
                  <p className="text-xs font-black text-neutral-900 mt-1">
                    {item.currency} {item.startingPrice.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-neutral-500">onwards</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 11. Fixed Bottom Action Bar for Mobile */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200/90 p-3 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {event.isSoldOut ? 'Status' : 'Starting From'}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-lg font-black ${
                  event.isSoldOut ? 'text-neutral-500 line-through' : 'text-neutral-950'
                }`}
              >
                {event.isSoldOut ? 'Sold Out' : `${event.currency} ${event.startingPrice.toLocaleString('en-IN')}`}
              </span>
              {!event.isSoldOut && (
                <span className="text-[11px] text-neutral-400 font-semibold">onwards</span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={event.isSoldOut}
            onClick={handleProceedBooking}
            className={`py-3 px-6 rounded-xl font-black text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
              event.isSoldOut
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                : 'bg-[#85142f] hover:bg-[#6e1026] text-white shadow-[#85142f]/30'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>{event.isSoldOut ? 'Sold Out' : 'Book Tickets'}</span>
            {!event.isSoldOut && <ChevronRight className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP EVENT VIEW (Preserved 100% as-is: hidden lg:block) */}
      {/* ========================================================= */}
      <div className="hidden lg:block pb-20">
        {/* 1. TOP NAVIGATION / BREADCRUMB (Mobile & Tablet Optimized) */}
        <div className="bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          
          {/* Mobile view: Clean back button without squished long breadcrumbs */}
          <div className="flex sm:hidden items-center gap-1">
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-neutral-800 hover:text-[#85142f] font-bold text-xs py-1 px-1.5 -ml-1 rounded-lg transition-colors active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px] text-[#85142f]" />
              <span>Live Events</span>
            </Link>
          </div>

          {/* Tablet & Desktop: Complete breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium truncate">
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-neutral-800 hover:text-[#85142f] font-bold transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              <span>Back to Live Events</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-400 shrink-0">{event.category}</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-bold truncate max-w-xs md:max-w-md">
              {event.title}
            </span>
          </div>

          {/* Right Action Icons: Share & Wishlist */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors relative active:scale-90"
              aria-label="Share Event"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -bottom-8 right-0 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow whitespace-nowrap z-50">
                  Link copied!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center active:scale-90 ${
                isLiked ? 'text-[#85142f] bg-rose-50' : 'text-neutral-700'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#85142f] text-[#85142f]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. EVENT HERO SECTION (Responsive for Mobile, Tablet, and Desktop) */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.bannerImage || event.image}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-16">
          <div className="flex flex-col md:flex-row gap-5 sm:gap-8 lg:gap-12 items-start">
            
            {/* Event Poster Card:
                - Mobile: Wide 16:9 or 4:3 rounded card
                - Tablet (md): 280px 3:4 card
                - Desktop (lg): 340px 3:4 card
            */}
            <div className="w-full md:w-[280px] lg:w-[340px] shrink-0">
              <div className="relative aspect-[16/10] md:aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900 group">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 300px, 340px"
                  className={`object-cover object-center ${
                    event.isSoldOut ? 'grayscale contrast-125' : 'group-hover:scale-102 transition-transform duration-500'
                  }`}
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${bookingInfo.badgeColor} shadow-md backdrop-blur-md`}>
                    {bookingInfo.title}
                  </span>

                  {event.isSoldOut ? (
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      SOLD OUT
                    </span>
                  ) : event.isPromoted ? (
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      PROMOTED
                    </span>
                  ) : event.isFastFilling ? (
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      FAST FILLING
                    </span>
                  ) : null}
                </div>

                {/* Bottom Highlight Pill */}
                {event.badgeText && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#85142f]/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{event.badgeText}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Information Header */}
            <div className="flex-1 min-w-0 w-full">
              
              {/* Category & Attributes Pills (Horizontal swipe on mobile) */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 mb-2.5 sm:mb-3 scrollbar-none">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-rose-300 border border-white/10 whitespace-nowrap">
                  {event.category}
                </span>
                {event.language && (
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-neutral-300 border border-white/10 whitespace-nowrap">
                    {event.language}
                  </span>
                )}
                {event.ageRestriction && (
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-neutral-300 border border-white/10 whitespace-nowrap">
                    {event.ageRestriction}
                  </span>
                )}
                {event.isOutdoor && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 whitespace-nowrap">
                    Outdoor Venue
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3 sm:mb-4">
                {event.title}
              </h1>

              {/* Artist Card (Responsive touch-friendly) */}
              {event.artist && (
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md mb-4 sm:mb-6">
                  {event.artist.image ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                      <Image
                        src={event.artist.image}
                        alt={event.artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#85142f] text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                      {event.artist.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {event.artist.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-rose-200/90 font-medium truncate">
                      {event.artist.role}
                    </p>
                  </div>
                </div>
              )}

              {/* 2-Column Key Metadata Grid (Date, Venue, Duration, Seating Format) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 text-xs text-neutral-200 font-medium">
                
                <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#85142f]/30 text-rose-300 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      Date & Time
                    </span>
                    <span className="font-extrabold text-white text-xs truncate block">
                      {event.date}
                    </span>
                    {event.time && (
                      <span className="text-[11px] text-neutral-300 block">
                        {event.time}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#85142f]/30 text-rose-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      Venue
                    </span>
                    <span className="font-extrabold text-white text-xs truncate block">
                      {event.venue}
                    </span>
                    <span className="text-[11px] text-neutral-300 block">
                      {event.city}
                    </span>
                  </div>
                </div>

                {event.duration && (
                  <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        Duration
                      </span>
                      <span className="font-extrabold text-white text-xs truncate block">
                        {event.duration}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                    <BookingIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      Layout
                    </span>
                    <span className="font-extrabold text-white text-xs truncate block">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="lg:flex lg:gap-10 items-start">
          
          {/* LEFT COLUMN: ABOUT, TERMS & ARTIST BIO */}
          <div className="flex-1 min-w-0 space-y-6 sm:space-y-8">
            
            {/* Booking Mode Informational Callout */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#85142f]/10 text-[#85142f] flex items-center justify-center shrink-0">
                <BookingIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 mb-0.5 flex items-center gap-2">
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
            <section className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-8 shadow-xs">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-neutral-950 mb-3 sm:mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span>About The Event</span>
                <Sparkles className="w-4 h-4 text-[#85142f]" />
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
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
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                    Available Delivery Modes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.deliveryOptions.includes('digital') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>M-Ticket (Digital QR)</span>
                      </span>
                    )}
                    {event.deliveryOptions.includes('home_delivery') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Home Delivery (Physical Band/Pass)</span>
                      </span>
                    )}
                    {event.deliveryOptions.includes('venue_pickup') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Box Office Venue Pickup</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Terms and Conditions */}
            <section className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-8 shadow-xs">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-neutral-950 mb-3 sm:mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span>Terms & Conditions</span>
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
              </h2>

              <ul className="space-y-2 text-xs text-neutral-600 list-disc list-inside leading-relaxed">
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
                      Outside eatables, beverages, and recording cameras are strictly prohibited.
                    </li>
                  </>
                )}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING PANEL (Visible on Desktop lg and up) */}
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
      </div>
    </div>
  );
};
