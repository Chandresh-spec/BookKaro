'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  ChevronRight,
  LogOut,
  Info,
  CheckCircle2,
  User as UserIcon,
} from 'lucide-react';
import { User } from '@/types';
import { ACCOUNT_MENU_ITEMS } from '@/config/accountNav';
import { useOptionalAccount } from '@/context/AccountContext';

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
  const account = useOptionalAccount();
  const activeProfile = account ? account.profile : user;

  if (!isOpen) return null;

  const unreadCount = account?.unreadNotificationsCount ?? 0;
  const upcomingOrdersCount =
    account?.orders.filter((o) => o.isUpcoming && o.status === 'CONFIRMED').length ?? 0;
  const wishlistCount = account?.wishlist.length ?? 0;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        className="relative w-full max-w-sm sm:max-w-[380px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden"
        role="dialog"
        aria-label="User Profile Menu"
      >
        {/* Header / User Profile Banner */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-neutral-900 tracking-tight truncate">
              Hey{activeProfile ? `, ${activeProfile.name.split(' ')[0]}` : '!'}
            </h2>
            {activeProfile ? (
              <Link
                href="/profile/edit"
                onClick={onClose}
                className="text-xs text-neutral-500 font-semibold hover:text-[#85142f] transition-colors inline-flex items-center gap-0.5 mt-0.5"
              >
                <span>Edit Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSignInClick?.();
                }}
                className="text-xs text-[#85142f] font-semibold hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
              >
                <span>Sign in / Register</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/profile/edit"
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-base overflow-hidden"
              aria-label="Edit Profile"
            >
              {activeProfile?.avatar ? (
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : activeProfile ? (
                <span className="bg-[#85142f] text-white w-full h-full flex items-center justify-center text-base font-black">
                  {activeProfile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserIcon className="w-5 h-5 text-neutral-400" />
              )}
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[2px]" />
            </button>
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100/80">
          {/* Highlight Banner: "Get tickets on Whatsapp/SMS!" -> /profile/verify-mobile */}
          <Link
            href="/profile/verify-mobile"
            onClick={onClose}
            className="block px-4 py-3 bg-[#fff8e6] hover:bg-[#fff3d1] border-b border-amber-200/80 transition-colors group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-amber-400/25 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  {account?.profile?.isMobileVerified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2px]" />
                  ) : (
                    <Info className="w-3.5 h-3.5 stroke-[2.2px]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#85142f] transition-colors">
                    Get tickets on Whatsapp/SMS!
                  </h4>
                  <p className="text-[11px] text-neutral-600 font-medium truncate">
                    {account?.profile?.isMobileVerified
                      ? `Verified: ${account.profile.mobile}`
                      : activeProfile?.mobile
                      ? `Verify ${activeProfile.mobile}`
                      : 'Add your Mobile Number'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </Link>

          {/* Menu Items List */}
          <div className="py-1">
            {ACCOUNT_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge =
                item.id === 'notifications' && unreadCount > 0
                  ? unreadCount
                  : item.id === 'orders' && upcomingOrdersCount > 0
                  ? upcomingOrdersCount
                  : item.id === 'wishlist' && wishlistCount > 0
                  ? wishlistCount
                  : null;

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
                      <p className="text-[13px] font-semibold text-neutral-900 group-hover:text-[#85142f] transition-colors truncate">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] text-neutral-500 font-normal truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {badge !== null && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                          item.id === 'notifications'
                            ? 'bg-[#85142f] text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer: Sign Out Button */}
        <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
          {activeProfile ? (
            <button
              type="button"
              onClick={() => {
                account?.signOut();
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
