'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  QrCode,
  Sparkles,
  Ticket,
  User,
  Phone,
  Mail,
  Shirt,
  Heart,
  ShieldCheck,
  Building2,
  CreditCard,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
import { SportEvent, ParticipantInfo, ParticipationCategory } from '@/types/sports';
import { useOptionalAccount } from '@/context/AccountContext';

type SportsBookingStep = 'ticket' | 'registration' | 'review';

export default function SportsBookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  // Find event
  const event: SportEvent | undefined = useMemo(() => {
    return MOCK_SPORTS_EVENTS.find(
      (e) => e.id === eventId || e.slug === eventId
    );
  }, [eventId]);

  const account = useOptionalAccount();
  const [currentStep, setCurrentStep] = useState<SportsBookingStep>('ticket');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');

  // Selected quantities map: { [categoryId]: count }
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // List of participants generated from selected quantities
  const [participants, setParticipants] = useState<
    Array<{
      id: string;
      categoryName: string;
      categoryFee: number;
      fullName: string;
      age: string;
      gender: string;
      email: string;
      phone: string;
      emergencyPhone: string;
      tshirtSize: string;
      bloodGroup: string;
      medicalAccepted: boolean;
    }>
  >([]);

  // Delivery type in review step
  const [deliveryType, setDeliveryType] = useState<'m_ticket' | 'courier'>('m_ticket');
  const [courierAddress, setCourierAddress] = useState({
    fullName: 'Chandresh',
    phone: '+91 9876543210',
    street: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    pincode: '560038',
  });

  // Available categories (from participationCategories or ticketCategories or fallback)
  const categories: ParticipationCategory[] = useMemo(() => {
    if (!event) return [];
    if (event.participationCategories && event.participationCategories.length > 0) {
      return event.participationCategories;
    }
    if (event.ticketCategories && event.ticketCategories.length > 0) {
      return event.ticketCategories.map((t) => ({
        id: t.id,
        name: t.name,
        fee: t.price,
        statusText: t.statusText,
        isSoldOut: t.isSoldOut || !t.available,
      }));
    }
    return [
      { id: 'cat-std', name: 'STANDARD ADMISSION', fee: event.startingPrice || 399 },
    ];
  }, [event]);

  // Total tickets count & subtotal
  const totalTickets = useMemo(() => {
    return Object.values(selectedQuantities).reduce((acc, q) => acc + q, 0);
  }, [selectedQuantities]);

  const itemsSubtotal = useMemo(() => {
    return categories.reduce((acc, cat) => {
      const q = selectedQuantities[cat.id] || 0;
      return acc + q * cat.fee;
    }, 0);
  }, [categories, selectedQuantities]);

  const convenienceFee = totalTickets * 40;
  const gst = Math.round(convenienceFee * 0.18);
  const deliveryFee = deliveryType === 'courier' ? 99 : 0;
  const grandTotal = itemsSubtotal + convenienceFee + gst + deliveryFee;

  // Handler for adding/updating quantity
  const handleUpdateQuantity = (catId: string, newQty: number) => {
    if (newQty < 0) return;
    if (newQty > 10) return;

    // Check 10-ticket limit across all
    const currentTotalExcluding = Object.entries(selectedQuantities).reduce(
      (acc, [id, q]) => (id === catId ? acc : acc + q),
      0
    );

    if (currentTotalExcluding + newQty > 10) {
      alert('You can add up to 10 tickets only.');
      return;
    }

    setSelectedQuantities((prev) => {
      const copy = { ...prev };
      if (newQty === 0) {
        delete copy[catId];
      } else {
        copy[catId] = newQty;
      }
      return copy;
    });
  };

  // Move from Ticket -> Registration
  const handleProceedToRegistration = () => {
    if (totalTickets === 0) return;

    // Generate participant list
    const newParticipants: typeof participants = [];
    categories.forEach((cat) => {
      const count = selectedQuantities[cat.id] || 0;
      for (let i = 0; i < count; i++) {
        // Try to preserve existing participant data if available
        const existing = participants[newParticipants.length];
        newParticipants.push({
          id: `${cat.id}-${i}`,
          categoryName: cat.name,
          categoryFee: cat.fee,
          fullName: existing?.fullName || '',
          age: existing?.age || '',
          gender: existing?.gender || '',
          email: existing?.email || '',
          phone: existing?.phone || '',
          emergencyPhone: existing?.emergencyPhone || '',
          tshirtSize: existing?.tshirtSize || 'M',
          bloodGroup: existing?.bloodGroup || 'O+',
          medicalAccepted: existing?.medicalAccepted || false,
        });
      }
    });

    setParticipants(newParticipants);
    setCurrentStep('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update a single participant's field
  const handleUpdateParticipant = (index: number, field: string, val: any) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    );
  };

  // Move from Registration -> Review & Pay
  const handleProceedToReview = () => {
    // Validate each participant
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName.trim()) {
        alert(`Please enter full name for Participant ${i + 1} (${p.categoryName}).`);
        return;
      }
      if (!p.age || Number(p.age) <= 0) {
        alert(`Please enter valid age for Participant ${i + 1}.`);
        return;
      }
      if (!p.phone.trim()) {
        alert(`Please enter contact phone for Participant ${i + 1}.`);
        return;
      }
      if (!p.medicalAccepted) {
        alert(`Please accept the medical declaration for Participant ${i + 1}.`);
        return;
      }
    }

    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Finalize payment
  const handleCompletePayment = () => {
    const mockId = `BK-SP-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(mockId);
    if (account && event) {
      account.addOrder({
        id: 'ord-' + Date.now(),
        bookingId: mockId,
        type: 'sport',
        title: event.title,
        subtitle: `${event.sportType} • ${event.distanceOrCategory || 'Entry Pass'}`,
        posterImage: event.image,
        venue: event.venue,
        city: event.city || 'Bengaluru',
        date: event.date,
        time: event.time || '06:00 AM',
        seatsOrTier:
          participants.length > 0
            ? participants.map((p) => p.categoryName).join(', ')
            : `${totalTickets} Pass(es)`,
        quantity: totalTickets || 1,
        ticketPrice: itemsSubtotal,
        convenienceFee: convenienceFee + gst,
        donationAmount: account.preferences.autoRoundupCharity ? 1 : 0,
        discountAmount: 0,
        totalPaid: grandTotal,
        paymentMethod: 'BookKaro Sports Checkout (Simulated)',
        status: 'CONFIRMED',
        isUpcoming: true,
        deliveryType: deliveryType === 'courier' ? 'Home Delivery' : 'M-Ticket',
        bookedAt: 'Just now',
        canCancel: false,
        itemHref: `/sports/${event.id}`,
      });
    }
    setIsConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border text-center max-w-sm">
          <p className="font-bold text-sm text-neutral-800 mb-4">Event not found.</p>
          <Link
            href="/sports"
            className="px-5 py-2 rounded-lg bg-[#85142f] text-white text-xs font-bold"
          >
            Back to Sports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 flex flex-col justify-between selection:bg-[#85142f] selection:text-white">
      {/* ── TOP HEADER (Matching BookMyShow Screenshots 6 & 7) ──────────────── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[#85142f] font-black text-xl tracking-tight hidden sm:block"
            >
              Book<span className="text-neutral-950 font-normal">Karo</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (currentStep === 'registration') setCurrentStep('ticket');
                else if (currentStep === 'review') setCurrentStep('registration');
                else router.push(`/sports/${event.id}`);
              }}
              className="p-1 rounded-full text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>

          <h2 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate max-w-xs sm:max-w-md text-center">
            {event.title}
          </h2>

          <div className="w-8" />
        </div>

        {/* ── STEPPER: ❶ Ticket > ❷ Registration > ❸ Review & Proceed to Pay ─── */}
        <div className="border-t border-neutral-100 bg-white py-2.5 px-4">
          <div className="max-w-md mx-auto flex items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
            <span
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 'ticket' ? 'text-neutral-950' : 'text-neutral-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 'ticket'
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                1
              </span>
              <span>Ticket</span>
            </span>

            <span className="text-neutral-300 font-normal">&gt;</span>

            <span
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 'registration' ? 'text-neutral-950' : 'text-neutral-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 'registration'
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                2
              </span>
              <span>Registration</span>
            </span>

            <span className="text-neutral-300 font-normal">&gt;</span>

            <span
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === 'review' ? 'text-neutral-950' : 'text-neutral-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 'review'
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                3
              </span>
              <span>Review & Proceed to Pay</span>
            </span>
          </div>
        </div>

        {/* ── EVENT VENUE & DATE GREY STRIP (Screenshots 6 & 7) ──────────────── */}
        <div className="bg-[#e9ecef] py-2 px-4 text-center text-xs font-semibold text-neutral-700 border-b border-neutral-200">
          <span>{event.venue}</span>
          <span className="mx-2">•</span>
          <span>
            {event.date} | {event.time || '05:15 AM'}
          </span>
        </div>
      </header>

      {/* ── MAIN WORKFLOW ─────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 sm:py-8 flex-1">
        
        {/* ════════════════════════════════════════════════════════════════════
            STEP 1: SELECT TICKETS (Matching Screenshots 6 & 7 Exactly)
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 'ticket' && !isConfirmed && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                Select Tickets
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                You can add up to 10 tickets only
              </p>
            </div>

            {/* Ticket Cards List */}
            <div className="space-y-3 pt-2">
              {categories.map((cat) => {
                const qty = selectedQuantities[cat.id] || 0;
                const isSoldOut = cat.isSoldOut;

                return (
                  <div
                    key={cat.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isSoldOut
                        ? 'bg-white border-neutral-200/80 opacity-60'
                        : qty > 0
                        ? 'bg-white border-[#e11d48]/50 shadow-xs ring-1 ring-[#e11d48]/20'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                    }`}
                  >
                    {/* Left: Title & Price */}
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 tracking-tight truncate">
                        {cat.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-extrabold text-neutral-950">
                          ₹{cat.fee.toLocaleString('en-IN')}
                        </span>
                        {cat.statusText && (
                          <>
                            <span className="text-neutral-400">|</span>
                            <span
                              className={`font-bold ${
                                cat.statusText.toLowerCase().includes('sold')
                                  ? 'text-neutral-500'
                                  : 'text-[#e11d48]'
                              }`}
                            >
                              {cat.statusText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Add Button OR Quantity Counter (Screenshot 6 & 7) */}
                    <div className="shrink-0">
                      {isSoldOut ? null : qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(cat.id, 1)}
                          className="px-6 py-1.5 rounded-lg border border-[#e11d48] text-[#e11d48] hover:bg-rose-50 text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-2xs"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center border border-[#e11d48] rounded-lg bg-white overflow-hidden text-[#e11d48] shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(cat.id, qty - 1)}
                            className="px-3 py-1 font-extrabold text-sm hover:bg-rose-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 font-black text-xs text-neutral-950">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(cat.id, qty + 1)}
                            className="px-3 py-1 font-extrabold text-sm hover:bg-rose-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 2: REGISTRATION (Participant Information Form)
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 'registration' && !isConfirmed && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                Participant Details
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Enter details for each registered participant for event passes and emergency safety
              </p>
            </div>

            <div className="space-y-5">
              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                    <span className="font-black text-xs sm:text-sm text-neutral-950">
                      Participant {idx + 1} ({p.categoryName})
                    </span>
                    <span className="text-[11px] font-extrabold text-[#e11d48] bg-rose-50 px-2 py-0.5 rounded">
                      Fee: ₹{p.categoryFee}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Full Name (as on Govt ID) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={p.fullName}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'fullName', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 26"
                        value={p.age}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'age', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={p.gender}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'gender', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Contact Mobile *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={p.phone}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'phone', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Event T-Shirt Size
                      </label>
                      <select
                        value={p.tshirtSize}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'tshirtSize', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                          <option key={sz} value={sz}>
                            {sz} (Unisex)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9123456789"
                        value={p.emergencyPhone}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'emergencyPhone', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.medicalAccepted}
                        onChange={(e) =>
                          handleUpdateParticipant(idx, 'medicalAccepted', e.target.checked)
                        }
                        className="mt-0.5 rounded border-neutral-300 text-[#e11d48] focus:ring-[#e11d48]"
                      />
                      <span className="text-[11px] text-neutral-600 leading-snug">
                        I confirm that Participant {idx + 1} is medically fit to run and agrees to safety guidelines & liability waiver.
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 3: REVIEW & PROCEED TO PAY (Order Summary & Checkout)
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 'review' && !isConfirmed && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                Review & Proceed to Pay
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Verify booking details and choose your pass delivery format
              </p>
            </div>

            {/* Delivery Option */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3">
              <span className="text-xs font-black uppercase text-neutral-400">
                Ticket Delivery Format
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliveryType('m_ticket')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    deliveryType === 'm_ticket'
                      ? 'border-[#e11d48] bg-rose-50/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-neutral-900">
                    Digital M-Ticket
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Instant WhatsApp & SMS pass (FREE)
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryType('courier')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    deliveryType === 'courier'
                      ? 'border-[#e11d48] bg-rose-50/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-neutral-900">
                    Home Bib Courier
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Delivered to doorstep (+₹99)
                  </div>
                </div>
              </div>

              {deliveryType === 'courier' && (
                <div className="pt-2 text-xs space-y-2">
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={courierAddress.street}
                    onChange={(e) =>
                      setCourierAddress({ ...courierAddress, street: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#e11d48] focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2.5 text-xs">
              <span className="text-xs font-black uppercase text-neutral-400 block mb-1">
                Order Summary
              </span>

              <div className="flex justify-between text-neutral-700">
                <span>Tickets Subtotal ({totalTickets} tickets)</span>
                <span className="font-extrabold text-neutral-900">
                  ₹{itemsSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-700">
                <span>Booking & Convenience Fee</span>
                <span className="font-extrabold text-neutral-900">
                  ₹{convenienceFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-neutral-700">
                <span>Integrated GST (18%)</span>
                <span className="font-extrabold text-neutral-900">
                  ₹{gst.toLocaleString('en-IN')}
                </span>
              </div>

              {deliveryFee > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Home Courier Fee</span>
                  <span className="font-extrabold text-neutral-900">
                    ₹{deliveryFee}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm font-black text-neutral-950">
                <span>Total Amount</span>
                <span className="text-base text-[#e11d48]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Simulation Demo Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Simulation Mode:</strong> No real payment is deducted. Click Confirm Payment to generate your BookMyShow-style M-Ticket.
              </span>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 4: CONFIRMATION (M-Ticket Screen with QR code)
            ════════════════════════════════════════════════════════════════════ */}
        {isConfirmed && (
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden space-y-6 pb-8 animate-in fade-in duration-300">
            <div className="bg-[#e11d48] text-white p-6 sm:p-8 text-center relative">
              <div className="w-14 h-14 rounded-full bg-white text-[#e11d48] flex items-center justify-center mx-auto mb-2 shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5px]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-1">
                Booking Confirmed!
              </h2>
              <p className="text-rose-100 text-xs font-semibold">
                Booking ID: <span className="font-mono font-bold text-white">{bookingRefId}</span>
              </p>
            </div>

            <div className="px-6 space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-neutral-950">{event.title}</h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {event.venue} • {event.date} at {event.time || '05:15 AM'}
                </p>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center max-w-xs mx-auto">
                <div className="w-28 h-28 bg-white border rounded-xl p-2 mx-auto mb-2 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-neutral-900" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 block">
                  Scan at Entry Gate / Bib Expo
                </span>
              </div>

              {/* Participants Roster */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-neutral-400 block">
                  Registered Runners
                </span>
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-neutral-900 block">
                        {p.fullName || `Runner ${idx + 1}`}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {p.categoryName} • Jersey Size: {p.tshirtSize}
                      </span>
                    </div>
                    <span className="font-mono font-black text-[#e11d48] bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                      BIB #{1040 + idx * 7}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-4 rounded-xl border border-neutral-300 font-extrabold text-xs text-neutral-800 flex items-center justify-center gap-1.5 hover:bg-neutral-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Pass</span>
                </button>

                <Link
                  href="/sports"
                  className="py-2.5 px-4 rounded-xl bg-[#e11d48] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#be123c] text-center"
                >
                  <span>Explore Sports</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── STICKY BOTTOM PROCEED BAR (Matching Screenshots 6 & 7) ─────────── */}
      {!isConfirmed && (
        <div className="bg-white border-t border-neutral-200 p-3 sm:p-4 sticky bottom-0 z-40 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            {currentStep === 'ticket' ? (
              <button
                type="button"
                disabled={totalTickets === 0}
                onClick={handleProceedToRegistration}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-tight transition-all text-center cursor-pointer ${
                  totalTickets === 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                    : 'bg-[#85142f] hover:bg-[#6e1026] text-white shadow-md active:scale-98'
                }`}
              >
                {totalTickets === 0
                  ? 'Proceed'
                  : `Proceed • ₹${itemsSubtotal.toLocaleString('en-IN')}`}
              </button>
            ) : currentStep === 'registration' ? (
              <button
                type="button"
                onClick={handleProceedToReview}
                className="w-full py-3.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white font-extrabold text-sm tracking-tight shadow-md active:scale-98 transition-all text-center cursor-pointer"
              >
                Proceed to Review & Pay
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompletePayment}
                className="w-full py-3.5 rounded-xl bg-[#85142f] hover:bg-[#6e1026] text-white font-extrabold text-sm tracking-tight shadow-md active:scale-98 transition-all text-center cursor-pointer"
              >
                Confirm Payment • ₹{grandTotal.toLocaleString('en-IN')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
