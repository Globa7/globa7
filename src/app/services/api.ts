/**
 * API Service for Globa7 Platform
 * 
 * This service handles all API communication with the Supabase backend.
 * It provides a clean interface for authentication, bookings, and admin functions.
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

// Helper to get auth token
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

// Helper for authenticated requests
async function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    signUp: async (email: string, password: string, name: string, phone: string) => {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign up failed');
      }

      return response.json();
    },

    signIn: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign in failed');
      }

      const data = await response.json();
      
      // Set session with Supabase
      await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.accessToken,
      });

      return data;
    },

    signOut: async () => {
      await supabase.auth.signOut();
    },

    getCurrentUser: async () => {
      return authFetch('/auth/me');
    },
  },

  // Client functions
  client: {
    getProfile: async () => {
      return authFetch('/client/profile');
    },

    updateProfile: async (updates: any) => {
      return authFetch('/client/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    createBooking: async (bookingData: any) => {
      return authFetch('/client/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },

    getBookings: async () => {
      return authFetch('/client/bookings');
    },

    getBooking: async (id: string) => {
      return authFetch(`/client/bookings/${id}`);
    },

    saveAddress: async (address: any) => {
      return authFetch('/client/addresses', {
        method: 'POST',
        body: JSON.stringify(address),
      });
    },
  },

  // Admin functions
  admin: {
    getAnalytics: async () => {
      return authFetch('/admin/analytics');
    },

    getAllBookings: async () => {
      return authFetch('/admin/bookings');
    },

    updateBooking: async (id: string, updates: any) => {
      return authFetch(`/admin/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    getPricing: async () => {
      return authFetch('/admin/pricing');
    },

    updatePricing: async (pricing: any) => {
      return authFetch('/admin/pricing', {
        method: 'PUT',
        body: JSON.stringify(pricing),
      });
    },

    getBundles: async () => {
      return authFetch('/admin/bundles');
    },

    createBundle: async (bundle: any) => {
      return authFetch('/admin/bundles', {
        method: 'POST',
        body: JSON.stringify(bundle),
      });
    },

    updateBundle: async (id: string, updates: any) => {
      return authFetch(`/admin/bundles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    deleteBundle: async (id: string) => {
      return authFetch(`/admin/bundles/${id}`, {
        method: 'DELETE',
      });
    },

    getDrivers: async () => {
      return authFetch('/admin/drivers');
    },

    createDriver: async (driver: any) => {
      return authFetch('/admin/drivers', {
        method: 'POST',
        body: JSON.stringify(driver),
      });
    },

    updateDriver: async (id: string, updates: any) => {
      return authFetch(`/admin/drivers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    deleteDriver: async (id: string) => {
      return authFetch(`/admin/drivers/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

export { supabase };
