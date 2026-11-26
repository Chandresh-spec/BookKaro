'use client';

import React from 'react';
import { Accessibility } from 'lucide-react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2.5 px-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs text-xs font-semibold text-neutral-600">
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded border-2 border-emerald-500 bg-white" />
        <span>Available</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded bg-[#85142f] border-2 border-[#85142f]" />
        <span className="font-bold text-[#85142f]">Selected</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded bg-neutral-300 border border-neutral-400" />
        <span className="text-neutral-400">Sold</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-400" />
        <span className="text-amber-800">Held</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded bg-blue-500 text-white flex items-center justify-center text-[9px]">
          <Accessibility className="w-2.5 h-2.5" />
        </span>
        <span>Accessible</span>
      </div>
    </div>
  );
};
