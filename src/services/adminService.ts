import { supabase } from "@/integrations/supabase/client";

export async function fetchAdminStats() {
  const [deliveriesRes, digitalMsgRes, warehouseRes, paymentsRes] = await Promise.all([
    supabase.from("deliveries").select("id, delivery_date, status"),
    supabase.from("digital_messages").select("id"),
    supabase.from("warehouse_items").select("id"),
    supabase.from("payments").select("id, created_at").gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);
  return { deliveriesRes, digitalMsgRes, warehouseRes, paymentsRes };
}