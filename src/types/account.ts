export interface AccountProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  mobile: string;
  isMobileVerified: boolean;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  avatar?: string;
  birthday?: string;
  gender?: 'Man' | 'Woman' | 'Other' | 'Prefer not to say';
  married?: 'Yes' | 'No' | 'Prefer not to say';
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state?: string;
}

export type NotificationCategory = 'all' | 'bookings' | 'offers' | 'alerts';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: Exclude<NotificationCategory, 'all'>;
  timestamp: string;
  dateGroup: 'Today' | 'Earlier this week' | 'Earlier';
  isRead: boolean;
  actionHref?: string;
  actionLabel?: string;
}

export type OrderItemType = 'movie' | 'event' | 'sport' | 'stream';
export type OrderStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface OrderRecord {
  id: string;
  bookingId: string;
  type: OrderItemType;
  title: string;
  subtitle: string;
  posterImage: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  seatsOrTier: string;
  quantity: number;
  ticketPrice: number;
  convenienceFee: number;
  donationAmount: number;
  discountAmount: number;
  totalPaid: number;
  paymentMethod: string;
  status: OrderStatus;
  isUpcoming: boolean;
  deliveryType: 'M-Ticket' | 'Box Office Pickup' | 'Home Delivery' | 'Digital Stream';
  bookedAt: string;
  canCancel: boolean;
  itemHref: string;
}

export interface WishlistEntry {
  id: string;
  itemType: 'movie' | 'event' | 'sport';
  title: string;
  subtitle: string;
  meta: string;
  image: string;
  href: string;
  city?: string;
  rating?: number;
  priceLabel?: string;
  addedAt: string;
}

export interface StreamTitle {
  id: string;
  movieId: string;
  title: string;
  posterImage: string;
  bannerImage: string;
  genre: string;
  languages: string[];
  duration: string;
  certificate: string;
  rating: number;
  accessType: 'rented' | 'purchased';
  quality: '4K UHD' | 'Full HD';
  pricePaid: number;
  expiresInDays?: number;
  watchedPercent: number;
  lastWatchedAt?: string;
  synopsis: string;
}

export interface StreamCatalogItem {
  id: string;
  title: string;
  posterImage: string;
  bannerImage: string;
  genre: string;
  languages: string[];
  duration: string;
  certificate: string;
  rating: number;
  rentPrice: number;
  buyPrice: number;
  synopsis: string;
}

export interface RewardOffer {
  id: string;
  brand: string;
  title: string;
  description: string;
  code: string;
  category: 'Movies' | 'F&B' | 'Events' | 'Partner';
  coinsCost: number;
  expiry: string;
  terms: string;
  claimed?: boolean;
}

export interface ScratchCard {
  id: string;
  title: string;
  subtitle: string;
  rewardText: string;
  code: string;
  isScratched: boolean;
  expiresOn: string;
}

export interface RewardHistoryEntry {
  id: string;
  title: string;
  date: string;
  coins: number;
  type: 'earned' | 'redeemed';
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  label: string;
  detail: string;
  subDetail: string;
  isDefault: boolean;
}

export interface AccountPreferences {
  emailOffers: boolean;
  smsAlerts: boolean;
  whatsappTickets: boolean;
  pushReminders: boolean;
  personalizedPicks: boolean;
  autoRoundupCharity: boolean;
  saveQuickPay: boolean;
  locationAutoDetect: boolean;
}

export interface BookAChangeCampaign {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  image: string;
  raisedAmount: number;
  goalAmount: number;
  supportersCount: number;
  impactMetric: string;
}

export interface BookAChangeContribution {
  id: string;
  campaignTitle: string;
  amount: number;
  date: string;
  source: 'Ticket Roundup' | 'Direct Contribution';
  receiptId: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  bookingId?: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
  lastUpdate: string;
}
