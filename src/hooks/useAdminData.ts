import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase';

interface AdminStats {
  totalUsers: number;
  totalKeepsakes: number;
  // Adicione outras estatísticas aqui
}

interface DeliveryByMonth {
  month: string;
  count: number;
}

interface TopUser {
  id: string;
  email: string;
  keepsakeCount: number;
}

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
      // Exemplo de busca de dados, adapte conforme seu schema do Supabase
      const { data: usersData, error: usersError } = await supabase.from('users').select('id');
      const { data: keepsakesData, error: keepsakesError } = await supabase.from('keepsakes').select('id');

      if (usersError || keepsakesError) {
        throw usersError || keepsakesError;
      }

      setStats({
        totalUsers: usersData?.length || 0,
        totalKeepsakes: keepsakesData?.length || 0,
      });

      // Mock de dados para deliveriesByMonth e topUsers
      setDeliveriesByMonth([
        { month: 'Jan', count: 10 },
        { month: 'Feb', count: 15 },
      ]);
      setTopUsers([
        { id: '1', email: 'user1@example.com', keepsakeCount: 5 },
        { id: '2', email: 'user2@example.com', keepsakeCount: 3 },
      ]);

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