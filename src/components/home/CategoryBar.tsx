'use client';

import React from 'react';
import { Film, Music, Trophy, Drama, Mic, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryType } from '@/types';

interface CategoryBarProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: CategoryType) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'film':
        return <Film className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'music':
        return <Music className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'trophy':
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'theater':
        return <Drama className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'mic':
        return <Mic className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <section className="py-8 sm:py-12 border-t border-neutral-100 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-6 sm:mb-8">
          What are you in the mood for?
        </h2>

        {/* Categories Grid: 6 cols on desktop, 3 cols on mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <a
                key={cat.id}
                href={cat.href}
                onClick={(e) => {
                  if (onSelectCategory) {
                    onSelectCategory(cat.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border transition-all duration-200 group text-center cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-sm text-neutral-800'
                }`}
              >
                <div
                  className={`mb-3 p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                    isSelected
                      ? 'text-white'
                      : 'text-neutral-700 group-hover:text-neutral-950'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold tracking-tight ${
                    isSelected ? 'text-white' : 'text-neutral-800'
                  }`}
                >
                  {cat.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
