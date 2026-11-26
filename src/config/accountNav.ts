import {
  Bell,
  Ticket,
  Heart,
  Tv,
  CreditCard,
  HelpCircle,
  Settings,
  Gift,
  Compass,
  LucideIcon,
} from 'lucide-react';

export type AccountSectionId =
  | 'overview'
  | 'edit'
  | 'verify-mobile'
  | 'notifications'
  | 'orders'
  | 'wishlist'
  | 'stream-library'
  | 'play-credit-card'
  | 'help'
  | 'settings'
  | 'rewards'
  | 'bookachange';

export interface AccountMenuItem {
  id: Exclude<AccountSectionId, 'overview' | 'edit' | 'verify-mobile'>;
  icon: LucideIcon;
  title: string;
  subtitle: string | null;
  href: string;
}

export const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    subtitle: null,
    href: '/profile/notifications',
  },
  {
    id: 'orders',
    icon: Ticket,
    title: 'Your Orders',
    subtitle: 'View all your bookings & purchases',
    href: '/profile/orders',
  },
  {
    id: 'wishlist',
    icon: Heart,
    title: 'Your Wishlist',
    subtitle: null,
    href: '/profile/wishlist',
  },
  {
    id: 'stream-library',
    icon: Tv,
    title: 'Stream Library',
    subtitle: 'Rented & Purchased Movies',
    href: '/profile/stream-library',
  },
  {
    id: 'play-credit-card',
    icon: CreditCard,
    title: 'Play Credit Card',
    subtitle: 'View your Play Credit Card details and offers',
    href: '/profile/play-credit-card',
  },
  {
    id: 'help',
    icon: HelpCircle,
    title: 'Help & Support',
    subtitle: 'View commonly asked queries and Chat',
    href: '/profile/help',
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'Accounts & Settings',
    subtitle: 'Location, Payments, Permissions & More',
    href: '/profile/settings',
  },
  {
    id: 'rewards',
    icon: Gift,
    title: 'Rewards',
    subtitle: 'View your rewards & unlock new ones',
    href: '/profile/rewards',
  },
  {
    id: 'bookachange',
    icon: Compass,
    title: 'BookAChange',
    subtitle: null,
    href: '/profile/bookachange',
  },
];

export const LEGACY_TAB_TO_ROUTE: Record<string, string> = {
  edit: '/profile/edit',
  mobile: '/profile/verify-mobile',
  'verify-mobile': '/profile/verify-mobile',
  notifications: '/profile/notifications',
  orders: '/profile/orders',
  wishlist: '/profile/wishlist',
  stream: '/profile/stream-library',
  'stream-library': '/profile/stream-library',
  cards: '/profile/play-credit-card',
  'play-card': '/profile/play-credit-card',
  'play-credit-card': '/profile/play-credit-card',
  help: '/profile/help',
  settings: '/profile/settings',
  rewards: '/profile/rewards',
  bookachange: '/profile/bookachange',
};
