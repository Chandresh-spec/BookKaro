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
          m.genres.some((g) => g.toLowerCase().includes(q))
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
};
