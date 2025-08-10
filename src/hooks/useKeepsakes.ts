import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Keepsake {
  id: string;
  title: string;
  delivery_date: string;
  status: string | null;
  type: 'digital' | 'physical';
}

export const useKeepsakes = () => {
  const [keepsakes, setKeepsakes] = useState<Keepsake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchKeepsakes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type')
        .order('delivery_date', { ascending: false });

      if (error) throw error;
      setKeepsakes(data || []);
    } catch (e) {
      console.error('Erro ao carregar keepsakes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeepsakes();
  }, []);

  return { keepsakes, loading, refetch: fetchKeepsakes };
};
