'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, MapPin, Calendar, Clock, CheckCircle2, Ticket } from 'lucide-react';
import { Movie, LiveEvent } from '@/types';

interface BookingModalProps {
  item: Movie | LiveEvent | null;
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  item,
  isOpen,
  onClose,
  currentCity,
}) => {
  const [selectedShowtime, setSelectedShowtime] = useState('06:45 PM');
  const [ticketCount, setTicketCount] = useState(2);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const isMovie = 'rating' in item;
  const unitPrice = isMovie ? 350 : (item as LiveEvent).startingPrice;
  const totalAmount = unitPrice * ticketCount;
  const showtimes = ['11:00 AM', '02:30 PM', '06:45 PM', '10:00 PM'];

  const handleBooking = async () => {
    setIsSubmitting(true);
    // Simulate booking API request (Ready to hook to FastAPI POST /api/v1/bookings)
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isBooked ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-xs">
              Your tickets for <strong className="text-neutral-800">{item.title}</strong> have been secured.
            </p>

            <div className="w-full bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-left space-y-2 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Tickets:</span>
                <span className="font-semibold text-neutral-900">{ticketCount} Seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Time:</span>
                <span className="font-semibold text-neutral-900">{isMovie ? selectedShowtime : (item as LiveEvent).time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-bold text-neutral-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px] pt-1 border-t border-neutral-200/60">
                <span>FastAPI Booking ID:</span>
                <span className="font-mono">BK-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-neutral-950 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header Media */}
            <div className="relative aspect-[16/8] w-full bg-neutral-900">
              <Image
                src={isMovie ? (item as Movie).bannerImage || (item as Movie).posterImage : (item as LiveEvent).image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  {isMovie ? (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{(item as Movie).rating}</span>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white text-neutral-950 text-[10px] font-bold uppercase">
                      {(item as LiveEvent).category}
                    </span>
                  )}
                  <span className="text-[11px] text-white/80 font-medium">
                    {isMovie ? (item as Movie).genres.join(', ') : (item as LiveEvent).venue}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Location & Details pill */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{currentCity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isMovie ? 'Today, Next Showing' : (item as LiveEvent).date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isMovie ? (item as Movie).duration || '2h 30m' : (item as LiveEvent).time}</span>
                </div>
              </div>

              {/* Showtime Selector (for movies) */}
              {isMovie && (
                <div>
                  <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                    Select Showtime
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {showtimes.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedShowtime(st)}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          selectedShowtime === st
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket Quantity */}
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                  Tickets
                </label>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-xs sm:text-sm font-medium text-neutral-700">
                    Standard Admission (₹{unitPrice} / seat)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={ticketCount <= 1}
                      onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-neutral-950 w-4 text-center">
                      {ticketCount}
                    </span>
                    <button
                      type="button"
                      disabled={ticketCount >= 10}
                      onClick={() => setTicketCount((c) => Math.min(10, c + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Backend Integration Note badge */}
              <div className="p-3 bg-neutral-100/70 rounded-xl text-[11px] text-neutral-600 flex items-start gap-2 border border-neutral-200/50">
                <Ticket className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">Backend Ready: </span>
                  Ready to connect with your FastAPI endpoint (<code className="bg-neutral-200/70 px-1 py-0.5 rounded text-[10px]">POST /api/v1/bookings</code>).
                </div>
              </div>

            </div>

            {/* Modal Footer / Checkout */}
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-500 font-medium">Total Amount</div>
                <div className="text-lg font-extrabold text-neutral-950">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:bg-neutral-600"
              >
                {isSubmitting ? 'Reserving...' : 'Book Tickets'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
