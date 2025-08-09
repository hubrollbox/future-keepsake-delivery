
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const SUPABASE_URL = "https://mlxmymmoysbtnvcehggn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o";

export const supabase = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      flowType: 'implicit',
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: { 'Accept': 'application/json' },
    },
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined;
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: { [key: string]: any }) {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=${value}; path=/; ${Object.entries(options)
          .map(([k, v]) => `${k}=${v}`)
          .join('; ')}`;
      },
      remove(name: string) {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      },
    },
  }
);

export async function verificarUsuarioLogado() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao obter a sessão:', error.message);
    return false;
  }
  if (session && session.user) {
    return true;
  } else {
    return false;
  }
}
