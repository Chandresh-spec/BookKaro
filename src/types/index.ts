export type CategoryType = 'all' | 'movies' | 'concerts' | 'sports' | 'theatre' | 'comedy' | 'live-events';

export interface CategoryItem {
  id: CategoryType;
  label: string;
  iconName: 'layout-grid' | 'film' | 'music' | 'trophy' | 'theater' | 'mic' | 'sparkles';
  badge?: string;
  href: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  tagline?: string;
  rating: number;
  votesCount?: string;
  genres: string[];
  languages: string[];
  duration?: string;
  releaseDate?: string;
  bannerImage: string;
  posterImage: string;
  isCinemaExclusive: boolean;
  featured?: boolean;
}

export interface LiveEvent {
  id: string;
  title: string;
  category: 'MUSIC' | 'SPORTS' | 'COMEDY' | 'THEATRE' | 'LIFESTYLE';
  date: string;
  time: string;
  venue: string;
  city: string;
  startingPrice: number;
  currency: string;
  image: string;
  isTrending?: boolean;
  badgeText?: string;
}

export interface ValueProp {
  id: string;
  icon: 'ticket' | 'shield' | 'headset';
  title: string;
  description: string;
}

export interface CityOption {
  id: string;
  name: string;
  isPopular?: boolean;
}

export interface FilterState {
  city: string;
  language: string;
  category: string;
  searchQuery: string;
}
