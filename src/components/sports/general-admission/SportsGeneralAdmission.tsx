'use client';

import React from 'react';
import { Ticket, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { TicketCategory } from '@/types/sports';

interface SportsGeneralAdmissionProps {
  categories: TicketCategory[];
  selectedQuantities: Record<string, number>;
  onQuantityChange: (categoryId: string, quantity: number) => void;
  currency?: string;
  maxPerOrder?: number;
}

export const SportsGeneralAdmission: React.FC<SportsGeneralAdmissionProps> = ({
  categories,
  selectedQuantities,
  onQuantityChange,
  currency = '₹',
  maxPerOrder = 8,
}) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center text-neutral-500">
        <Ticket className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
        <p className="font-bold text-sm">No ticket categories available for this sport event.</p>
      </div>
    );
  }

  const totalSelected = Object.values(selectedQuantities).reduce((acc, q) => acc + q, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#85142f]" />
              <span>Select Ticket Categories</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Choose admission passes for this sports exhibition or tournament
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            Max {maxPerOrder} tickets
          </span>
        </div>

        <div className="space-y-3.5">
          {categories.map((cat) => {
            const qty = selectedQuantities[cat.id] || 0;
            const isSelected = qty > 0;
            const isSoldOut = !cat.available;

            return (
              <div
                key={cat.id}
                className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSoldOut
                    ? 'border-neutral-200 bg-neutral-50 opacity-60'
                    : isSelected
                    ? 'border-[#85142f] bg-rose-50/20 shadow-xs'
                    : 'border-neutral-200/80 hover:border-neutral-300 bg-white'
                }`}
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm sm:text-base text-neutral-900">
                      {cat.name}
                    </h4>
                    {isSoldOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-100 text-red-700">
                        Sold Out
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700">
                        Available
                      </span>
                    )}
                  </div>

                  {cat.perks && cat.perks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {cat.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100/80 px-2 py-0.5 rounded"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-base sm:text-lg font-black text-neutral-950">
                      {currency} {cat.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-semibold ml-1">
                      per spectator
                    </span>
                  </div>
                </div>

                {/* Right: Quantity controls */}
                <div className="sm:self-center shrink-0">
                  {isSoldOut ? (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-500 font-bold text-xs cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-neutral-50 p-1.5 rounded-xl border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(cat.id, Math.max(0, qty - 1))}
                        disabled={qty <= 0}
                        className="w-8 h-8 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
                      >
                        -
                      </button>
                      <span className="font-black text-sm w-6 text-center text-neutral-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (totalSelected < maxPerOrder) {
                            onQuantityChange(cat.id, qty + 1);
                          }
                        }}
                        disabled={totalSelected >= maxPerOrder}
                        className="w-8 h-8 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
