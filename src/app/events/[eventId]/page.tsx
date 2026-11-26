'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles, RotateCcw, Share2, Check } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { LIVE_EVENTS_MOCK } from '@/data/mockEvents';
import { LiveEvent, User } from '@/types';
import { EventDetails } from '@/components/events/EventDetails';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${event?.title || 'Event'} — BookKaro`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  // Find the event by ID
  const event: LiveEvent | undefined = useMemo(() => {
    return LIVE_EVENTS_MOCK.find((e) => e.id === eventId);
  }, [eventId]);

  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return LIVE_EVENTS_MOCK.filter(
      (e) => e.id !== event.id && (e.category === event.category || e.city === event.city)
    ).slice(0, 3);
  }, [event]);

  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col justify-between selection:bg-[#85142f] selection:text-white">
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
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#85142f] flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 mb-2">
              Event Not Found
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 leading-relaxed">
              We couldn't locate the event with ID "{eventId}". It might have been moved or is no longer listed.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-md hover:bg-[#6c0f25] active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Browse All Live Events</span>
            </Link>
          </div>
        </main>

        <Footer />
        <MobileBottomNav
          user={currentUser}
          onProfileClick={() => setIsAuthModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-neutral-900 selection:bg-[#85142f] selection:text-white">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={event.city || currentCity}
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
            onClick={() => router.push('/events')}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 3. EVENT DETAILS COMPONENT */}
      <main className="flex-1">
        <EventDetails
          event={event}
          relatedEvents={relatedEvents}
          onBookClick={() => {
            // In Phase 4-6, this will route to dedicated booking flow
            router.push(`/events/${event.id}/book`);
          }}
        />
      </main>

      {/* 3. FOOTER */}
      <Footer />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
