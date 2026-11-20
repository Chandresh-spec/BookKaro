'use client';

import React, { useState } from 'react';
import { Check, MapPin, Users, Ticket, Sparkles, AlertCircle } from 'lucide-react';
import { ZoneVenueConfig } from '@/types/venue';
import { ConcertZone } from '@/types/event';
import { SelectedTicketItem } from '@/types/booking';
import { InteractiveZoneMap } from './InteractiveZoneMap';
import { TicketQuantitySelector } from '../TicketQuantitySelector';

interface ZoneBookingProps {
  venueConfig: ZoneVenueConfig;
  zones: ConcertZone[];
  selectedItems: SelectedTicketItem[];
  onZoneQuantityChange: (zone: ConcertZone, quantity: number) => void;
}

export const ZoneBooking: React.FC<ZoneBookingProps> = ({
  venueConfig,
  zones,
  selectedItems,
  onZoneQuantityChange,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0]?.id || 'zone-premium-standing');

  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];
  const activeGeom = venueConfig.zones.find((z) => z.id === activeZoneId);

  const getSelectedQuantity = (zoneId: string) => {
    const found = selectedItems.find((item) => item.id === zoneId);
    return found ? found.quantity : 0;
  };

  const activeQty = getSelectedQuantity(activeZone.id);

  return (
    <div className="space-y-6">
      {/* Interactive Map Header Banner */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900">
              Interactive Standing Zone Map
            </h3>
            <p className="text-xs text-neutral-500">
              Select any zone on the arena map or the cards below to choose your passes.
            </p>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <InteractiveZoneMap
        venueConfig={venueConfig}
        zones={zones}
        selectedZoneId={activeZoneId}
        onSelectZone={(id) => setActiveZoneId(id)}
      />

      {/* Active Selected Zone Card / Quantity Selector */}
      {activeZone && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#85142f] shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeZone.color }}
                />
                <h4 className="font-black text-base sm:text-lg text-neutral-950">
                  {activeZone.name}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#85142f]">
                  SELECTED
                </span>
              </div>

              {activeGeom?.recommendedAudience && (
                <p className="text-xs text-neutral-600 mb-2">
                  {activeGeom.recommendedAudience}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-medium">
                {activeZone.entryGate && (
                  <span className="flex items-center gap-1 text-neutral-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#85142f]" />
                    <span>{activeZone.entryGate}</span>
                  </span>
                )}
                <span>•</span>
                <span className="text-emerald-700 font-bold">
                  {activeZone.available} passes remaining
                </span>
              </div>
            </div>

            {/* Price & Quantity Selector */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
              <div className="text-left sm:text-right">
                <span className="block text-xl sm:text-2xl font-black text-neutral-950">
                  ₹{activeZone.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400 font-semibold">
                  per pass
                </span>
              </div>

              <TicketQuantitySelector
                quantity={activeQty}
                min={0}
                max={Math.min(6, activeZone.available)}
                disabled={activeZone.isSoldOut}
                onChange={(qty) => onZoneQuantityChange(activeZone, qty)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick All Zones Grid Selector */}
      <div>
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          All Arena Standing Zones
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {zones.map((zone) => {
            const isCurrent = activeZoneId === zone.id;
            const qty = getSelectedQuantity(zone.id);

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#85142f] bg-rose-50/40 shadow-xs'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="font-extrabold text-xs text-neutral-900 truncate">
                      {zone.name}
                    </span>
                  </div>
                  {qty > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#85142f] text-white text-[10px] font-black shrink-0">
                      {qty} Selected
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-neutral-900">
                    ₹{zone.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-semibold">
                    {zone.available} left
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
