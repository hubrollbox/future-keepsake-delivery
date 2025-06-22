import { supabase } from "@/integrations/supabase/client";
import type { Capsule } from "@/components/admin/AdminCapsules";

export async function fetchCapsules(): Promise<Capsule[]> {
  const { data, error } = await supabase.from("capsules").select("*");
  if (error) throw new Error(error.message);
  return data || [];
}