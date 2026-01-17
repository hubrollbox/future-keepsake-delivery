import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Valores hardcoded (seguros para chaves públicas/anónimas)
const SUPABASE_URL = "https://mlxmymmoysbtnvcehggn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o";

// Validação de segurança
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration is missing. Please check your environment setup.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
