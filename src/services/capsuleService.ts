
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
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  // Use deliveries table as it's the closest match to capsules in the current schema
  // Adicionando filtro de user_id para garantir que apenas as cápsulas do usuário sejam retornadas
  const { data, error } = await supabase
    .from("deliveries")
    .select("id, type, location, created_at, delivery_date, status, title, description, digital_file_url, user_id")
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Erro ao buscar cápsulas:", error);
    throw new Error("Não foi possível carregar suas cápsulas do tempo");
  }
  
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
