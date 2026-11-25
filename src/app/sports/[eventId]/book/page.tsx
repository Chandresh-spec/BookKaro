'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Trophy,
  Ticket,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MOCK_SPORTS_EVENTS } from '@/data/mockSportsEvents';
import { STADIUM_VENUE_CONFIG } from '@/data/mockVenues';
import { SportEvent, ParticipantInfo, SportBookingItem, ParticipationCategory } from '@/types/sports';
import { TicketDeliveryType, DeliveryAddress } from '@/types/booking';
import { StadiumStand, StadiumBlock, StadiumSeat } from '@/types/venue';
import { User } from '@/types';

import { BookingStepper, BookingStep } from '@/components/booking/BookingStepper';
import { ReservationTimer } from '@/components/booking/ReservationTimer';
import { StadiumMap } from '@/components/booking/reserved-seating/StadiumMap';
import { BlockSelector } from '@/components/booking/reserved-seating/BlockSelector';
import { SeatMap } from '@/components/booking/reserved-seating/SeatMap';
import { MockPayment } from '@/components/booking/checkout/MockPayment';

import { ParticipationRegistration } from '@/components/sports/registration/ParticipationRegistration';
import { SportsGeneralAdmission } from '@/components/sports/general-admission/SportsGeneralAdmission';
import { SportsDeliverySelector } from '@/components/sports/checkout/SportsDeliverySelector';
import {
  SportsBookingConfirmation,
  SportsConfirmationData,
} from '@/components/sports/checkout/SportsBookingConfirmation';
import { SportsBookingSummary } from '@/components/sports/SportsBookingSummary';

export default function SportEventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  // Nav state
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  // Find event
  const event: SportEvent | undefined = useMemo(() => {
    return MOCK_SPORTS_EVENTS.find(
      (e) => e.id === eventId || e.slug === eventId
    );
  }, [eventId]);

  // Stepper state: 'tickets' -> 'delivery' -> 'payment'
  const [currentStep, setCurrentStep] = useState<BookingStep>('tickets');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationData, setConfirmationData] = useState<SportsConfirmationData | null>(null);

  // Selected ticket / participation items
  const [selectedItems, setSelectedItems] = useState<SportBookingItem[]>([]);
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Delivery options state
  const [deliveryType, setDeliveryType] = useState<TicketDeliveryType>('digital');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: 'Chandresh',
    phone: '+91 9876543210',
    street: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  // General Admission quantities
  const [gaQuantities, setGaQuantities] = useState<Record<string, number>>({});

  // Reserved Seating state
  const [selectedStand, setSelectedStand] = useState<StadiumStand | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<StadiumBlock | null>(null);

  // Mode A: Handle Participation selection
  const handleParticipationChange = (
    category: ParticipationCategory,
    quantity: number,
    updatedParticipants: ParticipantInfo[]
  ) => {
    setParticipants(updatedParticipants);
    setSelectedItems([
      {
        id: category.id,
        name: category.name,
        price: category.fee,
        quantity,
        distance: category.distance,
        includesTShirt: category.includesTShirt,
        participants: updatedParticipants,
      },
    ]);
  };

  // Mode B: Handle General Admission quantity change
  const handleGAQuantityChange = (categoryId: string, quantity: number) => {
    setGaQuantities((prev) => {
      const updated = { ...prev, [categoryId]: quantity };
      if (quantity === 0) delete updated[categoryId];
      return updated;
    });

    if (!event || !event.ticketCategories) return;
    const items: SportBookingItem[] = [];
    event.ticketCategories.forEach((cat) => {
      const q = cat.id === categoryId ? quantity : gaQuantities[cat.id] || 0;
      if (q > 0) {
        items.push({
          id: cat.id,
          name: cat.name,
          price: cat.price,
          quantity: q,
        });
      }
    });
    setSelectedItems(items);
  };

  // Mode C: Handle Reserved Seat Toggle
  const handleToggleSeat = (
    seat: StadiumSeat,
    stand: StadiumStand,
    block: StadiumBlock
  ) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === seat.id);
      if (exists) {
        return prev.filter((item) => item.id !== seat.id);
      } else {
        if (prev.length >= 8) {
          alert('You can select a maximum of 8 seats per order.');
          return prev;
        }
        return [
          ...prev,
          {
            id: seat.id,
            name: `${stand.name} • ${block.code} • Row ${seat.row} - Seat ${seat.number}`,
            price: seat.price,
            quantity: 1,
            seatDetails: {
              stand: stand.name,
              block: block.name,
              row: seat.row,
              seatNumber: seat.number,
              tier: seat.tier,
            },
          },
        ];
      }
    });
  };

  // Validation before proceeding from Step 1
  const validateStep1 = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one ticket or participation category.');
      return false;
    }
    if (event?.bookingMode === 'participation') {
      for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        if (!p.fullName.trim()) {
          alert(`Please enter full name for Participant ${i + 1}.`);
          return false;
        }
        if (!p.age || Number(p.age) <= 0) {
          alert(`Please enter valid age for Participant ${i + 1}.`);
          return false;
        }
        if (!p.phone.trim()) {
          alert(`Please enter mobile number for Participant ${i + 1}.`);
          return false;
        }
        if (!p.medicalDeclarationAccepted) {
          alert(`Please accept the medical declaration waiver for Participant ${i + 1}.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleProceedFromTickets = () => {
    if (!validateStep1()) return;
    setCurrentStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromDelivery = () => {
    if (deliveryType === 'home_delivery') {
      if (!deliveryAddress.fullName || !deliveryAddress.street || !deliveryAddress.pincode) {
        alert('Please fill in complete courier delivery address.');
        return;
      }
    }
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = () => {
    if (!event) return;
    const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const feePerUnit = event.bookingMode === 'participation' ? 35 : 40;
    const totalConvenienceFee = totalQuantity * feePerUnit;
    const gstOnFee = Math.round(totalConvenienceFee * 0.18);
    const deliveryFee = deliveryType === 'home_delivery' ? 99 : 0;
    const totalPaid = itemsSubtotal + totalConvenienceFee + gstOnFee + deliveryFee;

    const mockBookingId = `BK-SP-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmation: SportsConfirmationData = {
      bookingId: mockBookingId,
      bookingTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      event,
      items: selectedItems,
      totalPaid,
      deliveryType,
      deliveryAddress: deliveryType === 'home_delivery' ? deliveryAddress : undefined,
      participants: event.bookingMode === 'participation' ? participants : undefined,
    };

    setConfirmationData(confirmation);
    setIsConfirmed(true);
    setIsMobileSummaryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations for summary & mobile bar
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const feePerUnit = event?.bookingMode === 'participation' ? 35 : 40;
  const totalConvenienceFee = totalQuantity * feePerUnit;
  const gstOnFee = Math.round(totalConvenienceFee * 0.18);
  const deliveryFee = deliveryType === 'home_delivery' ? 99 : 0;
  const totalPayable = itemsSubtotal + totalConvenienceFee + gstOnFee + deliveryFee;

  const currentButtonLabel =
    currentStep === 'tickets'
      ? 'Continue to Delivery'
      : currentStep === 'delivery'
      ? 'Continue to Payment'
      : 'Confirm Payment';

  const handleProceedCurrentStep = () => {
    if (currentStep === 'tickets') handleProceedFromTickets();
    else if (currentStep === 'delivery') handleProceedFromDelivery();
    else handlePaymentSuccess();
  };

  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col justify-between selection:bg-[#85142f] selection:text-white">
        <Navbar
          currentCity={currentCity}
          user={currentUser}
          onSelectCity={setCurrentCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs flex flex-col items-center">
            <Trophy className="w-12 h-12 text-[#85142f] mb-3" />
            <h1 className="text-xl font-black text-neutral-900 mb-2">Sports Event Not Found</h1>
            <p className="text-xs text-neutral-500 mb-6">
              Could not find sport event with ID "{eventId}".
            </p>
            <Link
              href="/sports"
              className="px-6 py-2.5 rounded-full bg-[#85142f] text-white text-xs font-bold"
            >
              Back to Sports Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-neutral-900 selection:bg-[#85142f] selection:text-white pb-32 sm:pb-36 lg:pb-16">
      {/* 1. TOP NAVBAR (Hidden on mobile to maximize space) */}
      <div className="hidden lg:block">
        <Navbar
          currentCity={event.city || currentCity}
          user={currentUser}
          onSelectCity={setCurrentCity}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSignOut={() => setCurrentUser(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 2. SUB-HEADER WITH TIMER & BREADCRUMB */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 lg:top-20 z-40 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link
            href={`/sports/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#85142f] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5px] text-[#85142f]" />
            <span className="truncate max-w-[170px] sm:max-w-md font-extrabold text-neutral-950">
              {event.title}
            </span>
          </Link>

          {!isConfirmed && (
            <ReservationTimer
              initialSeconds={600}
              onExpire={() => {
                alert('Your sports booking hold time has expired. Please select tickets again.');
                setSelectedItems([]);
                setCurrentStep('tickets');
              }}
            />
          )}
        </div>
      </header>

      {/* 3. BOOKING STEPPER */}
      {!isConfirmed && (
        <BookingStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step === 'delivery' && !validateStep1()) return;
            if (step === 'payment' && !validateStep1()) return;
            setCurrentStep(step);
          }}
        />
      )}

      {/* 4. MAIN WORKFLOW CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 flex-1 w-full">
        {isConfirmed && confirmationData ? (
          /* STEP 4: SUCCESS CONFIRMATION */
          <SportsBookingConfirmation data={confirmationData} />
        ) : (
          <div className="lg:flex lg:gap-8 items-start">
            {/* LEFT COLUMN: ACTIVE STEP INTERFACE */}
            <div className="flex-1 min-w-0 mb-6 lg:mb-0">
              {/* STEP 1: SELECT TICKETS ACCORDING TO BOOKING MODE */}
              {currentStep === 'tickets' && (
                <>
                  {/* MODE A: PARTICIPATION REGISTRATION (Marathons, Running, Tournaments) */}
                  {event.bookingMode === 'participation' && (
                    <ParticipationRegistration
                      categories={event.participationCategories || []}
                      currency={event.currency}
                      selectedCategory={
                        event.participationCategories?.find(
                          (c) => c.id === selectedItems[0]?.id
                        ) || null
                      }
                      selectedQuantity={selectedItems[0]?.quantity || 1}
                      initialParticipants={participants}
                      onSelectionChange={handleParticipationChange}
                    />
                  )}

                  {/* MODE B: GENERAL ADMISSION SPORTS (Motorsports, Tournaments) */}
                  {event.bookingMode === 'general-admission' && (
                    <SportsGeneralAdmission
                      categories={event.ticketCategories || []}
                      selectedQuantities={gaQuantities}
                      onQuantityChange={handleGAQuantityChange}
                      currency={event.currency}
                    />
                  )}

                  {/* MODE C: RESERVED STADIUM SEATING (Football, Cricket, Basketball) */}
                  {event.bookingMode === 'reserved-seating' && (
                    <div className="space-y-6">
                      {/* View 1: Stadium Map Overview */}
                      {!selectedStand && (
                        <div>
                          <div className="mb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-[#85142f] bg-rose-50 px-2.5 py-1 rounded-md inline-block mb-1">
                              Stadium Overview
                            </span>
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                              Select Stand — {event.venue}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              Click any highlighted stand (North, South, East, West) to inspect block tiers.
                            </p>
                          </div>
                          <StadiumMap
                            venueConfig={STADIUM_VENUE_CONFIG}
                            selectedStand={selectedStand}
                            onSelectStand={(stand) => {
                              setSelectedStand(stand);
                              setSelectedBlock(null);
                            }}
                          />
                        </div>
                      )}

                      {/* View 2: Block Selector */}
                      {selectedStand && !selectedBlock && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-xs font-black uppercase tracking-wider text-[#85142f] bg-rose-50 px-2.5 py-1 rounded-md inline-block mb-1">
                                {selectedStand.name}
                              </span>
                              <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                                Select Block / Bay
                              </h3>
                              <p className="text-xs text-neutral-500">
                                Choose a seating block tier to view individual numbered seats.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedStand(null)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Back to Stands</span>
                            </button>
                          </div>
                          <BlockSelector
                            stand={selectedStand}
                            onSelectBlock={(block) => setSelectedBlock(block)}
                            onBackToStadium={() => setSelectedStand(null)}
                          />
                        </div>
                      )}

                      {/* View 3: Detailed Seat Map */}
                      {selectedStand && selectedBlock && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-xs font-black uppercase tracking-wider text-[#85142f] bg-rose-50 px-2.5 py-1 rounded-md inline-block mb-1">
                                {selectedStand.name} • {selectedBlock.name}
                              </span>
                              <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                                Select Your Seats
                              </h3>
                              <p className="text-xs text-neutral-500">
                                Click seats to select or unselect. Max 8 seats per order.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedBlock(null)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Back to Blocks</span>
                            </button>
                          </div>
                          <SeatMap
                            stand={selectedStand}
                            block={selectedBlock}
                            selectedItems={selectedItems.map((item) => ({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: item.quantity,
                              seatDetails: item.seatDetails as any,
                            }))}
                            onToggleSeat={(seat) =>
                              handleToggleSeat(seat, selectedStand, selectedBlock)
                            }
                            onBackToBlocks={() => setSelectedBlock(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: DELIVERY OPTIONS */}
              {currentStep === 'delivery' && (
                <SportsDeliverySelector
                  event={event}
                  selectedDelivery={deliveryType}
                  onSelectDelivery={setDeliveryType}
                  address={deliveryAddress}
                  onAddressChange={setDeliveryAddress}
                />
              )}

              {/* STEP 3: MOCK PAYMENT CHECKOUT */}
              {currentStep === 'payment' && (
                <MockPayment
                  totalAmount={totalPayable}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>

            {/* RIGHT COLUMN: STICKY BOOKING SUMMARY (Desktop) */}
            <aside className="hidden lg:block w-80 lg:w-96 shrink-0 sticky top-36">
              <SportsBookingSummary
                event={event}
                selectedItems={selectedItems}
                deliveryType={deliveryType}
                deliveryFee={deliveryFee}
                onRemoveItem={(id) => {
                  setSelectedItems((prev) => prev.filter((i) => i.id !== id));
                }}
                onProceed={handleProceedCurrentStep}
                buttonLabel={currentButtonLabel}
                isProceedDisabled={totalQuantity === 0}
              />
            </aside>
          </div>
        )}
      </main>

      {/* 5. MOBILE FLOATING ACTION BAR & EXPANDABLE DRAWER */}
      {!isConfirmed && (
        <>
          {/* Backdrop when mobile summary expanded */}
          {isMobileSummaryOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
              onClick={() => setIsMobileSummaryOpen(false)}
            />
          )}

          {/* Expandable Mobile Summary Drawer */}
          <div
            className={`lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-neutral-200/90 shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
              isMobileSummaryOpen ? 'translate-y-0' : 'translate-y-[calc(100%-76px)]'
            }`}
          >
            {/* Drawer Peek Header / Toggle */}
            <div
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-neutral-900">
                  {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'} Selected
                </span>
                <span className="text-xs text-neutral-400 font-bold">•</span>
                <span className="text-sm font-black text-[#85142f]">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                <span>{isMobileSummaryOpen ? 'Hide Summary' : 'View Summary'}</span>
                {isMobileSummaryOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Scrollable Summary Body */}
            {isMobileSummaryOpen && (
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                <SportsBookingSummary
                  event={event}
                  selectedItems={selectedItems}
                  deliveryType={deliveryType}
                  deliveryFee={deliveryFee}
                  onRemoveItem={(id) => {
                    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
                  }}
                  onProceed={handleProceedCurrentStep}
                  buttonLabel={currentButtonLabel}
                  isProceedDisabled={totalQuantity === 0}
                />
              </div>
            )}

            {/* Persistent Mobile Bottom Action Bar */}
            <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">
                  Total Payable
                </span>
                <span className="text-lg font-black text-neutral-950 truncate block">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                disabled={totalQuantity === 0}
                onClick={handleProceedCurrentStep}
                className="py-3 px-6 rounded-full bg-[#85142f] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>{currentButtonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <Footer />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
