'use client';

import React from 'react';
import { Clapperboard, Music, Trophy, Drama, Mic, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryType } from '@/types';

interface CategoryBarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clapperboard':
        return <Clapperboard className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'trophy':
        return <Trophy className="w-4 h-4" />;
      case 'theater':
        return <Drama className="w-4 h-4" />;
      case 'mic':
      default:
        return <Mic className="w-4 h-4" />;
    }
  };

  return (
    <section className="pt-2 pb-3 sm:pt-3 sm:pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#85142f] rounded-xs" />
            <h2 className="text-sm sm:text-base font-black tracking-tight text-neutral-900 uppercase">
              Explore Experiences
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
            Browse by entertainment category
          </span>
        </div>

        {/* Structured Category Tiles Row */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none -webkit-overflow-scrolling-touch">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#85142f] text-white border-[#85142f] shadow-sm shadow-[#85142f]/25'
                    : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-[#85142f]'}>
                  {getIcon(cat.iconName)}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
