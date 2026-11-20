'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
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
    setCurrentStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromDelivery = () => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Delivery fee calculation
  const deliveryFee = deliveryType === 'home_delivery' ? 99 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-neutral-900 selection:bg-[#85142f] selection:text-white pb-24 lg:pb-16">
      {/* 1. TOP NAVBAR */}
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
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 lg:top-20 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#85142f] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
            <span className="truncate max-w-[150px] sm:max-w-md">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full">
        {isConfirmed && confirmationData ? (
          /* STEP 4: SUCCESS CONFIRMATION */
          <BookingConfirmation
            confirmation={confirmationData}
            event={event}
          />
        ) : (
          <div className="lg:flex lg:gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP INTERFACE */}
            <div className="flex-1 min-w-0 mb-8 lg:mb-0">
              
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

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
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
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
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
                    totalAmount={
                      selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
                      selectedItems.reduce((acc, item) => acc + item.quantity, 0) * 40 +
                      Math.round(selectedItems.reduce((acc, item) => acc + item.quantity, 0) * 40 * 0.18) +
                      deliveryFee
                    }
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY BOOKING SUMMARY */}
            <aside className="w-full lg:w-96 shrink-0 lg:sticky lg:top-36">
              <BookingSummary
                event={event}
                selectedItems={selectedItems}
                deliveryType={deliveryType}
                deliveryFee={deliveryFee}
                onRemoveItem={handleRemoveItem}
                onProceed={
                  currentStep === 'tickets'
                    ? handleProceedFromTickets
                    : currentStep === 'delivery'
                    ? handleProceedFromDelivery
                    : handlePaymentSuccess
                }
                buttonLabel={
                  currentStep === 'tickets'
                    ? 'Continue to Delivery'
                    : currentStep === 'delivery'
                    ? 'Continue to Payment'
                    : 'Confirm Payment'
                }
                isProceedDisabled={selectedItems.length === 0}
              />
            </aside>
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <Footer />

      {/* 6. MOBILE BOTTOM NAV */}
      <MobileBottomNav
        user={currentUser}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />

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
