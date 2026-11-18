'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  currentCity: string;
}

export const Footer: React.FC<FooterProps> = ({ currentCity }) => {
  return (
    <footer className="border-t border-neutral-100 bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-16 border-b border-neutral-100">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="18" height="18" x="3" y="3" rx="4" />
                  <path d="M7 3v18" />
                  <path d="M3 7.5h4" />
                  <path d="M3 12h4" />
                  <path d="M3 16.5h4" />
                  <circle cx="15.5" cy="12" r="2.5" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-950">
                BookKaro
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed">
              Big screens. Live stages. Real memories. <br />
              Find your next experience in {currentCity}.
            </p>
          </div>

          {/* Links Column 1: Explore */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#movies" className="hover:text-neutral-950 transition-colors">
                  Movies
                </a>
              </li>
              <li>
                <a href="#concerts" className="hover:text-neutral-950 transition-colors">
                  Concerts & festivals
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-neutral-950 transition-colors">
                  Sports & live events
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: BookKaro */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
              BookKaro
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#about" className="hover:text-neutral-950 transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#list-event" className="hover:text-neutral-950 transition-colors">
                  List your event
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-neutral-950 transition-colors">
                  Contact & support
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Follow along */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
              Follow along
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-neutral-950 transition-colors"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-neutral-950 transition-colors"
                >
                  <span>X / Twitter</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-neutral-950 transition-colors"
                >
                  <span>YouTube</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 BookKaro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-neutral-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
