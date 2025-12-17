
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
  
  const capsules: Capsule[] = await Promise.all(
    (data || []).map(async (delivery) => {
      let signedUrl: string | undefined = undefined;
      if (delivery.digital_file_url) {
        const { data: signed, error: signedErr } = await supabase.storage
          .from("digital-files")
          .createSignedUrl(delivery.digital_file_url, 3600);
        if (!signedErr) {
          signedUrl = signed?.signedUrl || undefined;
        } else {
          signedUrl = undefined;
        }
      }
      const base = {
        id: delivery.id,
        type: delivery.type === "physical" ? "Física" : "Digital",
        physical_location: delivery.location || undefined,
        created_at: delivery.created_at || new Date().toISOString(),
        delivery_date: delivery.delivery_date,
        status: delivery.status,
        sender_name: "Utilizador",
        sender_contact: "N/A",
        recipient_name: "N/A",
        recipient_contact: "N/A",
        notes: delivery.description || undefined,
      } as Capsule;
      return signedUrl ? { ...base, digital_link: signedUrl } : base;
    })
  );
  
  return capsules;
}
