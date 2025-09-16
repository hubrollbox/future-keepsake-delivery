import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface AIQuotaData {
  used: number;
  limit: number;
  remaining: number;
  tier: 'free' | 'premium' | 'family';
  canUseAI: boolean;
  resetDate: string;
}

const QUOTA_LIMITS = {
  free: 3,
  premium: 50,
  family: 100
} as const;

export function useAIQuota() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<AIQuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get user's subscription tier from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const tier = (profile?.subscription_plan || 'free') as keyof typeof QUOTA_LIMITS;

      // Get current usage from api_request_log table
      const { data: usage, error: usageError } = await supabase
        .from('api_request_log')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', resetDate.toISOString());

      if (usageError) throw usageError;

      const limit = QUOTA_LIMITS[tier];

      // Count current usage for today from api_request_log
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      const usageCount = usage?.length || 0;

      // Calculate next reset date (midnight UTC)
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);

      const quotaData: AIQuotaData = {
        used: usageCount,
        limit,
        remaining: Math.max(0, limit - usageCount),
        tier,
        canUseAI: usageCount < limit,
        resetDate: tomorrow.toISOString()
      };

      setQuota(quotaData);
    } catch (err) {
      console.error('Error fetching AI quota:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar quota de IA');
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (): Promise<boolean> => {
    if (!user?.id || !quota) {
      return false;
    }

    if (!quota.canUseAI) {
      toast.error(`Limite de ${quota.limit} sugestões diárias atingido!`, {
        description: 'Faça upgrade para mais sugestões de IA.'
      });
      return false;
    }

    try {
      // Log the API request in api_request_log table
      const { error } = await supabase
        .from('api_request_log')
        .insert({
          user_id: user.id,
          endpoint: 'ai_suggestion',
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Update local state
      setQuota(prev => prev ? {
        ...prev,
        used: prev.used + 1,
        remaining: Math.max(0, prev.limit - (prev.used + 1)),
        canUseAI: (prev.used + 1) < prev.limit
      } : null);

      // Show warning when approaching limit
      const newUsage = quota.used + 1;
      if (newUsage >= quota.limit * 0.8) {
        const remaining = quota.limit - newUsage;
        if (remaining > 0) {
          toast.warning(`Restam apenas ${remaining} sugestões hoje!`, {
            description: 'Considere fazer upgrade para mais sugestões.'
          });
        }
      }

      return true;
    } catch (err) {
      console.error('Error incrementing AI usage:', err);
      toast.error('Erro ao registrar uso da IA');
      return false;
    }
  };

  const getQuotaStatus = () => {
    if (!quota) return null;

    const percentage = (quota.used / quota.limit) * 100;
    
    if (percentage >= 100) {
      return {
        status: 'exceeded' as const,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        message: 'Limite diário atingido'
      };
    } else if (percentage >= 80) {
      return {
        status: 'warning' as const,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        message: 'Próximo do limite'
      };
    } else {
      return {
        status: 'normal' as const,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        message: 'Dentro do limite'
      };
    }
  };

  const getUpgradeMessage = () => {
    if (!quota) return null;

    switch (quota.tier) {
      case 'free':
        return {
          title: 'Upgrade para Premium',
          description: 'Tenha 50 sugestões de IA por dia',
          benefits: ['50 sugestões diárias', 'Suporte prioritário', 'Recursos avançados']
        };
      case 'premium':
        return {
          title: 'Upgrade para Family',
          description: 'Tenha 100 sugestões de IA por dia',
          benefits: ['100 sugestões diárias', 'Compartilhamento familiar', 'Recursos premium']
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchQuota();
  }, [user]);

  // Recarregar quota a cada hora para capturar resets
  useEffect(() => {
    const interval = setInterval(fetchQuota, 60 * 60 * 1000); // 1 hora
    return () => clearInterval(interval);
  }, [user]);

  return {
    quota,
    loading,
    error,
    fetchQuota,
    incrementUsage,
    getQuotaStatus,
    getUpgradeMessage,
    canUseAI: quota?.canUseAI ?? false
  };
}