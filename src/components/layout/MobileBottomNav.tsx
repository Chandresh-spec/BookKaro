'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Film, Trophy, Ticket, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface MobileBottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: User | null;
  onProfileClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab: propActiveTab,
  onTabChange,
  user,
  onProfileClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on route if not explicitly provided
  const currentTab =
    propActiveTab ||
    (pathname?.startsWith('/movies')
      ? 'movies'
      : pathname?.startsWith('/sports')
      ? 'sports'
      : pathname?.startsWith('/events')
      ? 'live-events'
      : 'home');

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
    },
    {
      id: 'movies',
      label: 'Movies',
      icon: Film,
      href: '/movies',
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Trophy,
      href: '/sports',
    },
    {
      id: 'live-events',
      label: 'Live Events',
      icon: Ticket,
      href: '/events',
    },
    {
      id: 'profile',
      label: user ? user.name.split(' ')[0] : 'Profile',
      icon: UserIcon,
      onClick: onProfileClick,
    },
  ];

  const handleNavClick = (tabId: string, href?: string) => {
    onTabChange?.(tabId);
    if (!href) return;

    if (href === '/' && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '/movies' && pathname === '/movies') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '/sports' && pathname === '/sports') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '/events' && pathname === '/events') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      if (pathname === '/') {
        const hash = href.replace('/', '');
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 w-full z-50 bg-white border-t border-neutral-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] transform-gpu will-change-transform pb-[env(safe-area-inset-bottom,0px)]"
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.onClick) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all active:scale-95 cursor-pointer select-none ${
                  isActive ? 'text-[#85142f]' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {/* Active Top Bar Indicator */}
                {isActive && (
                  <span className="absolute top-0 inset-x-4 h-[2px] bg-[#85142f] rounded-full" />
                )}

                <div className="relative mb-0.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
                  {user && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#85142f] ring-1 ring-white" />
                  )}
                </div>
                <span className={`text-[10px] tracking-tight leading-tight ${isActive ? 'text-[#85142f] font-bold' : 'text-neutral-600 font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNavClick(tab.id, tab.href)}
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all active:scale-95 cursor-pointer select-none ${
                isActive ? 'text-[#85142f]' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {/* Active Top Bar Indicator */}
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-[2px] bg-[#85142f] rounded-full" />
              )}

              <div className="relative mb-0.5">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight leading-tight ${isActive ? 'text-[#85142f] font-bold' : 'text-neutral-600 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
