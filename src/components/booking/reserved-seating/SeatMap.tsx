'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Accessibility,
  AlertCircle,
} from 'lucide-react';
import { StadiumStand, StadiumBlock, StadiumSeat } from '@/types/venue';
import { SelectedTicketItem } from '@/types/booking';
import { generateBlockSeats } from '@/data/mockInventory';
import { SeatLegend } from './SeatLegend';

interface SeatMapProps {
  stand: StadiumStand;
  block: StadiumBlock;
  selectedItems: SelectedTicketItem[];
  onToggleSeat: (seat: StadiumSeat, stand: StadiumStand, block: StadiumBlock) => void;
  onBackToBlocks: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  stand,
  block,
  selectedItems,
  onToggleSeat,
  onBackToBlocks,
}) => {
  const [scale, setScale] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState<StadiumSeat | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lazy-load seats for this block
  const seats: StadiumSeat[] = useMemo(() => {
    return generateBlockSeats(block.id, block.tier, block.basePrice);
  }, [block.id, block.tier, block.basePrice]);

  const selectedSeatIds = useMemo(() => {
    return new Set(selectedItems.map((item) => item.id));
  }, [selectedItems]);

  const handleSeatClick = (seat: StadiumSeat) => {
    if (seat.status === 'sold') {
      showToast('This seat has already been booked by another fan.');
      return;
    }
    if (seat.status === 'held') {
      showToast('This seat is temporarily locked in another user checkout.');
      return;
    }
    if (seat.status === 'blocked') {
      showToast('This seat is reserved for camera and sound mixing operations.');
      return;
    }

    const isCurrentlySelected = selectedSeatIds.has(seat.id);
    if (!isCurrentlySelected && selectedItems.length >= 6) {
      showToast('Maximum 6 tickets allowed per order for fair booking access.');
      return;
    }

    onToggleSeat(seat, stand, block);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.0));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75));
  const handleResetZoom = () => setScale(1);

  // Unique rows
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-4">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <button
          type="button"
          onClick={onBackToBlocks}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#85142f] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
          <span>Back to {stand.name} Sections</span>
        </button>

        <span className="text-xs font-black text-[#85142f] bg-rose-50 px-2.5 py-1 rounded-full">
          {block.name}
        </span>
      </div>

      {/* Seat Legend */}
      <SeatLegend />

      {/* SVG Seat Layout Canvas */}
      <div className="relative bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl select-none">
        
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg text-white">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Info Tooltip */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          {hoveredSeat ? (
            <div className="bg-neutral-900/95 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-xl text-white text-xs">
              <span className="block font-black text-rose-300">
                Row {hoveredSeat.row} — Seat {hoveredSeat.number}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-300">
                <span>₹{hoveredSeat.price.toLocaleString('en-IN')}</span>
                <span>•</span>
                <span className="uppercase text-amber-300">{hoveredSeat.status}</span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] font-bold text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              Tap any green seat to select (Max 6)
            </span>
          )}
        </div>

        {/* Toast Warning */}
        {toastMessage && (
          <div className="absolute bottom-14 inset-x-4 z-30 flex justify-center pointer-events-none">
            <div className="bg-[#85142f] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* STAGE DIRECTION BANNER AT TOP */}
        <div className="pt-6 pb-2 px-4 flex flex-col items-center justify-center">
          <div className="w-48 sm:w-64 h-7 rounded-full bg-gradient-to-r from-rose-900/60 via-[#85142f] to-rose-900/60 border border-rose-500/40 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white shadow-inner">
            ▲ MAIN STAGE THIS WAY ▲
          </div>
        </div>

        {/* Interactive SVG Seat Grid */}
        <div className="overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            <svg
              viewBox="0 0 420 320"
              className="w-[380px] sm:w-[420px] h-auto drop-shadow-2xl"
            >
              {/* Row Letters on the left */}
              {rowLabels.map((r, rIdx) => (
                <text
                  key={`label-${r}`}
                  x="20"
                  y={68 + rIdx * 32}
                  fill="#737373"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {r}
                </text>
              ))}

              {/* Individual Seats */}
              {seats.map((seat) => {
                const isSelected = selectedSeatIds.has(seat.id);
                const isHovered = hoveredSeat?.id === seat.id;

                // Seat color based on state
                let fillColor = '#10b981'; // available
                let strokeColor = '#059669';

                if (isSelected) {
                  fillColor = '#85142f';
                  strokeColor = '#ffffff';
                } else if (seat.status === 'sold') {
                  fillColor = '#404040';
                  strokeColor = '#262626';
                } else if (seat.status === 'held') {
                  fillColor = '#f59e0b';
                  strokeColor = '#d97706';
                } else if (seat.status === 'blocked') {
                  fillColor = '#1f1f1f';
                  strokeColor = '#171717';
                }

                return (
                  <g
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    {/* Seat Circle / Rounded Rect */}
                    <rect
                      x={seat.coords.x}
                      y={seat.coords.y}
                      width="24"
                      height="22"
                      rx="6"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />

                    {/* Seat Number */}
                    <text
                      x={seat.coords.x + 12}
                      y={seat.coords.y + 15}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : seat.status === 'sold' ? '#737373' : '#ffffff'}
                      fontSize="9"
                      fontWeight="800"
                      pointerEvents="none"
                    >
                      {seat.number}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-neutral-900 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
          <span>{stand.name} • {block.name}</span>
          <span className="font-bold text-emerald-400">
            {selectedItems.length} of 6 Seats Selected
          </span>
        </div>
      </div>
    </div>
  );
};
