'use client';

import React from 'react';
import { ShieldCheck, Ticket, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { SelectedTicketItem, TicketDeliveryType } from '@/types/booking';
import { LiveEvent } from '@/types/event';

interface BookingSummaryProps {
  event: LiveEvent;
  selectedItems: SelectedTicketItem[];
  deliveryType?: TicketDeliveryType;
  deliveryFee?: number;
  onRemoveItem?: (id: string) => void;
  onProceed: () => void;
  buttonLabel?: string;
  isProceedDisabled?: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  event,
  selectedItems,
  deliveryType = 'digital',
  deliveryFee = 0,
  onRemoveItem,
  onProceed,
  buttonLabel = 'Proceed',
  isProceedDisabled = false,
}) => {
  const totalTickets = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Mock convenience fee & GST
  const convenienceFeePerTicket = 40;
  const totalConvenienceFee = totalTickets > 0 ? totalTickets * convenienceFeePerTicket : 0;
  const gstOnFee = Math.round(totalConvenienceFee * 0.18);
  const totalPayable = itemsSubtotal + totalConvenienceFee + gstOnFee + deliveryFee;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-md space-y-5">
      {/* Event Header in Summary */}
      <div className="pb-4 border-b border-neutral-100">
        <span className="text-[10px] uppercase font-black tracking-wider text-[#85142f] bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
          Order Summary
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
          <span>Tickets Selected</span>
          <span>{totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}</span>
        </div>

        {selectedItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-neutral-50 border border-dashed border-neutral-300 text-center text-xs text-neutral-400 font-medium">
            No tickets or seats selected yet. Choose your preferred tickets from the left.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-extrabold text-neutral-900 truncate">
                    {item.name}
                  </div>
                  {item.seatDetails && (
                    <div className="text-[11px] text-neutral-500 font-semibold truncate">
                      {item.seatDetails.stand} • Row {item.seatDetails.row}, Seat {item.seatDetails.seatNumber}
                    </div>
                  )}
                  <div className="text-[11px] text-[#85142f] font-bold">
                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-neutral-950 text-xs sm:text-sm">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 rounded-full text-neutral-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
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

      {/* Price Breakdown */}
      {selectedItems.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
          <div className="flex items-center justify-between">
            <span>Ticket Subtotal</span>
            <span className="font-bold text-neutral-900">
              ₹{itemsSubtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-500">
            <span>Convenience Fee (₹40/tkt)</span>
            <span>₹{totalConvenienceFee.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center justify-between text-neutral-500">
            <span>Integrated GST (18%)</span>
            <span>₹{gstOnFee.toLocaleString('en-IN')}</span>
          </div>

          {deliveryFee > 0 && (
            <div className="flex items-center justify-between text-neutral-700 font-semibold">
              <span>Home Courier Delivery</span>
              <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-neutral-900">
                Total Payable
              </span>
              <span className="text-[10px] text-neutral-400 font-normal">
                Includes all mock fees & taxes
              </span>
            </div>
            <span className="text-2xl font-black text-[#85142f]">
              ₹{totalPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        disabled={isProceedDisabled || selectedItems.length === 0}
        onClick={onProceed}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
          isProceedDisabled || selectedItems.length === 0
            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
            : 'bg-[#85142f] hover:bg-[#6c0f25] text-white shadow-[#85142f]/30'
        }`}
      >
        <Ticket className="w-4 h-4" />
        <span>{buttonLabel}</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
      </button>

      {/* Security badge */}
      <div className="text-center pt-1">
        <span className="text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simulated Booking Sandbox — No Real Charges</span>
        </span>
      </div>
    </div>
  );
};
