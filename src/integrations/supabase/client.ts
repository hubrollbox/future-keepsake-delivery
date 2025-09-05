import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Lovable environment: use explicit constants (publishable)
const SUPABASE_URL = 'https://mlxmymmoysbtnvcehggn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create a more secure storage mechanism for auth tokens
const secureStorage = typeof window !== 'undefined' ? {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Check if token is expired before returning
      const data = JSON.parse(item);
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item;
    } catch (error) {
      console.error('Error accessing secure storage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      // Don't store in localStorage if in a non-HTTPS environment (except localhost)
      if (typeof window !== 'undefined' && 
          window.location.protocol !== 'https:' && 
          window.location.hostname !== 'localhost') {
        console.warn('Refusing to store auth token in non-HTTPS environment');
        return;
      }
      
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting secure storage:', error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  }
} : undefined;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: secureStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Set shorter session duration for better security
    storageKey: 'keepla_auth_token',
  }
});