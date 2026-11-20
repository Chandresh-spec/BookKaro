import { LiveEvent } from '@/types/event';

export const LIVE_EVENTS_MOCK: LiveEvent[] = [
  // --- 1. FEATURED & TRENDING CONCERTS (ZONE-BASED & RESERVED STADIUM) ---
  {
    id: 'coldplay-music-of-the-spheres',
    title: 'Coldplay: Music of the Spheres World Tour',
    category: 'Concerts & Gigs',
    date: 'Sat, 18 Jan 2027',
    time: '6:00 PM',
    venue: 'DY Patil Stadium: Navi Mumbai',
    city: 'Mumbai',
    startingPrice: 2500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop',
    badgeText: 'WORLD TOUR',
    isTrending: true,
    isPromoted: true,
    isFeatured: true,
    language: 'English',
    isOutdoor: true,
    isFastFilling: true,
    mustAttend: true,
    bookingType: 'reserved-seating',
    venueId: 'dy-patil-stadium',
    artist: {
      name: 'Coldplay',
      role: 'British Rock Band',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
      bio: 'Grammy-winning iconic band featuring Chris Martin, Jonny Buckland, Guy Berryman, and Will Champion.',
    },
    duration: '3h 30m',
    ageRestriction: '5+ Years',
    deliveryOptions: ['digital', 'home_delivery', 'venue_pickup'],
    about: [
      'Coldplay brings their globally celebrated Music of the Spheres World Tour to India for an unprecedented stadium spectacle.',
      'Experience jaw-dropping LED wristband illuminations, kinetic dancefloors, lasers, confetti cannons, and timeless anthems like "Yellow", "Fix You", "Viva La Vida", and "A Sky Full of Stars".',
      'The tour is committed to 100% solar energy and sustainable production standards.'
    ],
    terms: [
      'Tickets once booked cannot be exchanged, cancelled, or refunded.',
      'Entry gates open at 3:30 PM. Show commences promptly at 6:00 PM.',
      'Re-entry is strictly prohibited once inside the venue perimeter.',
      'Outside food, beverages, cameras, and dangerous objects are banned.'
    ]
  },
  {
    id: 'sunburn-martin-garrix-bengaluru',
    title: 'Sunburn Arena Ft. Martin Garrix — Bengaluru',
    category: 'Music Festivals',
    date: 'Sat, 14 Feb 2027',
    time: '4:00 PM',
    venue: 'NICE Grounds: Tumkur Road, Bengaluru',
    city: 'Bengaluru',
    startingPrice: 1750,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
    badgeText: 'ARENA TOUR',
    isTrending: true,
    isPromoted: true,
    isFeatured: true,
    language: 'English',
    isOutdoor: true,
    isFastFilling: true,
    mustAttend: true,
    bookingType: 'zone-based',
    venueId: 'nice-grounds-arena',
    artist: {
      name: 'Martin Garrix',
      role: 'World #1 DJ / Producer',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop',
      bio: 'Electronic dance music prodigy known for global chartbusters like "Animals", "Scared to Be Lonely", and "In the Name of Love".',
    },
    duration: '6 Hours',
    ageRestriction: '15+ Years',
    deliveryOptions: ['digital', 'home_delivery', 'venue_pickup'],
    about: [
      'Asia\'s biggest electronic music promoter Sunburn Arena returns with Dutch electronic maestro Martin Garrix.',
      'Prepare for custom stage designs, immersive pyrotechnics, heavy bass drops, and special guest DJ acts starting from early afternoon.',
      'Exclusive Fan Pit, VIP lounges, and General Admission zones equipped with curated F&B stalls.'
    ],
    terms: [
      'Wristbands will be scanned at RFID turnstiles. Tampered wristbands will be voided without refund.',
      'Valid government photo ID is mandatory at the security checkpoints.',
      'Alcohol will only be served to patrons meeting legal drinking age (21+).'
    ]
  },
  {
    id: 'diljit-dosanjh-aura-tour',
    title: 'Diljit Dosanjh — RuPay Aura India Tour',
    category: 'Concerts & Gigs',
    date: 'Sun, 29 Nov',
    time: '7:00 PM',
    venue: 'Jawaharlal Nehru Stadium: Delhi',
    city: 'Delhi-NCR',
    startingPrice: 4899,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop',
    badgeText: 'FAST FILLING',
    isTrending: true,
    isPromoted: false,
    isFeatured: true,
    language: 'Punjabi',
    isOutdoor: true,
    isFastFilling: true,
    mustAttend: true,
    bookingType: 'zone-based',
    venueId: 'delhi-jn-stadium-arena',
    artist: {
      name: 'Diljit Dosanjh',
      role: 'Global Punjabi Icon',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
      bio: 'International trailblazer selling out global arenas with electrifying Bhangra, Hip Hop, and soulful Punjabi music.',
    },
    duration: '3h 00m',
    ageRestriction: 'All Ages Welcome',
    deliveryOptions: ['digital', 'home_delivery'],
    about: [
      'Diljit Dosanjh brings the electrifying Aura Tour to the national capital.',
      'Hear mega chartbusters "G.O.A.T.", "Lover", "Born to Shine", "Kinni Kinni", and "Naina" live with high-octane choreography and live brass band.',
      'Multiple standing zones available including Fan Pit right beside the runway stage.'
    ],
    terms: [
      'Tickets once confirmed cannot be refunded or cancelled.',
      'Gates open 2 hours prior to the show time.',
      'Professional recording equipment and DSLRs are strictly prohibited.'
    ]
  },
  {
    id: 'arijit-singh-symphony-bengaluru',
    title: 'Arijit Singh Live Symphony with 60-Piece Orchestra',
    category: 'Concerts & Gigs',
    date: 'Sat, 21 Feb 2027',
    time: '6:30 PM',
    venue: 'M. Chinnaswamy Stadium: Bengaluru',
    city: 'Bengaluru',
    startingPrice: 1999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    badgeText: 'EXCLUSIVE',
    isTrending: true,
    isPromoted: true,
    isFeatured: true,
    language: 'Hindi',
    isOutdoor: true,
    isFastFilling: false,
    mustAttend: true,
    bookingType: 'reserved-seating',
    venueId: 'chinnaswamy-stadium',
    artist: {
      name: 'Arijit Singh',
      role: 'Playback Legend',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop',
      bio: 'The undisputed voice of Bollywood melodies, performing with an international grand orchestra.',
    },
    duration: '3h 45m',
    ageRestriction: 'All Ages',
    deliveryOptions: ['digital', 'home_delivery', 'venue_pickup'],
    about: [
      'A soulful, grandiose evening featuring Arijit Singh backed by a 60-piece orchestral ensemble.',
      'Experience orchestral arrangements of "Tum Hi Ho", "Channa Mereya", "Kesariya", "Agar Tum Saath Ho", and classical medleys.',
      'Grand reserved stadium seating across North, South, East, and West Stands.'
    ],
    terms: [
      'Children aged 3 and above require an individual ticket.',
      'Strict security screening in place; please arrive early.'
    ]
  },

  // --- 2. STANDUP COMEDY & THEATRE (GENERAL ADMISSION) ---
  {
    id: 'aakash-gupta-daily-ka-kaam',
    title: 'Daily Ka Kaam Hai By Aakash Gupta',
    category: 'Standup Comedy',
    date: 'Fri, 12 Dec',
    time: '7:30 PM',
    venue: 'Good Shepherd Auditorium: Museum Road, Bengaluru',
    city: 'Bengaluru',
    startingPrice: 599,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800&auto=format&fit=crop',
    badgeText: 'BESTSELLER',
    isTrending: true,
    isPromoted: false,
    language: 'Hinglish',
    isOutdoor: false,
    isFastFilling: true,
    mustAttend: true,
    bookingType: 'general-admission',
    venueId: 'good-shepherd-auditorium',
    artist: {
      name: 'Aakash Gupta',
      role: 'Stand-up Comedian',
      bio: 'Comicstaan Season 2 winner known for his hysterical physical comedy, observations, and eccentric characters.',
    },
    duration: '1h 30m',
    ageRestriction: '16+ Years',
    deliveryOptions: ['digital'],
    about: [
      'Aakash Gupta\'s brand new hour "Daily Ka Kaam Hai" breaks down everyday Indian routines, airport struggles, and hilarious childhood traumas.',
      'Fast-paced laughs, theatrical storytelling, and improv banter with the front row.'
    ],
    terms: [
      'Latecomers will only be allowed entry during applause breaks.',
      'Flash photography and mobile video streaming are prohibited inside the auditorium.'
    ]
  },
  {
    id: 'gaurav-kapoor-live-mumbai',
    title: 'Gaurav Kapoor Live — Unfiltered Laughs',
    category: 'Standup Comedy',
    date: 'Sun, 21 Dec',
    time: '6:00 PM & 8:30 PM',
    venue: 'The Comedy Theatre: Bandra West, Mumbai',
    city: 'Mumbai',
    startingPrice: 999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop',
    badgeText: 'SELLING FAST',
    isTrending: false,
    isPromoted: false,
    language: 'Hindi',
    isOutdoor: false,
    isFastFilling: true,
    bookingType: 'general-admission',
    artist: {
      name: 'Gaurav Kapoor',
      role: 'Stand-up Comedian',
      bio: 'Delhi boy in Mumbai, beloved for sharp observations on weddings, corporate life, and everyday absurdity.',
    },
    duration: '1h 20m',
    ageRestriction: '18+ Years',
    deliveryOptions: ['digital'],
    about: [
      'Gaurav Kapoor is back with fresh jokes about family drama, local trains, gym trainers, and why adulthood is completely overrated.'
    ],
    terms: ['No entry permitted after 15 minutes of show commencement.']
  },
  {
    id: 'hamlet-the-classic-return',
    title: 'Hamlet — The Classic Return (Shakespeare Retold)',
    category: 'Theatre & Plays',
    date: 'Sat, 17 Jan',
    time: '6:30 PM',
    venue: 'Ranga Shankara: J.P. Nagar, Bengaluru',
    city: 'Bengaluru',
    startingPrice: 350,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    badgeText: 'CRITICS CHOICE',
    isTrending: false,
    isPromoted: false,
    language: 'English',
    isOutdoor: false,
    bookingType: 'general-admission',
    duration: '2h 15m',
    ageRestriction: '12+ Years',
    deliveryOptions: ['digital'],
    about: [
      'A breathtaking experimental stage production of Shakespeare\'s greatest tragedy, adapted for modern theatre lovers.',
      'Winner of 4 National Theatre Awards for lighting and set design.'
    ],
    terms: ['Auditorium doors will close at 6:25 PM sharp. Mobile phones must remain switched off.']
  },

  // --- 3. MORE LIVE CONCERTS ACROSS CITIES & BOOKING TYPES ---
  {
    id: 'yuvan-shankar-raja-concert',
    title: 'Yuvan Shankar Raja Live in Concert',
    category: 'Concerts & Gigs',
    date: 'Sat, 5 Dec',
    time: '6:00 PM',
    venue: 'NICE Grounds: Bengaluru',
    city: 'Bengaluru',
    startingPrice: 699,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    isPromoted: true,
    isTrending: true,
    language: 'Tamil',
    isOutdoor: true,
    bookingType: 'zone-based',
    artist: {
      name: 'Yuvan Shankar Raja',
      role: 'Music Composer',
      bio: 'The undisputed Drug of Youth bringing soulful chords and energy to Bengaluru.'
    },
    duration: '4h 00m',
    ageRestriction: 'All Ages',
    deliveryOptions: ['digital', 'home_delivery'],
    about: [
      'Celebrate 25 iconic years of Yuvanism with a massive 4-hour live musical celebration featuring stellar guest playback singers.'
    ],
    terms: ['ID proof mandatory. No outside eatables allowed.']
  },
  {
    id: 'prateek-kuhad-silhouettes-tour',
    title: 'Prateek Kuhad — Silhouettes Acoustic Night',
    category: 'Concerts & Gigs',
    date: 'Sun, 10 Jan',
    time: '8:00 PM',
    venue: 'Jayamahal Palace Grounds: Bengaluru',
    city: 'Bengaluru',
    startingPrice: 1299,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    badgeText: 'ACOUSTIC',
    isTrending: false,
    language: 'Hindi',
    isOutdoor: true,
    bookingType: 'general-admission',
    artist: {
      name: 'Prateek Kuhad',
      role: 'Indie Singer-Songwriter',
      bio: 'Intimate storytelling and heartfelt melodies that resonated across global music charts.'
    },
    duration: '2h 00m',
    ageRestriction: '12+ Years',
    deliveryOptions: ['digital'],
    about: [
      'Spend a starry evening listening to "cold/mess", "Kasoor", "Co2", and fresh tracks from his acoustic repertoire under fairy lights.'
    ],
    terms: ['Open-air seated event on first-come-first-served basis within ticket category.']
  },
  {
    id: 'anuv-jain-guldasta-tour',
    title: 'Anuv Jain — Guldasta India Tour',
    category: 'Concerts & Gigs',
    date: 'Sat, 24 Jan',
    time: '7:00 PM',
    venue: 'Gachibowli Stadium Ground: Hyderabad',
    city: 'Hyderabad',
    startingPrice: 999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
    badgeText: 'INDIE POP',
    isTrending: true,
    language: 'Hindi',
    isOutdoor: true,
    bookingType: 'zone-based',
    artist: {
      name: 'Anuv Jain',
      role: 'Indie Musician',
      bio: 'Known for poignant acoustic ballads like "Baarishein", "Alag Aasmaan", and "Husn".'
    },
    duration: '2h 30m',
    ageRestriction: 'All Ages',
    deliveryOptions: ['digital', 'home_delivery'],
    about: [
      'Sing along to heartfelt anthems that have captured millions of hearts worldwide in an unforgettable open-air concert.'
    ],
    terms: ['Standard security policies apply. Parking available at stadium lots.']
  },
  {
    id: 'smirnoff-experience-alesso',
    title: 'Smirnoff Experience ft. ALESSO — Bengaluru',
    category: 'Music Festivals',
    date: 'Fri, 27 Nov',
    time: '5:00 PM',
    venue: 'Bhartiya Mall Of Bengaluru: Thanisandra',
    city: 'Bengaluru',
    startingPrice: 1500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    badgeText: 'EDM NIGHT',
    isTrending: false,
    language: 'English',
    isOutdoor: true,
    bookingType: 'zone-based',
    artist: {
      name: 'Alesso',
      role: 'Swedish DJ / Producer',
    },
    duration: '5 Hours',
    ageRestriction: '21+ Years',
    deliveryOptions: ['digital'],
    about: [
      'Progressive house icon Alesso brings anthems like "Heroes", "Calling", and "Under Control" to Bengaluru.'
    ],
    terms: ['Age verification mandatory. Valid Govt ID required.']
  },

  // --- 4. SOLD OUT EVENT EXAMPLE (FOR TESTING SOLD OUT STATE) ---
  {
    id: 'dua-lipa-radical-optimism-tour',
    title: 'Dua Lipa — Radical Optimism World Tour',
    category: 'Concerts & Gigs',
    date: 'Sat, 30 Nov',
    time: '7:30 PM',
    venue: 'MMRDA Grounds: BKC, Mumbai',
    city: 'Mumbai',
    startingPrice: 3500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    badgeText: 'SOLD OUT',
    isTrending: true,
    isPromoted: false,
    isSoldOut: true,
    language: 'English',
    isOutdoor: true,
    bookingType: 'zone-based',
    artist: {
      name: 'Dua Lipa',
      role: 'Pop Superstar',
    },
    duration: '2h 15m',
    ageRestriction: '12+ Years',
    deliveryOptions: ['digital', 'home_delivery'],
    about: [
      'Triple Grammy winner Dua Lipa brings high energy disco-pop thrills with chart hits "Houdini", "Training Season", and "Levitating".'
    ],
    terms: ['All tickets are 100% sold out. No box office sales at the venue.']
  },

  // --- 5. CLASSICAL, NIGHTLIFE & TRADITIONAL ---
  {
    id: 'zakir-hussain-masters-percussion',
    title: 'Ustad Zakir Hussain — Masters of Percussion',
    category: 'Classical & Dance',
    date: 'Sun, 1 Feb',
    time: '6:30 PM',
    venue: 'NCPA: Tata Theatre, Nariman Point, Mumbai',
    city: 'Mumbai',
    startingPrice: 1200,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
    badgeText: 'LEGENDS',
    isTrending: false,
    language: 'Instrumental',
    isOutdoor: false,
    bookingType: 'reserved-seating',
    duration: '2h 45m',
    ageRestriction: '8+ Years',
    deliveryOptions: ['digital'],
    about: [
      'A spellbinding classical jugalbandi featuring Ustad Zakir Hussain collaborating with international virtuoso percussionists.'
    ],
    terms: ['Formal or smart casual attire recommended. Silence during performances.']
  },
  {
    id: 'sunburn-goa-nye-bash',
    title: 'Sunburn Goa NYE Beachfront Mega Festival',
    category: 'Nightlife & Parties',
    date: 'Thu, 31 Dec',
    time: '3:00 PM',
    venue: 'Vagator Beach: North Goa',
    city: 'Mumbai',
    startingPrice: 3999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    badgeText: 'NEW YEAR BASH',
    isTrending: true,
    isPromoted: true,
    language: 'English',
    isOutdoor: true,
    bookingType: 'zone-based',
    duration: '10 Hours',
    ageRestriction: '18+ Years',
    deliveryOptions: ['digital', 'venue_pickup'],
    about: [
      'Ring in the New Year with world-class international DJs, oceanfront fireworks, beach flea markets, and neon stages.'
    ],
    terms: ['Wristband exchange opens at 12:00 PM on event day at box office.']
  }
];

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'All Live Events', icon: 'sparkles' },
  { id: 'Concerts & Gigs', label: 'Concerts & Gigs', icon: 'music' },
  { id: 'Standup Comedy', label: 'Standup Comedy', icon: 'mic' },
  { id: 'Music Festivals', label: 'Music Festivals', icon: 'flame' },
  { id: 'Theatre & Plays', label: 'Theatre & Plays', icon: 'drama' },
  { id: 'Classical & Dance', label: 'Classical & Traditional', icon: 'heart' },
  { id: 'Nightlife & Parties', label: 'Nightlife & Parties', icon: 'cocktail' },
];

export const EVENT_DATES_FILTER = [
  'All Dates',
  'Today',
  'Tomorrow',
  'This Weekend',
  'Next 7 Days',
  'Next 30 Days'
];

export const EVENT_PRICE_RANGES = [
  'All Prices',
  'Free',
  '₹0 - ₹500',
  '₹501 - ₹2000',
  'Above ₹2000'
];

export const EVENT_LANGUAGES = [
  'All Languages',
  'English',
  'Hindi',
  'Punjabi',
  'Tamil',
  'Kannada',
  'Hinglish',
  'Instrumental'
];

export const EVENT_BOOKING_MODES = [
  { id: 'all', label: 'All Types' },
  { id: 'general-admission', label: 'General Admission' },
  { id: 'zone-based', label: 'Zone-Based (Standing)' },
  { id: 'reserved-seating', label: 'Reserved Stadium Seating' },
];
