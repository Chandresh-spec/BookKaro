'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';
import { ZoneVenueConfig } from '@/types/venue';
import { ConcertZone } from '@/types/event';

interface InteractiveZoneMapProps {
  venueConfig: ZoneVenueConfig;
  zones: ConcertZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
}

export const InteractiveZoneMap: React.FC<InteractiveZoneMapProps> = ({
  venueConfig,
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const [scale, setScale] = useState(1);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.0));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75));
  const handleResetZoom = () => setScale(1);

  // Find hovered zone metadata
  const hoveredZone = zones.find((z) => z.id === hoveredZoneId);

  return (
    <div className="relative bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl select-none">
      {/* Zoom / Pan Controls Toolbar */}
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

      {/* Hover Info Tooltip Bar */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        {hoveredZone ? (
          <div className="bg-neutral-900/95 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-xl text-white max-w-xs animate-in fade-in duration-150">
            <span className="block text-xs font-black text-rose-300">
              {hoveredZone.name}
            </span>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-300">
              <span>₹{hoveredZone.price.toLocaleString('en-IN')}</span>
              <span>•</span>
              <span className="text-emerald-400">{hoveredZone.available} passes left</span>
            </div>
          </div>
        ) : (
          <span className="text-[11px] font-bold text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            Tap any standing zone to select
          </span>
        )}
      </div>

      {/* Interactive SVG Arena View */}
      <div className="overflow-hidden p-6 sm:p-10 flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
        <div
          className="w-full max-w-2xl transition-transform duration-300 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          <svg
            viewBox={venueConfig.viewBox}
            className="w-full h-auto drop-shadow-2xl"
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern
                id="arena-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity="0.06"
                />
              </pattern>
            </defs>
            <rect width="1000" height="800" fill="url(#arena-grid)" />

            {/* STAGE CONTAINER (Top) */}
            <g id="stage-group">
              {/* Outer stage boundary */}
              <rect
                x="250"
                y="30"
                width="500"
                height="80"
                rx="16"
                fill="#85142f"
                stroke="#f43f5e"
                strokeWidth="2"
              />
              {/* Runway Catwalk */}
              <path
                d="M 450 110 L 450 180 Q 500 200 550 180 L 550 110 Z"
                fill="#9f1239"
                stroke="#f43f5e"
                strokeWidth="2"
              />
              <text
                x="500"
                y="75"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="900"
                letterSpacing="4"
              >
                ★ MAIN CONCERT STAGE ★
              </text>
              <text
                x="500"
                y="155"
                textAnchor="middle"
                fill="#fecdd3"
                fontSize="11"
                fontWeight="700"
                letterSpacing="2"
              >
                RUNWAY
              </text>
            </g>

            {/* SOUND CONSOLE / MIX TOWER (Middle) */}
            <rect
              x="450"
              y="450"
              width="100"
              height="35"
              rx="6"
              fill="#262626"
              stroke="#525252"
              strokeWidth="1.5"
            />
            <text
              x="500"
              y="472"
              textAnchor="middle"
              fill="#a3a3a3"
              fontSize="10"
              fontWeight="700"
            >
              FOH MIXING
            </text>

            {/* INTERACTIVE VENUE ZONES */}
            {venueConfig.zones.map((geom) => {
              const zoneData = zones.find((z) => z.id === geom.id);
              const isSelected = selectedZoneId === geom.id;
              const isHovered = hoveredZoneId === geom.id;

              return (
                <g
                  key={geom.id}
                  onClick={() => onSelectZone(geom.id)}
                  onMouseEnter={() => setHoveredZoneId(geom.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Zone Polygon / Path */}
                  <path
                    d={geom.svgPath}
                    fill={isSelected ? '#85142f' : isHovered ? geom.hoverColor : geom.fillColor}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                    stroke={isSelected ? '#ffffff' : geom.strokeColor}
                    strokeWidth={isSelected ? 4 : isHovered ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />

                  {/* Zone Name Label */}
                  <text
                    x={geom.labelPosition.x}
                    y={geom.labelPosition.y - 8}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="16"
                    fontWeight="800"
                    pointerEvents="none"
                  >
                    {geom.name}
                  </text>

                  {/* Zone Price & Availability Label */}
                  {zoneData && (
                    <text
                      x={geom.labelPosition.x}
                      y={geom.labelPosition.y + 14}
                      textAnchor="middle"
                      fill={isSelected ? '#fecdd3' : '#e2e8f0'}
                      fontSize="12"
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      ₹{zoneData.price.toLocaleString('en-IN')} • {zoneData.available} left
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom Stage Direction Indicator */}
      <div className="bg-neutral-900 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span>Stage at top. Click any highlighted standing zone to configure passes.</span>
        </span>
        <span className="font-bold text-neutral-200 hidden sm:inline">
          {venueConfig.name}
        </span>
      </div>
    </div>
  );
};
