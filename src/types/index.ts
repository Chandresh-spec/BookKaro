export type CategoryType = 'movies' | 'concerts' | 'sports' | 'theatre' | 'comedy';

export interface CategoryItem {
  id: CategoryType;
  label: string;
  iconName: 'clapperboard' | 'music' | 'trophy' | 'theater' | 'mic';
  href: string;
}

export interface Movie {
  id: string;
  title: string;
  nativeTitle?: string;
  rating: number;
  votesCount?: string;
  likes?: string;
  genre: string;
  genres?: string[];
  languages: string[];
  formats?: string[];
  certificate?: string;
  duration?: string;
  posterImage: string;
  bannerImage?: string;
  isCinemaExclusive?: boolean;
  isUpcoming?: boolean;
  isPromoted?: boolean;
  trailerUrl?: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  startingPrice: number;
  currency: string;
  image: string;
  badgeText?: string;
  isTrending?: boolean;
  isPromoted?: boolean;
  language?: string;
  isOutdoor?: boolean;
  isFastFilling?: boolean;
  mustAttend?: boolean;
}

export interface SportEvent {
  id: string;
  title: string;
  sportType: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  distanceOrCategory?: string;
  startingPrice: number;
  currency: string;
  image: string;
  isOutdoor?: boolean;
  isFastFilling?: boolean;
}

export interface FeaturedHero {
  tag: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  badgeName: string;
  badgeSub: string;
  bgImage: string;
  trailerUrl: string;
}

export interface CityOption {
  id: string;
  name: string;
  isPopular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  avatar?: string;
}
