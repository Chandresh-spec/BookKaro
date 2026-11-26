'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronRight, Layers, MapPin } from 'lucide-react';
import { StadiumVenueConfig, StadiumStand } from '@/types/venue';

interface StadiumMapProps {
  venueConfig: StadiumVenueConfig;
  selectedStand: StadiumStand | null;
  onSelectStand: (stand: StadiumStand) => void;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  venueConfig,
  selectedStand,
  onSelectStand,
}) => {
  const [scale, setScale] = useState(1);
  const [hoveredStandId, setHoveredStandId] = useState<string | null>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 1.8));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.8));
  const handleResetZoom = () => setScale(1);

  return (
    <div className="space-y-6">
      {/* Stadium SVG Overview Card */}
      <div className="relative bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl select-none">
        
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg text-white">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Top Hint */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="text-[11px] font-bold text-neutral-300 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            Click on any Stadium Stand to zoom into blocks
          </span>
        </div>

        {/* SVG Stadium Layout */}
        <div className="overflow-hidden p-6 sm:p-10 flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
          <div
            className="w-full max-w-xl transition-transform duration-300 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            <svg viewBox={venueConfig.viewBox} className="w-full h-auto drop-shadow-2xl">
              
              {/* Outer Stadium Perimeter Ring */}
              <circle
                cx="500"
                cy="500"
                r="460"
                fill="#171717"
                stroke="#404040"
                strokeWidth="2"
              />

              {/* Central Pitch / Stage Field */}
              <ellipse
                cx="500"
                cy="500"
                rx="240"
                ry="210"
                fill="#262626"
                stroke="#525252"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Central Concert Stage representation */}
              <rect
                x="410"
                y="350"
                width="180"
                height="65"
                rx="12"
                fill="#85142f"
                stroke="#f43f5e"
                strokeWidth="2"
              />
              <text
                x="500"
                y="388"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="900"
                letterSpacing="2"
              >
                ★ MAIN STAGE ★
              </text>

              {/* Central Arena General Field */}
              <text
                x="500"
                y="520"
                textAnchor="middle"
                fill="#737373"
                fontSize="13"
                fontWeight="800"
                letterSpacing="3"
              >
                CENTRAL FIELD & PRODUCTION
              </text>

              {/* 4 STANDS RENDERING */}
              {venueConfig.stands.map((stand) => {
                const isSelected = selectedStand?.id === stand.id;
                const isHovered = hoveredStandId === stand.id;

                return (
                  <g
                    key={stand.id}
                    onClick={() => onSelectStand(stand)}
                    onMouseEnter={() => setHoveredStandId(stand.id)}
                    onMouseLeave={() => setHoveredStandId(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    <path
                      d={stand.svgPath}
                      fill={isSelected ? '#85142f' : stand.accentColor}
                      fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                      stroke={isSelected ? '#ffffff' : stand.accentColor}
                      strokeWidth={isSelected ? 4 : isHovered ? 3 : 1.5}
                      className="transition-all duration-200"
                    />

                    {/* Stand Label */}
                    <text
                      x={
                        stand.code === 'NORTH'
                          ? 500
                          : stand.code === 'SOUTH'
                          ? 500
                          : stand.code === 'EAST'
                          ? 900
                          : 100
                      }
                      y={
                        stand.code === 'NORTH'
                          ? 80
                          : stand.code === 'SOUTH'
                          ? 920
                          : stand.code === 'EAST'
                          ? 500
                          : 500
                      }
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="20"
                      fontWeight="900"
                      pointerEvents="none"
                    >
                      {stand.name}
                    </text>

                    {/* Blocks count badge */}
                    <text
                      x={
                        stand.code === 'NORTH'
                          ? 500
                          : stand.code === 'SOUTH'
                          ? 500
                          : stand.code === 'EAST'
                          ? 900
                          : 100
                      }
                      y={
                        stand.code === 'NORTH'
                          ? 105
                          : stand.code === 'SOUTH'
                          ? 945
                          : stand.code === 'EAST'
                          ? 525
                          : 525
                      }
                      textAnchor="middle"
                      fill="#fecdd3"
                      fontSize="12"
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {stand.blocks.length} Blocks Available
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Stadium Footer Bar */}
        <div className="bg-neutral-900 border-t border-white/10 px-4 py-3 flex items-center justify-between text-xs text-neutral-400">
          <span>{venueConfig.name} • {venueConfig.city}</span>
          <span className="font-bold text-rose-300">
            Select a stand to choose seating tiers
          </span>
        </div>
      </div>

      {/* Stand Selection Cards List */}
      <div>
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Or Choose Stand By Name
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {venueConfig.stands.map((stand) => {
            const isCurrent = selectedStand?.id === stand.id;
            const minPrice = Math.min(...stand.blocks.map((b) => b.basePrice));

            return (
              <div
                key={stand.id}
                onClick={() => onSelectStand(stand)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isCurrent
                    ? 'border-[#85142f] bg-rose-50/40 shadow-md ring-2 ring-[#85142f]/20'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                    style={{ backgroundColor: stand.accentColor }}
                  >
                    {stand.code.slice(0, 1)}
                  </div>
                  <div>
                    <h5 className="font-black text-sm sm:text-base text-neutral-950">
                      {stand.name}
                    </h5>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {stand.description}
                    </p>
                    <span className="text-[11px] font-bold text-neutral-400 mt-1 block">
                      {stand.blocks.length} Blocks Available • From ₹{minPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-neutral-800 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
