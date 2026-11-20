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

  const isMovie = 'genre' in item;
  const unitPrice = isMovie ? 350 : (item as LiveEvent).startingPrice;
  const totalAmount = unitPrice * ticketCount;
  const showtimes = ['11:00 AM', '02:30 PM', '06:45 PM', '10:00 PM'];

  const handleBooking = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isBooked ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-14 h-14 rounded-xl bg-[#85142f]/10 text-[#85142f] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-xs leading-relaxed">
              Your tickets for <strong className="text-neutral-800">{item.title}</strong> have been reserved.
            </p>

            <div className="w-full bg-[#fbf9f8] rounded-xl p-4 border border-neutral-200/70 text-left space-y-2 mb-6 text-xs sm:text-sm">
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
                <span className="font-bold text-[#85142f]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px] pt-1.5 border-t border-neutral-200">
                <span>FastAPI Booking ID:</span>
                <span className="font-mono text-neutral-700">BK-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#85142f] text-white font-bold rounded-lg hover:bg-[#6e1026] transition-colors cursor-pointer btn-press"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header Media */}
            <div className="relative aspect-[16/8] w-full bg-neutral-900">
              <Image
                src={isMovie ? (item as Movie).posterImage : (item as LiveEvent).image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  {isMovie ? (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{(item as Movie).rating}</span>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#85142f] text-white text-[10px] font-bold uppercase">
                      {(item as LiveEvent).category}
                    </span>
                  )}
                  <span className="text-xs text-white/90 font-medium">
                    {isMovie ? (item as Movie).languages.join(', ') : (item as LiveEvent).venue}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Location & Details pill */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 bg-[#fbf9f8] p-3 rounded-xl border border-neutral-200/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
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
                  <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider mb-2">
                    Select Showtime
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {showtimes.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedShowtime(st)}
                        className={`py-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          selectedShowtime === st
                            ? 'bg-[#85142f] text-white border-[#85142f] shadow-xs'
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
                <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider mb-2">
                  Tickets
                </label>
                <div className="flex items-center justify-between p-3.5 bg-[#fbf9f8] rounded-xl border border-neutral-200/80">
                  <span className="text-xs sm:text-sm font-medium text-neutral-700">
                    Standard Admission (₹{unitPrice} / seat)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={ticketCount <= 1}
                      onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
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
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Backend Integration Note badge */}
              <div className="p-3 bg-[#85142f]/5 rounded-xl text-[11px] text-neutral-600 flex items-start gap-2 border border-[#85142f]/10">
                <Ticket className="w-4 h-4 text-[#85142f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">Backend Ready: </span>
                  Ready to connect with your FastAPI endpoint (<code className="bg-[#85142f]/10 px-1 py-0.5 rounded text-[10px] text-[#85142f]">POST /api/v1/bookings</code>).
                </div>
              </div>

            </div>

            {/* Modal Footer / Checkout */}
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-[#fbf9f8] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-500 font-medium">Total Amount</div>
                <div className="text-lg font-black text-[#85142f]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#85142f] hover:bg-[#6e1026] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-sm active:scale-95 disabled:bg-neutral-400 cursor-pointer btn-press"
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
