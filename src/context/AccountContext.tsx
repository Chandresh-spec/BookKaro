'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AccountProfile,
  NotificationItem,
  OrderRecord,
  WishlistEntry,
  StreamTitle,
  StreamCatalogItem,
  RewardOffer,
  ScratchCard,
  RewardHistoryEntry,
  SavedPaymentMethod,
  AccountPreferences,
  BookAChangeContribution,
  SupportTicket,
} from '@/types/account';
import { User } from '@/types';
import {
  DEFAULT_ACCOUNT_PROFILE,
  DEFAULT_PREFERENCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_WISHLIST,
  INITIAL_STREAM_LIBRARY,
  INITIAL_SCRATCH_CARDS,
  INITIAL_REWARD_OFFERS,
  INITIAL_REWARD_HISTORY,
  INITIAL_PAYMENT_METHODS,
  INITIAL_BAC_CONTRIBUTIONS,
  INITIAL_SUPPORT_TICKETS,
} from '@/data/mockAccountData';
import { api } from '@/services/api';

const STORAGE_KEY = 'bookkaro_account_state_v2';

export interface PlayCardApplicationState {
  status: 'not_applied' | 'submitted' | 'approved';
  applicationId?: string;
  submittedAt?: string;
  fullName?: string;
  pan?: string;
  incomeRange?: string;
  employmentType?: string;
}

interface PersistedAccountState {
  profile: AccountProfile | null;
  selectedCity: string;
  notifications: NotificationItem[];
  orders: OrderRecord[];
  wishlist: WishlistEntry[];
  streamLibrary: StreamTitle[];
  karoCoins: number;
  scratchCards: ScratchCard[];
  rewardOffers: RewardOffer[];
  rewardHistory: RewardHistoryEntry[];
  paymentMethods: SavedPaymentMethod[];
  preferences: AccountPreferences;
  playCardApplication: PlayCardApplicationState;
  bacContributions: BookAChangeContribution[];
  supportTickets: SupportTicket[];
}

interface AccountContextValue extends PersistedAccountState {
  isHydrated: boolean;
  unreadNotificationsCount: number;
  setCity: (city: string) => void;
  signIn: (u: User) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<AccountProfile>) => Promise<void>;
  verifyMobile: (mobile: string, otp: string) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addOrder: (order: OrderRecord) => void;
  cancelOrder: (orderId: string) => Promise<void>;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (entry: Omit<WishlistEntry, 'addedAt'>) => boolean;
  removeFromWishlist: (id: string) => void;
  rentOrBuyStream: (item: StreamCatalogItem, accessType: 'rented' | 'purchased') => Promise<void>;
  updateStreamProgress: (id: string, watchedPercent: number) => void;
  scratchCard: (id: string) => void;
  claimReward: (id: string) => { success: boolean; message: string };
  addPaymentMethod: (method: Omit<SavedPaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  updatePreferences: (patch: Partial<AccountPreferences>) => void;
  submitPlayCardApplication: (payload: {
    fullName: string;
    pan: string;
    incomeRange: string;
    employmentType: string;
  }) => Promise<void>;
  resetPlayCardApplication: () => void;
  donateBookAChange: (campaignTitle: string, amount: number) => Promise<BookAChangeContribution>;
  createSupportTicket: (payload: {
    subject: string;
    category: string;
    bookingId?: string;
  }) => SupportTicket;
  resetDemoState: () => void;
}

const initialPersistedState: PersistedAccountState = {
  profile: DEFAULT_ACCOUNT_PROFILE,
  selectedCity: DEFAULT_ACCOUNT_PROFILE.city || 'Bengaluru',
  notifications: INITIAL_NOTIFICATIONS,
  orders: INITIAL_ORDERS,
  wishlist: INITIAL_WISHLIST,
  streamLibrary: INITIAL_STREAM_LIBRARY,
  karoCoins: 320,
  scratchCards: INITIAL_SCRATCH_CARDS,
  rewardOffers: INITIAL_REWARD_OFFERS,
  rewardHistory: INITIAL_REWARD_HISTORY,
  paymentMethods: INITIAL_PAYMENT_METHODS,
  preferences: DEFAULT_PREFERENCES,
  playCardApplication: { status: 'not_applied' },
  bacContributions: INITIAL_BAC_CONTRIBUTIONS,
  supportTickets: INITIAL_SUPPORT_TICKETS,
};

const AccountContext = createContext<AccountContextValue | null>(null);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedAccountState>(initialPersistedState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedAccountState>;
        setState((prev) => ({
          ...prev,
          ...parsed,
          selectedCity: parsed.selectedCity || parsed.profile?.city || prev.selectedCity,
          preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences || {}) },
        }));
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state, isHydrated]);

  const setCity = useCallback((city: string) => {
    setState((prev) => ({
      ...prev,
      selectedCity: city,
      profile: prev.profile ? { ...prev.profile, city } : null,
    }));
  }, []);

  const signIn = useCallback((u: User) => {
    setState((prev) => {
      const parts = (u.name || 'Guest User').trim().split(' ');
      const firstName = parts[0] || 'Guest';
      const lastName = parts.slice(1).join(' ');
      const base = prev.profile || DEFAULT_ACCOUNT_PROFILE;
      return {
        ...prev,
        profile: {
          ...base,
          id: u.id || base.id,
          name: u.name || base.name,
          firstName,
          lastName,
          email: u.email || base.email,
          mobile: u.mobile || base.mobile,
          avatar: u.avatar || base.avatar,
          city: prev.selectedCity || base.city,
          isMobileVerified: Boolean(u.mobile) ? true : base.isMobileVerified,
        },
      };
    });
  }, []);

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, profile: null }));
  }, []);

  const updateProfile = useCallback(async (patch: Partial<AccountProfile>) => {
    await api.updateProfile(patch);
    setState((prev) => {
      if (!prev.profile) return prev;
      const firstName = patch.firstName ?? prev.profile.firstName;
      const lastName = patch.lastName ?? prev.profile.lastName;
      const combinedName =
        patch.name ?? (`${firstName} ${lastName}`.trim() || prev.profile.name);
      const mobileChanged = patch.mobile !== undefined && patch.mobile !== prev.profile.mobile;
      const nextCity = patch.city ?? prev.selectedCity;
      return {
        ...prev,
        selectedCity: nextCity,
        profile: {
          ...prev.profile,
          ...patch,
          city: nextCity,
          firstName,
          lastName,
          name: combinedName,
          isMobileVerified: mobileChanged
            ? false
            : (patch.isMobileVerified ?? prev.profile.isMobileVerified),
        },
      };
    });
  }, []);

  const verifyMobile = useCallback(async (mobile: string, otp: string) => {
    const res = await api.verifyOtp(mobile, otp);
    if (!res.success) return false;
    setState((prev) => {
      const base = prev.profile || DEFAULT_ACCOUNT_PROFILE;
      return {
        ...prev,
        profile: {
          ...base,
          mobile,
          isMobileVerified: true,
          whatsappOptIn: true,
          smsOptIn: true,
        },
        notifications: prev.notifications.map((n) =>
          n.id === 'notif-2' ? { ...n, isRead: true } : n
        ),
      };
    });
    return true;
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: [] }));
  }, []);

  const addOrder = useCallback((order: OrderRecord) => {
    setState((prev) => {
      if (prev.orders.some((o) => o.bookingId === order.bookingId)) {
        return prev;
      }
      const nextContributions =
        order.donationAmount > 0
          ? [
              {
                id: 'cont-' + Date.now(),
                campaignTitle: '500 Young Musicians Scholarship',
                amount: order.donationAmount,
                date: 'Today',
                source: 'Ticket Roundup' as const,
                receiptId: 'BAC-80G-' + Math.floor(1000 + Math.random() * 8999),
              },
              ...prev.bacContributions,
            ]
          : prev.bacContributions;

      return {
        ...prev,
        orders: [order, ...prev.orders],
        karoCoins: prev.karoCoins + 50,
        bacContributions: nextContributions,
        rewardHistory: [
          {
            id: 'rh-' + Date.now(),
            title: `Booking Bonus — ${order.title}`,
            date: 'Today',
            coins: 50,
            type: 'earned',
          },
          ...prev.rewardHistory,
        ],
        notifications: [
          {
            id: 'notif-ord-' + Date.now(),
            title: `Booking Confirmed: ${order.title}`,
            message: `Your M-Ticket (${order.bookingId}) for ${order.venue} is ready in Your Orders.`,
            category: 'bookings',
            timestamp: 'Just now',
            dateGroup: 'Today',
            isRead: false,
            actionHref: '/profile/orders',
            actionLabel: 'View Ticket',
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    await api.cancelBooking(orderId);
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'CANCELLED', isUpcoming: false, canCancel: false }
          : o
      ),
      notifications: [
        {
          id: 'notif-cancel-' + Date.now(),
          title: 'Booking Cancelled & Refund Initiated',
          message:
            'Your simulated cancellation is processed. Refund will be credited to your original payment source or BookKaro Cash.',
          category: 'bookings',
          timestamp: 'Just now',
          dateGroup: 'Today',
          isRead: false,
          actionHref: '/profile/orders',
          actionLabel: 'View Orders',
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const isWishlisted = useCallback(
    (id: string) => state.wishlist.some((item) => item.id === id),
    [state.wishlist]
  );

  const toggleWishlist = useCallback(
    (entry: Omit<WishlistEntry, 'addedAt'>) => {
      const exists = state.wishlist.some((w) => w.id === entry.id);
      setState((prev) => {
        const already = prev.wishlist.some((w) => w.id === entry.id);
        if (already) {
          return {
            ...prev,
            wishlist: prev.wishlist.filter((w) => w.id !== entry.id),
          };
        }
        return {
          ...prev,
          wishlist: [{ ...entry, addedAt: 'Just now' }, ...prev.wishlist],
        };
      });
      return !exists;
    },
    [state.wishlist]
  );

  const removeFromWishlist = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
  }, []);

  const rentOrBuyStream = useCallback(
    async (item: StreamCatalogItem, accessType: 'rented' | 'purchased') => {
      await new Promise((r) => setTimeout(r, 350));
      const pricePaid = accessType === 'purchased' ? item.buyPrice : item.rentPrice;
      const newTitle: StreamTitle = {
        id: 'stream-' + Date.now(),
        movieId: item.id,
        title: item.title,
        posterImage: item.posterImage,
        bannerImage: item.bannerImage,
        genre: item.genre,
        languages: item.languages,
        duration: item.duration,
        certificate: item.certificate,
        rating: item.rating,
        accessType,
        quality: accessType === 'purchased' ? '4K UHD' : 'Full HD',
        pricePaid,
        expiresInDays: accessType === 'rented' ? 30 : undefined,
        watchedPercent: 0,
        lastWatchedAt: 'Added just now',
        synopsis: item.synopsis,
      };
      const newOrder: OrderRecord = {
        id: 'ord-str-' + Date.now(),
        bookingId: 'BK-STR-' + Math.floor(10000 + Math.random() * 89999),
        type: 'stream',
        title: `${item.title} (${accessType === 'purchased' ? 'Stream Buy' : 'Stream Rental'})`,
        subtitle: `${newTitle.quality} • ${item.languages.slice(0, 2).join(', ')}`,
        posterImage: item.posterImage,
        venue: 'BookKaro Stream',
        city: 'Online',
        date: 'Today',
        time: 'Watch Anytime',
        seatsOrTier:
          accessType === 'purchased' ? 'Lifetime Digital Ownership' : '30-Day Rental License',
        quantity: 1,
        ticketPrice: pricePaid,
        convenienceFee: 0,
        donationAmount: 0,
        discountAmount: 0,
        totalPaid: pricePaid,
        paymentMethod: 'BookKaro QuickPay (Simulated)',
        status: 'CONFIRMED',
        isUpcoming: false,
        deliveryType: 'Digital Stream',
        bookedAt: 'Just now',
        canCancel: false,
        itemHref: '/profile/stream-library',
      };
      setState((prev) => ({
        ...prev,
        streamLibrary: [
          newTitle,
          ...prev.streamLibrary.filter((t) => t.movieId !== item.id),
        ],
        orders: [newOrder, ...prev.orders],
      }));
    },
    []
  );

  const updateStreamProgress = useCallback((id: string, watchedPercent: number) => {
    setState((prev) => ({
      ...prev,
      streamLibrary: prev.streamLibrary.map((t) =>
        t.id === id
          ? {
              ...t,
              watchedPercent: Math.min(100, Math.max(0, watchedPercent)),
              lastWatchedAt: 'Just now',
            }
          : t
      ),
    }));
  }, []);

  const scratchCard = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.scratchCards.find((c) => c.id === id);
      if (!target || target.isScratched) return prev;
      return {
        ...prev,
        karoCoins: prev.karoCoins + 50,
        scratchCards: prev.scratchCards.map((c) =>
          c.id === id ? { ...c, isScratched: true } : c
        ),
        rewardHistory: [
          {
            id: 'rh-sc-' + Date.now(),
            title: `Scratch Card Unlocked — ${target.title}`,
            date: 'Today',
            coins: 50,
            type: 'earned',
          },
          ...prev.rewardHistory,
        ],
      };
    });
  }, []);

  const claimReward = useCallback(
    (id: string): { success: boolean; message: string } => {
      const offer = state.rewardOffers.find((r) => r.id === id);
      if (!offer) return { success: false, message: 'Offer not found' };
      if (offer.claimed) return { success: true, message: `Voucher ${offer.code} already claimed` };
      if (state.karoCoins < offer.coinsCost) {
        return {
          success: false,
          message: `Need ${offer.coinsCost - state.karoCoins} more KaroCoins to unlock this reward`,
        };
      }
      setState((prev) => ({
        ...prev,
        karoCoins: prev.karoCoins - offer.coinsCost,
        rewardOffers: prev.rewardOffers.map((r) =>
          r.id === id ? { ...r, claimed: true } : r
        ),
        rewardHistory: [
          {
            id: 'rh-clm-' + Date.now(),
            title: `Redeemed: ${offer.title}`,
            date: 'Today',
            coins: -offer.coinsCost,
            type: 'redeemed',
          },
          ...prev.rewardHistory,
        ],
      }));
      return { success: true, message: `Unlocked! Code ${offer.code} copied to your rewards.` };
    },
    [state.rewardOffers, state.karoCoins]
  );

  const addPaymentMethod = useCallback((method: Omit<SavedPaymentMethod, 'id'>) => {
    setState((prev) => {
      const created: SavedPaymentMethod = { ...method, id: 'pm-' + Date.now() };
      const existing = method.isDefault
        ? prev.paymentMethods.map((m) => ({ ...m, isDefault: false }))
        : prev.paymentMethods;
      return { ...prev, paymentMethods: [created, ...existing] };
    });
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((m) => m.id !== id),
    }));
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<AccountPreferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...patch },
    }));
  }, []);

  const submitPlayCardApplication = useCallback(
    async (payload: {
      fullName: string;
      pan: string;
      incomeRange: string;
      employmentType: string;
    }) => {
      await new Promise((r) => setTimeout(r, 600));
      setState((prev) => ({
        ...prev,
        playCardApplication: {
          status: 'submitted',
          applicationId: 'BK-PLAY-' + Math.floor(100000 + Math.random() * 899999),
          submittedAt: 'Just now',
          ...payload,
        },
      }));
    },
    []
  );

  const resetPlayCardApplication = useCallback(() => {
    setState((prev) => ({
      ...prev,
      playCardApplication: { status: 'not_applied' },
    }));
  }, []);

  const donateBookAChange = useCallback(async (campaignTitle: string, amount: number) => {
    await new Promise((r) => setTimeout(r, 400));
    const entry: BookAChangeContribution = {
      id: 'cont-' + Date.now(),
      campaignTitle,
      amount,
      date: 'Today',
      source: 'Direct Contribution',
      receiptId: 'BAC-80G-' + Math.floor(1000 + Math.random() * 8999),
    };
    setState((prev) => ({
      ...prev,
      bacContributions: [entry, ...prev.bacContributions],
    }));
    return entry;
  }, []);

  const createSupportTicket = useCallback(
    (payload: { subject: string; category: string; bookingId?: string }) => {
      const ticket: SupportTicket = {
        id: 'SUP-' + Math.floor(10000 + Math.random() * 89999),
        subject: payload.subject,
        category: payload.category,
        bookingId: payload.bookingId,
        status: 'Open',
        createdAt: 'Just now',
        lastUpdate: 'Assigned to BookKaro Care (Simulated)',
      };
      setState((prev) => ({
        ...prev,
        supportTickets: [ticket, ...prev.supportTickets],
      }));
      return ticket;
    },
    []
  );

  const resetDemoState = useCallback(() => {
    setState(initialPersistedState);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const unreadNotificationsCount = state.notifications.filter((n) => !n.isRead).length;

  return (
    <AccountContext.Provider
      value={{
        ...state,
        isHydrated,
        unreadNotificationsCount,
        setCity,
        signIn,
        signOut,
        updateProfile,
        verifyMobile,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        addOrder,
        cancelOrder,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        rentOrBuyStream,
        updateStreamProgress,
        scratchCard,
        claimReward,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        updatePreferences,
        submitPlayCardApplication,
        resetPlayCardApplication,
        donateBookAChange,
        createSupportTicket,
        resetDemoState,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error('useAccount must be used within AccountProvider');
  }
  return ctx;
}

export function useOptionalAccount(): AccountContextValue | null {
  return useContext(AccountContext);
}
