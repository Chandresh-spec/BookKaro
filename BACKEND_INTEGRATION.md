# BookKaro — FastAPI Backend Integration Guide

This frontend has been built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. It is fully prepared to hook into a **FastAPI** backend with clear separation of types, mock services, and API endpoints.

---

## 1. Quick Environment Setup

When you start your FastAPI backend (e.g. running on `http://localhost:8000`), simply configure the environment variable in `.env.local` inside the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend API service (`src/services/api.ts`) will automatically switch from using local mock data to calling your live FastAPI backend.

---

## 2. Recommended FastAPI Endpoints & Data Schemas

Here are the FastAPI endpoints expected by `src/services/api.ts`:

### A. Movies Endpoint
`GET /api/v1/movies`
- **Query Parameters**:
  - `city` (optional string, e.g. `Bengaluru`)
  - `language` (optional string, e.g. `Hindi`, `English`, `Kannada`)
  - `search` (optional string)
- **Response**: List of Movie objects:
  ```json
  [
    {
      "id": "orbit",
      "title": "Orbit",
      "originalTitle": "ORBIT",
      "tagline": "Beyond our world lies the unknown",
      "rating": 8.8,
      "votesCount": "42.5K",
      "genres": ["Sci-Fi", "Adventure"],
      "languages": ["English", "Hindi"],
      "duration": "2h 45m",
      "posterImage": "https://...",
      "bannerImage": "https://...",
      "isCinemaExclusive": true
    }
  ]
  ```

### B. Live Events Endpoint
`GET /api/v1/events`
- **Query Parameters**:
  - `city` (optional string)
  - `category` (optional string, e.g. `MUSIC`, `SPORTS`, `COMEDY`)
  - `search` (optional string)
- **Response**: List of LiveEvent objects:
  ```json
  [
    {
      "id": "after-hours-live",
      "title": "After Hours: Live in Bengaluru",
      "category": "MUSIC",
      "date": "SAT, 24 NOV",
      "time": "7:00 PM",
      "venue": "Phoenix Marketcity",
      "city": "Bengaluru",
      "startingPrice": 1499,
      "currency": "₹",
      "image": "https://...",
      "badgeText": "MUSIC"
    }
  ]
  ```

### C. Booking Reservation Endpoint
`POST /api/v1/bookings`
- **Request Body**:
  ```json
  {
    "itemId": "orbit",
    "itemType": "movie",
    "showtime": "06:45 PM",
    "seats": 2,
    "city": "Bengaluru",
    "totalAmount": 700
  }
  ```
- **Response**:
  ```json
  {
    "bookingId": "BK-829142",
    "status": "CONFIRMED",
    "message": "Tickets confirmed"
  }
  ```

### D. Newsletter Subscription Endpoint
`POST /api/v1/newsletter/subscribe`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "You are on the list! Watch your inbox for VIP drops and event perks."
  }
  ```

---

## 3. Sample FastAPI Python Implementation

You can paste this starter snippet into your FastAPI `main.py`:

```python
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional

app = FastAPI(title="BookKaro API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsletterRequest(BaseModel):
    email: EmailStr

class BookingRequest(BaseModel):
    itemId: str
    itemType: str
    showtime: Optional[str] = None
    seats: int
    city: str
    totalAmount: float

@app.get("/api/v1/movies")
def get_movies(city: Optional[str] = None, language: Optional[str] = None, search: Optional[str] = None):
    # Return your movie database records here
    return [...]

@app.get("/api/v1/events")
def get_events(city: Optional[str] = None, category: Optional[str] = None, search: Optional[str] = None):
    # Return your event database records here
    return [...]

@app.post("/api/v1/bookings")
def create_booking(booking: BookingRequest):
    return {
        "bookingId": f"BK-{booking.itemId[:3].upper()}-992",
        "status": "CONFIRMED",
        "details": booking
    }

@app.post("/api/v1/newsletter/subscribe")
def subscribe(payload: NewsletterRequest):
    return {
        "success": True,
        "message": f"Successfully subscribed {payload.email}"
    }
```
