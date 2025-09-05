import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Lovable environment: explicit constants (publishable keys are safe in frontend)
const supabaseUrl = 'https://mlxmymmoysbtnvcehggn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});