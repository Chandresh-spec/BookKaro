'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Search, Menu, X, ChevronDown, Check, Ticket } from 'lucide-react';
import { CITIES } from '@/data/mockData';

interface NavbarProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onSearchClick?: () => void;
  onSignInClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  onSearchClick,
  onSignInClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Movies', href: '#movies' },
    { label: 'Concerts', href: '#concerts' },
    { label: 'Sports', href: '#sports' },
    { label: 'Theatre', href: '#theatre' },
    { label: 'Events', href: '#live-events' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-950">
                BookKaro
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[14px]">
              {navLinks.map((link) => {
                const isActive = activeTab === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setActiveTab(link.label)}
                    className={`relative py-2 font-medium transition-colors ${
                      isActive
                        ? 'text-neutral-950 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* City Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-neutral-800 hover:bg-neutral-100/80 transition-colors cursor-pointer"
                aria-label="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate max-w-[90px] sm:max-w-none">{currentCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* City Dropdown Menu */}
              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Popular Cities
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {CITIES.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectCity(city.name);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors ${
                          currentCity.toLowerCase() === city.name.toLowerCase()
                            ? 'bg-neutral-100 font-semibold text-neutral-950'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{city.name}</span>
                        {currentCity.toLowerCase() === city.name.toLowerCase() && (
                          <Check className="w-4 h-4 text-neutral-900" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              type="button"
              onClick={onSearchClick}
              className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Sign In Button (Desktop) */}
            <button
              type="button"
              onClick={onSignInClick}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sign In
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
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
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSignInClick?.();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
