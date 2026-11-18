'use client';

import React from 'react';
import { Clapperboard, Music, Trophy, Drama, Mic } from 'lucide-react';
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
    <section className="py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#85142f] text-white shadow-sm shadow-[#85142f]/20 hover:bg-[#721027]'
                    : 'bg-white text-neutral-800 border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span>{getIcon(cat.iconName)}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
