'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Search, X, ChevronDown, Check, Ticket, LogOut } from 'lucide-react';
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
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Movies', href: '#movies' },
    { label: 'Concerts', href: '#concerts' },
    { label: 'Sports', href: '#sports' },
    { label: 'Theatre', href: '#theatre' },
    { label: 'Events', href: '#trending' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP NAVBAR (visible on lg and up)                     */}
      {/* ============================================================ */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-neutral-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Logo & Desktop Nav Links */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                  BookKaro
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="flex items-center gap-7 text-[14px]">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.label;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setActiveTab(link.label)}
                      className={`relative py-2 font-medium transition-colors ${
                        isActive
                          ? 'text-neutral-900 font-bold'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#85142f] rounded-full" />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* City Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Select City"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
                  <span>{currentCity}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors ${
                            currentCity.toLowerCase() === city.name.toLowerCase()
                              ? 'bg-[#85142f]/10 text-[#85142f] font-bold'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{city.name}</span>
                          {currentCity.toLowerCase() === city.name.toLowerCase() && (
                            <Check className="w-4 h-4 text-[#85142f]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isSearchOpen || searchQuery
                    ? 'bg-[#85142f] text-white'
                    : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/70'
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Profile Avatar 'C' */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    } else {
                      onSignInClick?.();
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                  aria-label="User Profile"
                >
                  {user ? user.name.charAt(0).toUpperCase() : 'C'}
                </button>

                {user && isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-neutral-100 text-xs">
                      <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email || user.mobile}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Desktop Search Dropdown */}
          {isSearchOpen && (
            <div className="pb-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center bg-white rounded-full border border-neutral-200/90 px-4 py-2 shadow-sm max-w-xl mx-auto">
                <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search movies, events, artists..."
                  className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
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
                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors ml-2"
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
      {/* 2. MOBILE HEADER: BRAND NAME ON LEFT + ONLY SEARCH ON RIGHT  */}
      {/* (No hamburger menu, no floating drawer overlapping the hero) */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-neutral-200/60 px-4 h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Ticket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-neutral-900">
            BookKaro
          </span>
        </Link>

        {/* Right: Only the Search Button */}
        <button
          type="button"
          onClick={() => {
            setIsSearchOpen((prev) => !prev);
            setTimeout(() => searchInputRef.current?.focus(), 150);
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
            isSearchOpen || searchQuery
              ? 'bg-[#85142f] text-white shadow-xs'
              : 'bg-white text-neutral-800 border border-neutral-200/80 hover:bg-neutral-50 shadow-xs'
          }`}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </header>

      {/* Mobile Search Overlay Modal (appears smoothly when search button is tapped) */}
      {isSearchOpen && (
        <div className="lg:hidden fixed top-2.5 inset-x-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center bg-white rounded-full border border-neutral-200/90 px-3.5 py-2 shadow-xl">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, events, artists..."
              className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange('');
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
