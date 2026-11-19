export interface PersonDetail {
  id: string; // e.g. "ranbir-kapoor"
  name: string; // e.g. "Ranbir Kapoor"
  alsoKnownAs?: string; // "Daboo, Ganglu"
  occupation: string; // "Actor • Special Appearances • Assistant Director • Singer • Producer"
  born: string; // "September 28, 1982"
  birthplace: string; // "Mumbai, Maharashtra, India"
  spouse?: string; // "Alia Bhatt"
  children?: string; // "1"
  image: string;
  about: string;
  peers: Array<{
    id: string;
    name: string;
    role: string;
    image: string;
  }>;
  family: Array<{
    id: string;
    name: string;
    relation: string;
    image: string;
  }>;
  movies: Array<{
    id: string;
    title: string;
    posterImage: string;
    role?: string;
    rating?: number;
    year?: string;
  }>;
  trivia: string[];
  quotes: string[];
}

export const PERSONS_DATA: Record<string, PersonDetail> = {
  'ranbir-kapoor': {
    id: 'ranbir-kapoor',
    name: 'Ranbir Kapoor',
    alsoKnownAs: 'Daboo, Ganglu',
    occupation: 'Actor • Special Appearances • Assistant Director • Singer • Producer',
    born: 'September 28, 1982',
    birthplace: 'Mumbai, Maharashtra, India',
    spouse: 'Alia Bhatt',
    children: '1',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    about:
      'One of the most versatile performers in contemporary Bollywood, Ranbir Kapoor hails from a family of acting legends and yesteryear superstars who have graced the silver screen for several generations now. An alumnus of the Lee Strasberg Theatre and Film Institute in New York, he started out in the industry as an assistant director to Sanjay Leela Bhansali in the film Black (2005). This was followed by a scintillating acting debut in Bhansali’s Saawariya (2007). Over his two-decade career, Kapoor has collected numerous Filmfare and national honors for memorable turns in films like Rockstar, Barfi!, Tamasha, Sanju, Brahmastra, and Animal.',
    peers: [
      {
        id: 'ranveer-singh',
        name: 'Ranveer Singh',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'shahid-kapoor',
        name: 'Shahid Kapoor',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'aditya-roy-kapur',
        name: 'Aditya Roy Kapur',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'arjun-kapoor',
        name: 'Arjun Kapoor',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
      },
    ],
    family: [
      {
        id: 'alia-bhatt',
        name: 'Alia Bhatt',
        relation: 'Spouse',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'raha-kapoor',
        name: 'Raha Kapoor',
        relation: 'Daughter',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'neetu-singh',
        name: 'Neetu Singh',
        relation: 'Mother',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'rishi-kapoor',
        name: 'Rishi Kapoor',
        relation: 'Father',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'riddhima-sahani',
        name: 'Riddhima Kapoor Sahani',
        relation: 'Sister',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'raj-kapoor',
        name: 'Raj Kapoor',
        relation: 'Paternal Grandfather',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
      },
    ],
    movies: [
      {
        id: 'ramayana',
        title: 'Ramayana',
        posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        role: 'Lord Rama',
        rating: 9.2,
        year: '2026',
      },
      {
        id: 'love-and-war',
        title: 'Love & War',
        posterImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
        role: 'Lead',
        rating: 8.9,
        year: '2026',
      },
      {
        id: 'animal',
        title: 'Animal',
        posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        role: 'Ranvijay Singh',
        rating: 8.4,
        year: '2023',
      },
      {
        id: 'brahmastra',
        title: 'Brahmāstra: Part One – Shiva',
        posterImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
        role: 'Shiva',
        rating: 7.8,
        year: '2022',
      },
      {
        id: 'sanju',
        title: 'Sanju',
        posterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        role: 'Sanjay Dutt',
        rating: 8.6,
        year: '2018',
      },
    ],
    trivia: [
      'Ranbir Kapoor is named after his grandfather Raj Kapoor, whose full real name was Ranbir Raj Kapoor.',
      'He is a trained jazz and ballet dancer and underwent extensive parkour training for his roles.',
      'He co-owns the Indian Super League football team Mumbai City FC and is a passionate supporter of FC Barcelona.',
      'Ranbir made his Bollywood foray behind the scenes as assistant director to Sanjay Leela Bhansali on the critically acclaimed film Black (2005).',
    ],
    quotes: [
      'I think failure always teaches you something. It is important to embrace failure and learn from it rather than hide from it.',
      'Cinema is not just entertainment; for me, it is life. When the camera rolls, that is the most honest version of me.',
      'Every character I portray takes away a piece of me and gives me a new perspective on humanity.',
    ],
  },

  'viraj-ghelani': {
    id: 'viraj-ghelani',
    name: 'Viraj Ghelani',
    alsoKnownAs: 'Viraj',
    occupation: 'Actor • Content Creator • Comedian',
    born: 'May 12, 1993',
    birthplace: 'Mumbai, Maharashtra, India',
    spouse: 'Palak Khimawat',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    about:
      'Viraj Ghelani is an Indian actor, stand-up comedian, and digital creator known for his relatable Gujarati comedy sketches and high-energy screen presence. He gained massive popularity through sketches on FilterCopy and Dice Media before making his feature film debut in Govinda Naam Mera and Jawan, and now stars in the youth comedy Party Animals.',
    peers: [
      {
        id: 'arjun-tanwar',
        name: 'Arjun Tanwar',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'alam-taqveem-khan',
        name: 'Alam Taqveem Khan',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'soundous-moufakir',
        name: 'Soundous Moufakir',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      },
    ],
    family: [
      {
        id: 'palak-khimawat',
        name: 'Palak Khimawat',
        relation: 'Spouse',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
      },
    ],
    movies: [
      {
        id: 'party-animals',
        title: 'Party Animals',
        posterImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
        role: 'Mann Patel',
        rating: 8.2,
        year: '2026',
      },
      {
        id: 'govinda-naam-mera',
        title: 'Govinda Naam Mera',
        posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        role: 'Balram',
        rating: 7.2,
        year: '2022',
      },
      {
        id: 'jawan',
        title: 'Jawan',
        posterImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
        role: 'Special Appearance',
        rating: 8.4,
        year: '2023',
      },
    ],
    trivia: [
      'Started creating short vines and YouTube videos while studying engineering in Mumbai.',
      'Known affectionately as "Nani’s boy" across his viral social media videos.',
    ],
    quotes: [
      'If you can make someone laugh after a long exhausting day, you’ve done your job.',
    ],
  },

  'sai-pallavi': {
    id: 'sai-pallavi',
    name: 'Sai Pallavi',
    alsoKnownAs: 'Pallavi Senthamarai',
    occupation: 'Actress • Dancer • Doctor',
    born: 'May 9, 1992',
    birthplace: 'Kotagiri, Tamil Nadu, India',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    about:
      'Sai Pallavi Senthamarai is one of Indian cinema’s most acclaimed and beloved actresses, celebrated for her natural performances, refuse-to-wear-makeup ethos, and extraordinary dancing skills. A trained physician who graduated from Tbilisi State Medical University, she catapulted to pan-Indian stardom with Premam (2015), followed by landmark roles in Fidaa, Gargi, Shyam Singha Roy, and Ramayana.',
    peers: [
      {
        id: 'ranbir-kapoor',
        name: 'Ranbir Kapoor',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'yash',
        name: 'Yash',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      },
    ],
    family: [
      {
        id: 'pooja-kannan',
        name: 'Pooja Kannan',
        relation: 'Sister',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
      },
    ],
    movies: [
      {
        id: 'ramayana',
        title: 'Ramayana',
        posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        role: 'Mata Sita',
        rating: 9.2,
        year: '2026',
      },
      {
        id: 'gargi',
        title: 'Gargi',
        posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        role: 'Gargi',
        rating: 8.8,
        year: '2022',
      },
      {
        id: 'shyam-singha-roy',
        title: 'Shyam Singha Roy',
        posterImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
        role: 'Rosie / Maithreyi',
        rating: 8.1,
        year: '2021',
      },
    ],
    trivia: [
      'She is a qualified medical doctor holding an MBBS degree.',
      'Famously turned down a ₹2 crore fairness cream endorsement deal, advocating for self-love and natural beauty.',
    ],
    quotes: [
      'Confidence doesn’t come from external makeup; it comes from believing in what you bring to the table.',
    ],
  },

  yash: {
    id: 'yash',
    name: 'Yash',
    alsoKnownAs: 'Naveen Kumar Gowda, Rocking Star',
    occupation: 'Actor • Producer',
    born: 'January 8, 1986',
    birthplace: 'Bhuvanahalli, Karnataka, India',
    spouse: 'Radhika Pandit',
    children: '2',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    about:
      'Naveen Kumar Gowda, known professionally as Yash and fondly called "Rocking Star Yash", is a pan-Indian superstar hailing from the Kannada film industry. After rising through theatre and television, his iconic portrayal of Rocky Bhai in the blockbuster K.G.F franchise broke all-time box office records across India. He now stars as the mighty Ravana in the epic Ramayana.',
    peers: [
      {
        id: 'ranbir-kapoor',
        name: 'Ranbir Kapoor',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'prashanth-neel',
        name: 'Prashanth Neel',
        role: 'Director',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
      },
    ],
    family: [
      {
        id: 'radhika-pandit',
        name: 'Radhika Pandit',
        relation: 'Spouse',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
      },
    ],
    movies: [
      {
        id: 'ramayana',
        title: 'Ramayana',
        posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        role: 'Lankesh Ravana',
        rating: 9.2,
        year: '2026',
      },
      {
        id: 'kgf-chapter-2',
        title: 'K.G.F: Chapter 2',
        posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        role: 'Rocky Bhai',
        rating: 8.9,
        year: '2022',
      },
    ],
    trivia: [
      'His father worked as a BMTC bus driver in Bengaluru while Yash pursued his dreams in Kannada theatre.',
      'Co-founded the Yasho Marga Foundation, providing drinking water and drought relief across rural Karnataka.',
    ],
    quotes: [
      'If you have the courage to dream big, never let anyone tell you your background limits your horizon.',
    ],
  },
};

// Fallback generator for any cast or crew member clicked
export function getPersonDetail(idOrName: string): PersonDetail {
  const normalizedId = idOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (PERSONS_DATA[normalizedId]) {
    return PERSONS_DATA[normalizedId];
  }

  // Capitalize name nicely
  const displayName = idOrName
    .split(/[-_ ]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: normalizedId,
    name: displayName,
    alsoKnownAs: displayName.split(' ')[0],
    occupation: 'Actor • Creative Artist • Producer',
    born: 'October 15, 1990',
    birthplace: 'Mumbai, Maharashtra, India',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    about: `${displayName} is an accomplished artist and prominent personality in Indian entertainment. Known for their dedication to authentic character portrayals and versatility across genres, they continue to captivate audiences on stage and screen.`,
    peers: [
      {
        id: 'ranbir-kapoor',
        name: 'Ranbir Kapoor',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'viraj-ghelani',
        name: 'Viraj Ghelani',
        role: 'Actor',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      },
    ],
    family: [],
    movies: [
      {
        id: 'party-animals',
        title: 'Party Animals',
        posterImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
        role: 'Actor',
        rating: 8.2,
        year: '2026',
      },
      {
        id: 'ramayana',
        title: 'Ramayana',
        posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        role: 'Lead',
        rating: 9.2,
        year: '2026',
      },
    ],
    trivia: [
      `${displayName} began their creative journey through theatre and short films before making a mark on the big screen.`,
    ],
    quotes: [
      'Art is about making people feel connected to stories they might otherwise never experience.',
    ],
  };
}
