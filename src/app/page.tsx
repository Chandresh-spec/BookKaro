'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { NowShowing } from '@/components/home/NowShowing';
import { TrendingExperiences } from '@/components/home/TrendingExperiences';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { TrailerModal } from '@/components/common/TrailerModal';
import { MOVIES, TRENDING_EXPERIENCES, FEATURED_HERO } from '@/data/mockData';
import { Movie, LiveEvent, CategoryType, User } from '@/types';

export default function Home() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('movies');
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('home');
  const [selectedItemForBooking, setSelectedItemForBooking] = useState<Movie | LiveEvent | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerTitle, setTrailerTitle] = useState('After Hours Live Showcase');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  // Keep mobile bottom tab as home on the index page

  // Filter movies by search query if user searches
  const filteredMovies = searchQuery.trim()
    ? MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : MOVIES;

  // Filter trending events by search query if user searches
  const filteredEvents = searchQuery.trim()
    ? TRENDING_EXPERIENCES.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TRENDING_EXPERIENCES;

  const handleOpenMovieBooking = (movie: Movie) => {
    setSelectedItemForBooking(movie);
    setIsBookingModalOpen(true);
  };

  const handleOpenEventBooking = (event: LiveEvent) => {
    setSelectedItemForBooking(event);
    setIsBookingModalOpen(true);
  };

  const handleHeroBooking = () => {
    setSelectedItemForBooking({
      id: 'after-hours-hero',
      title: FEATURED_HERO.badgeName + ' — ' + FEATURED_HERO.title.replace('\n', ' '),
      category: 'CONCERT',
      date: FEATURED_HERO.date,
      time: FEATURED_HERO.time,
      venue: FEATURED_HERO.venue,
      city: currentCity,
      startingPrice: 1499,
      currency: '₹',
      image: FEATURED_HERO.bgImage,
    });
    setIsBookingModalOpen(true);
  };

  const handleWatchTrailer = (title?: string) => {
    setTrailerTitle(title || FEATURED_HERO.badgeName);
    setIsTrailerModalOpen(true);
  };

  const router = useRouter();

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'movies') {
      router.push('/movies');
      return;
    }
    if (categoryId === 'sports') {
      router.push('/sports');
      return;
    }
    if (categoryId === 'concerts' || categoryId === 'theatre' || categoryId === 'comedy') {
      router.push('/events');
      return;
    }
    const targetElement = document.getElementById('trending');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f8] text-neutral-900 selection:bg-[#85142f] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentCity={currentCity}
        user={currentUser}
        onSelectCity={(city) => setCurrentCity(city)}
        onSearchClick={() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (input) input.focus();
        }}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onSignOut={() => setCurrentUser(null)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Featured Hero Banner */}
        <Hero
          currentCity={currentCity}
          onBookTickets={handleHeroBooking}
          onWatchTrailer={() => handleWatchTrailer('After Hours Live Showcase')}
        />

        {/* Category Capsule Pills */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Now Showing Section */}
        <NowShowing
          movies={filteredMovies}
          onBookMovie={handleOpenMovieBooking}
        />

        {/* Trending Experiences Section */}
        <TrendingExperiences
          events={filteredEvents}
          onSelectEvent={handleOpenEventBooking}
        />

        {/* EXPLORE ALL CATEGORIES (Matching BookMyShow Mobile Reference) */}
        <div className="lg:hidden py-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('trending');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else router.push('/events');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ec5e7b] hover:text-[#85142f] active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#ec5e7b]" />
            <span>Explore All Categories</span>
          </button>
        </div>

        {/* KNOW MORE ABOUT ONLINE TICKET BOOKING ACCORDION */}
        <div className="lg:hidden border-t border-neutral-200 bg-neutral-50/60 rounded-xl mx-4 my-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsKnowMoreOpen(!isKnowMoreOpen)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <span>Know more about Online Ticket Booking</span>
            <span className="text-base font-light text-neutral-500">
              {isKnowMoreOpen ? '−' : '+'}
            </span>
          </button>
          {isKnowMoreOpen && (
            <div className="px-4 pb-4 text-[11px] text-neutral-500 leading-relaxed space-y-2 animate-in fade-in duration-200">
              <p>
                BookKaro is your one-stop entertainment destination in {currentCity} for movies, live concerts, stand-up comedy, sports marathons, theatre plays, and family experiences.
              </p>
              <p>
                Enjoy seamless instant seat reservations, M-Tickets on WhatsApp, verified event organizers, and exclusive bank offers with 24/7 dedicated customer assistance.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer currentCity={currentCity} />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        item={selectedItemForBooking}
        currentCity={currentCity}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedItemForBooking(null);
        }}
      />

      {/* Authentication Modal ("Get Started") */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Video Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerModalOpen}
        title={trailerTitle}
        onClose={() => setIsTrailerModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Fixed at bottom for mobile viewports) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={(tab) => setMobileTab(tab)}
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
