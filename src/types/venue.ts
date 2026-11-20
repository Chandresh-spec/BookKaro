export type SeatStatus = 'available' | 'selected' | 'held' | 'sold' | 'blocked';
export type SeatTierCategory = 'PLATINUM' | 'GOLD' | 'SILVER' | 'VIP' | 'GENERAL';

export interface SeatCoordinates {
  x: number;
  y: number;
}

export interface StadiumSeat {
  id: string;
  row: string;
  number: number;
  tier: SeatTierCategory;
  price: number;
  status: SeatStatus;
  coords: SeatCoordinates;
  isAccessible?: boolean;
}

export interface StadiumBlock {
  id: string;
  name: string;
  code: string;
  tier: SeatTierCategory;
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  svgPath: string; // SVG path or polygon points for the block
  labelCoords: { x: number; y: number };
  seats?: StadiumSeat[]; // Lazy-loaded for performance
}

export interface StadiumStand {
  id: string;
  name: string; // e.g., 'North Stand', 'South Stand', 'East Club', 'West Pavilion'
  code: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  accentColor: string;
  description?: string;
  svgPath: string;
  blocks: StadiumBlock[];
}

export interface StadiumVenueConfig {
  id: string;
  name: string;
  city: string;
  type: 'stadium';
  viewBox: string;
  fieldLabel: string; // e.g., 'Cricket Pitch / Stage Center'
  stands: StadiumStand[];
}

export interface ZoneGeometry {
  id: string;
  name: string;
  code: string;
  svgPath: string;
  fillColor: string;
  hoverColor: string;
  strokeColor: string;
  labelPosition: { x: number; y: number };
  capacity: number;
  entryGate: string;
  recommendedAudience?: string;
}

export interface ZoneVenueConfig {
  id: string;
  name: string;
  city: string;
  type: 'arena' | 'open-ground';
  viewBox: string;
  stagePosition: 'top' | 'center';
  zones: ZoneGeometry[];
}

export type VenueConfiguration = StadiumVenueConfig | ZoneVenueConfig;
