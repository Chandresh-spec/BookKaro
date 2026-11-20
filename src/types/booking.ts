import { ConcertBookingMode } from './event';
import { SeatTierCategory } from './venue';

export type TicketDeliveryType = 'digital' | 'home_delivery' | 'venue_pickup';

export interface SelectedTicketItem {
  id: string; // tierId, zoneId, or seatId
  name: string; // e.g. "Phase 1 - Fan Pit" or "Block A Row C Seat 12"
  price: number;
  quantity: number;
  seatDetails?: {
    stand?: string;
    block?: string;
    row?: string;
    seatNumber?: number;
    tier?: SeatTierCategory;
  };
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BookingState {
  eventId: string;
  bookingType: ConcertBookingMode;
  items: SelectedTicketItem[];
  deliveryType: TicketDeliveryType;
  deliveryAddress?: DeliveryAddress;
  convenienceFeePerTicket: number;
  gstPercent: number; // e.g. 18%
  homeDeliveryFee: number;
  reservationExpiresAt?: number; // timestamp ms
}

export interface BookingConfirmationResult {
  bookingId: string;
  bookingTime: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  items: SelectedTicketItem[];
  totalPaid: number;
  deliveryType: TicketDeliveryType;
  deliveryAddress?: DeliveryAddress;
  qrCodeUrl: string;
}
