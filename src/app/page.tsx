'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { NowShowing } from '@/components/home/NowShowing';
import { StepOutTuneIn } from '@/components/home/StepOutTuneIn';
import { PromoBanner } from '@/components/home/PromoBanner';
import { ValueProps } from '@/components/home/ValueProps';
import { Newsletter } from '@/components/home/Newsletter';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { MOVIES, LIVE_EVENTS } from '@/data/mockData';
import { Movie, LiveEvent, CategoryType } from '@/types';

export default function Home() {
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>();
  const [selectedItemForBooking, setSelectedItemForBooking] = useState<Movie | LiveEvent | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Filtered movies based on global search if any
  const displayedMovies = searchQuery.trim()
    ? MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : MOVIES;

  // Filtered live events based on global search if any
  const displayedEvents = searchQuery.trim()
    ? LIVE_EVENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : LIVE_EVENTS;

  const handleOpenMovieBooking = (movie: Movie) => {
    setSelectedItemForBooking(movie);
    setIsBookingModalOpen(true);
  };

  const handleOpenEventBooking = (event: LiveEvent) => {
    setSelectedItemForBooking(event);
    setIsBookingModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Smooth scroll to results
      const section = document.getElementById('movies');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    const section = document.getElementById('movies');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    const targetId = categoryId === 'movies' ? 'movies' : 'live-events';
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiscoverWeekend = () => {
    const section = document.getElementById('live-events');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      {/* Top Navigation */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        onSearchClick={() => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
        onSignInClick={() => {
          alert('Sign In modal / FastAPI OAuth authentication ready');
        }}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          currentCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)}
          onSearch={handleSearch}
          onTagClick={handleTagClick}
        />

        {/* Categories Bar ("What are you in the mood for?") */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Now Showing (Movies grid with language filter pills) */}
        <NowShowing
          movies={displayedMovies}
          onSelectMovie={handleOpenMovieBooking}
        />

        {/* Step out. Tune in. (Live events grid) */}
        <StepOutTuneIn
          events={displayedEvents}
          currentCity={currentCity}
          onSelectEvent={handleOpenEventBooking}
        />

        {/* Promotional Dark Feature Banner ("Less scrolling. More living.") */}
        <PromoBanner onDiscoverClick={handleDiscoverWeekend} />

        {/* Value Proposition Highlights ("More experience. Less effort.") */}
        <ValueProps />

        {/* Newsletter Subscription ("Be first in line.") */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer currentCity={currentCity} />

      {/* Interactive Booking & Details Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        item={selectedItemForBooking}
        currentCity={currentCity}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedItemForBooking(null);
        }}
      />
    </div>
  );
}
