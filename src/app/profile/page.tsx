'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Percent,
  CreditCard,
  Utensils,
  Store,
  Settings,
  FileText,
  ClipboardList,
  Ticket,
  Heart,
  Tv,
  HelpCircle,
  LogOut,
  Info,
  Check,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
    mobile: '+91 98765 43210',
  });

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editMobile, setEditMobile] = useState(currentUser?.mobile || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: editName,
        email: editEmail,
        mobile: editMobile,
      });
      setIsEditProfileOpen(false);
      showToast('Profile updated successfully!');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 pb-24 lg:pb-12 selection:bg-[#85142f] selection:text-white">
      {/* 1. DESKTOP NAVBAR */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={(c) => setCurrentCity(c)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200/80 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
          </Link>
          <h1 className="text-base font-extrabold text-neutral-900">
            Profile
          </h1>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-2xl mx-auto px-4 pt-4 sm:pt-8 space-y-4">
        
        {/* User Card & Greeting */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#85142f] text-white flex items-center justify-center font-black text-xl shadow-sm">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900 leading-snug">
                Hey, {currentUser ? currentUser.name : 'Guest'}!
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setIsEditProfileOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-xs font-semibold text-[#85142f] hover:underline flex items-center gap-0.5 mt-0.5"
              >
                <span>{currentUser ? 'Edit Profile' : 'Sign in to your account'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!currentUser && (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#85142f] text-white text-xs font-bold shadow-xs active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Highlight Banner: "Get tickets on Whatsapp/SMS!" */}
        <div
          onClick={() => setIsMobileModalOpen(true)}
          className="bg-[#fff8e6] border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#fff4d6] transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/30 text-amber-900 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Get tickets on Whatsapp/SMS!
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-medium">
                {currentUser?.mobile ? `Linked: ${currentUser.mobile}` : 'Add your Mobile Number'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Group 1: Bookings & Experiences */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-xs overflow-hidden">
          <Link
            href="/profile?tab=orders"
            onClick={() => showToast('Displaying recent ticket bookings')}
            className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Ticket className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <div>
                <p className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                  Your Orders
                </p>
                <p className="text-[11px] text-neutral-500">View all your bookings & purchases</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/profile?tab=wishlist"
            onClick={() => showToast('Wishlist items')}
            className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <p className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Your Wishlist
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/movies"
            className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <Tv className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <div>
                <p className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                  Stream Library
                </p>
                <p className="text-[11px] text-neutral-500">Rented & Purchased Movies</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Group 2: Rewards, Offers, Gift Cards, Food & Beverages (Matches Mockup 1) */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => showToast('Rewards unlocked: 250 KaroCoins!')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Gift className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Rewards
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Available Offers: ₹100 off on Axis Bank & ICICI credit cards')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Percent className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Offers
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Gift Cards: Send movie & concert vouchers to friends')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Gift Cards
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Food & Beverages: Pre-order popcorn, combos & snacks')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Utensils className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Food & Beverages
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Group 3: Partner & Account Settings (Matches Mockup 1) */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => showToast('List Your Show: Partner with BookKaro to sell tickets')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Store className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                List your Show
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Settings className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Account & Settings
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => showToast('24x7 Help & Support: support@bookkaro.com')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <HelpCircle className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Help & Support
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Group 4: Legal & Policy (Matches Mockup 1) */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => showToast('Terms & Conditions — BookKaro Ticketing Platform')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <FileText className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Terms & Conditions
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Privacy Policy — Your data is encrypted and secure')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <ClipboardList className="w-5 h-5 text-neutral-600 group-hover:text-[#85142f] transition-colors" />
              <span className="text-sm font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 5: BookAChange Social Impact Banner (Exact Match to Mockup) */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-100 shadow-2xs">
          <div className="flex items-center gap-3.5">
            {/* Geometric Multi-Color Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 p-0.5 shrink-0 shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#85142f]" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-900">
                BookAChange
              </h4>
              <p className="text-xs text-neutral-600 font-medium">
                Powering Dreams Amplifying Change
              </p>
            </div>
          </div>
        </div>

        {/* Brand Watermark (Matches Mockup bottom) */}
        <div className="pt-6 pb-2 text-center">
          <span className="text-lg font-black tracking-widest uppercase text-neutral-300 font-mono select-none">
            BookKaro
          </span>
        </div>

        {/* Sign Out Button */}
        {currentUser && (
          <div className="pt-2 pb-6">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-xl border-2 border-[#85142f] text-[#85142f] hover:bg-rose-50 text-sm font-bold tracking-tight transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <LogOut className="w-4 h-4 stroke-[2.2px]" />
              <span>Sign out</span>
            </button>
          </div>
        )}

      </main>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#85142f]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#85142f]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Mobile Number (WhatsApp/SMS)</label>
                <input
                  type="tel"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#85142f]"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#85142f] text-white text-sm font-bold shadow-md hover:bg-[#6e1026]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp/SMS Mobile Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-black text-neutral-900 mb-2">WhatsApp / SMS Tickets</h3>
            <p className="text-xs text-neutral-600 mb-4">
              Enter your mobile number to receive ticket confirmations, barcodes, and live gate updates directly on WhatsApp and SMS.
            </p>
            <input
              type="tel"
              value={editMobile}
              onChange={(e) => setEditMobile(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#85142f]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMobileModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setCurrentUser({ ...currentUser, mobile: editMobile });
                  }
                  setIsMobileModalOpen(false);
                  showToast('Mobile number linked for WhatsApp/SMS tickets!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#85142f] text-white text-xs font-bold shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
          showToast(`Welcome back, ${u.name}!`);
        }}
      />

      {/* Master BMS Footer */}
      <Footer currentCity={currentCity} />

      {/* Mobile Bottom Dock (Profile Active) */}
      <MobileBottomNav
        activeTab="profile"
        user={currentUser}
        onProfileClick={() => {}}
      />
    </div>
  );
}
