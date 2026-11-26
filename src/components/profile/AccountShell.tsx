'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  Search,
  Film,
  Ticket,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { ACCOUNT_MENU_ITEMS, AccountSectionId } from '@/config/accountNav';
import { useAccount } from '@/context/AccountContext';
import { MOVIES } from '@/data/mockData';
import { LIVE_EVENTS_MOCK } from '@/data/mockEvents';

interface AccountShellProps {
  activeSection: AccountSectionId;
  pageTitle: string;
  backHref?: string;
  mobileRightAction?: React.ReactNode;
  children: React.ReactNode;
}

export const AccountShell: React.FC<AccountShellProps> = ({
  activeSection,
  pageTitle,
  backHref = '/profile',
  mobileRightAction,
  children,
}) => {
  const {
    profile,
    selectedCity,
    unreadNotificationsCount,
    orders,
    wishlist,
    setCity,
    signIn,
    signOut,
  } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const currentCity = selectedCity || profile?.city || 'Bengaluru';

  const quickSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const movieMatches = MOVIES.filter(
      (m) => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((m) => ({
        id: m.id,
        title: m.title,
        subtitle: `Movie • ${m.genre}`,
        href: `/movies/${m.id}`,
        kind: 'movie' as const,
      }));
    const eventMatches = LIVE_EVENTS_MOCK.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: `${e.category} • ${e.city}`,
        href: `/events/${e.id}`,
        kind: 'event' as const,
      }));
    return [...movieMatches, ...eventMatches].slice(0, 5);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f3f5] text-neutral-900 selection:bg-[#85142f] selection:text-white">
      {/* Desktop Top Navbar */}
      <div className="hidden lg:block relative">
        <Navbar
          currentCity={currentCity}
          user={profile}
          onSelectCity={setCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={signOut}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Instant Search Results Panel when user searches from Navbar on account pages */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[76px] z-[60] w-full max-w-xl px-4">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
              <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-semibold">
                  Quick Results for &ldquo;{searchQuery.trim()}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {quickSearchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No movies or events matched.{' '}
                  <Link
                    href="/movies"
                    onClick={() => setSearchQuery('')}
                    className="text-[#85142f] font-bold hover:underline"
                  >
                    Browse all Movies
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {quickSearchResults.map((res) => (
                    <Link
                      key={res.id}
                      href={res.href}
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {res.kind === 'movie' ? (
                          <Film className="w-4 h-4 text-[#85142f] shrink-0" />
                        ) : (
                          <Ticket className="w-4 h-4 text-[#85142f] shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">{res.subtitle}</p>
                        </div>
                      </div>
                      <Search className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Sub-page Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200/80 px-3 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={backHref}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors shrink-0"
            aria-label="Back to Profile"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2px]" />
          </Link>
          <h1 className="text-[15px] font-bold text-neutral-900 truncate">{pageTitle}</h1>
        </div>
        {mobileRightAction && <div className="shrink-0 ml-2">{mobileRightAction}</div>}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-3.5 sm:px-6 lg:px-8 py-4 lg:py-7 pb-24 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[288px_1fr] lg:gap-6 items-start">
          {/* Desktop Left Account Sidebar */}
          <aside className="hidden lg:block bg-white rounded-xl border border-neutral-200/80 shadow-2xs overflow-hidden sticky top-24">
            {/* User Identity Header */}
            <div className="px-4 py-3.5 border-b border-neutral-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-extrabold text-neutral-900 truncate">
                  Hey{profile ? `, ${profile.firstName || profile.name.split(' ')[0]}` : '!'}
                </p>
                {profile ? (
                  <Link
                    href="/profile/edit"
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold mt-0.5 transition-colors ${activeSection === 'edit'
                        ? 'text-[#85142f] underline'
                        : 'text-neutral-500 hover:text-[#85142f]'
                      }`}
                  >
                    <span>Edit Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#85142f] hover:underline mt-0.5 cursor-pointer"
                  >
                    <span>Sign in to sync account</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <Link
                href="/profile/edit"
                className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden"
                aria-label="Edit Profile"
              >
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : profile ? (
                  <span className="w-full h-full bg-[#85142f] text-white flex items-center justify-center text-sm font-black">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserIcon className="w-5 h-5 text-neutral-400" />
                )}
              </Link>
            </div>

            {/* Highlight Banner: Mobile Verification for WhatsApp/SMS */}
            <Link
              href="/profile/verify-mobile"
              className={`block px-4 py-2.5 border-b transition-colors ${activeSection === 'verify-mobile'
                  ? 'bg-[#fff2cf] border-amber-300'
                  : 'bg-[#fff8e6] hover:bg-[#fff3d1] border-amber-200/70'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  {profile?.isMobileVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">
                      Get tickets on Whatsapp/SMS!
                    </p>
                    <p className="text-[11px] text-neutral-600 truncate mt-0.5">
                      {profile?.isMobileVerified
                        ? `Verified: ${profile.mobile}`
                        : profile?.mobile
                          ? `Verify ${profile.mobile}`
                          : 'Add your Mobile Number'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </div>
            </Link>

            {/* Sidebar Links */}
            <nav className="divide-y divide-neutral-100" aria-label="Account Sections">
              {ACCOUNT_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const badge =
                  item.id === 'notifications' && unreadNotificationsCount > 0
                    ? unreadNotificationsCount
                    : item.id === 'orders'
                      ? orders.filter((o) => o.isUpcoming && o.status === 'CONFIRMED').length || null
                      : item.id === 'wishlist' && wishlist.length > 0
                        ? wishlist.length
                        : null;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2.5 transition-colors group border-l-[3px] ${isActive
                        ? 'bg-rose-50/80 border-l-[#85142f]'
                        : 'border-l-transparent hover:bg-neutral-50'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <Icon
                        className={`w-4 h-4 shrink-0 stroke-[1.9px] transition-colors ${isActive
                            ? 'text-[#85142f]'
                            : 'text-neutral-500 group-hover:text-[#85142f]'
                          }`}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-[13px] truncate transition-colors ${isActive
                              ? 'font-bold text-[#85142f]'
                              : 'font-semibold text-neutral-800 group-hover:text-[#85142f]'
                            }`}
                        >
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {badge !== null && badge > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${item.id === 'notifications'
                              ? 'bg-[#85142f] text-white'
                              : 'bg-neutral-100 text-neutral-600'
                            }`}
                        >
                          {badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${isActive
                            ? 'text-[#85142f]'
                            : 'text-neutral-400 group-hover:translate-x-0.5'
                          }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Sign Out / Sign In */}
            <div className="p-3.5 border-t border-neutral-100 bg-white">
              {profile ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full py-2 rounded-lg border border-[#85142f] text-[#85142f] hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-2 rounded-lg bg-[#85142f] hover:bg-[#6e1026] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="min-w-0 space-y-4">
            {!profile && (
              <div className="bg-white rounded-xl border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">
                      You are browsing in signed-out preview mode
                    </p>
                    <p className="text-[11px] text-neutral-600">
                      Sign in to sync your BookKaro profile, bookings, and saved preferences.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#85142f] text-white text-xs font-bold hover:bg-[#6e1026] transition-colors shrink-0 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer currentCity={currentCity} />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab="profile" user={profile} onProfileClick={() => { }} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          signIn(u);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};
