'use client';

import React from 'react';
import { Check, AlertCircle, Sparkles, Tag, Users } from 'lucide-react';
import { TicketTier } from '@/types/event';
import { SelectedTicketItem } from '@/types/booking';
import { TicketQuantitySelector } from '../TicketQuantitySelector';

interface GeneralAdmissionProps {
  tiers: TicketTier[];
  selectedItems: SelectedTicketItem[];
  onQuantityChange: (tier: TicketTier, quantity: number) => void;
}

export const GeneralAdmission: React.FC<GeneralAdmissionProps> = ({
  tiers,
  selectedItems,
  onQuantityChange,
}) => {
  const getSelectedQuantity = (tierId: string) => {
    const found = selectedItems.find((item) => item.id === tierId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#85142f]/10 text-[#85142f] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900">
              General Admission (Open Tier Access)
            </h3>
            <p className="text-xs text-neutral-500">
              Select your preferred ticket category and quantity below. No seat reservation needed.
            </p>
          </div>
        </div>
      </div>

      {/* Tier Selection Cards */}
      <div className="space-y-3.5">
        {tiers.map((tier) => {
          const selectedQty = getSelectedQuantity(tier.id);
          const isSelected = selectedQty > 0;

          return (
            <div
              key={tier.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${
                tier.isSoldOut
                  ? 'bg-neutral-50 border-neutral-200 opacity-60'
                  : isSelected
                  ? 'bg-white border-[#85142f] ring-2 ring-[#85142f]/20 shadow-md'
                  : 'bg-white border-neutral-200/80 hover:border-neutral-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-neutral-950 truncate">
                      {tier.name}
                    </h4>
                    {tier.isSoldOut ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-200 text-neutral-600">
                        SOLD OUT
                      </span>
                    ) : tier.available <= 10 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 animate-pulse">
                        Only {tier.available} left!
                      </span>
                    ) : null}
                  </div>

                  {tier.description && (
                    <p className="text-xs text-neutral-500 mb-2.5">
                      {tier.description}
                    </p>
                  )}

                  {/* Perks Tags */}
                  {tier.perks && tier.perks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tier.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Price & Quantity Control */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="text-left sm:text-right">
                    <span className="block text-lg sm:text-xl font-black text-neutral-950">
                      ₹{tier.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-semibold">
                      per ticket
                    </span>
                  </div>

                  <TicketQuantitySelector
                    quantity={selectedQty}
                    min={0}
                    max={Math.min(tier.maxPerOrder, tier.available)}
                    disabled={tier.isSoldOut}
                    onChange={(qty) => onQuantityChange(tier, qty)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
