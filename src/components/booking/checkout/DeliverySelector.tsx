'use client';

import React from 'react';
import { QrCode, Truck, Building2, Check, MapPin, AlertCircle } from 'lucide-react';
import { TicketDeliveryType, DeliveryAddress } from '@/types/booking';
import { LiveEvent } from '@/types/event';

interface DeliverySelectorProps {
  event: LiveEvent;
  selectedDelivery: TicketDeliveryType;
  onSelectDelivery: (type: TicketDeliveryType) => void;
  address: DeliveryAddress;
  onAddressChange: (addr: DeliveryAddress) => void;
}

export const DeliverySelector: React.FC<DeliverySelectorProps> = ({
  event,
  selectedDelivery,
  onSelectDelivery,
  address,
  onAddressChange,
}) => {
  const allowedOptions = event.deliveryOptions || ['digital', 'home_delivery', 'venue_pickup'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-black text-neutral-950 mb-1">
          Choose How You Want Your Tickets Delivered
        </h3>
        <p className="text-xs text-neutral-500">
          Select your preferred method to receive entry passes for this event.
        </p>
      </div>

      {/* Delivery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Option 1: Digital QR */}
        {allowedOptions.includes('digital') && (
          <div
            onClick={() => onSelectDelivery('digital')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedDelivery === 'digital'
                ? 'border-[#85142f] bg-rose-50/40 ring-2 ring-[#85142f]/20 shadow-sm'
                : 'border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                {selectedDelivery === 'digital' && (
                  <span className="w-5 h-5 rounded-full bg-[#85142f] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5px]" />
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-neutral-950 mb-1">
                Digital M-Ticket
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                Instant digital QR code delivered directly to your email and BookKaro profile.
              </p>
            </div>
            <span className="text-xs font-black text-emerald-700">
              FREE
            </span>
          </div>
        )}

        {/* Option 2: Home Delivery */}
        {allowedOptions.includes('home_delivery') && (
          <div
            onClick={() => onSelectDelivery('home_delivery')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedDelivery === 'home_delivery'
                ? 'border-[#85142f] bg-rose-50/40 ring-2 ring-[#85142f]/20 shadow-sm'
                : 'border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                {selectedDelivery === 'home_delivery' && (
                  <span className="w-5 h-5 rounded-full bg-[#85142f] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5px]" />
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-neutral-950 mb-1">
                Courier Delivery
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                Physical commemorative RFID band & concert laminate shipped to your doorstep.
              </p>
            </div>
            <span className="text-xs font-black text-neutral-900">
              ₹99 courier charge
            </span>
          </div>
        )}

        {/* Option 3: Box Office Pickup */}
        {allowedOptions.includes('venue_pickup') && (
          <div
            onClick={() => onSelectDelivery('venue_pickup')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedDelivery === 'venue_pickup'
                ? 'border-[#85142f] bg-rose-50/40 ring-2 ring-[#85142f]/20 shadow-sm'
                : 'border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedDelivery === 'venue_pickup' && (
                  <span className="w-5 h-5 rounded-full bg-[#85142f] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5px]" />
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-neutral-950 mb-1">
                Box Office Pickup
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                Collect physical passes from the stadium ticket counter 3 hours prior to showtime.
              </p>
            </div>
            <span className="text-xs font-black text-emerald-700">
              FREE
            </span>
          </div>
        )}
      </div>

      {/* Address Form (if Home Delivery selected) */}
      {selectedDelivery === 'home_delivery' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <MapPin className="w-4 h-4 text-[#85142f]" />
            <h4 className="font-extrabold text-sm text-neutral-900">
              Shipping & Delivery Address
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => onAddressChange({ ...address, fullName: e.target.value })}
                placeholder="e.g. Chandresh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={address.phone}
                onChange={(e) => onAddressChange({ ...address, phone: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => onAddressChange({ ...address, street: e.target.value })}
                placeholder="Flat / House No., Building Name, Street"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => onAddressChange({ ...address, city: e.target.value })}
                placeholder="e.g. Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#85142f]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Pincode</label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => onAddressChange({ ...address, pincode: e.target.value })}
                placeholder="e.g. 560001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#85142f]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
