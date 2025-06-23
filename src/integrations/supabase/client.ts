import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_PUBLISHABLE_KEY:", SUPABASE_PUBLISHABLE_KEY);

export const supabase = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      flowType: 'implicit',
      autoRefreshToken: true,
      persistSession: true,
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
    console.log('Usuário está logado:', session.user);
    return true;
  } else {
    console.log('Nenhum usuário logado.');
    return false;
  }
}