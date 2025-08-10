import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Keepsake {
  id: string;
  title: string;
  delivery_date: string;
  status: string | null;
  type: 'digital' | 'physical';
  content?: string;
  recipient_email?: string;
  recipient_phone?: string;
}

export const useKeepsakes = () => {
  const [keepsakes, setKeepsakes] = useState<Keepsake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchKeepsakes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, content, recipient_email, recipient_phone')
        .order('delivery_date', { ascending: false });

      if (error) throw error;
      setKeepsakes(data || []);
    } catch (e) {
      console.error('Erro ao carregar keepsakes:', e);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas cápsulas do tempo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar keepsakes com paginação
  const fetchKeepsakesPaginated = async (start = 0, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, content, recipient_email, recipient_phone')
        .order('delivery_date', { ascending: false })
        .range(start, start + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Erro ao carregar keepsakes paginados:', e);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas cápsulas do tempo.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Função para atualizar um keepsake
  const updateKeepsake = async (id: string, updates: Partial<Keepsake>) => {
    try {
      const { error } = await supabase
        .from('keepsakes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Cápsula do tempo atualizada com sucesso.",
      });
      
      // Recarregar a lista após atualização
      await fetchKeepsakes();
      return true;
    } catch (e) {
      console.error('Erro ao atualizar keepsake:', e);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a cápsula do tempo.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Função para deletar um keepsake
  const deleteKeepsake = async (id: string) => {
    try {
      const { error } = await supabase
        .from('keepsakes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Cápsula do tempo excluída com sucesso.",
      });
      
      // Recarregar a lista após exclusão
      await fetchKeepsakes();
      return true;
    } catch (e) {
      console.error('Erro ao excluir keepsake:', e);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a cápsula do tempo.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchKeepsakes();
  }, []);

  return { 
    keepsakes, 
    loading, 
    refetch: fetchKeepsakes,
    fetchKeepsakesPaginated,
    updateKeepsake,
    deleteKeepsake
  };
};
