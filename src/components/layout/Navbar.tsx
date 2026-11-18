'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Search, Menu, X, ChevronDown, Check, Ticket, LogOut } from 'lucide-react';
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
  onSearchClick,
  onSignInClick,
  onSignOut,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 bg-[#fbf9f8]/95 backdrop-blur-md border-b border-neutral-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                BookKaro
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[14px]">
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
          <div className="flex items-center gap-3 sm:gap-4">
            {/* City Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
                <span className="truncate max-w-[90px] sm:max-w-none">{currentCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* City Dropdown Menu */}
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

            {/* Search Icon Button (Desktop) */}
            <button
              type="button"
              onClick={onSearchClick}
              className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/70 rounded-full transition-colors cursor-pointer"
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

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Directly Under Header (matching the phone screenshot!) */}
        <div className="lg:hidden pb-3">
          <div className="relative flex items-center bg-white rounded-full border border-neutral-200/80 px-3.5 py-2 shadow-xs">
            <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, events, artists..."
              className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-[#fbf9f8] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveTab(link.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#85142f] text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
