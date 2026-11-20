'use client';

import React from 'react';
import { Music, Mic, Flame, Drama, Heart, Wine, Sparkles } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/data/mockEvents';

interface EventCategoryPillsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const EventCategoryPills: React.FC<EventCategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'music':
        return <Music className="w-3.5 h-3.5" />;
      case 'mic':
        return <Mic className="w-3.5 h-3.5" />;
      case 'flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'drama':
        return <Drama className="w-3.5 h-3.5" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5" />;
      case 'cocktail':
        return <Wine className="w-3.5 h-3.5" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {EVENT_CATEGORIES.map((cat) => {
        const isSelected =
          cat.id === 'all'
            ? selectedCategory === null
            : selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
              isSelected
                ? 'bg-[#85142f] text-white border border-[#85142f] shadow-xs'
                : 'bg-white text-neutral-800 border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span>{getIcon(cat.icon)}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
