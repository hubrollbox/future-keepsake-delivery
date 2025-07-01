
import { supabase } from "@/integrations/supabase/client";

export async function fetchAdminStats() {
  // Check for valid session before making requests
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error("Auth session missing!");
  }
  const [deliveriesRes, messagesRes, warehouseRes, paymentsRes] = await Promise.all([
    supabase.from("deliveries").select("id, delivery_date, status"),
    supabase.from("messages").select("id"),
    supabase.from("warehouse_items").select("id"),
    supabase.from("payments").select("id, created_at").gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);
  return { deliveriesRes, messagesRes, warehouseRes, paymentsRes };
}
