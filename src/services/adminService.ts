
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

  // Get user profiles with minimal personal information
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", topUserIds);
    
  // Mask personal information for data protection
  const maskedProfiles = profiles?.map(profile => ({
    id: profile.id,
    full_name: maskPersonalName(profile.full_name)
  }));

  return topUserIds.map(userId => ({
    user_id: anonymizeUserId(userId),
    name: maskedProfiles?.find(p => p.id === userId)?.full_name || "Utilizador Anónimo",
    count: userDeliveryCount[userId]
  }));
}

/**
 * Masks a personal name for privacy protection
 * @param name The full name to mask
 * @returns The masked name
 */
function maskPersonalName(name: string | null | undefined): string {
  if (!name) return "Utilizador Anónimo";
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    // Single name - show first character and mask the rest
    return `${nameParts[0].charAt(0)}${'*'.repeat(Math.max(2, nameParts[0].length - 1))}`;
  }
  
  // Multiple names - show first character of first name and first character of last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return `${firstName.charAt(0)}${'*'.repeat(Math.max(2, firstName.length - 1))} ${lastName.charAt(0)}${'*'.repeat(Math.max(2, lastName.length - 1))}`;
}

/**
 * Anonymizes a user ID for privacy protection
 * @param userId The user ID to anonymize
 * @returns The anonymized user ID
 */
function anonymizeUserId(userId: string): string {
  if (!userId) return "anonymous";
  
  // Keep first 3 and last 3 characters, replace the rest with asterisks
  const firstPart = userId.substring(0, 3);
  const lastPart = userId.substring(userId.length - 3);
  const middleLength = Math.max(0, userId.length - 6);
  
  return `${firstPart}${'*'.repeat(middleLength)}${lastPart}`;
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
