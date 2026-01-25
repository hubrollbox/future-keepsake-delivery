import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalDeliveries: number;
  sentToday: number;
  totalMessages: number;
  activeUsers: number;
  pendingDeliveries: number;
  errorDeliveries: number;
}

export interface AdminData {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para carregar dados do admin dashboard
 * Recupera estatísticas de entregas, mensagens e usuários
 */
export function useAdminData(): AdminData {
  const [stats, setStats] = useState<AdminStats>({
    totalDeliveries: 0,
    sentToday: 0,
    totalMessages: 0,
    activeUsers: 0,
    pendingDeliveries: 0,
    errorDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch total deliveries
      const { count: totalDeliveries, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true });

      if (deliveriesError) throw deliveriesError;

      // Fetch deliveries sent today
      const today = new Date().toISOString().split('T')[0];
      const { count: sentToday, error: sentTodayError } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered')
        .gte('updated_at', `${today}T00:00:00Z`);

      if (sentTodayError) throw sentTodayError;

      // Fetch total messages (same as deliveries)
      const { count: totalMessages, error: messagesError } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true });

      if (messagesError) throw messagesError;

      // Fetch active users (users with recent activity)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: activeUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', weekAgo);

      if (usersError) throw usersError;

      // Fetch pending deliveries
      const { count: pendingDeliveries, error: pendingError } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      if (pendingError) throw pendingError;

      // Fetch error deliveries
      const { count: errorDeliveries, error: errorError } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'error');

      if (errorError) throw errorError;

      setStats({
        totalDeliveries: totalDeliveries || 0,
        sentToday: sentToday || 0,
        totalMessages: totalMessages || 0,
        activeUsers: activeUsers || 0,
        pendingDeliveries: pendingDeliveries || 0,
        errorDeliveries: errorDeliveries || 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(message);
      console.error('[useAdminData]', message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
