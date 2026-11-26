'use client';

import React from 'react';
import { SPORTS_CATEGORIES } from '@/data/mockSportsEvents';
import { SportCategory } from '@/types/sports';

interface SportsCategoryChipsProps {
  selectedSports: string[];
  onToggleSport: (sport: string) => void;
  onClearSports?: () => void;
  className?: string;
}

export const SportsCategoryChips: React.FC<SportsCategoryChipsProps> = ({
  selectedSports,
  onToggleSport,
  onClearSports,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5">
        {/* All Sports Pill */}
        <button
          type="button"
          onClick={() => {
            if (onClearSports) onClearSports();
          }}
          className={`px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
            selectedSports.length === 0
              ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
              : 'bg-white text-neutral-700 border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
          }`}
        >
          All Sports
        </button>

        {/* Categories from Screenshot */}
        {SPORTS_CATEGORIES.map((category) => {
          const isSelected = selectedSports.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => onToggleSport(category)}
              className={`px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#85142f] text-white shadow-xs font-bold scale-[1.02]'
                  : 'bg-white text-neutral-700 border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
