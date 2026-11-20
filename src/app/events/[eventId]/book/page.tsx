'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { LIVE_EVENTS_MOCK } from '@/data/mockEvents';
import { STADIUM_VENUE_CONFIG, ZONE_VENUE_CONFIG } from '@/data/mockVenues';
import {
  getGeneralAdmissionTiers,
  getZoneEventInventory,
} from '@/data/mockInventory';
import { LiveEvent, User } from '@/types';
import {
  SelectedTicketItem,
  TicketDeliveryType,
  DeliveryAddress,
  BookingConfirmationResult,
} from '@/types/booking';
import { StadiumStand, StadiumBlock, StadiumSeat } from '@/types/venue';
import { TicketTier, ConcertZone } from '@/types/event';

import { BookingStepper, BookingStep } from '@/components/booking/BookingStepper';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { ReservationTimer } from '@/components/booking/ReservationTimer';
import { GeneralAdmission } from '@/components/booking/general-admission/GeneralAdmission';
import { ZoneBooking } from '@/components/booking/zone-based/ZoneBooking';
import { StadiumMap } from '@/components/booking/reserved-seating/StadiumMap';
import { BlockSelector } from '@/components/booking/reserved-seating/BlockSelector';
import { SeatMap } from '@/components/booking/reserved-seating/SeatMap';
import { DeliverySelector } from '@/components/booking/checkout/DeliverySelector';
import { MockPayment } from '@/components/booking/checkout/MockPayment';
import { BookingConfirmation } from '@/components/booking/checkout/BookingConfirmation';

export default function EventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  // Global nav state
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_c1',
    name: 'Chandresh',
    email: 'chandresh@example.com',
  });

  // Find event
  const event: LiveEvent | undefined = useMemo(() => {
    return LIVE_EVENTS_MOCK.find((e) => e.id === eventId);
  }, [eventId]);

  // Stepper state: 'tickets' -> 'delivery' -> 'payment' -> 'confirmation'
  const [currentStep, setCurrentStep] = useState<BookingStep>('tickets');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationData, setConfirmationData] = useState<BookingConfirmationResult | null>(null);

  // Selected ticket items
  const [selectedItems, setSelectedItems] = useState<SelectedTicketItem[]>([]);
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

  // Reserved Seating Navigation state (Stadium -> Stand -> Block -> Seat)
  const [selectedStand, setSelectedStand] = useState<StadiumStand | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<StadiumBlock | null>(null);

  // Inventories for this event
  const gaTiers = useMemo(() => {
    if (!event) return [];
    return getGeneralAdmissionTiers(event.startingPrice);
  }, [event]);

  const zoneInventory = useMemo(() => {
    if (!event) return [];
    return getZoneEventInventory(event.id, event.startingPrice);
  }, [event]);

  // General Admission quantity handler
  const handleGAQuantityChange = (tier: TicketTier, quantity: number) => {
    setSelectedItems((prev) => {
      const filtered = prev.filter((item) => item.id !== tier.id);
      if (quantity === 0) return filtered;
      return [
        ...filtered,
        {
          id: tier.id,
          name: tier.name,
          price: tier.price,
          quantity,
        },
      ];
    });
  };

  // Zone quantity handler
  const handleZoneQuantityChange = (zone: ConcertZone, quantity: number) => {
    setSelectedItems((prev) => {
      const filtered = prev.filter((item) => item.id !== zone.id);
      if (quantity === 0) return filtered;
      return [
        ...filtered,
        {
          id: zone.id,
          name: zone.name,
          price: zone.price,
          quantity,
        },
      ];
    });
  };

  // Reserved Seat Toggle handler
  const handleToggleSeat = (
    seat: StadiumSeat,
    stand: StadiumStand,
    block: StadiumBlock
  ) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.id === seat.id);
      if (exists) {
        return prev.filter((item) => item.id !== seat.id);
      }
      return [
        ...prev,
        {
          id: seat.id,
          name: `${stand.name} • ${block.code} (Row ${seat.row}, Seat ${seat.number})`,
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
    });
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Step transitions
  const handleProceedFromTickets = () => {
    if (selectedItems.length === 0) return;
    setIsMobileSummaryOpen(false);
    setCurrentStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromDelivery = () => {
    setIsMobileSummaryOpen(false);
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = () => {
    if (!event) return;

    const totalTickets = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalConvenienceFee = totalTickets * 40;
    const gstOnFee = Math.round(totalConvenienceFee * 0.18);
    const deliveryFee = deliveryType === 'home_delivery' ? 99 : 0;
    const totalPaid = itemsSubtotal + totalConvenienceFee + gstOnFee + deliveryFee;

    const mockBookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmation: BookingConfirmationResult = {
      bookingId: mockBookingId,
      bookingTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time || '7:00 PM',
      venue: event.venue,
      items: selectedItems,
      totalPaid,
      deliveryType,
      deliveryAddress: deliveryType === 'home_delivery' ? deliveryAddress : undefined,
      qrCodeUrl: 'mock-qr-code',
    };

    setConfirmationData(confirmation);
    setIsConfirmed(true);
    setIsMobileSummaryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations for mobile bar
  const totalTickets = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalConvenienceFee = totalTickets * 40;
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
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-10 shadow-xs flex flex-col items-center">
            <h1 className="text-xl font-black text-neutral-900 mb-2">Event Not Found</h1>
            <p className="text-xs text-neutral-500 mb-6">Could not find event with ID "{eventId}".</p>
            <Link
              href="/events"
              className="px-6 py-2.5 rounded-full bg-[#85142f] text-white text-xs font-bold"
            >
              Back to Live Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-neutral-900 selection:bg-[#85142f] selection:text-white pb-32 sm:pb-36 lg:pb-16">
      
      {/* 1. TOP NAVBAR (Hidden on small mobile to maximize screen area for maps) */}
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
            href={`/events/${event.id}`}
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
                alert('Your reservation hold time has expired. Please select tickets again.');
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
          onStepClick={(step) => setCurrentStep(step)}
        />
      )}

      {/* 4. MAIN BOOKING WORKFLOW CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 flex-1 w-full">
        {isConfirmed && confirmationData ? (
          /* STEP 4: SUCCESS CONFIRMATION */
          <BookingConfirmation
            confirmation={confirmationData}
            event={event}
          />
        ) : (
          <div className="lg:flex lg:gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP INTERFACE */}
            <div className="flex-1 min-w-0 mb-6 lg:mb-0">
              
              {/* STEP 1: SELECT TICKETS ACCORDING TO BOOKING MODE */}
              {currentStep === 'tickets' && (
                <>
                  {/* MODE 1: GENERAL ADMISSION */}
                  {event.bookingType === 'general-admission' && (
                    <GeneralAdmission
                      tiers={gaTiers}
                      selectedItems={selectedItems}
                      onQuantityChange={handleGAQuantityChange}
                    />
                  )}

                  {/* MODE 2: ZONE-BASED ARENA */}
                  {event.bookingType === 'zone-based' && (
                    <ZoneBooking
                      venueConfig={ZONE_VENUE_CONFIG}
                      zones={zoneInventory}
                      selectedItems={selectedItems}
                      onZoneQuantityChange={handleZoneQuantityChange}
                    />
                  )}

                  {/* MODE 3: RESERVED STADIUM SEATING */}
                  {event.bookingType === 'reserved-seating' && (
                    <>
                      {!selectedStand ? (
                        /* View 1: Whole Stadium Overview & Stand Selection */
                        <StadiumMap
                          venueConfig={STADIUM_VENUE_CONFIG}
                          selectedStand={selectedStand}
                          onSelectStand={(stand) => setSelectedStand(stand)}
                        />
                      ) : !selectedBlock ? (
                        /* View 2: Stand View & Block Selection */
                        <BlockSelector
                          stand={selectedStand}
                          onBackToStadium={() => setSelectedStand(null)}
                          onSelectBlock={(block) => setSelectedBlock(block)}
                        />
                      ) : (
                        /* View 3: Detailed Interactive Seat Map */
                        <SeatMap
                          stand={selectedStand}
                          block={selectedBlock}
                          selectedItems={selectedItems}
                          onToggleSeat={handleToggleSeat}
                          onBackToBlocks={() => setSelectedBlock(null)}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {/* STEP 2: TICKET DELIVERY SELECTION */}
              {currentStep === 'delivery' && (
                <div className="space-y-6">
                  <DeliverySelector
                    event={event}
                    selectedDelivery={deliveryType}
                    onSelectDelivery={setDeliveryType}
                    address={deliveryAddress}
                    onAddressChange={setDeliveryAddress}
                  />

                  <div className="hidden lg:flex items-center justify-between pt-4 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('tickets')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Ticket Selection</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedFromDelivery}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#85142f] text-white text-xs sm:text-sm font-extrabold shadow-md hover:bg-[#6c0f25] transition-all"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: MOCK PAYMENT GATEWAY */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <div className="hidden lg:flex items-center justify-between pb-2 border-b border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('delivery')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-[#85142f]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Delivery Options</span>
                    </button>
                  </div>

                  <MockPayment
                    totalAmount={totalPayable}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY BOOKING SUMMARY (Desktop lg and up) */}
            <aside className="hidden lg:block w-96 shrink-0 lg:sticky lg:top-36">
              <BookingSummary
                event={event}
                selectedItems={selectedItems}
                deliveryType={deliveryType}
                deliveryFee={deliveryFee}
                onRemoveItem={handleRemoveItem}
                onProceed={handleProceedCurrentStep}
                buttonLabel={currentButtonLabel}
                isProceedDisabled={selectedItems.length === 0}
              />
            </aside>
          </div>
        )}
      </main>

      {/* 5. MOBILE & TABLET STICKY BOTTOM ACTION BAR (Screens < lg) */}
      {!isConfirmed && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 p-3 sm:p-4 z-50 shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            
            {/* Left: Summary summary info & trigger */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-neutral-950">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
                {totalTickets > 0 && (
                  <span className="text-[11px] font-bold text-neutral-500 truncate">
                    ({totalTickets} {totalTickets === 1 ? 'pass' : 'passes'})
                  </span>
                )}
              </div>

              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsMobileSummaryOpen(true)}
                  className="text-[11px] font-bold text-[#85142f] hover:underline flex items-center gap-0.5 cursor-pointer mt-0.5"
                >
                  <span>View Breakdown</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right: Primary Continue / Book button */}
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={handleProceedCurrentStep}
              className={`py-3 px-5 sm:px-7 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
                selectedItems.length === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                  : 'bg-[#85142f] text-white shadow-[#85142f]/35 hover:bg-[#6c0f25]'
              }`}
            >
              <span>{currentButtonLabel}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* 6. MOBILE SLIDE-UP SUMMARY DRAWER / BOTTOM SHEET */}
      {isMobileSummaryOpen && (
        <div className="fixed inset-0 z-55 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#85142f]" />
                <h3 className="font-extrabold text-sm text-neutral-900">
                  Order Breakdown & Selected Seats
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSummaryOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto">
              <BookingSummary
                event={event}
                selectedItems={selectedItems}
                deliveryType={deliveryType}
                deliveryFee={deliveryFee}
                onRemoveItem={handleRemoveItem}
                onProceed={() => {
                  setIsMobileSummaryOpen(false);
                  handleProceedCurrentStep();
                }}
                buttonLabel={currentButtonLabel}
                isProceedDisabled={selectedItems.length === 0}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. FOOTER */}
      <Footer />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
