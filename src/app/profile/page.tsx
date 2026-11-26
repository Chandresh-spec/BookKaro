'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Ticket,
  Heart,
  Tv,
  CreditCard,
  HelpCircle,
  Settings,
  Gift,
  LogOut,
  Info,
  CheckCircle2,
  User as UserIcon,
  Sparkles,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert } from '@/components/profile/AccountUi';
import { LEGACY_TAB_TO_ROUTE } from '@/config/accountNav';
import { useAccount } from '@/context/AccountContext';

function ProfileHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const {
    profile,
    orders,
    wishlist,
    streamLibrary,
    karoCoins,
    notifications,
    unreadNotificationsCount,
    signIn,
    signOut,
  } = useAccount();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam && LEGACY_TAB_TO_ROUTE[tabParam]) {
      router.replace(LEGACY_TAB_TO_ROUTE[tabParam]);
    }
  }, [tabParam, router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const upcomingOrders = orders.filter((o) => o.isUpcoming && o.status === 'CONFIRMED');

  return (
    <>
      <ToastAlert message={toast} />

      {/* ============================================================ */}
      {/* 1. DESKTOP ACCOUNT OVERVIEW (lg and up)                      */}
      {/* ============================================================ */}
      <div className="hidden lg:block">
        <AccountShell activeSection="overview" pageTitle="My Account">
          <div className="space-y-4">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-5 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#85142f] text-white flex items-center justify-center font-black text-xl overflow-hidden shrink-0">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : profile ? (
                    profile.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-900">
                    Welcome back, {profile ? profile.firstName || profile.name : 'Guest'}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {profile?.email || 'Sign in to sync bookings'} •{' '}
                    {profile?.city || 'Bengaluru'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {!profile?.isMobileVerified && (
                  <Link
                    href="/profile/verify-mobile"
                    className="px-3.5 py-2 rounded-lg bg-[#fff8e6] border border-amber-300 text-xs font-bold text-amber-900 hover:bg-[#fff2cf]"
                  >
                    Verify Mobile
                  </Link>
                )}
                <Link
                  href="/profile/edit"
                  className="px-4 py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* 4 Quick Stat Tiles */}
            <div className="grid grid-cols-4 gap-3.5">
              <Link
                href="/profile/orders"
                className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-[#85142f] transition-colors"
              >
                <Ticket className="w-4 h-4 text-[#85142f] mb-2" />
                <p className="text-xl font-black text-neutral-900">{upcomingOrders.length}</p>
                <p className="text-xs text-neutral-500 font-semibold">Upcoming Bookings</p>
              </Link>
              <Link
                href="/profile/wishlist"
                className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-[#85142f] transition-colors"
              >
                <Heart className="w-4 h-4 text-[#85142f] mb-2" />
                <p className="text-xl font-black text-neutral-900">{wishlist.length}</p>
                <p className="text-xs text-neutral-500 font-semibold">Saved Wishlist</p>
              </Link>
              <Link
                href="/profile/stream-library"
                className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-[#85142f] transition-colors"
              >
                <Tv className="w-4 h-4 text-[#85142f] mb-2" />
                <p className="text-xl font-black text-neutral-900">{streamLibrary.length}</p>
                <p className="text-xs text-neutral-500 font-semibold">Stream Library</p>
              </Link>
              <Link
                href="/profile/rewards"
                className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-[#85142f] transition-colors"
              >
                <Coins className="w-4 h-4 text-[#85142f] mb-2" />
                <p className="text-xl font-black text-neutral-900">{karoCoins}</p>
                <p className="text-xs text-neutral-500 font-semibold">KaroCoins</p>
              </Link>
            </div>

            {/* Upcoming Orders Preview */}
            <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Recent &amp; Upcoming Bookings</h3>
                <Link
                  href="/profile/orders"
                  className="text-xs font-bold text-[#85142f] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href="/profile/orders"
                    className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={order.posterImage}
                        alt={order.title}
                        className="w-11 h-14 rounded-md object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{order.title}</p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {order.date} • {order.time} • {order.venue}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          {order.bookingId}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-neutral-900 shrink-0">
                      ₹{order.totalPaid.toLocaleString('en-IN')}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Notifications Preview */}
            <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Recent Notifications</h3>
                <Link
                  href="/profile/notifications"
                  className="text-xs font-bold text-[#85142f] hover:underline inline-flex items-center gap-1"
                >
                  <span>See All ({notifications.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {notifications.slice(0, 2).map((n) => (
                  <Link
                    key={n.id}
                    href="/profile/notifications"
                    className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-neutral-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{n.title}</p>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-[11px] text-neutral-400 shrink-0">{n.timestamp}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AccountShell>
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE PROFILE MENU HUB (below lg)                        */}
      {/* ============================================================ */}
      <div className="lg:hidden min-h-screen flex flex-col bg-[#f5f6f8] text-neutral-900 pb-20">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 px-3 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2px]" />
            </Link>
            <h1 className="text-base font-extrabold text-neutral-900">Profile</h1>
          </div>
        </header>

        <main className="px-3.5 pt-4 space-y-3.5 flex-1">
          {/* User Identity Card */}
          <div className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-full bg-[#85142f] text-white flex items-center justify-center font-black text-lg overflow-hidden shrink-0">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : profile ? (
                  profile.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-neutral-900 leading-snug truncate">
                  Hey, {profile ? profile.firstName || profile.name : 'Guest'}!
                </h2>
                {profile ? (
                  <Link
                    href="/profile/edit"
                    className="text-xs font-semibold text-[#85142f] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    <span>Edit Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-xs font-semibold text-[#85142f] hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                  >
                    <span>Sign in to your account</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {!profile && (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#85142f] text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Highlight Banner: Mobile Verification */}
          <Link
            href="/profile/verify-mobile"
            className="bg-[#fff8e6] border border-amber-300/80 rounded-xl p-3.5 flex items-center justify-between hover:bg-[#fff4d6] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-400/25 text-amber-900 flex items-center justify-center shrink-0">
                {profile?.isMobileVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-neutral-900 group-hover:text-[#85142f]">
                  Get tickets on Whatsapp/SMS!
                </h3>
                <p className="text-[11px] text-neutral-600 font-medium truncate">
                  {profile?.isMobileVerified
                    ? `Verified: ${profile.mobile}`
                    : profile?.mobile
                    ? `Verify ${profile.mobile}`
                    : 'Add your Mobile Number'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </Link>

          {/* Group 1: Notifications, Orders, Wishlist, Stream */}
          <div className="bg-white rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 overflow-hidden">
            <Link
              href="/profile/notifications"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-neutral-600" />
                <span className="text-[13px] font-bold text-neutral-900">Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#85142f] text-white text-[10px] font-bold">
                    {unreadNotificationsCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </Link>

            <Link
              href="/profile/orders"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Your Orders</p>
                  <p className="text-[11px] text-neutral-500">View all your bookings &amp; purchases</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/profile/wishlist"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-neutral-600" />
                <span className="text-[13px] font-bold text-neutral-900">Your Wishlist</span>
              </div>
              <div className="flex items-center gap-2">
                {wishlist.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                    {wishlist.length}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </Link>

            <Link
              href="/profile/stream-library"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Tv className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Stream Library</p>
                  <p className="text-[11px] text-neutral-500">Rented &amp; Purchased Movies</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* Group 2: Play Credit Card, Help, Settings, Rewards */}
          <div className="bg-white rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 overflow-hidden">
            <Link
              href="/profile/play-credit-card"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Play Credit Card</p>
                  <p className="text-[11px] text-neutral-500">
                    View your Play Credit Card details and offers
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/profile/help"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Help &amp; Support</p>
                  <p className="text-[11px] text-neutral-500">
                    View commonly asked queries and Chat
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/profile/settings"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Accounts &amp; Settings</p>
                  <p className="text-[11px] text-neutral-500">
                    Location, Payments, Permissions &amp; More
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/profile/rewards"
              className="flex items-center justify-between p-3.5 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-neutral-600" />
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">Rewards</p>
                  <p className="text-[11px] text-neutral-500">
                    View your rewards &amp; unlock new ones
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* BookAChange Banner Card */}
          <Link
            href="/profile/bookachange"
            className="block rounded-xl p-4 bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-100 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 p-0.5 shrink-0">
                  <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#85142f]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-neutral-900">BookAChange</h4>
                  <p className="text-[11px] text-neutral-600 font-medium">
                    Powering Dreams Amplifying Change
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
          </Link>

          {/* Brand Watermark */}
          <div className="pt-4 pb-1 text-center">
            <span className="text-base font-black tracking-widest uppercase text-neutral-300 font-mono select-none">
              BookKaro
            </span>
          </div>

          {/* Sign Out Button */}
          {profile && (
            <div className="pb-4">
              <button
                type="button"
                onClick={() => {
                  signOut();
                  showToast('Signed out successfully');
                }}
                className="w-full py-3 rounded-xl border border-[#85142f] text-[#85142f] hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </main>

        <MobileBottomNav activeTab="profile" user={profile} onProfileClick={() => {}} />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          signIn(u);
          setIsAuthModalOpen(false);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-xs text-neutral-500">
          Loading profile...
        </div>
      }
    >
      <ProfileHubContent />
    </Suspense>
  );
}
