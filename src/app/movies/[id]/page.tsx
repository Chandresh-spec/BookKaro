'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ThumbsUp,
  Play,
  Heart,
  Star,
  Clock,
  Calendar,
  MapPin,
  Utensils,
  Smartphone,
  Info,
  Check,
  Search,
  Filter,
  X,
  ArrowRight,
  ShieldCheck,
  Car,
  Accessibility,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { BookingModal } from '@/components/booking/BookingModal';
import { CinemaSeatLayout } from '@/components/booking/CinemaSeatLayout';
import { MovieVideosView } from '@/components/movies/MovieVideosView';
import { AuthModal } from '@/components/auth/AuthModal';
import { TrailerModal } from '@/components/common/TrailerModal';
import { MOVIES, CINEMAS_LIST, DEFAULT_CINEMA_SHOWTIMES } from '@/data/mockData';
import { Movie, CinemaShowtime, User } from '@/types';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;

  // Find movie by ID or fallback
  const movie: Movie = useMemo(() => {
    return (
      MOVIES.find((m) => m.id === movieId) ||
      MOVIES.find((m) => m.id === 'ramayana') ||
      MOVIES.find((m) => m.id === 'party-animals') ||
      MOVIES[0]
    );
  }, [movieId]);

  // View state: 'details' (movie hero) -> 'showtimes' (theatres list) -> 'seating' (exact cinema seat layout) -> 'trailers' (exact videos view)
  const [activeView, setActiveView] = useState<'details' | 'showtimes' | 'seating' | 'trailers'>('details');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(650);
  const [favoriteCinemas, setFavoriteCinemas] = useState<string[]>(['pvr-nexus-koramangala']);
  const [showFavouriteBanner, setShowFavouriteBanner] = useState(true);

  // Advanced Showtimes Filters
  const [cinemaSearchQuery, setCinemaSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'all' | 'under-250' | '250-350' | 'above-350'>('all');
  const [selectedSpecialFormat, setSelectedSpecialFormat] = useState<'all' | '2D' | 'ATMOS' | '4DX' | '4K LASER'>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [openFilterDropdown, setOpenFilterDropdown] = useState<'price' | 'formats' | 'time' | null>(null);

  // Modals & Tooltips
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedCinemaForInfo, setSelectedCinemaForInfo] = useState<CinemaShowtime | null>(null);
  const [hoveredShowtime, setHoveredShowtime] = useState<string | null>(null);
  const [selectedShowtimeInfo, setSelectedShowtimeInfo] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleInterested = () => {
    if (isInterested) {
      setIsInterested(false);
      setInterestedCount((prev) => prev - 1);
      showToast('Removed from your Wishlist');
    } else {
      setIsInterested(true);
      setInterestedCount((prev) => prev + 1);
      showToast('Added to your Wishlist!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${movie.title} — BookKaro`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const toggleFavoriteCinema = (cinemaId: string, cinemaName: string) => {
    if (favoriteCinemas.includes(cinemaId)) {
      setFavoriteCinemas((prev) => prev.filter((id) => id !== cinemaId));
      showToast(`Removed ${cinemaName} from favourites`);
    } else {
      setFavoriteCinemas((prev) => [...prev, cinemaId]);
      showToast(`Added ${cinemaName} to favourites!`);
    }
  };

  // Generate 7 days starting from Fri, 20 Nov 2026 (matching mockup)
  const dateOptions = [
    { day: 'FRI', date: '20', month: 'NOV', isWeekend: false },
    { day: 'SAT', date: '21', month: 'NOV', isWeekend: true },
    { day: 'SUN', date: '22', month: 'NOV', isWeekend: true },
    { day: 'MON', date: '23', month: 'NOV', isWeekend: false },
    { day: 'TUE', date: '24', month: 'NOV', isWeekend: false },
    { day: 'WED', date: '25', month: 'NOV', isWeekend: false },
    { day: 'THU', date: '26', month: 'NOV', isWeekend: false },
  ];

  // Raw showtimes list
  const rawShowtimes: CinemaShowtime[] = useMemo(() => {
    if (movie.showtimes && movie.showtimes.length > 0) {
      return movie.showtimes;
    }
    return DEFAULT_CINEMA_SHOWTIMES;
  }, [movie]);

  // Filtered showtimes based on search, favorites, time, format, price
  const filteredCinemas = useMemo(() => {
    return rawShowtimes.filter((cinema) => {
      // 1. Favourites filter
      if (showFavouritesOnly && !favoriteCinemas.includes(cinema.cinemaId)) {
        return false;
      }

      // 2. Search query filter
      if (cinemaSearchQuery.trim()) {
        const query = cinemaSearchQuery.toLowerCase();
        const matchesName = cinema.cinemaName.toLowerCase().includes(query);
        const matchesLocation = (cinema.location || '').toLowerCase().includes(query);
        if (!matchesName && !matchesLocation) return false;
      }

      // 3. Times filter
      let matchingTimes = cinema.times;

      // Special Format filter
      if (selectedSpecialFormat !== 'all') {
        matchingTimes = matchingTimes.filter((st) =>
          (st.format || '2D').toUpperCase().includes(selectedSpecialFormat.toUpperCase())
        );
      }

      // Price Filter
      if (selectedPriceFilter !== 'all') {
        matchingTimes = matchingTimes.filter((st) => {
          const price = st.price || 250;
          if (selectedPriceFilter === 'under-250') return price <= 250;
          if (selectedPriceFilter === '250-350') return price > 250 && price <= 350;
          if (selectedPriceFilter === 'above-350') return price > 350;
          return true;
        });
      }

      // Time of Day Filter
      if (selectedTimeFilter !== 'all') {
        matchingTimes = matchingTimes.filter((st) => {
          const timeStr = st.time.toUpperCase();
          const isPM = timeStr.includes('PM');
          const isAM = timeStr.includes('AM');
          const hour = parseInt(timeStr.split(':')[0], 10);
          const hour24 = isPM && hour !== 12 ? hour + 12 : isAM && hour === 12 ? 0 : hour;

          if (selectedTimeFilter === 'morning') return hour24 < 12;
          if (selectedTimeFilter === 'afternoon') return hour24 >= 12 && hour24 < 16;
          if (selectedTimeFilter === 'evening') return hour24 >= 16 && hour24 < 19;
          if (selectedTimeFilter === 'night') return hour24 >= 19;
          return true;
        });
      }

      return matchingTimes.length > 0;
    });
  }, [
    rawShowtimes,
    showFavouritesOnly,
    favoriteCinemas,
    cinemaSearchQuery,
    selectedSpecialFormat,
    selectedPriceFilter,
    selectedTimeFilter,
  ]);

  const activeFiltersCount =
    (selectedPriceFilter !== 'all' ? 1 : 0) +
    (selectedSpecialFormat !== 'all' ? 1 : 0) +
    (selectedTimeFilter !== 'all' ? 1 : 0) +
    (showFavouritesOnly ? 1 : 0) +
    (cinemaSearchQuery ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedPriceFilter('all');
    setSelectedSpecialFormat('all');
    setSelectedTimeFilter('all');
    setShowFavouritesOnly(false);
    setCinemaSearchQuery('');
    setOpenFilterDropdown(null);
    showToast('All filters cleared');
  };

  const handleSelectShowtime = (cinema: CinemaShowtime, showtime: any) => {
    const dayName = dateOptions[selectedDateIndex].day === 'FRI' ? 'Fri' : dateOptions[selectedDateIndex].day;
    const formattedDate = `${dayName}, ${dateOptions[selectedDateIndex].date} November, 2026`;
    setSelectedShowtimeInfo({
      movie,
      cinemaName: cinema.cinemaName,
      showtime: showtime.time,
      format: showtime.format || (movie.formats?.[0] ?? '3D'),
      price: showtime.price || 530,
      date: formattedDate,
      cinemaTimes: cinema.times,
    });
    setActiveView('seating');
  };

  // Recommended "You might also like" movies
  const relatedMovies = useMemo(() => {
    return MOVIES.filter((m) => m.id !== movie.id).slice(0, 5);
  }, [movie.id]);

  // Seating layout view matching the exact BookMyShow seat booking screen
  if (activeView === 'seating') {
    return (
      <CinemaSeatLayout
        movie={movie}
        cinemaName={selectedShowtimeInfo?.cinemaName || 'PVR: Bhartiya Mall of Bengaluru'}
        selectedDate={selectedShowtimeInfo?.date || 'Fri, 20 November, 2026'}
        showtime={selectedShowtimeInfo?.showtime || '06:05 PM'}
        format={selectedShowtimeInfo?.format || '3D'}
        language={movie.languages?.[0] || 'Hindi'}
        availableShowtimes={selectedShowtimeInfo?.cinemaTimes || [
          { time: '10:15 AM', format: 'PXL' },
          { time: '02:10 PM', format: 'PXL' },
          { time: '06:05 PM', format: 'PXL' },
        ]}
        onBack={() => setActiveView('showtimes')}
        onBookingComplete={(details) => {
          showToast(`Booking confirmed for ${details.seats.length} seats!`);
          setActiveView('details');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 selection:bg-[#ec5e7b] selection:text-white flex flex-col">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={(c) => setCurrentCity(c)}
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
            onClick={() => {
              if (activeView === 'trailers') {
                setActiveView('details');
              } else if (activeView === 'showtimes') {
                setActiveView('details');
              } else {
                router.push('/movies');
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </button>
          <h1 className="text-sm font-extrabold text-neutral-900 truncate max-w-[200px]">
            {activeView === 'trailers' ? `Videos - ${movie.title}` : movie.title}
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

      {/* ============================================================ */}
      {/* VIEW 1: MOVIE DETAILS HERO & OVERVIEW (Matches User Mockup)  */}
      {/* ============================================================ */}
      {activeView === 'details' && (
        <main className="flex-1 bg-white">
          {/* Hero Section with Immersive Wide Backdrop */}
          <section className="relative w-full bg-[#121214] text-white overflow-hidden">
            {/* Background Backdrop with Gradient Overlays */}
            <div className="absolute inset-0 z-0">
              <Image
                src={movie.bannerImage || movie.posterImage}
                alt={movie.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-40 lg:opacity-50 filter blur-xs lg:blur-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-[#121214]/85 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/60 z-10" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">
                
                {/* Poster Card Left */}
                <div className="relative w-[220px] sm:w-[260px] lg:w-[270px] shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 group">
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={movie.posterImage}
                      alt={movie.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 220px, 270px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Trailers Badge Top/Center */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('trailers');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute bottom-12 inset-x-4 py-2 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Trailers (8)</span>
                    </button>

                    {/* In cinemas Badge */}
                    <div className="absolute bottom-0 inset-x-0 py-2 bg-neutral-950/95 text-center text-[11px] font-bold tracking-tight text-white/90">
                      In cinemas
                    </div>
                  </div>
                </div>

                {/* Movie Info Right */}
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <div className="flex items-center justify-center lg:justify-between mb-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                      {movie.title}
                    </h1>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Rating Badge: ★ 9.2/10 (440K+ Votes) > */}
                  <div className="my-3.5 flex items-center justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900/85 backdrop-blur-md border border-white/10 text-white cursor-pointer hover:bg-neutral-800 transition-colors">
                      <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span className="font-black text-sm sm:text-base">{movie.rating.toFixed(1)}/10</span>
                      <span className="text-xs text-neutral-300 font-semibold">({movie.votesCount || '440K+'} Votes)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
                    </div>
                  </div>

                  {/* Metadata Row: 3h 15m • Action, Adventure, Drama • U • 5 Nov, 2026 */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-neutral-300 font-medium mb-4 flex-wrap">
                    <span>{movie.duration || '3h 15m'}</span>
                    <span>•</span>
                    <span>{movie.genre}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/15 text-white text-[11px] font-bold">
                      {movie.certificate || 'U'}
                    </span>
                    <span>•</span>
                    <span>{movie.releaseDate || '5 Nov, 2026'}</span>
                  </div>

                  {/* Format Pills: 2D, EPIQ, IMAX 3D, DOLBY CINEMA 2D, EPIQ 3D, +10 */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2.5 flex-wrap">
                    {(movie.formats || ['2D', 'EPIQ', 'IMAX 3D', 'DOLBY CINEMA 2D', 'EPIQ 3D', '+10']).map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-white text-xs font-bold tracking-tight border border-white/15 hover:bg-white/20 transition-colors"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>

                  {/* Language Pills: Hindi, Telugu, +3 */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 flex-wrap">
                    {(movie.languages.length > 0 ? movie.languages : ['Hindi', 'Telugu', '+3']).map((lang) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-white text-xs font-bold tracking-tight border border-white/15 hover:bg-white/20 transition-colors"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Primary CTA: "Book tickets" (Switches to Available Theatres View) */}
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('showtimes');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-12 py-3.5 rounded-xl bg-[#ec5e7b] hover:bg-[#d94b68] text-white text-sm sm:text-base font-black tracking-tight shadow-xl shadow-[#ec5e7b]/30 active:scale-95 transition-all cursor-pointer"
                    >
                      Book tickets
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* About the movie Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-neutral-200/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                About the movie
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveView('trailers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-[#ec5e7b] text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-[#ec5e7b]" />
                <span>Watch Trailer</span>
              </button>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl font-normal">
              {movie.synopsis ||
                'The immortal story of Rama and Ravana defined a culture and moved generations. It now arrives as a cinematic landmark of our time. Ramayana is a timeless saga reborn through the lens of modern Indian cinema.'}
            </p>
          </section>

          {/* Cast Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-neutral-200/80">
            <div className="mb-10">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-5 tracking-tight">
                Cast
              </h2>
              <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
                {(movie.cast || [
                  {
                    name: 'Ranbir Kapoor',
                    role: 'Lord Rama',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'Sai Pallavi',
                    role: 'Sita',
                    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'Yash',
                    role: 'Ravana',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'Sunny Deol',
                    role: 'Lord Hanuman',
                    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
                  },
                ]).map((actor, idx) => {
                  const personSlug = actor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <Link
                      key={idx}
                      href={`/person/${personSlug}`}
                      className="flex flex-col items-center shrink-0 w-24 sm:w-28 text-center group cursor-pointer"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-2.5 shadow-sm group-hover:scale-105 transition-transform bg-neutral-200">
                        <Image
                          src={actor.image}
                          alt={actor.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#ec5e7b] transition-colors leading-tight">
                        {actor.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium mt-0.5">
                        {actor.role}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Crew Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-5 tracking-tight">
                Crew
              </h2>
              <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
                {(movie.crew || [
                  {
                    name: 'Nitesh Tiwari',
                    role: 'Director',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'Namit Malhotra',
                    role: 'Producer',
                    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'Hans Zimmer',
                    role: 'Music Composer',
                    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
                  },
                  {
                    name: 'A.R. Rahman',
                    role: 'Music Composer',
                    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop',
                  },
                ]).map((crew, idx) => {
                  const personSlug = crew.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <Link
                      key={idx}
                      href={`/person/${personSlug}`}
                      className="flex flex-col items-center shrink-0 w-24 sm:w-28 text-center group cursor-pointer"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-2.5 shadow-sm group-hover:scale-105 transition-transform bg-neutral-200">
                        <Image
                          src={crew.image}
                          alt={crew.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#ec5e7b] transition-colors leading-tight">
                        {crew.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium mt-0.5">
                        {crew.role}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recommendations: You might also like */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                You might also like
              </h2>
              <Link
                href="/movies"
                className="text-xs sm:text-sm font-bold text-[#85142f] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedMovies.map((item) => (
                <Link
                  key={item.id}
                  href={`/movies/${item.id}`}
                  className="flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 mb-2.5 shadow-xs">
                    <Image
                      src={item.posterImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 160px, 220px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-[#85142f] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">
                    {item.likes || `${item.votesCount || '10K+'} votes`}
                  </p>
                </Link>
              ))}
            </div>

            {/* Breadcrumb Trail */}
            <div className="mt-12 pt-6 border-t border-neutral-200/60 text-xs text-neutral-400 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-neutral-700">Home</Link>
              <span>→</span>
              <Link href="/movies" className="hover:text-neutral-700">Movie tickets</Link>
              <span>→</span>
              <Link href="/movies" className="hover:text-neutral-700">Latest Movies</Link>
              <span>→</span>
              <span className="text-neutral-600 font-bold">{movie.title}</span>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: AVAILABLE THEATRES VIEW (When "Book tickets" clicked) */}
      {/* ============================================================ */}
      {activeView === 'showtimes' && (
        <main className="flex-1 bg-[#f8f9fa]">
          {/* 1. Header Strip with Movie Quick Summary */}
          <section className="bg-white border-b border-neutral-200/90 pt-5 pb-4 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Back button (switches back to details) + Poster Thumbnail + Title & Badges */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveView('details')}
                    className="mt-1 sm:mt-0 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Back to Movie Details"
                    aria-label="Back to Movie Details"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
                  </button>

                  {/* Movie Mini Poster */}
                  <div
                    onClick={() => setActiveView('details')}
                    className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-200 hidden sm:block cursor-pointer group/thumb hover:scale-105 transition-transform"
                    title="Back to Movie Details"
                  >
                    <Image
                      src={movie.posterImage}
                      alt={movie.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-snug">
                        {movie.title} – ({movie.languages[0] || 'Hindi'})
                      </h1>
                      {movie.nativeTitle && (
                        <span className="text-sm font-bold text-neutral-400">
                          {movie.nativeTitle}
                        </span>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-semibold">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>Movie runtime: {movie.duration || '3h 15m'}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-extrabold">
                        {movie.certificate || 'U'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#85142f] text-xs font-bold">
                        {movie.genre}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-500 font-medium ml-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-neutral-900">{movie.rating.toFixed(1)}/10</span>
                        <span>({movie.votesCount || '440K+'} Votes)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-start md:self-auto pl-12 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => setActiveView('details')}
                    className="px-4 py-2 rounded-xl border border-neutral-300 hover:border-[#85142f] hover:text-[#85142f] text-xs font-bold text-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs active:scale-95"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Movie Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-9 h-9 rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-neutral-700 cursor-pointer shadow-2xs transition-colors active:scale-95"
                    title="Share Movie"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

        {/* 2. Modern Sticky Calendar Strip & Filter Toolbar */}
          <section className="border-b border-neutral-200 bg-white sticky top-0 z-40 shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 py-2.5">
              
              {/* Date Selector Tiles */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                {dateOptions.map((item, idx) => {
                  const isSelected = selectedDateIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`relative flex flex-col items-center justify-center w-14 sm:w-16 py-2 rounded-xl transition-all cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-[#ec5e7b] border-[#ec5e7b] text-white shadow-md shadow-[#ec5e7b]/30 font-bold scale-[1.03]'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
                        {item.day}
                      </span>
                      <span className="text-base sm:text-lg font-black leading-none my-0.5">
                        {item.date}
                      </span>
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
                        {item.month}
                      </span>
                      {item.isWeekend && !isSelected && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" title="Weekend" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Filters Toolbar on the Right */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-t md:border-t-0 md:border-l border-neutral-200 pt-2 md:pt-0 md:pl-4">
                
                {/* Active Language/Format Pill */}
                <div className="relative shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ec5e7b] border-b-2 border-[#ec5e7b] pb-2 px-2 whitespace-nowrap">
                    <span>{movie.languages[0] || 'Kannada'} - 2D</span>
                    <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                  </span>
                </div>

                {/* Filter 1: Price Range Popover */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenFilterDropdown(openFilterDropdown === 'price' ? null : 'price')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedPriceFilter !== 'all'
                        ? 'border-[#ec5e7b] bg-rose-50 text-[#ec5e7b] font-bold shadow-2xs'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>Price Range</span>
                    <span className="text-[10px]">▾</span>
                  </button>

                  {openFilterDropdown === 'price' && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-40 animate-in fade-in-50 duration-150">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                        Filter by Price
                      </div>
                      {[
                        { label: 'All Prices', val: 'all' },
                        { label: 'Under ₹250', val: 'under-250' },
                        { label: '₹250 - ₹350', val: '250-350' },
                        { label: 'Above ₹350', val: 'above-350' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setSelectedPriceFilter(opt.val as any);
                            setOpenFilterDropdown(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            selectedPriceFilter === opt.val
                              ? 'bg-rose-50 text-[#ec5e7b] font-bold'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedPriceFilter === opt.val && <Check className="w-3.5 h-3.5 text-[#ec5e7b]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter 2: Special Formats Popover */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenFilterDropdown(openFilterDropdown === 'formats' ? null : 'formats')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedSpecialFormat !== 'all'
                        ? 'border-[#ec5e7b] bg-rose-50 text-[#ec5e7b] font-bold shadow-2xs'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>Special Formats</span>
                    <span className="text-[10px]">▾</span>
                  </button>

                  {openFilterDropdown === 'formats' && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-40 animate-in fade-in-50 duration-150">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                        Sound & Projection
                      </div>
                      {[
                        { label: 'All Formats', val: 'all' },
                        { label: '2D Standard', val: '2D' },
                        { label: 'Dolby Atmos', val: 'ATMOS' },
                        { label: '4DX 3D', val: '4DX' },
                        { label: '4K Laser', val: '4K LASER' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setSelectedSpecialFormat(opt.val as any);
                            setOpenFilterDropdown(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            selectedSpecialFormat === opt.val
                              ? 'bg-rose-50 text-[#ec5e7b] font-bold'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedSpecialFormat === opt.val && <Check className="w-3.5 h-3.5 text-[#ec5e7b]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter 3: Preferred Time Popover */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenFilterDropdown(openFilterDropdown === 'time' ? null : 'time')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedTimeFilter !== 'all'
                        ? 'border-[#ec5e7b] bg-rose-50 text-[#ec5e7b] font-bold shadow-2xs'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>Preferred Time</span>
                    <span className="text-[10px]">▾</span>
                  </button>

                  {openFilterDropdown === 'time' && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-40 animate-in fade-in-50 duration-150">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                        Time of Show
                      </div>
                      {[
                        { label: 'All Showtimes', val: 'all' },
                        { label: 'Morning (Before 12 PM)', val: 'morning' },
                        { label: 'Afternoon (12 PM - 4 PM)', val: 'afternoon' },
                        { label: 'Evening (4 PM - 7 PM)', val: 'evening' },
                        { label: 'Night (After 7 PM)', val: 'night' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setSelectedTimeFilter(opt.val as any);
                            setOpenFilterDropdown(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            selectedTimeFilter === opt.val
                              ? 'bg-rose-50 text-[#ec5e7b] font-bold'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedTimeFilter === opt.val && <Check className="w-3.5 h-3.5 text-[#ec5e7b]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Filters Quick Button if active */}
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-[#85142f] hover:bg-rose-50 transition-colors shrink-0"
                    title="Clear All Filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

              </div>

            </div>
          </section>

          {/* 3. Interactive Sub-Bar (Live Search, Favourites, & Legend) */}
          <section className="bg-white border-b border-neutral-200/80 py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Left: Real-time Cinema Search Input & Favourites Toggle */}
              <div className="flex items-center gap-2.5 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={cinemaSearchQuery}
                    onChange={(e) => setCinemaSearchQuery(e.target.value)}
                    placeholder="Search cinema or location (e.g. Koramangala, INOX)..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#ec5e7b] focus:bg-white transition-all shadow-2xs"
                  />
                  {cinemaSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCinemaSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Favourites Only Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    showFavouritesOnly
                      ? 'bg-rose-50 border-rose-300 text-[#85142f]'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${showFavouritesOnly ? 'fill-[#ec5e7b] text-[#ec5e7b]' : 'text-neutral-400'}`} />
                  <span>Favourites {favoriteCinemas.length > 0 && `(${favoriteCinemas.length})`}</span>
                </button>
              </div>

              {/* Right: Legend */}
              <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                  <span className="text-neutral-700">AVAILABLE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                  <span className="text-neutral-700">FAST FILLING</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" />
                  <span className="text-neutral-700">ALMOST FULL</span>
                </div>
              </div>

            </div>
          </section>

          {/* 4. Cinemas & Showtimes Schedule List (Modern 2-Column Cards) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            {filteredCinemas.length === 0 ? (
              /* Empty state when filters match no cinemas */
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#85142f] flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-neutral-900 mb-1">
                  No Showtimes Found
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-5 leading-relaxed">
                  We couldn't find any showtimes matching your filters in {currentCity}. Try adjusting your filters or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#85142f] text-white text-xs font-bold shadow-md hover:bg-[#6e1026] active:scale-95 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredCinemas.map((cinema) => {
                const isFav = favoriteCinemas.includes(cinema.cinemaId);
                const cinemaBrand = cinema.brand || (cinema.cinemaName.startsWith('INOX') ? 'INOX' : cinema.cinemaName.startsWith('PVR') ? 'PVR' : cinema.cinemaName.startsWith('Cinepolis') ? 'Cinepolis' : 'Other');

                return (
                  <div
                    key={cinema.cinemaId}
                    className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col lg:flex-row gap-5 items-stretch"
                  >
                    {/* Left Column: Cinema Profile & Amenities (~360px on desktop) */}
                    <div className="w-full lg:w-[360px] shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-100 lg:pr-6 pb-4 lg:pb-0 flex flex-col justify-between">
                      <div>
                        {/* Cinema Header Row with Brand Badge & Heart */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {/* Brand Badge */}
                            {cinemaBrand === 'INOX' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-gradient-to-r from-[#0e2a47] to-[#1a3d66] text-white shadow-2xs uppercase">
                                INOX
                              </span>
                            )}
                            {cinemaBrand === 'PVR' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 shadow-2xs uppercase">
                                PVR
                              </span>
                            )}
                            {cinemaBrand === 'Cinepolis' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-gradient-to-r from-[#003366] to-[#0055a5] text-white shadow-2xs uppercase">
                                Cinépolis
                              </span>
                            )}
                            {cinemaBrand === 'Other' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-neutral-800 text-white shadow-2xs uppercase">
                                Cinema
                              </span>
                            )}
                            
                            {/* Distance Badge */}
                            {cinema.distance && (
                              <span className="text-[11px] font-medium text-neutral-400">
                                • {cinema.distance}
                              </span>
                            )}
                          </div>

                          {/* Favorite Heart Button */}
                          <button
                            type="button"
                            onClick={() => toggleFavoriteCinema(cinema.cinemaId, cinema.cinemaName)}
                            className="p-1 rounded-full text-neutral-300 hover:text-rose-500 transition-all cursor-pointer hover:scale-110 active:scale-95"
                            aria-label="Toggle favourite"
                            title={isFav ? "Saved to favourites" : "Add to favourites"}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Cinema Title */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3
                            onClick={() => setSelectedCinemaForInfo(cinema)}
                            className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug hover:text-[#ec5e7b] transition-colors cursor-pointer"
                          >
                            {cinema.cinemaName}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setSelectedCinemaForInfo(cinema)}
                            className="p-0.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                            title="Cinema Info"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Location Subtext */}
                        {cinema.location && (
                          <p className="text-xs text-neutral-500 mb-3 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{cinema.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Policy & Amenities Chips */}
                      <div className="space-y-2 pt-2 border-t border-neutral-100/80">
                        {/* Cancellation Policy */}
                        <div className="flex items-center gap-1.5 text-xs">
                          {cinema.cancellationAvailable ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Cancellation available</span>
                            </span>
                          ) : (
                            <span className="text-neutral-400 font-medium text-[11px]">
                              ✕ Non-cancellable
                            </span>
                          )}
                        </div>

                        {/* Facility Chips with Real Icons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cinema.facilities?.map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md transition-colors"
                            >
                              {f === 'F&B' && <span>🍿 F&B</span>}
                              {f === 'M-Ticket' && <span>📱 M-Ticket</span>}
                              {f === 'Parking' && <span>🚗 Parking</span>}
                              {f === 'Wheelchair' && <span>♿ Accessible</span>}
                              {f === 'Recliner' && <span>💺 Recliner</span>}
                              {f === '4DX' && <span>⚡ 4DX Experience</span>}
                              {!['F&B', 'M-Ticket', 'Parking', 'Wheelchair', 'Recliner', '4DX'].includes(f) && (
                                <span>{f}</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Showtime Pills with Pricing Breakdown Tooltip */}
                    <div className="flex-1 flex flex-wrap items-center content-center gap-3">
                      {cinema.times.map((st, sIdx) => {
                        const isFast = st.status === 'fast-filling';
                        const isAlmostFull = st.status === 'almost-full';
                        const uniqueKey = `${cinema.cinemaId}-${sIdx}`;
                        const isHovered = hoveredShowtime === uniqueKey;

                        return (
                          <div
                            key={sIdx}
                            className="relative group/pill"
                            onMouseEnter={() => setHoveredShowtime(uniqueKey)}
                            onMouseLeave={() => setHoveredShowtime(null)}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectShowtime(cinema, st)}
                              className={`flex flex-col items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:scale-104 active:scale-95 text-center ${
                                isAlmostFull
                                  ? 'border-rose-400 bg-rose-50/50 hover:bg-rose-500 hover:text-white text-rose-700'
                                  : isFast
                                  ? 'border-amber-400 bg-amber-50/40 hover:bg-amber-500 hover:text-white text-amber-700'
                                  : 'border-emerald-500/80 bg-white hover:bg-emerald-500 hover:text-white text-emerald-700'
                              }`}
                            >
                              {/* Showtime */}
                              <span className="text-xs sm:text-sm font-black tracking-tight leading-none">
                                {st.time}
                              </span>

                              {/* Format / Audio Subtitle */}
                              <span className="text-[9px] uppercase font-bold tracking-wider opacity-85 mt-1">
                                {st.format || '2D'}
                              </span>

                              {/* Price Tag Preview */}
                              {st.price && (
                                <span className="text-[10px] font-extrabold mt-0.5 opacity-90">
                                  ₹{st.price}
                                </span>
                              )}
                            </button>

                            {/* Class Pricing Hover Tooltip (BookMyShow Style) */}
                            {isHovered && st.categories && (
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-neutral-900/95 backdrop-blur-md text-white text-[11px] rounded-xl p-2.5 shadow-2xl z-50 pointer-events-none animate-in fade-in-50 zoom-in-95">
                                <div className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 border-b border-neutral-700/60 pb-1">
                                  Available Classes
                                </div>
                                <div className="space-y-1">
                                  {st.categories.map((cat, cIdx) => (
                                    <div key={cIdx} className="flex items-center justify-between">
                                      <span className="text-neutral-300 font-medium">{cat.name}:</span>
                                      <span className="font-bold text-white">₹{cat.price}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-1.5 pt-1 border-t border-neutral-800 text-[9px] text-amber-400 text-center font-bold">
                                  Tap to select seats
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })
            )}
          </section>

          {/* 5. Cinema Info Modal */}
          {selectedCinemaForInfo && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#85142f] mb-1.5 inline-block">
                      {selectedCinemaForInfo.brand || 'Cinema'}
                    </span>
                    <h3 className="text-lg font-black text-neutral-900 leading-snug">
                      {selectedCinemaForInfo.cinemaName}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{selectedCinemaForInfo.location || 'Bengaluru, Karnataka'}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCinemaForInfo(null)}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 py-3 border-y border-neutral-100 text-xs">
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Available Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCinemaForInfo.facilities?.map((f) => (
                        <span key={f} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium">
                          {f === 'F&B' ? '🍿 Food & Beverage Counter' : f === 'M-Ticket' ? '📱 Contactless M-Ticket' : f === 'Parking' ? '🚗 Car & Bike Parking' : f === 'Wheelchair' ? '♿ Wheelchair Accessible' : f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Ticket Cancellation Policy</h4>
                    <p className={selectedCinemaForInfo.cancellationAvailable ? "text-emerald-600 leading-relaxed" : "text-neutral-500 leading-relaxed"}>
                      {selectedCinemaForInfo.cancellationAvailable
                        ? "✓ Cancellation available up to 20 minutes before the scheduled showtime. 100% refund available as BookKaro credits or back to your payment mode."
                        : "✕ Non-cancellable tickets for this venue according to cinema exhibitor policy."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Audio & Projection</h4>
                    <p className="text-neutral-500 leading-relaxed">
                      Equipped with Dolby Atmos 7.1 surround sound and 4K RealD projection for unmatched clarity and deep bass.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedCinemaForInfo(null)}
                    className="px-6 py-2 rounded-xl bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Breadcrumbs & Padding for Showtimes */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200/80 text-xs text-neutral-400 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-neutral-700">Home</Link>
            <span>→</span>
            <Link href="/movies" className="hover:text-neutral-700">Movie tickets</Link>
            <span>→</span>
            <span className="text-neutral-600 font-bold">{movie.title} Showtimes</span>
          </div>
        </main>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: VIDEOS & TRAILERS VIEW (Matches User Screenshot)     */}
      {/* ============================================================ */}
      {activeView === 'trailers' && (
        <MovieVideosView
          movie={movie}
          onBack={() => {
            setActiveView('details');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* ============================================================ */}
      {/* 4. MASTER BOOKKARO FOOTER (Matches Screenshot 4)             */}
      {/* ============================================================ */}
      <Footer currentCity={currentCity} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        item={selectedShowtimeInfo ? selectedShowtimeInfo.movie : movie}
        currentCity={currentCity}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerModalOpen}
        title={`${movie.title} — Official Trailer`}
        onClose={() => setIsTrailerModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />

      {/* Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab="movies"
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
