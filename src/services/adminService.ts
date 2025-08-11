
import { supabase } from "@/integrations/supabase/client";

export async function fetchAdminStats() {
  // Check for valid session before making requests
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error("Auth session missing!");
  }

  const [deliveriesRes, digitalDeliveriesRes, warehouseRes, paymentsRes] = await Promise.all([
    supabase.from("deliveries").select("id, delivery_date, status, created_at, user_id"),
    supabase.from("deliveries").select("id").eq("type", "digital"),
    supabase.from("warehouse_items").select("id"),
    supabase.from("payments").select("id, created_at").gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return { deliveriesRes, digitalDeliveriesRes, warehouseRes, paymentsRes };
}

export async function fetchDeliveriesByMonth() {
  const { data: deliveries, error } = await supabase
    .from("deliveries")
    .select("created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Group deliveries by month
  const monthlyData: { [key: string]: number } = {};
  deliveries?.forEach(delivery => {
    const date = new Date(delivery.created_at);
    const monthKey = date.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' });
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime())
    .slice(-6); // Last 6 months
}

export async function fetchTopUsers() {
  const { data: deliveries, error } = await supabase
    .from("deliveries")
    .select("user_id");

  if (error) throw error;

  // Count deliveries per user
  const userDeliveryCount: { [key: string]: number } = {};
  deliveries?.forEach(delivery => {
    userDeliveryCount[delivery.user_id] = (userDeliveryCount[delivery.user_id] || 0) + 1;
  });

  // Get top 5 users
  const topUserIds = Object.entries(userDeliveryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([userId]) => userId);

  // Get user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", topUserIds);

  return topUserIds.map(userId => ({
    user_id: userId,
    name: profiles?.find(p => p.id === userId)?.full_name || "Utilizador Anónimo",
    count: userDeliveryCount[userId]
  }));
}

// 2. Otimizar Performance: Adicionar paginação no dashboard
// Atualização: implementado fetchDeliveries com paginação. Removidas marcas Markdown inválidas.

export const fetchDeliveries = async (page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('deliveries')
    .select('id, user_id, title, status, created_at, delivery_date, type, recipient_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;
  return { data, error, count, totalPages };
};
    .range(start, end);
    
  return { data, error, count, totalPages: Math.ceil(count / pageSize) };
};

// Funções similares para outros recursos (keepsakes, warehouse_items, etc.)
