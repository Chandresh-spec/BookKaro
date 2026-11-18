'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { NowShowing } from '@/components/home/NowShowing';
import { TrendingExperiences } from '@/components/home/TrendingExperiences';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { TrailerModal } from '@/components/common/TrailerModal';
import { MOVIES, TRENDING_EXPERIENCES, FEATURED_HERO } from '@/data/mockData';
import { Movie, LiveEvent, CategoryType, User } from '@/types';

export default function Home() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('movies');
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

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    const targetId = categoryId === 'movies' ? 'movies' : 'trending';
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-neutral-900 selection:bg-[#85142f] selection:text-white">
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
    </div>
  );
}
