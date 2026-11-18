/**
 * BookKaro API Client Service
 * 
 * Designed for seamless FastAPI / REST backend integration.
 * By default, this uses local mock data if the backend endpoint is not configured.
 * 
 * When ready to integrate your FastAPI backend:
 * Set NEXT_PUBLIC_API_URL="http://localhost:8000" in your .env.local file.
 */

import { Movie, LiveEvent, CategoryItem } from '@/types';
import { MOVIES, LIVE_EVENTS, CATEGORIES } from '@/data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  /**
   * Fetch movies with optional filters (city, language, search)
   */
  async getMovies(params?: { city?: string; language?: string; search?: string }): Promise<Movie[]> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params?.city) query.append('city', params.city);
        if (params?.language && params.language !== 'All') query.append('language', params.language);
        if (params?.search) query.append('search', params.search);

        const res = await fetch(`${API_BASE_URL}/api/v1/movies?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock movies:', err);
      }
    }

    // Client-side mock filtering
    let results = [...MOVIES];
    if (params?.language && params.language !== 'All') {
      results = results.filter((m) =>
        m.languages.some((l) => l.toLowerCase() === params.language?.toLowerCase())
      );
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          (m.genres && m.genres.some((g) => g.toLowerCase().includes(q)))
      );
    }
    return results;
  },

  /**
   * Fetch live events with optional filters (city, category, search)
   */
  async getEvents(params?: { city?: string; category?: string; search?: string }): Promise<LiveEvent[]> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params?.city) query.append('city', params.city);
        if (params?.category) query.append('category', params.category);
        if (params?.search) query.append('search', params.search);

        const res = await fetch(`${API_BASE_URL}/api/v1/events?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock events:', err);
      }
    }

    let results = [...LIVE_EVENTS];
    if (params?.city) {
      results = results.filter((e) => e.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params?.category) {
      results = results.filter((e) => e.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return results;
  },

  /**
   * Fetch categories list
   */
  async getCategories(): Promise<CategoryItem[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/categories`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock categories:', err);
      }
    }
    return CATEGORIES;
  },

  /**
   * Newsletter subscription endpoint
   */
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, simulated success response');
      }
    }

    // Simulated network delay
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: 'You are on the list! Watch your inbox for VIP drops and event perks.',
    };
  },

  /**
   * Request OTP for mobile login (Ready for FastAPI POST /api/v1/auth/otp/send)
   */
  async sendOtp(mobile: string): Promise<{ success: boolean; message: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, simulating OTP send:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: `OTP sent to ${mobile}` };
  },

  /**
   * Verify mobile OTP (Ready for FastAPI POST /api/v1/auth/otp/verify)
   */
  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user: any; token?: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile, otp }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, simulating OTP verify:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      user: {
        id: 'usr_' + Date.now(),
        name: 'Guest User',
        mobile,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      },
      token: 'jwt_mock_token_' + Date.now(),
    };
  },

  /**
   * Email Sign In / Sign Up (Ready for FastAPI POST /api/v1/auth/email)
   */
  async loginWithEmail(email: string, password?: string): Promise<{ success: boolean; user: any; token?: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, simulating Email login:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    const name = email.split('@')[0];
    return {
      success: true,
      user: {
        id: 'usr_' + Date.now(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      },
      token: 'jwt_mock_token_' + Date.now(),
    };
  },

  /**
   * OAuth Social Login (Google / Apple)
   */
  async loginWithOAuth(provider: 'google' | 'apple'): Promise<{ success: boolean; user: any; token?: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/${provider}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, simulating OAuth:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      user: {
        id: 'usr_' + provider + '_' + Date.now(),
        name: provider === 'google' ? 'Google User' : 'Apple User',
        email: `user@${provider}.com`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      },
      token: 'jwt_mock_token_' + Date.now(),
    };
  },
};
