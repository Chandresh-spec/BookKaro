import { CategoryItem, Movie, LiveEvent, FeaturedHero, CityOption } from '@/types';

export const CITIES: CityOption[] = [
  { id: 'bengaluru', name: 'Bengaluru', isPopular: true },
  { id: 'mumbai', name: 'Mumbai', isPopular: true },
  { id: 'delhi-ncr', name: 'Delhi-NCR', isPopular: true },
  { id: 'hyderabad', name: 'Hyderabad', isPopular: true },
  { id: 'chennai', name: 'Chennai', isPopular: true },
  { id: 'pune', name: 'Pune', isPopular: true },
];

export const FEATURED_HERO: FeaturedHero = {
  tag: 'FEATURED EVENT',
  title: 'Your next\nunforgettable moment.',
  subtitle: 'Discover and book the best movies, concerts, sports, theatre and live events in your city.',
  date: 'Sat, 24 Nov',
  time: '7:00 PM',
  venue: 'Phoenix Marketcity',
  city: 'Bengaluru',
  badgeName: 'After Hours',
  badgeSub: 'LIVE SHOWCASE',
  bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export const CATEGORIES: CategoryItem[] = [
  { id: 'movies', label: 'Movies', iconName: 'clapperboard', href: '#movies' },
  { id: 'concerts', label: 'Concerts', iconName: 'music', href: '#concerts' },
  { id: 'sports', label: 'Sports', iconName: 'trophy', href: '#sports' },
  { id: 'theatre', label: 'Theatre', iconName: 'theater', href: '#theatre' },
  { id: 'comedy', label: 'Comedy', iconName: 'mic', href: '#comedy' },
];

export const MOVIES: Movie[] = [
  {
    id: 'pushpa-2',
    title: 'Pushpa 2: The Rule',
    rating: 8.6,
    genre: 'Action',
    languages: ['Telugu', 'Hindi'],
    duration: '3h 10m',
    posterImage: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'kalki-2898-ad',
    title: 'Kalki 2898 AD',
    rating: 8.4,
    genre: 'Sci-Fi',
    languages: ['Telugu', 'Hindi'],
    duration: '3h 01m',
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'deadpool-and-wolverine',
    title: 'Deadpool & Wolverine',
    rating: 8.8,
    genre: 'Action',
    languages: ['English', 'Hindi'],
    duration: '2h 08m',
    posterImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    rating: 8.7,
    genre: 'Sci-Fi',
    languages: ['English'],
    duration: '2h 46m',
    posterImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'inside-out-2',
    title: 'Inside Out 2',
    rating: 8.5,
    genre: 'Animation',
    languages: ['English', 'Hindi'],
    duration: '1h 36m',
    posterImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
];

export const TRENDING_EXPERIENCES: LiveEvent[] = [
  {
    id: 'coldplay-music-spheres',
    title: 'Coldplay: Music of the Spheres',
    category: 'CONCERT',
    date: 'Sat, 18 Jan',
    time: '6:30 PM',
    venue: 'DY Patil Stadium',
    city: 'Mumbai',
    startingPrice: 2500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'ipl-2026-mi-csk',
    title: 'IPL 2026: MI vs CSK',
    category: 'SPORTS',
    date: 'Sun, 28 Mar',
    time: '7:30 PM',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    startingPrice: 999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'hamlet-classic-return',
    title: 'Hamlet – The Classic Return',
    category: 'THEATRE',
    date: 'Fri, 10 Feb',
    time: '8:00 PM',
    venue: 'Ravindra Kalakshetra',
    city: 'Bengaluru',
    startingPrice: 499,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
  },
];

export const LIVE_EVENTS = TRENDING_EXPERIENCES;
