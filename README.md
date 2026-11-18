# BookKaro — Modern Next.js Event & Movie Booking Platform

An ultra-modern, responsive frontend for **BookKaro** matching the exact mobile, tablet, and desktop design specifications.

## 🚀 Key Features

- **Pixel-Accurate Design**: Built to match mobile, tablet, and desktop mockups with smooth responsiveness.
- **Next.js 15 App Router**: Server and client component architecture with TypeScript and Tailwind CSS.
- **FastAPI-Ready Backend Architecture**:
  - Typed data schemas in `src/types/index.ts`
  - Flexible API service layer in `src/services/api.ts` (automatically connects to FastAPI via `NEXT_PUBLIC_API_URL` or falls back to mock data)
- **Interactive UI Components**:
  - Live city switcher (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, etc.)
  - Real-time search and filter by language (`All`, `Hindi`, `English`, `Kannada`)
  - Category selector (`Movies`, `Concerts`, `Sports`, `Theatre`, `Comedy`, `Live events`)
  - Dynamic interactive Booking Modal with showtime selection and seat calculator
  - Newsletter subscription form with feedback
  - Mobile slide-out navigation drawer with hamburger toggle

## 🛠️ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 Connecting to your FastAPI Backend

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for details on setting up FastAPI endpoints for movies, events, bookings, and newsletter subscriptions.
