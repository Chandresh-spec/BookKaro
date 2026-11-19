'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronRight,
  Bell,
  Ticket,
  Heart,
  Tv,
  CreditCard,
  HelpCircle,
  Settings,
  Gift,
  Compass,
  LogOut,
  Info,
  Phone,
  User as UserIcon,
  Check,
  Percent,
  Utensils,
  Share2,
} from 'lucide-react';
import { User } from '@/types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSignOut: () => void;
  onSignInClick?: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  onSignInClick,
}) => {
  const [mobileNumber, setMobileNumber] = useState(user?.mobile || '');
  const [isAddingMobile, setIsAddingMobile] = useState(false);
  const [mobileSaved, setMobileSaved] = useState(Boolean(user?.mobile));
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setMobileSaved(true);
      setIsAddingMobile(false);
      setActiveNotification('Mobile number saved for WhatsApp/SMS ticket updates!');
      setTimeout(() => setActiveNotification(null), 3000);
    }
  };

  const menuItems = [
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      subtitle: null,
      href: '/profile?tab=notifications',
    },
    {
      id: 'orders',
      icon: Ticket,
      title: 'Your Orders',
      subtitle: 'View all your bookings & purchases',
      href: '/profile?tab=orders',
    },
    {
      id: 'wishlist',
      icon: Heart,
      title: 'Your Wishlist',
      subtitle: null,
      href: '/profile?tab=wishlist',
    },
    {
      id: 'stream',
      icon: Tv,
      title: 'Stream Library',
      subtitle: 'Rented & Purchased Movies',
      href: '/movies',
    },
    {
      id: 'play-card',
      icon: CreditCard,
      title: 'Play Credit Card',
      subtitle: 'View your Play Credit Card details and offers',
      href: '/profile?tab=cards',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'View commonly asked queries and Chat',
      href: '/profile?tab=help',
    },
    {
      id: 'accounts',
      icon: Settings,
      title: 'Accounts & Settings',
      subtitle: 'Location, Payments, Permissions & More',
      href: '/profile?tab=settings',
    },
    {
      id: 'rewards',
      icon: Gift,
      title: 'Rewards',
      subtitle: 'View your rewards & unlock new ones',
      href: '/profile?tab=rewards',
    },
    {
      id: 'bookachange',
      icon: Compass,
      title: 'BookAChange',
      subtitle: null,
      href: '/profile?tab=bookachange',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Matches Desktop Mockup media_1795070874134_453fa4f0.jpg) */}
      <aside
        className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden"
        role="dialog"
        aria-label="User Profile Menu"
      >
        {/* Header / User Profile Banner */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Hey{user ? `, ${user.name.split(' ')[0]}` : '!'}</span>
            </h2>
            <Link
              href="/profile?tab=edit"
              onClick={onClose}
              className="text-xs text-neutral-500 font-semibold hover:text-[#85142f] transition-colors flex items-center gap-0.5 mt-0.5"
            >
              <span>Edit Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* User Avatar Circle */}
            <div className="w-12 h-12 rounded-full bg-neutral-200 border-2 border-white shadow-xs flex items-center justify-center text-neutral-700 font-bold text-base overflow-hidden">
              {user ? (
                <span className="bg-[#85142f] text-white w-full h-full flex items-center justify-center text-lg font-black">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserIcon className="w-6 h-6 text-neutral-400" />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[2px]" />
            </button>
          </div>
        </div>

        {/* Notification Toast if any */}
        {activeNotification && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 border-b border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium">{activeNotification}</span>
          </div>
        )}

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100/80">
          
          {/* Highlight Banner: "Get tickets on Whatsapp/SMS!" (Matching BMS Mockup) */}
          <div className="p-3 bg-[#fff8e6] border-b border-amber-200/80">
            {isAddingMobile ? (
              <form onSubmit={handleSaveMobile} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Enter WhatsApp / SMS Mobile</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingMobile(false)}
                    className="text-[11px] text-amber-700 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#85142f] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div
                onClick={() => setIsAddingMobile(true)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 stroke-[2.2px]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                      Get tickets on Whatsapp/SMS!
                    </h4>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      {mobileSaved && mobileNumber ? `Mobile: ${mobileNumber}` : 'Add your Mobile Number'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}
          </div>

          {/* Menu Items List */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <Icon className="w-4 h-4 text-neutral-600 group-hover:text-[#85142f] transition-colors shrink-0 stroke-[1.8px]" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 group-hover:text-[#85142f] transition-colors truncate">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-neutral-500 font-normal truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              );
            })}
          </div>

        </div>

        {/* Footer: Sign Out Button (Matching Mockup with red outline) */}
        <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
          {user ? (
            <button
              type="button"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-[#85142f] text-[#85142f] hover:bg-rose-50 text-sm font-bold tracking-tight transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 stroke-[2.2px]" />
              <span>Sign out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignInClick?.();
              }}
              className="w-full py-2.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white text-sm font-bold tracking-tight shadow-md transition-all active:scale-98 cursor-pointer text-center"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
