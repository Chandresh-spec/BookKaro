'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { BookingConfirmationResult } from '@/types/booking';
import { LiveEvent } from '@/types/event';

interface BookingConfirmationProps {
  confirmation: BookingConfirmationResult;
  event: LiveEvent;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  confirmation,
  event,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
      {/* Top Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
          Booking Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          Booking Reference ID:{' '}
          <span className="font-extrabold text-neutral-900 font-mono">
            {confirmation.bookingId}
          </span>
        </p>
      </div>

      {/* Main Ticket Pass Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xl">
        {/* Ticket Header */}
        <div className="bg-[#85142f] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 block mb-1">
              OFFICIAL LIVE EVENT PASS
            </span>
            <h3 className="text-lg sm:text-xl font-black leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-rose-100 mt-1">
              {event.date} {event.time ? `• ${event.time}` : ''}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center bg-neutral-100 px-4 py-2 border-y border-dashed border-neutral-300">
          <div className="w-4 h-4 rounded-full bg-[#fafafc] -ml-6 border-r border-neutral-300" />
          <div className="flex-1 text-center text-[10px] uppercase font-mono tracking-widest text-neutral-400">
            • • • • • • • • SCAN AT TURNSTILE GATE • • • • • • • •
          </div>
          <div className="w-4 h-4 rounded-full bg-[#fafafc] -mr-6 border-l border-neutral-300" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left Items Breakdown */}
            <div className="space-y-3 flex-1 text-xs">
              <div className="flex items-start gap-2 text-neutral-600">
                <MapPin className="w-4 h-4 text-[#85142f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-neutral-900">{event.venue}</span>
                  <span className="text-neutral-500">{event.city}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-neutral-400 block tracking-wider">
                  Reserved Seats / Passes
                </span>
                {confirmation.items.map((item) => (
                  <div key={item.id} className="flex justify-between font-bold text-neutral-800">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between font-black text-sm text-neutral-950 pt-1">
                <span>Total Paid (Simulated)</span>
                <span className="text-[#85142f]">
                  ₹{confirmation.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Right Mock QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 shrink-0">
              <div className="w-32 h-32 bg-white rounded-xl border border-neutral-200 p-2 flex items-center justify-center shadow-inner">
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  <rect x="35" y="10" width="10" height="15" fill="currentColor" />
                  <rect x="50" y="5" width="15" height="10" fill="currentColor" />
                  <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                  <rect x="70" y="35" width="10" height="25" fill="currentColor" />
                  <rect x="85" y="45" width="10" height="15" fill="currentColor" />
                  <rect x="35" y="75" width="25" height="10" fill="currentColor" />
                  <rect x="65" y="70" width="25" height="25" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 mt-2 font-mono">
                {confirmation.bookingId}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions inside card */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Delivery: {confirmation.deliveryType === 'home_delivery' ? 'Home Courier' : 'Digital QR'}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 font-bold text-neutral-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Return to Discovery CTA */}
      <div className="text-center pt-2">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-md hover:bg-[#6c0f25] transition-all"
        >
          <span>Explore More Live Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
