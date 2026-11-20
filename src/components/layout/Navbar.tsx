'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Search, X, ChevronDown, Check, Ticket, LogOut } from 'lucide-react';
import { ProfileDrawer } from '@/components/profile/ProfileDrawer';
import { CITIES } from '@/data/mockData';
import { User } from '@/types';

interface NavbarProps {
  currentCity: string;
  user?: User | null;
  onSelectCity: (city: string) => void;
  onSearchClick?: () => void;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  user,
  onSelectCity,
  onSignInClick,
  onSignOut,
  searchQuery,
  onSearchChange,
}) => {
  const pathname = usePathname();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'Concerts', href: '/events' },
    { label: 'Sports', href: '/sports' },
    { label: 'Live Events', href: '/events' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP NAVBAR (visible on lg and up)                     */}
      {/* ============================================================ */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-neutral-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo & Desktop Nav Links */}
            <div className="flex items-center gap-9">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-neutral-900">
                  BookKaro
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="flex items-center gap-7 text-[14px]">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`relative py-2 transition-colors ${
                        active
                          ? 'text-neutral-950 font-black'
                          : 'text-neutral-600 hover:text-neutral-950 font-semibold'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#85142f] rounded-xs" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* City Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-neutral-800 bg-white border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs transition-all cursor-pointer"
                  aria-label="Select City"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
                  <span>{currentCity}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      Select City
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => {
                            onSelectCity(city.name);
                            setIsCityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left font-semibold transition-colors ${
                            currentCity.toLowerCase() === city.name.toLowerCase()
                              ? 'bg-[#85142f]/10 text-[#85142f] font-bold'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{city.name}</span>
                          {currentCity.toLowerCase() === city.name.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-[#85142f]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Search Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSearchOpen || searchQuery
                    ? 'bg-[#85142f] text-white shadow-xs'
                    : 'text-neutral-700 bg-white border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
                }`}
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-neutral-500 font-normal">Search...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-neutral-100 text-neutral-500 rounded border border-neutral-200">
                  /
                </kbd>
              </button>

              {/* Profile Avatar Button */}
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(true)}
                className="w-9 h-9 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#6e1026] transition-all cursor-pointer ring-1 ring-[#85142f]/20"
                aria-label="User Profile"
              >
                {user ? user.name.charAt(0).toUpperCase() : 'C'}
              </button>
            </div>
          </div>

          {/* Desktop Search Dropdown Bar */}
          {isSearchOpen && (
            <div className="pb-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center bg-white rounded-xl border border-neutral-200/90 px-4 py-2.5 shadow-md max-w-xl mx-auto">
                <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search movies, events, sports, artists, or venues..."
                  className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors ml-2"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE HEADER                                            */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-neutral-200/60 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Ticket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-neutral-900">
            BookKaro
          </span>
        </Link>

        {/* Right Search Button */}
        <button
          type="button"
          onClick={() => {
            setIsSearchOpen((prev) => !prev);
            setTimeout(() => searchInputRef.current?.focus(), 150);
          }}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
            isSearchOpen || searchQuery
              ? 'bg-[#85142f] text-white shadow-xs'
              : 'bg-white text-neutral-800 border border-neutral-200/80 hover:bg-neutral-50 shadow-2xs'
          }`}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </header>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden fixed top-2.5 inset-x-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center bg-white rounded-xl border border-neutral-200/90 px-3.5 py-2.5 shadow-xl">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, events, sports..."
              className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange('');
              }}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={user || null}
        onSignOut={() => {
          onSignOut?.();
          setIsProfileDrawerOpen(false);
        }}
        onSignInClick={onSignInClick}
      />
    </>
  );
};
