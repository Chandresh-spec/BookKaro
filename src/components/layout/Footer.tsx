'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Ticket } from 'lucide-react';

interface FooterProps {
  currentCity: string;
}

export const Footer: React.FC<FooterProps> = ({ currentCity }) => {
  return (
    <footer className="border-t border-neutral-200/70 bg-[#fbf9f8] pt-12 pb-16 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-10 border-b border-neutral-200/70">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#85142f] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                BookKaro
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed">
              Your next unforgettable moment starts here. <br />
              Discover the best movies, concerts, and live experiences in {currentCity}.
            </p>
          </div>

          {/* Links Column 1: Explore */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <a href="#movies" className="hover:text-[#85142f] transition-colors">
                  Movies
                </a>
              </li>
              <li>
                <a href="#trending" className="hover:text-[#85142f] transition-colors">
                  Concerts & festivals
                </a>
              </li>
              <li>
                <a href="#trending" className="hover:text-[#85142f] transition-colors">
                  Sports & live events
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: BookKaro */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              BookKaro
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <a href="#about" className="hover:text-[#85142f] transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#list-event" className="hover:text-[#85142f] transition-colors">
                  List your event
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-[#85142f] transition-colors">
                  Contact & support
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Follow along */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Follow along
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#85142f] transition-colors"
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
                  className="inline-flex items-center gap-1 hover:text-[#85142f] transition-colors"
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
                  className="inline-flex items-center gap-1 hover:text-[#85142f] transition-colors"
                >
                  <span>YouTube</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>© 2026 BookKaro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#85142f] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#85142f] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
