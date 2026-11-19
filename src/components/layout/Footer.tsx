'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Headphones,
  Mail,
  Store,
  X,
  Check,
  Send,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  currentCity?: string;
}

export const Footer: React.FC<FooterProps> = ({ currentCity = 'Bengaluru' }) => {
  // Modals state for interactive footer buttons
  const [isListShowModalOpen, setIsListShowModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isCustomerCareModalOpen, setIsCustomerCareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [resendInput, setResendInput] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [organizerForm, setOrganizerForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Live Concert',
    city: currentCity,
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

  // SEO directory categories matching BookMyShow screenshots 1 & 2
  const directorySections = [
    {
      title: `MOVIES NOW SHOWING IN ${currentCity.toUpperCase()}`,
      links: [
        { label: 'Ramayana', href: '/movies' },
        { label: 'O.M Operation Mole', href: '/movies' },
        { label: 'Brindavihari', href: '/movies' },
        { label: 'Aakasamlo Oka Tara', href: '/movies' },
        { label: 'ENE Repeat', href: '/movies' },
        { label: 'Avengers: Doomsday', href: '/movies' },
        { label: 'Shankarabharanna', href: '/movies' },
        { label: 'Scene', href: '/movies' },
        { label: "Bachelor Party D'eux", href: '/movies' },
        { label: 'Godzilla Minus Zero', href: '/movies' },
      ],
    },
    {
      title: 'UPCOMING MOVIES PER WEEK',
      links: [
        { label: 'Upcoming Movies Today', href: '/movies' },
        { label: 'Upcoming Movies Tomorrow', href: '/movies' },
        { label: 'Upcoming Movies This Weekend', href: '/movies' },
      ],
    },
    {
      title: 'MOVIES BY GENRE',
      links: [
        { label: 'Drama Movies', href: '/movies' },
        { label: 'Thriller Movies', href: '/movies' },
        { label: 'Action Movies', href: '/movies' },
        { label: 'Comedy Movies', href: '/movies' },
        { label: 'Adventure Movies', href: '/movies' },
        { label: 'Romantic Movies', href: '/movies' },
        { label: 'Fantasy Movies', href: '/movies' },
        { label: 'Crime Movies', href: '/movies' },
        { label: 'Horror Movies', href: '/movies' },
        { label: 'Family Movies', href: '/movies' },
      ],
    },
    {
      title: 'MOVIES BY LANGUAGE',
      links: [
        { label: 'Movies in English', href: '/movies' },
        { label: 'Movies in Hindi', href: '/movies' },
        { label: 'Movies in Tamil', href: '/movies' },
        { label: 'Movies in Telugu', href: '/movies' },
        { label: 'Movies in Kannada', href: '/movies' },
        { label: 'Movies in Japanese', href: '/movies' },
        { label: 'Movies in Malayalam', href: '/movies' },
        { label: 'Movies in Sindhi', href: '/movies' },
        { label: 'Movies in Bengali', href: '/movies' },
        { label: 'Movies in Flemish', href: '/movies' },
      ],
    },
    {
      title: `SPORTS EVENTS IN ${currentCity.toUpperCase()}`,
      links: [
        { label: 'Running', href: '/sports' },
        { label: 'Chess', href: '/sports' },
        { label: 'Mixed Martial Arts', href: '/sports' },
        { label: 'Shooting', href: '/sports' },
        { label: 'Bowling', href: '/sports' },
        { label: 'Basketball', href: '/sports' },
        { label: 'Cricket', href: '/sports' },
        { label: 'Horse Race', href: '/sports' },
        { label: 'Sailing', href: '/sports' },
        { label: 'Cycling', href: '/sports' },
      ],
    },
    {
      title: 'EVENTS IN TOP CITIES',
      links: [
        { label: 'Events in Mumbai', href: '/events' },
        { label: 'Events in Delhi-NCR', href: '/events' },
        { label: 'Events in Chennai', href: '/events' },
        { label: 'Events in Bengaluru', href: '/events' },
        { label: 'Events in Hyderabad', href: '/events' },
        { label: 'Events in Pune', href: '/events' },
        { label: 'Events in Ahmedabad', href: '/events' },
        { label: 'Events in Kolkata', href: '/events' },
        { label: 'Events in Kochi', href: '/events' },
      ],
    },
    {
      title: 'CINEMAS IN TOP CITIES',
      links: [
        { label: 'Cinemas in Mumbai', href: '/movies' },
        { label: 'Cinemas in Delhi-NCR', href: '/movies' },
        { label: 'Cinemas in Chennai', href: '/movies' },
        { label: 'Cinemas in Bengaluru', href: '/movies' },
        { label: 'Cinemas in Hyderabad', href: '/movies' },
        { label: 'Cinemas in Pune', href: '/movies' },
        { label: 'Cinemas in Ahmedabad', href: '/movies' },
        { label: 'Cinemas in Kolkata', href: '/movies' },
        { label: 'Cinemas in Kochi', href: '/movies' },
      ],
    },
    {
      title: 'PLAYS IN TOP CITIES',
      links: [
        { label: 'Plays in Mumbai', href: '/events' },
        { label: 'Plays in Delhi-NCR', href: '/events' },
        { label: 'Plays in Chennai', href: '/events' },
        { label: 'Plays in Bengaluru', href: '/events' },
        { label: 'Plays in Hyderabad', href: '/events' },
        { label: 'Plays in Pune', href: '/events' },
        { label: 'Plays in Ahmedabad', href: '/events' },
        { label: 'Plays in Kolkata', href: '/events' },
        { label: 'Plays in Kochi', href: '/events' },
      ],
    },
    {
      title: 'ACTIVITIES IN TOP CITIES',
      links: [
        { label: 'Activities in Mumbai', href: '/events' },
        { label: 'Activities in Delhi-NCR', href: '/events' },
        { label: 'Activities in Chennai', href: '/events' },
        { label: 'Activities in Bengaluru', href: '/events' },
        { label: 'Activities in Hyderabad', href: '/events' },
        { label: 'Activities in Pune', href: '/events' },
        { label: 'Activities in Ahmedabad', href: '/events' },
        { label: 'Activities in Kolkata', href: '/events' },
        { label: 'Activities in Kochi', href: '/events' },
      ],
    },
    {
      title: 'MOVIES NOW SHOWING',
      links: [
        { label: 'Ramayana', href: '/movies' },
        { label: 'ENE Repeat', href: '/movies' },
        { label: 'O.M Operation Mole', href: '/movies' },
        { label: 'Aakasamlo Oka Tara', href: '/movies' },
        { label: 'Avengers: Doomsday', href: '/movies' },
        { label: 'Brindavihari', href: '/movies' },
        { label: 'Scene', href: '/movies' },
        { label: 'Godzilla Minus Zero', href: '/movies' },
        { label: 'Adventure of Jetcat 7D - Combo', href: '/movies' },
        { label: 'Ruff and Tuff Kanya', href: '/movies' },
      ],
    },
    {
      title: 'COUNTRIES',
      links: [
        { label: 'Indonesia', href: '/' },
        { label: 'Singapore', href: '/' },
        { label: 'Sri Lanka', href: '/' },
        { label: 'West Indies', href: '/' },
        { label: 'UAE', href: '/' },
      ],
    },
    {
      title: 'HELP',
      links: [
        { label: 'About Us', href: '/profile?tab=about' },
        { label: 'Contact Us', href: '/profile?tab=contact' },
        { label: 'Current Opening', href: '/profile?tab=careers' },
        { label: 'Press Release', href: '/profile?tab=press' },
        { label: 'Press Coverage', href: '/profile?tab=coverage' },
        { label: 'FAQs', href: '/profile?tab=faqs' },
        { label: 'Terms and Conditions', href: '/profile?tab=terms' },
        { label: 'Privacy Policy', href: '/profile?tab=privacy' },
      ],
    },
    {
      title: 'BOOKKARO EXCLUSIVES',
      links: [
        { label: 'Lollapalooza India', href: '/events' },
        { label: 'BookAChange', href: '/profile?tab=bookachange' },
        { label: 'Corporate Vouchers', href: '/profile?tab=vouchers' },
        { label: 'Gift Cards', href: '/profile?tab=giftcards' },
        { label: 'List My Show', href: '/profile?tab=listshow' },
        { label: 'Offers', href: '/profile?tab=offers' },
        { label: 'Stream', href: '/movies' },
        { label: 'Trailers', href: '/movies' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#313131] text-[#777777] font-sans pb-24 lg:pb-8 selection:bg-[#ec5e7b] selection:text-white mt-auto">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 bg-[#85142f] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. "LIST YOUR SHOW" TOP PROMO BAR (Matching Screenshot 1)    */}
      {/* ============================================================ */}
      <div className="bg-[#333338] border-b border-[#3d3d42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white">
              <Store className="w-5 h-5 stroke-[1.8px]" />
            </div>
            <div>
              <span className="text-white text-sm sm:text-base font-bold mr-2">
                List your Show
              </span>
              <span className="text-[#a5a5a5] text-xs sm:text-sm">
                Got a show, event, activity or a great experience? Partner with us & get listed on BookKaro
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsListShowModalOpen(true)}
            className="px-6 py-2.5 rounded-md bg-[#ec5e7b] hover:bg-[#d94b68] text-white text-xs sm:text-sm font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Contact today!
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 3-COLUMN QUICK CUSTOMER CARE STRIP (Matching Screenshot 1)*/}
      {/* ============================================================ */}
      <div className="bg-[#404040] border-b border-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            {/* 1. 24/7 CUSTOMER CARE */}
            <button
              type="button"
              onClick={() => setIsCustomerCareModalOpen(true)}
              className="flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors mb-2">
                <Headphones className="w-8 h-8 stroke-[1.5px]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white tracking-widest uppercase transition-colors">
                24/7 CUSTOMER CARE
              </span>
            </button>

            {/* 2. RESEND BOOKING CONFIRMATION */}
            <button
              type="button"
              onClick={() => setIsResendModalOpen(true)}
              className="flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors mb-2">
                <Ticket className="w-8 h-8 stroke-[1.5px]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white tracking-widest uppercase transition-colors">
                RESEND BOOKING CONFIRMATION
              </span>
            </button>

            {/* 3. SUBSCRIBE TO THE NEWSLETTER */}
            <button
              type="button"
              onClick={() => setIsNewsletterModalOpen(true)}
              className="flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors mb-2">
                <Mail className="w-8 h-8 stroke-[1.5px]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white tracking-widest uppercase transition-colors">
                SUBSCRIBE TO THE NEWSLETTER
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. DEEP SEO DIRECTORY LINKS GRID (Matching Screenshots 1 & 2)*/}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-6">
          {directorySections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-[11px] font-bold text-[#999999] tracking-wider uppercase">
                {section.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-[#777777]">
                {section.links.map((link, lIdx) => (
                  <React.Fragment key={lIdx}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                    {lIdx < section.links.length - 1 && (
                      <span className="text-[#555555] mx-1.5 select-none">|</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* 4. BRAND LOGO DIVIDER & SOCIAL ICONS (Matching Screenshot 2) */}
        {/* ============================================================ */}
        <div className="pt-12 pb-4">
          {/* Centered Brand Line */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="h-[1px] bg-[#444444] w-full" />
            <div className="absolute bg-[#313131] px-5 flex items-center gap-2 text-white">
              <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-white select-none">
                book<span className="text-[#ec5e7b]">karo</span>
              </span>
            </div>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-6">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X Twitter"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.224-.174.271-.4.165-1.499-.699-2.436-2.894-2.436-4.659 0-3.791 2.756-7.275 7.946-7.275 4.172 0 7.417 2.973 7.417 6.948 0 4.148-2.613 7.485-6.241 7.485-1.219 0-2.365-.635-2.758-1.385l-.75 2.859c-.271 1.044-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-[#404040] hover:bg-[#ec5e7b] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* Legal Copyright Disclaimer (Exact from Screenshot 2) */}
          <div className="text-center text-[10px] text-[#666666] leading-relaxed max-w-4xl mx-auto space-y-2 mt-4 px-4">
            <p>
              Copyright 2026 © BookKaro Entertainment Pvt. Ltd. All Rights Reserved.
            </p>
            <p>
              The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: LIST YOUR SHOW                                      */}
      {/* ============================================================ */}
      {isListShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#85142f]" />
                <h3 className="text-base font-bold text-neutral-900">List Your Show</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsListShowModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleListShowSubmit} className="space-y-3.5 pt-4 text-xs">
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
                <label className="font-bold text-neutral-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={organizerForm.phone}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Event Category</label>
                <select
                  value={organizerForm.eventType}
                  onChange={(e) => setOrganizerForm({ ...organizerForm, eventType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#85142f]"
                >
                  <option>Live Concert / Music Show</option>
                  <option>Comedy Standup</option>
                  <option>Sports Tournament / Marathon</option>
                  <option>Theatre / Stage Play</option>
                  <option>Workshop / Conference</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsListShowModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#85142f] text-white font-bold hover:bg-[#6e1026]"
                >
                  Submit Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: RESEND BOOKING CONFIRMATION                         */}
      {/* ============================================================ */}
      {isResendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#85142f]" />
                <h3 className="text-sm font-bold text-neutral-900">Resend Confirmation</h3>
              </div>
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

      {/* ============================================================ */}
      {/* MODAL 3: NEWSLETTER SUBSCRIPTION                             */}
      {/* ============================================================ */}
      {isNewsletterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#85142f]" />
                <h3 className="text-sm font-bold text-neutral-900">Subscribe Newsletter</h3>
              </div>
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

      {/* ============================================================ */}
      {/* MODAL 4: 24/7 CUSTOMER CARE INFO                             */}
      {/* ============================================================ */}
      {isCustomerCareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-neutral-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#85142f]" />
                <h3 className="text-sm font-bold text-neutral-900">24/7 Customer Care</h3>
              </div>
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
