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
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { SportsEventCard } from '@/components/sports/SportsEventCard';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
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
      {/* 1. TOP NAVBAR */}
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

      {/* 2. PAGE HEADER BAR WITH TITLE & SHARE */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 lg:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <Link
              href="/sports"
              className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </Link>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-950 tracking-tight truncate">
              {event.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-all relative shrink-0"
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
      </header>

      {/* 3. MAIN CONTENT: 2-COLUMN LAYOUT (Matching BookMyShow Screenshots 2, 3, 4, 5) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
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
                <p className="text-neutral-600 font-semibold">
                  Celebrating 60 Years of Hotel Empire
                </p>
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
          <aside className="hidden lg:block lg:col-span-4 sticky top-36">
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
                  className="py-3 px-8 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. MOBILE STICKY BOTTOM BAR (Screenshot 2, 3, 4, 5 on Mobile) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 z-40 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-[11px] text-neutral-500 font-semibold">Starting from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-neutral-950">
              ₹{event.startingPrice}
            </span>
            <span className="text-xs text-neutral-400">onwards</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookNow}
          className="px-8 py-3 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-sm tracking-tight shadow-md active:scale-95 transition-all cursor-pointer"
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
