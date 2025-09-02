import { useEffect, useState, useCallback } from "react";
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
  sent_at?: string;
}

export type KeepsakeStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'scheduled';

export const useKeepsakes = () => {
  const [keepsakes, setKeepsakes] = useState<Keepsake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchKeepsakes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, content:message_content, recipient_email, recipient_phone, sent_at')
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
  }, [toast]);

  // Função para buscar keepsakes com paginação e filtro por status
  const fetchKeepsakesPaginated = async (start = 0, limit = 10, statusFilter?: KeepsakeStatus) => {
    try {
      let query = supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, content:message_content, recipient_email, recipient_phone, sent_at')
        .order('delivery_date', { ascending: false });

      // Aplicar filtro de status se fornecido
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.range(start, start + limit - 1);

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

  // Função para buscar keepsakes por status específico
  const fetchKeepsakesByStatus = async (status: KeepsakeStatus) => {
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, content:message_content, recipient_email, recipient_phone, sent_at')
        .eq('status', status)
        .order('delivery_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Erro ao carregar keepsakes por status:', e);
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
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (typeof updates.content !== 'undefined') {
        dbUpdates.message_content = updates.content;
        delete dbUpdates.content;
      }
      const { error } = await supabase
        .from('keepsakes')
        .update(dbUpdates)
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
  }, [fetchKeepsakes]);

  return { 
    keepsakes, 
    loading, 
    refetch: fetchKeepsakes,
    fetchKeepsakesPaginated,
    fetchKeepsakesByStatus,
    updateKeepsake,
    deleteKeepsake
  };
};
