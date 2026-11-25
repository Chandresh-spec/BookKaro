'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  QrCode,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Trophy,
  Shirt,
  User,
  ArrowRight,
} from 'lucide-react';
import { SportEvent, ParticipantInfo, SportBookingItem } from '@/types/sports';
import { TicketDeliveryType, DeliveryAddress } from '@/types/booking';

export interface SportsConfirmationData {
  bookingId: string;
  bookingTime: string;
  event: SportEvent;
  items: SportBookingItem[];
  totalPaid: number;
  deliveryType: TicketDeliveryType;
  deliveryAddress?: DeliveryAddress;
  participants?: ParticipantInfo[];
}

interface SportsBookingConfirmationProps {
  data: SportsConfirmationData;
}

export const SportsBookingConfirmation: React.FC<SportsBookingConfirmationProps> = ({ data }) => {
  const { event, items, totalPaid, bookingId, bookingTime, participants = [] } = data;
  const isParticipation = event.bookingMode === 'participation';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Simulation Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="text-xs">
          <span className="font-extrabold uppercase tracking-wider text-amber-800 mr-1.5">
            [Demo / Simulation Mode]
          </span>
          This is a simulated transaction on BookKaro. No real payment was charged and no real race slots or inventory were reserved.
        </div>
      </div>

      {/* Main Ticket Confirmation Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden">
        {/* Top Success Header */}
        <div className="bg-[#85142f] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-white text-[#85142f] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
            {isParticipation ? 'Registration Confirmed!' : 'Booking Confirmed!'}
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm font-medium">
            Your booking reference ID is <span className="font-black text-white">{bookingId}</span>
          </p>
          <span className="inline-block mt-2 text-[11px] bg-black/20 text-rose-200 px-3 py-1 rounded-full font-mono">
            Booked on {bookingTime}
          </span>
        </div>

        {/* Event Summary Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-[#85142f]/10 text-[#85142f] uppercase tracking-wider mb-2">
                {event.sportType}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-xs text-neutral-600 font-medium">
                <span className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <Calendar className="w-4 h-4 text-[#85142f]" />
                  {event.date}
                </span>
                {event.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    {event.time}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  {event.venue}
                </span>
              </div>
            </div>

            {/* QR Code Graphic Simulation */}
            <div className="sm:self-center shrink-0 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
              <div className="w-24 h-24 bg-white border border-neutral-300 rounded-xl p-1 flex items-center justify-center mx-auto mb-1.5">
                <QrCode className="w-20 h-20 text-neutral-900" />
              </div>
              <span className="text-[10px] font-mono font-black text-neutral-600">
                {bookingId}
              </span>
            </div>
          </div>

          {/* Participant / Ticket Roster */}
          <div>
            <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider mb-3">
              {isParticipation ? 'Registered Participants & BIB Details' : 'Confirmed Seats & Passes'}
            </h4>

            {isParticipation && participants.length > 0 ? (
              <div className="space-y-2.5">
                {participants.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#85142f]/10 text-[#85142f] font-black flex items-center justify-center shrink-0 text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-extrabold text-neutral-900 text-sm">
                          {p.fullName || `Participant ${idx + 1}`}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span>Age: {p.age || 'N/A'}</span>
                          <span>•</span>
                          <span>Gender: {p.gender || 'N/A'}</span>
                          {p.tshirtSize && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 font-bold text-neutral-700">
                                <Shirt className="w-3 h-3" />
                                {p.tshirtSize}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-rose-50 text-[#85142f] font-mono font-extrabold text-[11px]">
                        BIB #{Math.floor(1000 + idx * 7 + (Math.random() * 50))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-neutral-900 block">
                        {item.name}
                      </span>
                      {item.seatDetails && (
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {item.seatDetails.stand} • {item.seatDetails.block} • Row {item.seatDetails.row} • Seat {item.seatDetails.seatNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-black text-neutral-900 block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Delivery Summary */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Method</span>
              <span className="font-extrabold text-neutral-900 capitalize">
                {data.deliveryType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Payment Mode</span>
              <span className="font-extrabold text-neutral-900">
                UPI / NetBanking (Simulated)
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-black text-neutral-950">
              <span>Total Amount Paid</span>
              <span className="text-base text-[#85142f]">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="py-3 px-5 rounded-xl border-2 border-neutral-300 font-extrabold text-xs text-neutral-800 flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download / Print Passes</span>
            </button>

            <Link
              href="/sports"
              className="py-3 px-5 rounded-xl bg-[#85142f] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#6c0f25] transition-all"
            >
              <span>Explore More Sports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
