'use client';

import React from 'react';
import { Home, Film, Ticket, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: User | null;
  onProfileClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  user,
  onProfileClick,
}) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '#',
    },
    {
      id: 'movies',
      label: 'Movies',
      icon: Film,
      href: '#movies',
    },
    {
      id: 'live-events',
      label: 'Live Events',
      icon: Ticket,
      href: '#trending',
    },
    {
      id: 'profile',
      label: user ? user.name.split(' ')[0] : 'Profile',
      icon: UserIcon,
      onClick: onProfileClick,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.onClick) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={`flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition-all cursor-pointer ${
                  isActive ? 'text-[#85142f]' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div className="relative mb-0.5">
                  <Icon className="w-5 h-5" />
                  {user && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#85142f] ring-1 ring-white" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-[#85142f]' : 'text-neutral-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition-all cursor-pointer ${
                isActive ? 'text-[#85142f]' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="relative mb-0.5">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-[#85142f] font-bold' : 'text-neutral-600'}`}>
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
