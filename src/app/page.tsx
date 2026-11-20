'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { MOVIES, TRENDING_EXPERIENCES, FEATURED_HERO, FEATURED_HEROES } from '@/data/mockData';
import { Movie, LiveEvent, CategoryType, User } from '@/types';

export default function Home() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('movies');
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

  const handleHeroBooking = (heroIndex: number = 0) => {
    const hero = FEATURED_HEROES?.[heroIndex] || FEATURED_HERO;
    setSelectedItemForBooking({
      id: 'featured-hero-' + heroIndex,
      title: hero.badgeName + ' — ' + hero.title.replace('\n', ' '),
      category: hero.tag.includes('SPORT') ? 'SPORTS' : 'CONCERT',
      date: hero.date,
      time: hero.time,
      venue: hero.venue,
      city: currentCity,
      startingPrice: 1499,
      currency: '₹',
      image: hero.bgImage,
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
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-neutral-900 selection:bg-[#85142f] selection:text-white pb-16 lg:pb-0">
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
