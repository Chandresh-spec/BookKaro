export type SportCategory =
  | 'Running'
  | 'Chess'
  | 'Mixed Martial Arts'
  | 'Shooting'
  | 'Basketball'
  | 'Card Games'
  | 'Football'
  | 'Motorsports'
  | 'Pool';

export type SportBookingMode = 'participation' | 'general-admission' | 'reserved-seating';

export type VenueType = 'indoor' | 'outdoor' | 'both';

export type VenueCategory = 'Stadium' | 'Ground / Track' | 'Arena / Indoor Complex' | 'Club / Lounge';

export interface ParticipationCategory {
  id: string;
  name: string;
  distance?: string;
  fee: number;
  description?: string;
  includesTShirt?: boolean;
  minAge?: number;
  availableSlots?: number;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: boolean;
  perks?: string[];
}

export interface SportEvent {
  id: string;
  title: string;
  slug: string;
  sportType: SportCategory | string;
  date: string;
  isoDate: string; // YYYY-MM-DD
  time?: string;
  venue: string;
  venueId: string;
  city: string;
  distanceOrCategory?: string;
  startingPrice: number;
  currency: string;
  image: string;
  bannerImage?: string;
  isOutdoor?: boolean;
  venueType?: VenueType;
  venueCategory?: VenueCategory;
  isFamilyFriendly?: boolean;
  isFastFilling?: boolean;
  isAvailable?: boolean;
  isFree?: boolean;
  description?: string;
  duration?: string;
  ageRestriction?: string;
  highlights?: string[];
  rules?: string[];
  terms?: string[];
  bookingMode: SportBookingMode;
  participationCategories?: ParticipationCategory[];
  ticketCategories?: TicketCategory[];
}

export interface SportVenue {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  type: VenueType;
  category: VenueCategory;
  sportsSupported: (SportCategory | string)[];
  image: string;
  capacity?: string;
  parkingAvailable?: boolean;
  metroConnectivity?: string;
}

export interface SportFilterState {
  sports: string[];
  dateOption: string | null;
  customStartDate: string | null;
  customEndDate: string | null;
  moreFilters: string[];
  venueCategory: string | null;
  priceRange: string | null;
  venueId: string | null;
}
