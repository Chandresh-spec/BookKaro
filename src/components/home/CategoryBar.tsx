'use client';

import React from 'react';
import { LayoutGrid, Film, Music, Trophy, Drama, Mic, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryType } from '@/types';

interface CategoryBarProps {
  selectedCategory?: CategoryType;
  onSelectCategory?: (categoryId: CategoryType) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'layout-grid':
        return <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'film':
        return <Film className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'music':
        return <Music className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'trophy':
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'theater':
        return <Drama className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'mic':
        return <Mic className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  return (
    <section className="py-6 sm:py-10 border-t border-neutral-100 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mb-5 sm:mb-6">
          What are you in the mood for?
        </h2>

        {/* 7 Horizontal Pill Cards: Responsive flex wrap / scroll */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory?.(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200/90 bg-white hover:border-neutral-400 text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-neutral-700'}>
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
