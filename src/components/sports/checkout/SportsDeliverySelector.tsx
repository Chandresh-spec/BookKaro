'use client';

import React from 'react';
import { QrCode, Truck, Building2, Check, MapPin, Shirt } from 'lucide-react';
import { TicketDeliveryType, DeliveryAddress } from '@/types/booking';
import { SportEvent } from '@/types/sports';

interface SportsDeliverySelectorProps {
  event: SportEvent;
  selectedDelivery: TicketDeliveryType;
  onSelectDelivery: (type: TicketDeliveryType) => void;
  address: DeliveryAddress;
  onAddressChange: (addr: DeliveryAddress) => void;
}

export const SportsDeliverySelector: React.FC<SportsDeliverySelectorProps> = ({
  event,
  selectedDelivery,
  onSelectDelivery,
  address,
  onAddressChange,
}) => {
  const isParticipation = event.bookingMode === 'participation';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-black text-neutral-950 mb-1">
          {isParticipation ? 'Race Kit & Entry Pass Delivery' : 'Choose Pass Delivery Method'}
        </h3>
        <p className="text-xs text-neutral-500">
          {isParticipation
            ? 'Select how you want to receive your official runner BIB, timing chip, and event kit.'
            : 'Select your preferred method to receive admission passes for this sports event.'}
        </p>
      </div>

      {/* Delivery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Option 1: Digital E-Pass */}
        <div
          onClick={() => onSelectDelivery('digital')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedDelivery === 'digital'
              ? 'border-[#85142f] bg-rose-50/30 shadow-xs'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#85142f] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  selectedDelivery === 'digital'
                    ? 'border-[#85142f] bg-[#85142f] text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {selectedDelivery === 'digital' && <Check className="w-3 h-3 stroke-[3px]" />}
              </div>
            </div>
            <h4 className="font-black text-sm text-neutral-900 mb-1">
              Digital E-Pass / M-Ticket
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
              Instant entry pass with barcode sent directly via WhatsApp and Email.
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-bold">Delivery Fee</span>
            <span className="font-black text-emerald-600">FREE</span>
          </div>
        </div>

        {/* Option 2: Home Courier */}
        <div
          onClick={() => onSelectDelivery('home_delivery')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedDelivery === 'home_delivery'
              ? 'border-[#85142f] bg-rose-50/30 shadow-xs'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  selectedDelivery === 'home_delivery'
                    ? 'border-[#85142f] bg-[#85142f] text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {selectedDelivery === 'home_delivery' && <Check className="w-3 h-3 stroke-[3px]" />}
              </div>
            </div>
            <h4 className="font-black text-sm text-neutral-900 mb-1">
              {isParticipation ? 'Home BIB & Kit Courier' : 'Home Delivery'}
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
              {isParticipation
                ? 'Official bib chest number, safety pins, and jersey couriered to your doorstep.'
                : 'Physical badge pass couriered 3-5 days before event.'}
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-bold">Delivery Fee</span>
            <span className="font-black text-neutral-900">₹99</span>
          </div>
        </div>

        {/* Option 3: Venue / Expo Pickup */}
        <div
          onClick={() => onSelectDelivery('venue_pickup')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selectedDelivery === 'venue_pickup'
              ? 'border-[#85142f] bg-rose-50/30 shadow-xs'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  selectedDelivery === 'venue_pickup'
                    ? 'border-[#85142f] bg-[#85142f] text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {selectedDelivery === 'venue_pickup' && <Check className="w-3 h-3 stroke-[3px]" />}
              </div>
            </div>
            <h4 className="font-black text-sm text-neutral-900 mb-1">
              {isParticipation ? 'Expo / Venue BIB Pickup' : 'Box Office Pickup'}
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
              Collect at the venue box office or bib distribution expo prior to the event.
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-bold">Delivery Fee</span>
            <span className="font-black text-emerald-600">FREE</span>
          </div>
        </div>
      </div>

      {/* Address Form (Shown only when Home Delivery selected) */}
      {selectedDelivery === 'home_delivery' && (
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <MapPin className="w-4 h-4 text-[#85142f]" />
            <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900">
              Courier Delivery Address
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => onAddressChange({ ...address, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => onAddressChange({ ...address, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Flat, House No., Building, Street *
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => onAddressChange({ ...address, street: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">City *</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => onAddressChange({ ...address, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">Pincode *</label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => onAddressChange({ ...address, pincode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#85142f] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
