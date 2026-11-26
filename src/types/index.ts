export type CategoryType = 'movies' | 'concerts' | 'sports' | 'theatre' | 'comedy';

export interface CategoryItem {
  id: CategoryType;
  label: string;
  iconName: 'clapperboard' | 'music' | 'trophy' | 'theater' | 'mic';
  href: string;
}

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface CrewMember {
  name: string;
  role: string;
  image: string;
}

export interface CinemaShowtime {
  cinemaId: string;
  cinemaName: string;
  brand?: 'INOX' | 'PVR' | 'Cinepolis' | 'Miraj' | 'Other';
  location?: string;
  distance?: string;
  cancellationAvailable?: boolean;
  facilities?: string[];
  times: {
    time: string;
    format?: string;
    status: 'available' | 'fast-filling' | 'almost-full';
    price?: number;
    seatsLeft?: number;
    categories?: { name: string; price: number; status: 'available' | 'filling-fast' | 'sold-out' }[];
  }[];
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
  synopsis?: string;
  releaseDate?: string;
  cast?: CastMember[];
  crew?: CrewMember[];
  showtimes?: CinemaShowtime[];
}

export * from './event';
export * from './venue';
export * from './booking';
export * from './sports';
export * from './account';

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
