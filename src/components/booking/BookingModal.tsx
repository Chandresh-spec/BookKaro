'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, MapPin, Calendar, Clock, CheckCircle2, Ticket, ChevronRight, Layers } from 'lucide-react';
import { Movie, LiveEvent } from '@/types';
import { SportEvent } from '@/types/sports';
import { useOptionalAccount } from '@/context/AccountContext';

interface ModalCategoryItem {
  id: string;
  name: string;
  price: number;
  distance?: string;
  perks?: string[];
}

interface BookingModalProps {
  item: Movie | LiveEvent | SportEvent | any | null;
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [generatedBookingId, setGeneratedBookingId] = useState<string>('');
  const account = useOptionalAccount();

  const isMovie = item ? 'genre' in item : false;
  const isSport = item ? 'sportType' in item || 'bookingMode' in item : false;

  // Extract categories if available (e.g. participation categories or ticket categories)
  const categories: ModalCategoryItem[] = useMemo(() => {
    if (!item) return [];
    if (item.participationCategories && Array.isArray(item.participationCategories)) {
      return item.participationCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        price: c.fee,
        distance: c.distance,
      }));
    }
    if (item.ticketCategories && Array.isArray(item.ticketCategories)) {
      return item.ticketCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        price: c.price,
        perks: c.perks,
      }));
    }
    return [];
  }, [item]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    } else {
      setSelectedCategoryId('');
    }
  }, [categories]);

  if (!isOpen || !item) return null;

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const unitPrice = activeCategory
    ? activeCategory.price
    : isMovie
    ? 350
    : item.startingPrice || 399;

  const totalAmount = unitPrice * ticketCount;
  const showtimes = ['11:00 AM', '02:30 PM', '06:45 PM', '10:00 PM'];

  const categoryLabel = isMovie
    ? null
    : item.sportType || item.category || 'EVENT';

  const venueLabel = isMovie
    ? (item as Movie).languages?.join(', ')
    : item.venue || currentCity;

  const handleBooking = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const newBookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedBookingId(newBookingId);
    if (account && item) {
      account.addOrder({
        id: 'ord-' + Date.now(),
        bookingId: newBookingId,
        type: isMovie ? 'movie' : isSport ? 'sport' : 'event',
        title: item.title,
        subtitle: isMovie
          ? (item as Movie).genre || 'Movie'
          : item.category || item.sportType || 'Live Experience',
        posterImage: item.posterImage || item.image,
        venue: venueLabel,
        city: currentCity,
        date: isMovie ? 'Today' : item.date || 'Upcoming',
        time: isMovie ? selectedShowtime : item.time || '06:00 PM',
        seatsOrTier: activeCategory ? activeCategory.name : `${ticketCount} Standard Seats`,
        quantity: ticketCount,
        ticketPrice: totalAmount,
        convenienceFee: Math.round(totalAmount * 0.08),
        donationAmount: account.preferences.autoRoundupCharity ? 1 : 0,
        discountAmount: 0,
        totalPaid:
          totalAmount +
          Math.round(totalAmount * 0.08) +
          (account.preferences.autoRoundupCharity ? 1 : 0),
        paymentMethod: 'Simulated Checkout',
        status: 'CONFIRMED',
        isUpcoming: true,
        deliveryType: 'M-Ticket',
        bookedAt: 'Just now',
        canCancel: true,
        itemHref: isMovie
          ? `/movies/${item.id}`
          : isSport
          ? `/sports/${item.id}`
          : `/events/${item.id}`,
      });
    }
    setIsSubmitting(false);
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isBooked ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-[#85142f]/10 text-[#85142f] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-xs">
              Your tickets for <strong className="text-neutral-800">{item.title}</strong> have been reserved.
            </p>

            <div className="w-full bg-[#fbf9f8] rounded-2xl p-4 border border-neutral-200/70 text-left space-y-2 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Category / Seats:</span>
                <span className="font-semibold text-neutral-900">
                  {activeCategory ? activeCategory.name : `${ticketCount} Seats`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tickets Count:</span>
                <span className="font-semibold text-neutral-900">{ticketCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Time:</span>
                <span className="font-semibold text-neutral-900">
                  {isMovie ? selectedShowtime : item.time || '05:30 AM'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-bold text-[#85142f]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px] pt-1.5 border-t border-neutral-200">
                <span>Booking ID:</span>
                <span className="font-mono text-neutral-700">
                  {generatedBookingId || 'BK-928401'}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/profile/orders"
                onClick={handleReset}
                className="flex-1 py-3 border border-[#85142f] text-[#85142f] font-bold rounded-xl hover:bg-rose-50 transition-colors text-center text-sm"
              >
                View in Your Orders
              </Link>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-[#85142f] text-white font-bold rounded-xl hover:bg-[#701027] transition-colors cursor-pointer text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Media */}
            <div className="relative aspect-[16/8] w-full bg-neutral-900">
              <Image
                src={isMovie ? (item as Movie).posterImage : item.image}
                alt={item.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  {isMovie ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{(item as Movie).rating}</span>
                    </div>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#85142f] text-white text-[10px] font-black uppercase tracking-wider">
                      {categoryLabel}
                    </span>
                  )}
                  <span className="text-xs text-white/90 font-medium truncate">
                    {venueLabel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Location & Details pill */}
              <div className="flex flex-wrap items-center gap-3.5 text-xs text-neutral-600 bg-[#fbf9f8] p-3 rounded-xl border border-neutral-200/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
                  <span>{currentCity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isMovie ? 'Today, Next Showing' : item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {isMovie
                      ? (item as Movie).duration || '2h 30m'
                      : item.time || '05:30 AM'}
                  </span>
                </div>
              </div>

              {/* Category Selector (for sports events with multiple categories) */}
              {categories.length > 1 && (
                <div>
                  <label className="block text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-2">
                    Select Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedCategoryId === cat.id
                            ? 'bg-[#85142f] text-white border-[#85142f] shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {cat.name} (₹{cat.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                        className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
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
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Tickets
                </label>
                <div className="flex items-center justify-between p-3.5 bg-[#fbf9f8] rounded-xl border border-neutral-200/80">
                  <span className="text-xs sm:text-sm font-medium text-neutral-700">
                    {activeCategory ? activeCategory.name : 'Standard Admission'} (₹{unitPrice} / seat)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={ticketCount <= 1}
                      onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer shadow-2xs hover:bg-neutral-50 transition-all"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-neutral-950 w-4 text-center">
                      {ticketCount}
                    </span>
                    <button
                      type="button"
                      disabled={ticketCount >= 10}
                      onClick={() => setTicketCount((c) => Math.min(10, c + 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-800 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer shadow-2xs hover:bg-neutral-50 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Reserved Stadium Seating Link (if applicable) */}
              {item.bookingMode === 'reserved-seating' && (
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Want to choose stands & numbered seats?</span>
                  <Link
                    href={`/sports/${item.id}/book`}
                    className="text-[#85142f] font-extrabold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Stadium Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

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
                <div className="text-lg sm:text-xl font-extrabold text-[#85142f]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#85142f] hover:bg-[#701027] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:bg-neutral-400 cursor-pointer"
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
