'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Clock,
  Hourglass,
  Users,
  Languages,
  Share2,
  ThumbsUp,
  Lightbulb,
  Ticket,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  TrendingUp,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { SportsEventCard } from '@/components/sports/SportsEventCard';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
import { User, SportEvent } from '@/types';

const sportsOffers = [
  {
    id: 'off-1',
    title: 'YES Private Debit Card Offer',
    subtitle: 'Tap to view details',
  },
  {
    id: 'off-2',
    title: 'Flat ₹100 Off with ICICI Netbanking',
    subtitle: 'Tap to view details',
  },
  {
    id: 'off-3',
    title: 'Marathon Runner Perk: Free Hydration Pack',
    subtitle: 'Tap to view details',
  },
];

export default function SportEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Find event
  const event = useMemo(() => {
    return MOCK_SPORTS_EVENTS.find(
      (e) => e.id === eventId || e.slug === eventId
    );
  }, [eventId]);

  // Related events
  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return MOCK_SPORTS_EVENTS.filter((e) => e.id !== event.id).slice(0, 4);
  }, [event]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleBookNow = () => {
    if (event) {
      router.push(`/sports/${event.id}/book`);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 flex flex-col justify-between">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={setCurrentCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-12 shadow-xs flex flex-col items-center">
            <h1 className="text-2xl font-black text-neutral-900 mb-2">
              Sports Event Not Found
            </h1>
            <p className="text-sm text-neutral-500 mb-6">
              The sports event you are looking for does not exist or has concluded.
            </p>
            <Link
              href="/sports"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#85142f] text-white text-xs font-bold shadow-md hover:bg-[#6e1026] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sports</span>
            </Link>
          </div>
        </main>
        <Footer currentCity={currentCity} />
      </div>
    );
  }

  const interestedTotal = (event.interestedCount || 49) + (isInterested ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#fafafc] text-neutral-900 pb-28 lg:pb-16 selection:bg-[#85142f] selection:text-white">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={setCurrentCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/sports')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </button>
          <h1 className="text-sm font-extrabold text-neutral-900 truncate max-w-[220px]">
            {event.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* ========================================================= */}
      {/* MOBILE SPORTS VIEW (BookMyShow Mobile Layout: lg:hidden)  */}
      {/* ========================================================= */}
      <div className="lg:hidden pb-24 bg-white">
        {/* 1. Hero Card: 16:9 Aspect Banner with Badges */}
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
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-900/90 text-white shadow-md backdrop-blur-md">
                {event.sportType}
              </span>

              {event.isFastFilling ? (
                <span className="px-2.5 py-1 rounded-md bg-[#85142f] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  FAST FILLING
                </span>
              ) : event.isFree ? (
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  FREE ENTRY
                </span>
              ) : null}
            </div>

            {/* Bottom Highlight */}
            {event.distanceOrCategory && (
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <span className="px-2.5 py-1 rounded-md bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{event.distanceOrCategory}</span>
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

        {/* 3. Event Meta Line */}
        <div className="px-4 py-1.5 text-xs text-neutral-600 font-medium flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-[#85142f]">{event.sportType}</span>
          {event.distanceOrCategory && (
            <>
              <span>•</span>
              <span>{event.distanceOrCategory}</span>
            </>
          )}
          {event.isFamilyFriendly && (
            <>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-bold">
                Family Friendly
              </span>
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

          {/* Venue & Location */}
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
              {interestedTotal} sports enthusiasts are interested
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
            {sportsOffers.map((offer) => (
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

        {/* 7. Participation Categories / Registration Tiers */}
        {event.participationCategories && event.participationCategories.length > 0 && (
          <div className="pt-3 pb-2 border-t border-neutral-100">
            <div className="px-4 mb-2.5">
              <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                Race Categories & Tiers
              </h3>
            </div>
            <div className="px-4 space-y-2">
              {event.participationCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-black text-neutral-900">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-medium">
                      Official BIB, Finisher Medal, Hydration & Breakfast
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-black text-neutral-950 block">
                      ₹{cat.fee}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">
                      Available
                    </span>
                  </div>
                </div>
              ))}
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
              {isReadMoreOpen
                ? event.description
                : event.description?.slice(0, 160) + '...'}
              <button
                type="button"
                onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                className="font-bold text-[#85142f] ml-1 hover:underline cursor-pointer"
              >
                {isReadMoreOpen ? ' Show less' : '...Read more'}
              </button>
            </p>
          </div>
        </div>

        {/* 9. Terms and Guidelines */}
        <div className="pt-3 pb-2 border-t border-neutral-100">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
              <span>Terms & Guidelines</span>
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            </h3>
            <button
              type="button"
              onClick={() => setIsTermsOpen(!isTermsOpen)}
              className="text-xs font-bold text-[#85142f] cursor-pointer"
            >
              {isTermsOpen ? 'Collapse' : 'View all'}
            </button>
          </div>
          <div className="px-4">
            <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
              {(isTermsOpen ? (event.terms || []) : (event.terms?.slice(0, 2) || [
                'Registrations once booked cannot be exchanged, cancelled, or refunded.',
                'BIB collection is mandatory before race morning.'
              ])).map((term, idx) => (
                <li key={idx} className="marker:text-[#85142f]">
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10. You Might Also Like / Related Sports */}
        {relatedEvents.length > 0 && (
          <div className="pt-4 pb-2 border-t border-neutral-100">
            <div className="px-4 flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                You might also like
              </h3>
              <Link
                href="/sports"
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
                  href={`/sports/${item.id}`}
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
                        {item.sportType}
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
                    {item.currency} {item.startingPrice} <span className="text-[10px] font-normal text-neutral-500">onwards</span>
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
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-neutral-950">
                ₹{event.startingPrice}
              </span>
              <span className="text-[11px] text-neutral-400 font-semibold">onwards</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="py-3 px-6 rounded-xl font-black text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer bg-[#85142f] hover:bg-[#6e1026] text-white shadow-[#85142f]/30"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP SPORTS VIEW (Preserved 100% as-is: hidden lg:block) */}
      {/* ========================================================= */}
      <div className="hidden lg:block">
        {/* 2. MAIN CONTENT: 2-COLUMN LAYOUT (Matching BookMyShow Screenshots 2, 3, 4, 5) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Title and Share Action Row (Directly above Banner, matching BookMyShow Screenshot 2) */}
        <div className="flex items-center justify-between gap-4 pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/sports"
              className="p-1.5 -ml-1.5 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Back to Sports"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </Link>
            <h1 className="text-xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              {event.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-full border border-neutral-200/90 text-neutral-700 hover:bg-neutral-100 transition-all relative shrink-0 shadow-2xs"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
            {copiedToast && (
              <span className="absolute -bottom-8 right-0 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                Link copied!
              </span>
            )}
          </button>
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: HERO BANNER, ABOUT, ARTISTS, GALLERY, FAQS (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* A. Large Landscape Banner Image */}
            <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-md">
              <Image
                src={event.bannerImage || event.image}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* B. Category Tag & Social Interest Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
              <span className="px-3.5 py-1.5 rounded-md bg-neutral-900 text-white text-xs font-black uppercase tracking-wider">
                {event.sportType}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>{interestedTotal} are interested</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsInterested(!isInterested)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all active:scale-95 ${
                    isInterested
                      ? 'border-[#85142f] bg-rose-50 text-[#85142f]'
                      : 'border-rose-400 text-[#85142f] hover:bg-rose-50'
                  }`}
                >
                  {isInterested ? 'Interested ✓' : "I'm Interested"}
                </button>
              </div>
            </div>

            {/* C. About The Event */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight">
                About The Event
              </h2>
              <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-2">
                <p className="font-extrabold text-neutral-950 uppercase tracking-wide">
                  {event.title}
                </p>
                {event.id === 'empire-heritage-run-2027' ? (
                  <p className="text-neutral-600 font-semibold">
                    Celebrating 60 Years of Hotel Empire
                  </p>
                ) : event.distanceOrCategory ? (
                  <p className="text-neutral-600 font-semibold">
                    {event.distanceOrCategory}
                  </p>
                ) : null}
                <p className="text-neutral-600">
                  {isReadMoreOpen
                    ? event.description
                    : event.description?.slice(0, 180) + '...'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                  className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer block"
                >
                  {isReadMoreOpen ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </section>

            {/* D. You Should Know Callout Box (Peach callout from Screenshot 3) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fff5f2] border border-[#ffded6] flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                Arrive on time, follow safety rules, and check your ticket inclusions.
              </p>
            </div>

            {/* E. Artists / Organizers (Screenshot 3) */}
            {event.artists && event.artists.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight">
                  Artists
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {event.artists.map((artist, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2 text-center"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 truncate">
                          {artist.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-medium truncate">
                          {artist.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* F. M-Ticket Banner (Screenshot 3 & 4) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fff5f2] border border-[#ffded6] flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#85142f] flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                    M-Ticket Available
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium">
                    Contactless Ticketing & Fast-track Entry with M-ticket.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#85142f] hover:underline cursor-pointer shrink-0">
                Learn How
              </span>
            </div>

            {/* G. Gallery (Screenshot 4) */}
            {event.gallery && event.gallery.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {event.gallery.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-2xs cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2.5 flex items-end">
                        <span className="text-[11px] font-extrabold text-white">
                          {item.category} ({item.count})
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-2xs flex items-center justify-center text-center p-3 cursor-pointer hover:bg-neutral-900 transition-colors">
                    <span className="text-xs font-extrabold text-white leading-snug">
                      See the Entire Gallery
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* H. Frequently Asked Questions (Screenshot 4) */}
            {event.faqs && event.faqs.length > 0 && (
              <section className="border-t border-neutral-200/80 pt-6">
                <h2 className="text-lg font-black text-neutral-950 mb-3">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                  {event.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-neutral-200/80 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-extrabold text-neutral-900"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-neutral-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>
                        {isOpen && (
                          <p className="pt-2 text-xs text-neutral-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* I. Terms & Conditions (Screenshot 4) */}
            <section className="border-t border-neutral-200/80 pt-6">
              <button
                type="button"
                onClick={() => setIsTermsOpen(!isTermsOpen)}
                className="w-full flex items-center justify-between text-left text-base sm:text-lg font-black text-neutral-950"
              >
                <span>Terms & Conditions</span>
                {isTermsOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                )}
              </button>
              {isTermsOpen && event.terms && (
                <ul className="pt-3 space-y-2 text-xs text-neutral-600 list-disc list-inside">
                  {event.terms.map((t, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* J. You May Also Like Shelf (Screenshot 4 & 5) */}
            {relatedEvents.length > 0 && (
              <section className="border-t border-neutral-200/80 pt-6 space-y-3">
                <div>
                  <h2 className="text-lg font-black text-neutral-950">
                    You May Also Like
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    Events around you, book now
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {relatedEvents.map((rel) => (
                    <SportsEventCard key={rel.id} event={rel} />
                  ))}
                </div>
              </section>
            )}

            {/* Breadcrumb path at bottom (Screenshot 5) */}
            <div className="text-[11px] text-neutral-400 font-medium pt-4">
              <span>Home</span> <span className="mx-1">→</span>{' '}
              <span>Sports</span> <span className="mx-1">→</span>{' '}
              <span>{event.sportType}</span> <span className="mx-1">→</span>{' '}
              <span className="text-neutral-700">{event.title} Tickets - BookKaro</span>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD (Screenshot 2, 3, 4, 5) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-md space-y-5">
              
              {/* Event Attributes Checklist */}
              <div className="space-y-3 text-xs sm:text-sm text-neutral-700 font-semibold">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{event.time || '5:15 AM'}</span>
                </div>

                {event.duration && (
                  <div className="flex items-center gap-3">
                    <Hourglass className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{event.duration}</span>
                  </div>
                )}

                {event.ageRestriction && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{event.ageRestriction}</span>
                  </div>
                )}

                {event.languages && (
                  <div className="flex items-center gap-3">
                    <Languages className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{event.languages.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{event.venue} ↗</span>
                </div>
              </div>

              {/* Price & CTA Bottom Strip */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-base sm:text-lg font-black text-neutral-950">
                    ₹{event.startingPrice} onwards
                  </div>
                  <span className="text-xs font-bold text-emerald-600 block">
                    Available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="py-3 px-8 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Master BMS Footer */}
      <Footer currentCity={currentCity} />
    </div>
  );
}
