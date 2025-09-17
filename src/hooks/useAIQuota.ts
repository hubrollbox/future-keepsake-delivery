import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

function getToday(): string {
  const d = new Date();
  const iso = d.toISOString();
  const parts = iso.split('T');
  return parts[0] ?? iso;
}

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
    if (!user || typeof user.id !== 'string') {
      setLoading(false);
      setError('Usuário inválido ou sem id.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar tier do usuário através do plan_id
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('plan_id, plans(name)')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Determinar tier com base no nome do plano
      const planName = (userProfile?.plans as { name: string } | null)?.name || 'free';
      const tier = (planName as keyof typeof QUOTA_LIMITS) || 'free';
      const limit = QUOTA_LIMITS[tier];

      // Buscar uso atual do dia
  const today = getToday();
  // user.id já validado como string
      const { data: usage, error: usageError } = await supabase
        .from('api_usage')
        .select('huggingface_requests')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      // Se não há registro para hoje, criar um
      let currentUsage = 0;
      if (usageError && usageError.code === 'PGRST116') {
        // Registro não existe, criar um novo
        const { data: newUsage, error: createError } = await supabase
          .from('api_usage')
          .insert([
            {
              user_id: user.id,
              date: today,
              huggingface_requests: 0
            }
          ])
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        currentUsage = newUsage?.huggingface_requests ?? 0;
      } else if (usageError) {
        throw usageError;
      } else {
        currentUsage = usage?.huggingface_requests ?? 0;
      }

      // Calcular próxima data de reset (meia-noite UTC)
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);

      const quotaData: AIQuotaData = {
        used: currentUsage,
        limit,
        remaining: Math.max(0, limit - currentUsage),
        tier,
        canUseAI: currentUsage < limit,
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
    if (!user || typeof user.id !== 'string' || !quota) {
      return false;
    }

    if (!quota.canUseAI) {
      toast.error(`Limite de ${quota.limit} sugestões diárias atingido!`, {
        description: 'Faça upgrade para mais sugestões de IA.'
      });
      return false;
    }

    try {
  const today = getToday();
  // user.id já validado como string
      const newUsage = quota.used + 1;

      const { error } = await supabase
        .from('api_usage')
        .upsert([
          {
            user_id: user.id,
            date: today,
            huggingface_requests: newUsage,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setQuota(prev => prev ? {
        ...prev,
        used: newUsage,
        remaining: Math.max(0, prev.limit - newUsage),
        canUseAI: newUsage < prev.limit
      } : null);

      // Mostrar aviso quando próximo do limite
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