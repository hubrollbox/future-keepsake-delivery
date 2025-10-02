import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, DeliveryByMonth, TopUser } from '@/types/admin';

const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [deliveriesByMonth, setDeliveriesByMonth] = useState<DeliveryByMonth[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all statistics in parallel
      const [
        profilesResult,
        keepsakesResult,
        deliveriesResult,
        pendingDeliveriesResult,
        digitalMessagesResult,
        warehouseResult,
        paymentsResult,
        deliveriesByMonthResult,
        topUsersResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('keepsakes').select('id', { count: 'exact', head: true }),
        supabase.from('deliveries').select('id', { count: 'exact', head: true }),
        supabase.from('deliveries').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
        supabase.from('keepsakes').select('id', { count: 'exact', head: true }).eq('type', 'digital'),
        supabase.from('warehouse_items').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        // Deliveries by month for the last 6 months
        supabase.rpc('get_deliveries_by_month').then(result => result.data || []),
        // Top users by keepsake count
        supabase
          .from('profiles')
          .select('id, email, full_name, keepsakes:keepsakes(count)')
          .order('keepsakes.count', { ascending: false })
          .limit(5)
      ]);

      // Build admin stats
      const adminStats: AdminStats = {
        totalUsers: profilesResult.count || 0,
        totalKeepsakes: keepsakesResult.count || 0,
        totalDeliveries: deliveriesResult.count || 0,
        pendingDeliveries: pendingDeliveriesResult.count || 0,
        digitalMessages: digitalMessagesResult.count || 0,
        warehouseItems: warehouseResult.count || 0,
        recentPayments: paymentsResult.count || 0,
      };

      setStats(adminStats);

      // Process deliveries by month
      if (deliveriesByMonthResult) {
        setDeliveriesByMonth(deliveriesByMonthResult as DeliveryByMonth[]);
      } else {
        // Fallback to manual grouping if RPC doesn't exist
        const { data: deliveriesData } = await supabase
          .from('deliveries')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString());

        const monthCounts = new Map<string, number>();
        deliveriesData?.forEach(delivery => {
          const month = new Date(delivery.created_at).toLocaleDateString('pt-PT', { month: 'short' });
          monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
        });

        const deliveriesArray: DeliveryByMonth[] = Array.from(monthCounts.entries()).map(([month, count]) => ({
          month,
          count
        }));
        setDeliveriesByMonth(deliveriesArray);
      }

      // Process top users
      if (topUsersResult.data) {
        const processedTopUsers: TopUser[] = topUsersResult.data.map(user => ({
          id: user.id,
          email: user.email || 'Sem email',
          full_name: user.full_name,
          keepsakeCount: Array.isArray(user.keepsakes) ? user.keepsakes.length : 0
        }));
        setTopUsers(processedTopUsers);
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Error fetching admin data:', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return { stats, deliveriesByMonth, topUsers, loading, error, fetchAdminData };
};

export default useAdminData;