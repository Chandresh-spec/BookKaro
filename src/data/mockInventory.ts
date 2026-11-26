import { TicketTier, ConcertZone } from '@/types/event';
import { StadiumSeat, SeatStatus, SeatTierCategory } from '@/types/venue';

// ============================================================================
// 1. GENERAL ADMISSION TICKET TIERS
// ============================================================================
export const getGeneralAdmissionTiers = (basePrice: number): TicketTier[] => {
  return [
    {
      id: 'tier-early-bird',
      name: 'Early Bird Pass',
      price: Math.max(350, Math.round(basePrice * 0.85)),
      description: 'Discounted access for early purchasers. Limited tickets available.',
      available: 0, // Sold out for realism
      maxPerOrder: 4,
      isSoldOut: true,
      perks: ['Standard Venue Admission', 'Digital E-Ticket'],
    },
    {
      id: 'tier-regular-entry',
      name: 'Phase 1 — General Entry',
      price: basePrice,
      description: 'Standard access pass for the live show on first-come basis.',
      available: 45,
      maxPerOrder: 6,
      perks: ['Standard Venue Admission', 'Access to food and beverage concourses'],
    },
    {
      id: 'tier-fan-front',
      name: 'Front Row / Fan Club Tier',
      price: Math.round(basePrice * 1.6),
      description: 'Priority queue admission and prime standing space right in front of the stage.',
      available: 18,
      maxPerOrder: 4,
      perks: [
        'Priority Fast-Track Gate Entry',
        'Direct Front Stage Perimeter',
        'Official Event Tour Lanyard',
      ],
    },
    {
      id: 'tier-vip-access',
      name: 'VIP Hospitality & Meet Experience',
      price: Math.round(basePrice * 2.8),
      description: 'The definitive concert experience with lounge access and artist tour poster.',
      available: 8,
      maxPerOrder: 2,
      perks: [
        'Dedicated VIP Valet Parking Entry',
        'Access to Air-Conditioned VIP Lounge',
        'Complimentary Welcome Drinks & Snacks',
        'Numbered Tour Laminate & Commemorative Merch',
      ],
    },
  ];
};

// ============================================================================
// 2. ZONE-BASED EVENT INVENTORY
// ============================================================================
export const getZoneEventInventory = (eventId: string, startingPrice: number): ConcertZone[] => {
  return [
    {
      id: 'zone-fan-pit',
      name: 'Fan Pit (Stage Runway)',
      price: Math.max(5500, Math.round(startingPrice * 3.2)),
      color: '#ef4444',
      capacity: 500,
      available: 32,
      entryGate: 'Gate 1 (Express Lane)',
      description: 'Closest proximity to the stage catwalk and artist runway.',
    },
    {
      id: 'zone-vip-lounge',
      name: 'VIP Elevated Lounge Deck',
      price: Math.max(4500, Math.round(startingPrice * 2.5)),
      color: '#8b5cf6',
      capacity: 350,
      available: 19,
      entryGate: 'Gate 2 (VIP Concourse)',
      description: 'Raised wooden deck with unobstructed view of the stage and private bar.',
    },
    {
      id: 'zone-vvip-cabana',
      name: 'VVIP Cabana Lounge (Table of 4)',
      price: Math.max(12000, Math.round(startingPrice * 6.5)),
      color: '#f59e0b',
      capacity: 120,
      available: 4,
      entryGate: 'Gate 2 (Valet Entrance)',
      description: 'Exclusive sofa seating with dedicated server and premium beverages.',
    },
    {
      id: 'zone-premium-standing',
      name: 'Premium Standing (Front Tier)',
      price: Math.max(2800, Math.round(startingPrice * 1.6)),
      color: '#3b82f6',
      capacity: 1200,
      available: 86,
      entryGate: 'Gate 3A',
      description: 'Excellent acoustic sweet-spot with direct center sightlines.',
    },
    {
      id: 'zone-general-admission',
      name: 'General Admission Floor (Phase 1)',
      price: startingPrice,
      color: '#10b981',
      capacity: 4000,
      available: 240,
      entryGate: 'Gate 4 & Gate 5',
      description: 'Spacious festival arena floor with food stalls and LED repeaters.',
    },
  ];
};

// ============================================================================
// 3. HIGH-PERFORMANCE DETERMINISTIC STADIUM SEAT GENERATOR
// ============================================================================
// Generates realistic rows and numbered seats with curved geometry on-the-fly
export const generateBlockSeats = (
  blockId: string,
  tier: SeatTierCategory,
  basePrice: number
): StadiumSeat[] => {
  const seats: StadiumSeat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 8;

  // Pseudo-random deterministic hash based on blockId
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const blockSeed = getHash(blockId);

  rows.forEach((row, rowIndex) => {
    // Dynamic price tier variation by row (Front rows A-C +15%)
    const rowPriceModifier = rowIndex < 2 ? 1.2 : rowIndex < 5 ? 1.1 : 1.0;
    const finalPrice = Math.round(basePrice * rowPriceModifier);

    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatId = `${blockId}-${row}-${seatNum}`;
      const seatSeed = (blockSeed + rowIndex * 17 + seatNum * 31) % 100;

      // Determine realistic availability state
      let status: SeatStatus = 'available';
      if (seatSeed < 24) {
        status = 'sold';
      } else if (seatSeed < 32) {
        status = 'held';
      } else if (seatSeed === 99) {
        status = 'blocked';
      }

      // Arrange in curved coordinate layout (width ~360, height ~280)
      const xSpacing = 36;
      const ySpacing = 32;
      const rowCurveOffset = Math.pow(Math.abs(seatNum - (seatsPerRow / 2 + 0.5)), 1.4) * 2.5;

      const x = 50 + (seatNum - 1) * xSpacing + (seatNum > 4 ? 14 : 0); // Aisle gap after seat 4
      const y = 50 + rowIndex * ySpacing - rowCurveOffset;

      const isAccessible = rowIndex === 0 && (seatNum === 1 || seatNum === seatsPerRow);

      seats.push({
        id: seatId,
        row,
        number: seatNum,
        tier,
        price: finalPrice,
        status,
        coords: { x, y },
        isAccessible,
      });
    }
  });

  return seats;
};
