'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Edit2,
  Accessibility,
  Plus,
  Minus,
  Check,
  Info,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { Movie, CinemaShowtime } from '@/types';

interface SeatItem {
  id: string; // e.g. "L-18"
  row: string; // "L"
  col: number; // 18
  displayNum: string; // "18"
  category: 'RECLINER' | 'PICTURE_PERFECT' | 'PRIME' | 'CLASSIC_PLUS' | 'EXTRA_LEGROOM';
  price: number;
  isWheelchair?: boolean;
  status: 'available' | 'sold' | 'bestseller';
}

interface CinemaSeatLayoutProps {
  movie: Movie;
  cinemaName: string;
  selectedDate: string; // e.g. "Fri, 20 November, 2026"
  showtime: string; // e.g. "06:05 PM"
  format?: string; // e.g. "3D" or "2D"
  language?: string; // e.g. "Hindi"
  availableShowtimes?: Array<{ time: string; format?: string; price?: number }>;
  onBack: () => void;
  onBookingComplete?: (bookingDetails: any) => void;
}

export const CinemaSeatLayout: React.FC<CinemaSeatLayoutProps> = ({
  movie,
  cinemaName,
  selectedDate,
  showtime: initialShowtime,
  format = '3D',
  language = 'Hindi',
  availableShowtimes = [
    { time: '10:15 AM', format: 'PXL' },
    { time: '02:10 PM', format: 'PXL' },
    { time: '06:05 PM', format: 'PXL' },
  ],
  onBack,
  onBookingComplete,
}) => {
  const [currentShowtime, setCurrentShowtime] = useState(initialShowtime || '06:05 PM');
  const [targetTicketCount, setTargetTicketCount] = useState(2);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  // Initial selected seats matching screenshot (L18, L19)
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['L-18', 'L-19']);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to center on mount for mobile view so users see the selected seats
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll slightly to reveal center aisles if on mobile
      const scrollTarget = (container.scrollWidth - container.clientWidth) / 2;
      if (scrollTarget > 0) {
        container.scrollLeft = scrollTarget;
      }
    }
  }, []);

  // Dynamic offers banner
  const offers = [
    'YES Private Debit Card Offer: 10% instant discount up to ₹150',
    'ICICI Bank Credit Card Offer: Buy 1 Get 1 free on select cards',
    'BookKaro Super Saver: Use code BK2026 to get ₹75 off F&B',
  ];

  // Helper to determine seat category & price
  const getCategoryAndPrice = (
    row: string,
    col: number
  ): { category: SeatItem['category']; price: number } => {
    if (row === 'N') {
      return { category: 'RECLINER', price: 870 };
    }
    if (row === 'D') {
      return { category: 'EXTRA_LEGROOM', price: 420 };
    }
    if (['M', 'L', 'K', 'J'].includes(row)) {
      if (col >= 12 && col <= 19) {
        return { category: 'PICTURE_PERFECT', price: 530 };
      }
      return { category: 'PRIME', price: 480 };
    }
    if (['H', 'G'].includes(row)) {
      if (col >= 12 && col <= 19) {
        return { category: 'PICTURE_PERFECT', price: 530 };
      }
      return { category: 'CLASSIC_PLUS', price: 410 };
    }
    // Rows F, E
    return { category: 'CLASSIC_PLUS', price: 410 };
  };

  // Generate initial seating layout matching the screenshot closely
  const allSeats: Record<string, SeatItem> = useMemo(() => {
    const seats: Record<string, SeatItem> = {};

    // Rows configuration: row letter and column ranges
    const rowConfig: Array<{ row: string; left: number[]; mid: number[]; right: number[] }> = [
      {
        row: 'N',
        left: [1, 2],
        mid: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        right: [15, 16, 17, 18, 19, 20],
      },
      {
        row: 'M',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'L',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'K',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'J',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'H',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'G',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'F',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'E',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
      {
        row: 'D',
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        mid: [12, 13, 14, 15, 16, 17, 18, 19],
        right: [20, 21, 22, 23, 24, 25, 26],
      },
    ];

    // Known available seats from the screenshot to match 100%
    const explicitlyAvailable = new Set([
      'N-1', 'N-2', 'N-5', 'N-20',
      'M-1', 'M-19', 'M-24', 'M-25', 'M-26',
      'L-1', 'L-2', 'L-18', 'L-19', 'L-24', 'L-25', 'L-26',
      'K-1', 'K-2', 'K-24', 'K-25', 'K-26',
      'J-1', 'J-2', 'J-3', 'J-24', 'J-25', 'J-26',
      'H-3', 'H-17', 'H-18', 'H-19', 'H-20', 'H-21', 'H-22', 'H-23', 'H-24', 'H-25', 'H-26',
      'G-1', 'G-2', 'G-3', 'G-8', 'G-20', 'G-21', 'G-22', 'G-23', 'G-24', 'G-25', 'G-26',
      'F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-17', 'F-18', 'F-19', 'F-20', 'F-21', 'F-22', 'F-23', 'F-24', 'F-25', 'F-26',
      'E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-16', 'E-17', 'E-18', 'E-19', 'E-20', 'E-21', 'E-22', 'E-23', 'E-24', 'E-25', 'E-26',
      'D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6', 'D-7', 'D-8', 'D-12', 'D-13', 'D-14', 'D-15', 'D-16', 'D-17', 'D-18', 'D-19', 'D-20', 'D-21', 'D-22', 'D-23', 'D-24', 'D-25', 'D-26',
    ]);

    rowConfig.forEach(({ row, left, mid, right }) => {
      const allCols = [...left, ...mid, ...right];
      allCols.forEach((col) => {
        const id = `${row}-${col}`;
        const { category, price } = getCategoryAndPrice(row, col);
        const isWheelchair = row === 'D' && (col === 1 || col === 2 || col === 12 || col === 13);
        const isAvail = explicitlyAvailable.has(id);
        const isBestseller = row === 'L' && (col === 18 || col === 19);

        seats[id] = {
          id,
          row,
          col,
          displayNum: col < 10 ? `0${col}` : `${col}`,
          category,
          price,
          isWheelchair,
          status: isBestseller ? 'bestseller' : isAvail ? 'available' : 'sold',
        };
      });
    });

    return seats;
  }, []);

  // Calculate total price based on currently selected seats
  const selectedSeatsInfo = useMemo(() => {
    return selectedSeatIds.map((id) => allSeats[id]).filter(Boolean);
  }, [selectedSeatIds, allSeats]);

  const totalPrice = useMemo(() => {
    return selectedSeatsInfo.reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeatsInfo]);

  // Handle seat click
  const handleSeatClick = (seat: SeatItem) => {
    if (seat.status === 'sold') return;

    if (selectedSeatIds.includes(seat.id)) {
      // Deselect
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      // Select
      if (selectedSeatIds.length >= targetTicketCount) {
        setSelectedSeatIds((prev) => [...prev.slice(1), seat.id]);
      } else {
        setSelectedSeatIds((prev) => [...prev, seat.id]);
      }
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.35));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.65));

  // Render an individual seat box
  const renderSeat = (seat: SeatItem) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isSold = seat.status === 'sold';
    const isBestseller = seat.status === 'bestseller';

    let styling =
      'border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 hover:shadow-xs';

    if (isSold) {
      styling = 'border border-neutral-200 bg-neutral-200/90 text-neutral-400 cursor-not-allowed select-none';
    } else if (isSelected) {
      styling = 'border border-emerald-600 bg-[#1ea838] text-white shadow-xs font-semibold scale-105';
    } else if (isBestseller) {
      styling = 'border border-amber-500 text-amber-700 bg-white hover:bg-amber-50';
    }

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={isSold}
        title={`${seat.row}${seat.displayNum} • ₹${seat.price} (${seat.category})`}
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] text-[10px] sm:text-[11px] font-medium flex items-center justify-center transition-all cursor-pointer shrink-0 ${styling}`}
      >
        {seat.isWheelchair ? (
          <Accessibility className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
        ) : (
          seat.displayNum
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-neutral-900 flex flex-col font-sans select-none relative">
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          {/* Back & Movie Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="p-1 -ml-1 sm:p-1.5 sm:-ml-1.5 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer shrink-0"
              aria-label="Back to showtimes"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-base font-bold text-neutral-900 leading-tight truncate">
                {movie.title} ({format})({language}) - {language}
              </h1>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-normal truncate mt-0.5">
                {cinemaName} | {selectedDate} | {currentShowtime}
              </p>
            </div>
          </div>

          {/* Right Controls: Wheelchair & Ticket Count */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 hover:border-neutral-400 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer shrink-0"
              title="Wheelchair accessibility info"
            >
              <Accessibility className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
            </button>

            <button
              onClick={() => setIsCountModalOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-[#f84464] text-[#f84464] hover:bg-[#f84464]/5 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{targetTicketCount} Tickets</span>
            </button>
          </div>
        </div>

        {/* 2. SHOWTIMES HORIZONTAL PILLS STRIP */}
        <div className="border-t border-neutral-100 bg-white px-3 sm:px-6 py-1.5 sm:py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            {availableShowtimes.map((st) => {
              const isActive = currentShowtime.toUpperCase().includes(st.time.toUpperCase());
              return (
                <button
                  key={st.time}
                  onClick={() => setCurrentShowtime(st.time)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[5px] text-center min-w-[84px] sm:min-w-[96px] text-xs transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#1ea838] text-white shadow-xs font-semibold'
                      : 'border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50 font-medium'
                  }`}
                >
                  <div className="leading-tight text-[11px] sm:text-xs">{st.time}</div>
                  <div
                    className={`text-[8.5px] sm:text-[9px] uppercase tracking-wider font-semibold ${
                      isActive ? 'text-white/90' : 'text-neutral-500'
                    }`}
                  >
                    {st.format || 'PXL'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. SEATING CANVAS AREA WITH NATURAL HORIZONTAL & VERTICAL SCROLL */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-auto w-full relative touch-pan-x touch-pan-y"
      >
        <div className="w-full min-w-max px-4 pt-3 pb-36 flex flex-col items-center">
          {/* Mobile Swipe Hint Banner */}
          <div className="sm:hidden mb-2 text-center text-[10px] text-neutral-400 font-medium flex items-center justify-center gap-1.5">
            <span>↔ Swipe left or right to view all seats</span>
          </div>

          <div
            style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200 ease-out flex flex-col items-center w-[840px] max-w-[920px]"
          >
            {/* TIER 1: ₹870 RECLINER ROWS */}
            <div className="w-full mb-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] bg-neutral-200 flex-1" />
                <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  ₹870 RECLINER ROWS
                </span>
                <div className="h-[1px] bg-neutral-200 flex-1" />
              </div>

              {/* Row N with Row Letters on both sides */}
              <div className="flex items-center justify-between gap-3">
                <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">N</span>
                <div className="flex items-center justify-center gap-6 sm:gap-10 flex-1">
                  {/* Left 01-02 */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[1, 2].map((c) => renderSeat(allSeats[`N-${c}`]))}
                  </div>
                  {/* Mid 03-14 */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((c) =>
                      renderSeat(allSeats[`N-${c}`])
                    )}
                  </div>
                  {/* Right 15-20 */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[15, 16, 17, 18, 19, 20].map((c) => renderSeat(allSeats[`N-${c}`]))}
                  </div>
                </div>
                <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">N</span>
              </div>
            </div>

            {/* TIER 2: PRIME ROWS & PICTURE PERFECT */}
            <div className="w-full mb-7">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3 text-center">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] bg-neutral-200 flex-1" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                    ₹480 PRIME ROWS
                  </span>
                  <div className="h-[1px] bg-neutral-200 w-4" />
                </div>

                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-600 uppercase px-2">
                  ₹530 PICTURE PERFECT
                </span>

                <div className="flex items-center gap-2">
                  <div className="h-[1px] bg-neutral-200 w-4" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                    ₹480 PRIME ROWS
                  </span>
                  <div className="h-[1px] bg-neutral-200 flex-1" />
                </div>
              </div>

              {/* Rows M, L, K, J */}
              <div className="space-y-2">
                {['M', 'L', 'K', 'J'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-between gap-3">
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                    <div className="flex items-center justify-center gap-4 sm:gap-7 flex-1">
                      {/* Left: 01 to 11 */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      {/* Middle: 12 to 19 */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[12, 13, 14, 15, 16, 17, 18, 19].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      {/* Right: 20 to 26 */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[20, 21, 22, 23, 24, 25, 26].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                    </div>
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER 3: ₹410 CLASSIC PLUS ROWS & ₹530 PICTURE PERFECT */}
            <div className="w-full mb-7">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3 text-center">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] bg-neutral-200 flex-1" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                    ₹410 CLASSIC PLUS ROWS
                  </span>
                  <div className="h-[1px] bg-neutral-200 w-4" />
                </div>

                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-600 uppercase px-2">
                  ₹530 PICTURE PERFECT
                </span>

                <div className="flex items-center gap-2">
                  <div className="h-[1px] bg-neutral-200 w-4" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 uppercase whitespace-nowrap">
                    ₹410 CLASSIC PLUS ROWS
                  </span>
                  <div className="h-[1px] bg-neutral-200 flex-1" />
                </div>
              </div>

              {/* Rows H, G */}
              <div className="space-y-2">
                {['H', 'G'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-between gap-3">
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                    <div className="flex items-center justify-center gap-4 sm:gap-7 flex-1">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[12, 13, 14, 15, 16, 17, 18, 19].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[20, 21, 22, 23, 24, 25, 26].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                    </div>
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER 4: ₹410 CLASSIC PLUS ROWS (F, E) */}
            <div className="w-full mb-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] bg-neutral-200 flex-1" />
                <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  ₹410 CLASSIC PLUS ROWS
                </span>
                <div className="h-[1px] bg-neutral-200 flex-1" />
              </div>

              {/* Rows F, E */}
              <div className="space-y-2">
                {['F', 'E'].map((rowLetter) => (
                  <div key={rowLetter} className="flex items-center justify-between gap-3">
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                    <div className="flex items-center justify-center gap-4 sm:gap-7 flex-1">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[12, 13, 14, 15, 16, 17, 18, 19].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[20, 21, 22, 23, 24, 25, 26].map((c) =>
                          renderSeat(allSeats[`${rowLetter}-${c}`])
                        )}
                      </div>
                    </div>
                    <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">
                      {rowLetter}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER 5: ₹420 EXTRA LEGROOM ROWS (Row D) */}
            <div className="w-full mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] bg-neutral-200 flex-1" />
                <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  ₹420 EXTRA LEGROOM ROWS
                </span>
                <div className="h-[1px] bg-neutral-200 flex-1" />
              </div>

              {/* Row D with Wheelchair icons */}
              <div className="flex items-center justify-between gap-3">
                <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">D</span>
                <div className="flex items-center justify-center gap-4 sm:gap-7 flex-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) =>
                      renderSeat(allSeats[`D-${c}`])
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[12, 13, 14, 15, 16, 17, 18, 19].map((c) =>
                      renderSeat(allSeats[`D-${c}`])
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[20, 21, 22, 23, 24, 25, 26].map((c) =>
                      renderSeat(allSeats[`D-${c}`])
                    )}
                  </div>
                </div>
                <span className="w-5 text-xs font-bold text-neutral-600 text-center shrink-0">D</span>
              </div>
            </div>

            {/* SCREEN BAR REPRESENTATION */}
            <div className="w-full max-w-md flex flex-col items-center mt-2 mb-6">
              <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#2dc492] to-transparent rounded-full shadow-[0_2px_8px_rgba(45,196,146,0.3)] mb-2" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">
                All eyes this way please! Screen
              </p>
            </div>
          </div>
        </div>

        {/* FLOATING ZOOM CONTROLS - Positioned cleanly so they never cover seats or footer */}
        <div className="fixed right-3 sm:right-6 bottom-28 sm:bottom-32 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs rounded-full shadow-md border border-neutral-200 p-1">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <div className="h-[1px] bg-neutral-200 mx-1" />
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </main>

      {/* 4. BOTTOM STICKY ACTION & LEGEND BAR */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {/* Legend Row - Responsive spacing */}
        <div className="max-w-4xl mx-auto px-3 py-1.5 sm:py-2 border-b border-neutral-100 flex items-center justify-center gap-3 sm:gap-10 text-[10px] sm:text-xs text-neutral-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border border-emerald-500 bg-white" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-neutral-200" />
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border border-amber-500 bg-white" />
            <span className="flex items-center gap-0.5">
              Bestseller <Info className="w-3 h-3 text-neutral-400" />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-[#1ea838]" />
            <span>Selected</span>
          </div>
        </div>

        {/* Offers Strip - Compact for mobile */}
        <div className="bg-[#fbfbfb] px-3 sm:px-4 py-1 sm:py-1.5 border-b border-neutral-100 text-[10px] sm:text-xs text-neutral-700 flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px] sm:text-[10px] shrink-0">
              ✓
            </div>
            <span className="font-medium text-neutral-800 truncate">
              {offers[activeOfferIndex]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
              {activeOfferIndex + 1}/{offers.length}
            </span>
            <button
              onClick={() => setActiveOfferIndex((prev) => (prev + 1) % offers.length)}
              className="text-neutral-400 hover:text-neutral-700 text-xs px-1 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        {/* Primary Checkout CTA */}
        <div className="max-w-md mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
          <button
            onClick={() => setIsSuccessModalOpen(true)}
            disabled={selectedSeatIds.length === 0}
            className={`w-full py-2.5 sm:py-3 px-6 rounded-lg font-bold text-sm sm:text-base text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSeatIds.length > 0
                ? 'bg-[#f84464] hover:bg-[#e03756] active:scale-[0.99]'
                : 'bg-neutral-300 cursor-not-allowed text-neutral-500'
            }`}
          >
            {selectedSeatIds.length > 0 ? (
              <>Pay ₹ {totalPrice.toLocaleString('en-IN')}</>
            ) : (
              'Select seats to proceed'
            )}
          </button>
        </div>
      </footer>

      {/* 5. TICKET COUNT SELECTOR MODAL */}
      {isCountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-neutral-100 text-center relative">
            <button
              onClick={() => setIsCountModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 mb-1">How many seats?</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Select ticket quantity to easily pick adjacent seats
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setTargetTicketCount(num);
                    setIsCountModalOpen(false);
                  }}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    targetTicketCount === num
                      ? 'bg-[#f84464] text-white shadow-md scale-105'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-4 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>RECLINER</span>
                <span className="font-semibold text-neutral-900">₹870</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>PICTURE PERFECT</span>
                <span className="font-semibold text-neutral-900">₹530</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>PRIME ROWS</span>
                <span className="font-semibold text-neutral-900">₹480</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>CLASSIC PLUS</span>
                <span className="font-semibold text-neutral-900">₹410</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>EXTRA LEGROOM</span>
                <span className="font-semibold text-neutral-900">₹420</span>
              </div>
            </div>

            <button
              onClick={() => setIsCountModalOpen(false)}
              className="mt-6 w-full py-2.5 bg-[#f84464] text-white font-bold text-xs rounded-lg hover:bg-[#e03756] transition-colors cursor-pointer"
            >
              Select Seats
            </button>
          </div>
        </div>
      )}

      {/* 6. BOOKING CONFIRMED MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl border border-neutral-100 relative text-center">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1">Booking Confirmed!</h3>
            <p className="text-xs text-neutral-500 mb-5 sm:mb-6">
              Your tickets are confirmed and ready on BookKaro
            </p>

            {/* Ticket Card Details */}
            <div className="bg-[#fbf9f8] rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 text-left space-y-2 text-xs mb-5 sm:mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <div>
                  <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{movie.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500">
                    {format} • {language}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                  CONFIRMED
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Cinema:</span>
                <span className="font-semibold text-neutral-800 text-right truncate max-w-[200px]">{cinemaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date & Showtime:</span>
                <span className="font-semibold text-neutral-800 text-right">
                  {selectedDate} | {currentShowtime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Seats ({selectedSeatIds.length}):</span>
                <span className="font-bold text-[#1ea838] text-right">
                  {selectedSeatIds.map((id) => id.replace('-', '')).join(', ')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-xs sm:text-sm">
                <span className="font-bold text-neutral-800">Total Paid:</span>
                <span className="font-bold text-[#f84464]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                <span>FastAPI Booking ID:</span>
                <span className="font-mono text-neutral-600 font-semibold">
                  BK-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  if (onBookingComplete) {
                    onBookingComplete({
                      movie,
                      cinemaName,
                      showtime: currentShowtime,
                      seats: selectedSeatIds,
                      totalPrice,
                    });
                  }
                }}
                className="flex-1 py-2.5 sm:py-3 bg-[#f84464] text-white font-bold rounded-xl hover:bg-[#e03756] transition-colors cursor-pointer text-xs sm:text-sm"
              >
                Done
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
