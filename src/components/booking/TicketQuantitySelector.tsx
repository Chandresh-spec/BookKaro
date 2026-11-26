'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface TicketQuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (qty: number) => void;
}

export const TicketQuantitySelector: React.FC<TicketQuantitySelectorProps> = ({
  quantity,
  min = 0,
  max = 10,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-400 bg-white flex items-center justify-center text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shadow-2xs"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-8 text-center text-sm font-black text-neutral-900 select-none">
        {quantity}
      </span>

      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-8 h-8 rounded-full border border-[#85142f] bg-[#85142f] hover:bg-[#6c0f25] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shadow-2xs"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
