export type ConcertBookingMode = 'general-admission' | 'zone-based' | 'reserved-seating';

export interface EventArtist {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: number;
  maxPerOrder: number;
  isSoldOut?: boolean;
  perks?: string[];
}

export interface ConcertZone {
  id: string;
  name: string;
  price: number;
  color: string;
  capacity: number;
  available: number;
  isSoldOut?: boolean;
  entryGate?: string;
  description?: string;
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
  isSoldOut?: boolean;
  isFeatured?: boolean;
  bookingType?: ConcertBookingMode;
  bannerImage?: string;
  artist?: EventArtist;
  duration?: string;
  ageRestriction?: string;
  about?: string[];
  terms?: string[];
  venueId?: string;
  deliveryOptions?: ('digital' | 'home_delivery' | 'venue_pickup')[];
  ticketTiers?: TicketTier[];
  zones?: ConcertZone[];
}

export interface EventFilterState {
  searchQuery: string;
  city: string;
  category: string | null;
  date: string | null;
  priceRange: string | null;
  language: string | null;
  bookingType: ConcertBookingMode | 'all';
  moreFilter: string | null;
}
