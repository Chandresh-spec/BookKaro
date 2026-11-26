'use client';

import React from 'react';
import { ShieldCheck, Ticket, Trash2, ArrowRight, Sparkles, Trophy, Shirt } from 'lucide-react';
import { SportEvent, SportBookingItem } from '@/types/sports';
import { TicketDeliveryType } from '@/types/booking';

interface SportsBookingSummaryProps {
  event: SportEvent;
  selectedItems: SportBookingItem[];
  deliveryType?: TicketDeliveryType;
  deliveryFee?: number;
  onRemoveItem?: (id: string) => void;
  onProceed: () => void;
  buttonLabel?: string;
  isProceedDisabled?: boolean;
}

export const SportsBookingSummary: React.FC<SportsBookingSummaryProps> = ({
  event,
  selectedItems,
  deliveryType = 'digital',
  deliveryFee = 0,
  onRemoveItem,
  onProceed,
  buttonLabel = 'Proceed to Delivery',
  isProceedDisabled = false,
}) => {
  const isParticipation = event.bookingMode === 'participation';
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Convenience fee: ₹40 per ticket/slot, 18% GST
  const feePerUnit = isParticipation ? 35 : 40;
  const totalConvenienceFee = totalQuantity > 0 ? totalQuantity * feePerUnit : 0;
  const gstOnFee = Math.round(totalConvenienceFee * 0.18);
  const totalPayable = itemsSubtotal + totalConvenienceFee + gstOnFee + deliveryFee;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-md space-y-5">
      {/* Event Header in Summary */}
      <div className="pb-4 border-b border-neutral-100">
        <span className="text-[10px] uppercase font-black tracking-wider text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
          {isParticipation ? 'Registration Summary' : 'Order Summary'}
        </span>
        <h3 className="font-extrabold text-sm sm:text-base text-neutral-950 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
          {event.date} • {event.venue}
        </p>
      </div>

      {/* Selected Items List */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
          <span>{isParticipation ? 'Selected Category' : 'Selected Tickets'}</span>
          <span>
            {totalQuantity} {totalQuantity === 1 ? (isParticipation ? 'slot' : 'pass') : (isParticipation ? 'slots' : 'passes')}
          </span>
        </div>

        {selectedItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-neutral-50 border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
            No {isParticipation ? 'race categories' : 'tickets'} selected yet.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-extrabold text-neutral-900 truncate">
                    {item.name}
                  </div>
                  {item.distance && (
                    <span className="text-[10px] font-bold text-[#85142f] bg-rose-50 px-1.5 py-0.2 rounded mr-1">
                      {item.distance}
                    </span>
                  )}
                  {item.seatDetails && (
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {item.seatDetails.stand} • {item.seatDetails.block} • R{item.seatDetails.row}-S{item.seatDetails.seatNumber}
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-500">
                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-neutral-950 text-xs">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Breakdown */}
      {totalQuantity > 0 && (
        <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>{isParticipation ? 'Registration Fee' : 'Ticket Subtotal'}</span>
            <span className="font-bold text-neutral-900">
              ₹{itemsSubtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>Booking & Convenience Fee</span>
            <span className="font-bold text-neutral-900">
              ₹{totalConvenienceFee.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>Integrated GST (18%)</span>
            <span className="font-bold text-neutral-900">
              ₹{gstOnFee.toLocaleString('en-IN')}
            </span>
          </div>

          {deliveryFee > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Home Courier Delivery</span>
              <span className="font-bold text-neutral-900">
                ₹{deliveryFee.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
            <span className="font-black text-neutral-950">Total Payable</span>
            <span className="font-black text-base sm:text-lg text-[#85142f]">
              ₹{totalPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        disabled={isProceedDisabled || totalQuantity === 0}
        onClick={onProceed}
        className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer ${
          isProceedDisabled || totalQuantity === 0
            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
            : 'bg-[#85142f] hover:bg-[#6c0f25] text-white shadow-[#85142f]/30'
        }`}
      >
        <span>{buttonLabel}</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
      </button>

      {/* Trust Badge */}
      <div className="text-center pt-1">
        <span className="text-[10px] text-neutral-400 font-semibold flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Verified Sports Booking • Simulated Demo</span>
        </span>
      </div>
    </div>
  );
};
