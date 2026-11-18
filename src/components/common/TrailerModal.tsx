'use client';

import React from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  title,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-800 text-white">
          <h3 className="font-bold text-sm sm:text-base">{title} — Official Trailer</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close trailer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Embed / Responsive Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
