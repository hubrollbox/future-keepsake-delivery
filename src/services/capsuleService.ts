export interface Capsule {
  id: string;
  type: "Física" | "Digital";
  physical_location?: string;
  digital_link?: string;
  created_at: string;
  delivery_date: string;
  status: string;
  sender_name: string;
  sender_contact: string;
  recipient_name: string;
  recipient_contact: string;
  notes?: string;
}

import { supabase } from "@/integrations/supabase/client";

export async function fetchCapsules(): Promise<Capsule[]> {
  const { data, error } = await supabase.from("capsules").select("*");
  if (error) throw new Error(error.message);
  return data || [];
}