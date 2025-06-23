import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.warn("Utilizador não autenticado.");
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
}