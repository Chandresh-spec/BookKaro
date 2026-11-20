'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Layers, Users, Sparkles, Check } from 'lucide-react';
import { StadiumStand, StadiumBlock } from '@/types/venue';

interface BlockSelectorProps {
  stand: StadiumStand;
  onBackToStadium: () => void;
  onSelectBlock: (block: StadiumBlock) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({
  stand,
  onBackToStadium,
  onSelectBlock,
}) => {
  return (
    <div className="space-y-5">
      {/* Back button & Stand Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <button
          type="button"
          onClick={onBackToStadium}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#85142f] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
          <span>Back to Stadium Overview</span>
        </button>

        <span className="text-xs font-bold text-neutral-400">
          Showing blocks for {stand.name}
        </span>
      </div>

      {/* Stand Description Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs"
            style={{ backgroundColor: stand.accentColor }}
          >
            {stand.code.slice(0, 1)}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-950">
              {stand.name}
            </h3>
            <p className="text-xs text-neutral-500">
              {stand.description || 'Choose your section/block to view available numbered seats.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full hidden sm:inline-block">
          {stand.blocks.length} Sections
        </span>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stand.blocks.map((block) => {
          const getTierBadge = () => {
            switch (block.tier) {
              case 'VIP':
                return 'bg-amber-100 text-amber-900 border-amber-300';
              case 'PLATINUM':
                return 'bg-slate-100 text-slate-900 border-slate-300';
              case 'GOLD':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
              case 'SILVER':
                return 'bg-neutral-100 text-neutral-700 border-neutral-200';
              default:
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            }
          };

          return (
            <div
              key={block.id}
              onClick={() => onSelectBlock(block)}
              className="p-5 rounded-3xl bg-white border border-neutral-200/80 hover:border-[#85142f]/40 hover:shadow-md card-hover transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTierBadge()}`}
                  >
                    {block.tier} TIER
                  </span>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {block.availableSeats} seats left
                  </span>
                </div>

                <h4 className="font-black text-sm sm:text-base text-neutral-950 mb-1">
                  {block.name}
                </h4>

                <p className="text-xs text-neutral-500 mb-3">
                  Section Code: <span className="font-bold text-neutral-700">{block.code}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">
                    Base Price
                  </span>
                  <span className="text-base sm:text-lg font-black text-neutral-950">
                    ₹{block.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#85142f] text-white text-xs font-bold shadow-xs">
                  <span>View Seats</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
