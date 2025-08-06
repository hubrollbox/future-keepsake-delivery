
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
  // Use deliveries table as it's the closest match to capsules in the current schema
  const { data, error } = await supabase
    .from("deliveries")
    .select("id, type, location, created_at, delivery_date, status, title, description, digital_file_url");
  
  if (error) throw new Error(error.message);
  
  // Transform deliveries data to match Capsule interface
  const capsules: Capsule[] = (data || []).map(delivery => ({
    id: delivery.id,
    type: delivery.type === "physical" ? "Física" : "Digital",
    physical_location: delivery.location || undefined,
    digital_link: delivery.digital_file_url || undefined,
    created_at: delivery.created_at || new Date().toISOString(),
    delivery_date: delivery.delivery_date,
    status: delivery.status,
    sender_name: "Utilizador", // Default sender name since we don't have this in deliveries
    sender_contact: "N/A", // Default contact
    recipient_name: "N/A", // No recipient name in deliveries table
    recipient_contact: "N/A", // No recipient email in deliveries table  
    notes: delivery.description || undefined,
  }));
  
  return capsules;
}
