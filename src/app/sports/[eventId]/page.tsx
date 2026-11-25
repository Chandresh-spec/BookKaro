'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Share2,
  Heart,
  Check,
  Train,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
import { MOCK_SPORTS_VENUES } from '@/data/mockSportsVenues';
import { User, SportEvent } from '@/types';

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

  // booking modal replaced by full page booking route
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Find event
  const event = useMemo(() => {
    return MOCK_SPORTS_EVENTS.find(
      (e) => e.id === eventId || e.slug === eventId
    );
  }, [eventId]);

  // Find venue
  const venue = useMemo(() => {
    if (!event) return null;
    return (
      MOCK_SPORTS_VENUES.find((v) => v.id === event.venueId) ||
      MOCK_SPORTS_VENUES.find((v) =>
        event.venue.toLowerCase().includes(v.name.toLowerCase())
      ) ||
      null
    );
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
            <div className="w-16 h-16 rounded-xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 mb-2">
              Sport Event Not Found
            </h1>
            <p className="text-sm text-neutral-500 mb-6">
              The sports event you are looking for is either completed or does not exist.
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

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 pb-24 lg:pb-16 selection:bg-[#85142f] selection:text-white">
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

      {/* 2. HERO BANNER WITH NAVIGATION OVERLAY */}
      <section className="relative w-full bg-neutral-950 text-white overflow-hidden">
        {/* Banner Image with rich backdrop gradient */}
        <div className="relative h-64 sm:h-80 lg:h-[400px] w-full">
          <Image
            src={event.bannerImage || event.image}
            alt={event.title}
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/60" />
        </div>

        {/* Floating Top Controls (Back, Share, Like) */}
        <div className="absolute top-4 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
          <Link
            href="/sports"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold transition-all border border-white/20 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Sports</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all border border-white/20 relative"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -bottom-8 right-0 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                  Link copied!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full backdrop-blur-md transition-all border border-white/20 ${
                isLiked
                  ? 'bg-rose-600 text-white'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              aria-label="Favorite event"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Bottom Content Banner */}
        <div className="absolute bottom-6 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-[#85142f] text-white text-xs font-black uppercase tracking-wider shadow-xs">
              {event.sportType}
            </span>
            {event.isFastFilling && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 text-xs font-black uppercase tracking-wider">
                Fast Filling
              </span>
            )}
            {event.venueType && (
              <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs text-white text-xs font-bold capitalize">
                {event.venueType}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md max-w-3xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 font-medium mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#ec5e7b]" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ec5e7b]" />
                {event.time}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ec5e7b]" />
              {event.venue}
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN DETAILS LAYOUT (2 COLUMNS ON DESKTOP) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* LEFT COLUMN: ABOUT, HIGHLIGHTS, CATEGORIES, RULES (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* About The Event */}
            {event.description && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#85142f]" />
                  <span>About The Event</span>
                </h2>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  {event.description}
                </p>
              </section>
            )}

            {/* Event Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#85142f]" />
                  <span>Event Highlights</span>
                </h2>
                <ul className="space-y-2.5">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-[#85142f] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3px]" />
                      </div>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Participation Categories / Ticket Options */}
            {event.bookingMode === 'participation' && event.participationCategories && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#85142f]" />
                  <span>Race & Participation Categories</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {event.participationCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 hover:border-[#85142f]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-neutral-900">
                            {cat.name}
                          </h3>
                          {cat.distance && (
                            <span className="text-xs text-neutral-500 font-semibold">
                              Distance: {cat.distance}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-black text-[#85142f]">
                          {cat.fee === 0 ? 'Free' : `₹${cat.fee}`}
                        </span>
                      </div>
                      {cat.includesTShirt && (
                        <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Includes Event T-Shirt
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.ticketCategories && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#85142f]" />
                  <span>Ticket Categories</span>
                </h2>
                <div className="space-y-2.5 pt-1">
                  {event.ticketCategories.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">
                          {tkt.name}
                        </h4>
                        {tkt.perks && (
                          <div className="flex gap-2 mt-1">
                            {tkt.perks.map((p, i) => (
                              <span key={i} className="text-[10px] text-neutral-500 font-medium">
                                • {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-neutral-900 block">
                          ₹{tkt.price}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            tkt.available ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tkt.available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Venue Information */}
            {venue && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#85142f]" />
                  <span>Venue Information</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
                  <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-neutral-900">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {venue.address}
                    </p>
                    {venue.metroConnectivity && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 pt-1">
                        <Train className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{venue.metroConnectivity}</span>
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Rules and Regulations */}
            {event.rules && event.rules.length > 0 && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#85142f]" />
                  <span>Rules & Regulations</span>
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-neutral-700">
                  {event.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </section>
            )}

            {/* Terms and Conditions */}
            {event.terms && event.terms.length > 0 && (
              <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xs">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#85142f]" />
                  <span>Terms & Conditions</span>
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-600">
                  {event.terms.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD (DESKTOP, 4 cols) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-md space-y-5">
              {/* Event poster thumbnail + meta */}
              <div className="flex gap-3.5">
                <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900 shadow-sm">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-md">
                    {event.sportType}
                  </span>
                  <h3 className="font-black text-sm text-neutral-900 truncate mt-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {event.venue}
                  </p>
                  <p className="text-xs font-bold text-neutral-800 mt-1">
                    {event.date}
                  </p>
                </div>
              </div>

              {/* Price block */}
              <div className="pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-500 block">
                    Starting Ticket Price
                  </span>
                  <span className="text-2xl font-black text-neutral-950">
                    {event.startingPrice === 0 ? 'Free' : `₹${event.startingPrice}`}
                  </span>
                  {event.startingPrice > 0 && (
                    <span className="text-xs text-neutral-400 ml-1">onwards</span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Available
                </span>
              </div>

              {/* Book Button */}
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white font-extrabold text-sm tracking-tight shadow-md transition-all active:scale-98 cursor-pointer text-center"
              >
                {event.bookingMode === 'participation' ? 'Register Now' : event.bookingMode === 'reserved-seating' ? 'Select Seats' : 'Book Tickets'}
              </button>

              <p className="text-[11px] text-center text-neutral-400">
                100% Secure Checkout with BookKaro Guarantee
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. MOBILE STICKY BOTTOM BAR (BookMyShow Mobile Style) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 z-40 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-[11px] text-neutral-500 font-semibold">Starting from</p>
          <p className="text-lg font-black text-neutral-950">
            {event.startingPrice === 0 ? 'Free' : `₹${event.startingPrice}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleBookNow}
          className="px-8 py-3 rounded-xl bg-[#85142f] text-white font-extrabold text-sm tracking-tight shadow-md active:scale-95 transition-all cursor-pointer"
        >
          Book Now
        </button>
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

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab="sports"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
