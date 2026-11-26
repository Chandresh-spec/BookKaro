'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  currentCity?: string;
}

export const Footer: React.FC<FooterProps> = ({ currentCity = 'Bengaluru' }) => {
  const [isListShowModalOpen, setIsListShowModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isCustomerCareModalOpen, setIsCustomerCareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [resendInput, setResendInput] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [organizerForm, setOrganizerForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Live Concert',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleListShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsListShowModalOpen(false);
    showToast('Thank you! Our partnership team will contact you within 24 hours.');
  };

  const handleResendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResendModalOpen(false);
    showToast(`Booking confirmation sent to ${resendInput}!`);
    setResendInput('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterModalOpen(false);
    showToast('Subscribed! Check your inbox for exclusive early-bird offers.');
    setNewsletterEmail('');
  };

  // Exact 13 Directory Sections from Screenshot 1 & 2
  const directorySections = [
    {
      title: 'MOVIES NOW SHOWING IN BENGALURU',
      links: [
        'Ramayana',
        'O.M Operation Mole',
        'Brindavihari',
        'Aakasamlo Oka Tara',
        'ENE Repeat',
        'Avengers: Doomsday',
        'Shankarabharanna',
        'Scene',
        "Bachelor Party D'eux",
        'Godzilla Minus Zero',
      ],
      href: '/movies',
    },
    {
      title: 'UPCOMING MOVIES PER WEEK',
      links: [
        'Upcoming Movies Today',
        'Upcoming Movies Tomorrow',
        'Upcoming Movies This Weekend',
      ],
      href: '/movies',
    },
    {
      title: 'MOVIES BY GENRE',
      links: [
        'Drama Movies',
        'Thriller Movies',
        'Action Movies',
        'Comedy Movies',
        'Adventure Movies',
        'Romantic Movies',
        'Fantasy Movies',
        'Crime Movies',
        'Horror Movies',
        'Family Movies',
      ],
      href: '/movies',
    },
    {
      title: 'MOVIES BY LANGUAGE',
      links: [
        'Movies in English',
        'Movies in Hindi',
        'Movies in Tamil',
        'Movies in Telugu',
        'Movies in Kannada',
        'Movies in Japanese',
        'Movies in Malayalam',
        'Movies in Sindhi',
        'Movies in Bengali',
        'Movies in Flemish',
      ],
      href: '/movies',
    },
    {
      title: 'SPORTS EVENTS IN BENGALURU',
      links: [
        'Running',
        'Chess',
        'Mixed Martial Arts',
        'Shooting',
        'Bowling',
        'Basketball',
        'Cricket',
        'Horse Race',
        'Sailing',
        'Cycling',
      ],
      href: '/sports',
    },
    {
      title: 'EVENTS IN TOP CITIES',
      links: [
        'Events in Mumbai',
        'Events in Delhi-NCR',
        'Events in Chennai',
        'Events in Bengaluru',
        'Events in Hyderabad',
        'Events in Pune',
        'Events in Ahmedabad',
        'Events in Kolkata',
        'Events in Kochi',
      ],
      href: '/events',
    },
    {
      title: 'CINEMAS IN TOP CITIES',
      links: [
        'Cinemas in Mumbai',
        'Cinemas in Delhi-NCR',
        'Cinemas in Chennai',
        'Cinemas in Bengaluru',
        'Cinemas in Hyderabad',
        'Cinemas in Pune',
        'Cinemas in Ahmedabad',
        'Cinemas in Kolkata',
        'Cinemas in Kochi',
      ],
      href: '/movies',
    },
    {
      title: 'PLAYS IN TOP CITIES',
      links: [
        'Plays in Mumbai',
        'Plays in Delhi-NCR',
        'Plays in Chennai',
        'Plays in Bengaluru',
        'Plays in Hyderabad',
        'Plays in Pune',
        'Plays in Ahmedabad',
        'Plays in Kolkata',
        'Plays in Kochi',
      ],
      href: '/events',
    },
    {
      title: 'ACTIVITIES IN TOP CITIES',
      links: [
        'Activities in Mumbai',
        'Activities in Delhi-NCR',
        'Activities in Chennai',
        'Activities in Bengaluru',
        'Activities in Hyderabad',
        'Activities in Pune',
        'Activities in Ahmedabad',
        'Activities in Kolkata',
        'Activities in Kochi',
      ],
      href: '/events',
    },
    {
      title: 'MOVIES NOW SHOWING',
      links: [
        'Ramayana',
        'ENE Repeat',
        'O.M Operation Mole',
        'Aakasamlo Oka Tara',
        'Avengers: Doomsday',
        'Brindavihari',
        'Scene',
        'Godzilla Minus Zero',
        'Adventure of Jetcat 7D - Combo',
        'Ruff and Tuff Kanya',
      ],
      href: '/movies',
    },
    {
      title: 'COUNTRIES',
      links: ['Indonesia', 'Singapore', 'Sri Lanka', 'West Indies'],
      href: '/',
    },
    {
      title: 'HELP',
      links: [
        'About Us',
        'Contact Us',
        'Current Opening',
        'Press Release',
        'Press Coverage',
        'FAQs',
        'Terms and Conditions',
        'Privacy Policy',
      ],
      href: '/profile',
    },
    {
      title: 'BOOKKARO EXCLUSIVES',
      links: [
        'Lollapalooza India',
        'BookAChange',
        'Corporate Vouchers',
        'Gift Cards',
        'List My Show',
        'Offers',
        'Stream',
        'Trailers',
      ],
      href: '/events',
    },
  ];

  return (
    <footer className="relative w-full font-sans text-slate-300 selection:bg-[#fbbf24] selection:text-neutral-950 mt-auto bg-[#070c1d] overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* ROW 1: "LIST YOUR SHOW" (Desktop / Laptop Only)              */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-[#0b132b] text-white border-b border-[#1c294a]/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            {/* Outline Tent Icon with top flag */}
            <svg
              className="w-8 h-8 text-white shrink-0"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="24" y1="4" x2="24" y2="13" />
              <path d="M24 5 L32 8.5 L24 12 Z" fill="currentColor" stroke="none" />
              <path d="M6 38 L24 13 L42 38 Z" />
              <path d="M6 38 Q10 41 15 38 Q19 41 24 38 Q29 41 34 38 Q38 41 42 38" />
              <path d="M20 38 L24 24 L28 38" />
              <line x1="24" y1="13" x2="15" y2="38" />
              <line x1="24" y1="13" x2="33" y2="38" />
            </svg>

            <div className="text-xs sm:text-[14px] leading-snug">
              <span className="font-bold text-white mr-2">List your Show</span>
              <span className="text-[#cccccc] font-normal">
                Got a show, event, activity or a great experience? Partner with us &amp; get listed on BookKaro
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsListShowModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-[#fbbf24] hover:bg-[#f59e0b] text-neutral-950 text-xs sm:text-sm font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Contact today!
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 2: 3 CUSTOMER CARE ITEMS (Desktop / Laptop Only)         */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-[#090f22] border-b border-[#1c294a]/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            {/* 1. 24/7 CUSTOMER CARE */}
            <button
              type="button"
              onClick={() => setIsCustomerCareModalOpen(true)}
              className="flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
            >
              <svg
                className="w-12 h-12 text-[#999999] group-hover:text-white transition-colors"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 28 C16 16, 48 16, 48 28" />
                <rect x="12" y="24" width="6" height="12" rx="3" />
                <rect x="46" y="24" width="6" height="12" rx="3" />
                <path d="M22 28 C22 21, 42 21, 42 28 C42 35, 38 41, 32 41 C26 41, 22 35, 22 28 Z" />
                <path d="M48 33 L48 40 C48 44, 42 45, 38 45" />
                <circle cx="36" cy="45" r="2" fill="currentColor" />
                <path d="M14 54 C14 47, 22 45, 32 45 C42 45, 50 47, 50 54" />
              </svg>
              <span className="text-[11px] font-semibold text-[#8f8f94] group-hover:text-white tracking-widest uppercase transition-colors">
                24/7 CUSTOMER CARE
              </span>
            </button>

            {/* 2. RESEND BOOKING CONFIRMATION */}
            <button
              type="button"
              onClick={() => setIsResendModalOpen(true)}
              className="flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
            >
              <svg
                className="w-12 h-12 text-[#999999] group-hover:text-white transition-colors"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M26 12 L48 18 C48 20 49 22 51 22 C53 23 54 22 55 20 L58 32 C56 33 55 35 55 37 C56 39 58 40 59 40 L37 48 C37 46 36 44 34 44 C32 43 31 44 30 46 L24 24" opacity="0.45" />
                <path d="M12 28 L42 20 C42 23 44 25 47 24 C49 24 51 22 51 19 L56 36 C53 37 52 39 52 42 C53 45 55 46 58 46 L28 54 C28 51 26 49 23 50 C21 50 19 52 19 55 L14 38 C17 37 18 35 18 32 C17 29 15 28 12 28 Z" />
                <line x1="39" y1="21" x2="43" y2="37" strokeDasharray="2 2" strokeWidth="1.5" />
                <circle cx="28" cy="38" r="3" />
              </svg>
              <span className="text-[11px] font-semibold text-[#8f8f94] group-hover:text-white tracking-widest uppercase transition-colors">
                RESEND BOOKING CONFIRMATION
              </span>
            </button>

            {/* 3. SUBSCRIBE TO THE NEWSLETTER */}
            <button
              type="button"
              onClick={() => setIsNewsletterModalOpen(true)}
              className="flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
            >
              <svg
                className="w-12 h-12 text-[#999999] group-hover:text-white transition-colors"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 14 L44 14 L44 34 L20 34 Z" />
                <line x1="24" y1="19" x2="36" y2="19" strokeWidth="1.5" />
                <line x1="24" y1="23" x2="40" y2="23" strokeWidth="1.5" />
                <line x1="24" y1="27" x2="34" y2="27" strokeWidth="1.5" />
                <path d="M12 28 L32 40 L52 28 L52 50 L12 50 Z" />
                <line x1="12" y1="50" x2="28" y2="37" />
                <line x1="52" y1="50" x2="36" y2="37" />
              </svg>
              <span className="text-[11px] font-semibold text-[#8f8f94] group-hover:text-white tracking-widest uppercase transition-colors">
                SUBSCRIBE TO THE NEWSLETTER
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 3: DEEP SEO DIRECTORY LINKS (Desktop / Laptop Only)      */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-[#070c1d] border-b border-[#1c294a]/60 py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {directorySections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                {section.title}
              </h4>
              <p className="text-[11px] leading-[22px] text-slate-500">
                {section.links.map((link, lIdx) => (
                  <React.Fragment key={lIdx}>
                    <Link
                      href={section.href}
                      className="hover:text-[#fbbf24] transition-colors"
                    >
                      {link}
                    </Link>
                    {lIdx < section.links.length - 1 && (
                      <span className="text-slate-700 mx-1.5 select-none">|</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 4: BRAND DIVIDER, SOCIALS, 4 COLUMNS & GOLDEN WAVES      */}
      {/* (Exact Match to User Mockup: Navy #070c1d + Gold Highlights) */}
      {/* ============================================================ */}
      <div className="relative bg-[#070c1d] pt-6 sm:pt-8 pb-24 lg:pb-14 overflow-hidden">
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Centered Brand Line with Golden Divider Line */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent w-full" />
            <div className="absolute bg-[#070c1d] px-4 flex items-center gap-1.5 select-none">
              <span className="text-white text-xl sm:text-2xl font-bold tracking-tight">book</span>
              <span className="bg-[#fbbf24] text-neutral-950 px-2 py-0.5 rounded-md text-sm sm:text-base font-black shadow-xs">
                Karo
              </span>
            </div>
          </div>

          {/* 6 Circular Gold Social Icons */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-5">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X Twitter"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3 sm:w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.224-.174.271-.4.165-1.499-.699-2.436-2.894-2.436-4.659 0-3.791 2.756-7.275 7.946-7.275 4.172 0 7.417 2.973 7.417 6.948 0 4.148-2.613 7.485-6.241 7.485-1.219 0-2.365-.635-2.758-1.385l-.75 2.859c-.271 1.044-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a1024] border border-[#f59e0b]/50 hover:border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* 4-Column Links Grid (Exact Match to User Mockup) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-6 lg:gap-10 py-5 sm:py-6 border-y border-[#1c294a]/80 my-5">
            {/* Column 1: BookKaro */}
            <div>
              <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-white mb-2 sm:mb-3">BookKaro</h4>
              <ul className="space-y-1 sm:space-y-2 text-[8.5px] sm:text-[11px] md:text-xs text-slate-300">
                <li><Link href="/about" className="hover:text-[#fbbf24] transition-colors block leading-tight">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-[#fbbf24] transition-colors block leading-tight">Careers</Link></li>
                <li><Link href="/press" className="hover:text-[#fbbf24] transition-colors block leading-tight">Press</Link></li>
                <li><Link href="/blog" className="hover:text-[#fbbf24] transition-colors block leading-tight">Blog</Link></li>
              </ul>
            </div>

            {/* Column 2: Help & Support */}
            <div>
              <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-white mb-2 sm:mb-3">Help &amp; Support</h4>
              <ul className="space-y-1 sm:space-y-2 text-[8.5px] sm:text-[11px] md:text-xs text-slate-300">
                <li><Link href="/faqs" className="hover:text-[#fbbf24] transition-colors block leading-tight">FAQs</Link></li>
                <li><button type="button" onClick={() => setIsCustomerCareModalOpen(true)} className="hover:text-[#fbbf24] transition-colors block text-left leading-tight cursor-pointer">Contact Us</button></li>
                <li><Link href="/guide" className="hover:text-[#fbbf24] transition-colors block leading-tight">Ticket Booking Guide</Link></li>
                <li><Link href="/refunds" className="hover:text-[#fbbf24] transition-colors block leading-tight">Cancellation &amp; Refunds</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-white mb-2 sm:mb-3">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-[8.5px] sm:text-[11px] md:text-xs text-slate-300">
                <li><Link href="/terms" className="hover:text-[#fbbf24] transition-colors block leading-tight">Terms &amp; Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-[#fbbf24] transition-colors block leading-tight">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-[#fbbf24] transition-colors block leading-tight">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#fbbf24] transition-colors block leading-tight">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Column 4: Get in Touch */}
            <div>
              <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-white mb-2 sm:mb-3">Get in Touch</h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[8.5px] sm:text-[11px] md:text-xs text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Mail className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#fbbf24] shrink-0" />
                  <a href="mailto:support@bookkaro.com" className="hover:text-[#fbbf24] transition-colors truncate">
                    support@bookkaro.com
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#fbbf24] shrink-0" />
                  <a href="tel:+918047123456" className="hover:text-[#fbbf24] transition-colors whitespace-nowrap">
                    +91 80 4712 3456
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#fbbf24] shrink-0" />
                  <span className="truncate">Bengaluru, Karnataka</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Gold Copyright Line & Legal Disclaimer */}
          <div className="text-center space-y-2 mt-4 px-2">
            <p className="text-[9.5px] sm:text-xs font-semibold text-[#fbbf24] tracking-wide">
              Copyright 2026 © BookKaro Entertainment Pvt. Ltd. All Rights Reserved.
            </p>
            <p className="text-[8px] sm:text-[10px] text-slate-400 leading-relaxed max-w-3xl mx-auto">
              The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
            </p>
          </div>
        </div>

        {/* Golden Glowing Silk Wave Ribbons at Bottom Edge */}
        <div className="absolute bottom-0 inset-x-0 overflow-hidden pointer-events-none h-14 sm:h-20 z-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="goldWaveRibbon1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.2" />
                <stop offset="30%" stopColor="#d97706" stopOpacity="0.75" />
                <stop offset="55%" stopColor="#fde047" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="goldWaveRibbon2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.1" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="75%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="goldWaveBottomGlow" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="0" y="50" width="1200" height="70" fill="url(#goldWaveBottomGlow)" />
            <path
              d="M-50,120 C180,60 380,15 650,75 C920,135 1100,55 1250,90 L1250,120 L-50,120 Z"
              fill="url(#goldWaveRibbon1)"
              opacity="0.5"
            />
            <path
              d="M-50,120 C220,110 400,35 700,95 C980,140 1150,45 1250,65 L1250,120 L-50,120 Z"
              fill="url(#goldWaveRibbon2)"
              opacity="0.7"
            />
            <path
              d="M-50,120 C180,60 380,15 650,75 C920,135 1100,55 1250,90"
              stroke="url(#goldWaveRibbon1)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M-50,120 C220,110 400,35 700,95 C980,140 1150,45 1250,65"
              stroke="#fef08a"
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Modals */}
      {isListShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">List Your Show</h3>
              <button
                type="button"
                onClick={() => setIsListShowModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleListShowSubmit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Your Name / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phoenix Entertainment"
                  value={organizerForm.name}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={organizerForm.email}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={organizerForm.phone}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsListShowModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-neutral-200 font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#85142f] text-white font-bold hover:bg-[#6e1026]"
                >
                  Submit Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isResendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Resend Confirmation</h3>
              <button
                type="button"
                onClick={() => setIsResendModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-600 my-3">
              Enter your mobile number or email address used during booking to receive your tickets on WhatsApp and SMS.
            </p>
            <form onSubmit={handleResendSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Mobile number or Email address"
                value={resendInput}
                onChange={(e) => setResendInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsResendModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-neutral-200 font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#85142f] text-white font-bold hover:bg-[#6e1026]"
                >
                  Resend Tickets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNewsletterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Subscribe Newsletter</h3>
              <button
                type="button"
                onClick={() => setIsNewsletterModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-600 my-3">
              Get weekly updates on blockbuster releases, concert pre-sales, and early-bird discounts in {currentCity}.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3 text-xs">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewsletterModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-neutral-200 font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#85142f] text-white font-bold hover:bg-[#6e1026]"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCustomerCareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">24/7 Customer Care</h3>
              <button
                type="button"
                onClick={() => setIsCustomerCareModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="my-4 space-y-3 text-xs text-neutral-700">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="font-bold text-neutral-900 mb-0.5">Toll-Free Helpline</p>
                <p className="text-neutral-600 font-mono">1800-209-2665 (BOOK)</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="font-bold text-neutral-900 mb-0.5">Email Support</p>
                <p className="text-neutral-600">helpdesk@bookkaro.com</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="font-bold text-neutral-900 mb-0.5">Live Chat</p>
                <p className="text-neutral-600">Available 24x7 from your Profile &gt; Help & Support</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomerCareModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#85142f] text-white font-bold text-xs hover:bg-[#6e1026]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
