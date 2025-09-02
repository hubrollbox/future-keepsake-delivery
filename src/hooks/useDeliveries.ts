import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Delivery {
  id: string;
  status: string;
  // Adicione outras propriedades de entrega aqui
}

const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*');

      if (error) {
        throw error;
      }
      setDeliveries(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
      setError(err.message);
      }
      console.error('Error fetching deliveries:', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDelivery = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      setDeliveries(prevDeliveries => prevDeliveries.filter(delivery => delivery.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
      setError(err.message);
      console.error('Error deleting delivery:', err.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return { deliveries, loading, error, deleteDelivery, fetchDeliveries };
};

export { useDeliveries };