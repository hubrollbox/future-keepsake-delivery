import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { gamificationService, GamificationActionType } from '@/services/gamificationService';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  total_points: number;
  current_level: number;
  current_streak: number;
  next_level_points: number;
  progress_to_next_level: number;
}

interface GamificationContextType {
  stats: UserStats | null;
  trackAction: (action: GamificationActionType, metadata?: any) => Promise<void>;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateLevelProgress = (points: number) => {
    // Exemplo de fórmula logarítmica ou por faixas para níveis
    // Nível 1: 0-500
    // Nível 2: 501-1500
    // Nível 3: 1501-3000
    // etc.
    const levelBase = 500;
    const currentLevel = Math.floor(points / levelBase) + 1;
    const nextLevelPoints = currentLevel * levelBase;
    const currentLevelStart = (currentLevel - 1) * levelBase;
    
    const progress = Math.min(100, Math.max(0, 
      ((points - currentLevelStart) / (nextLevelPoints - currentLevelStart)) * 100
    ));

    return {
      currentLevel,
      nextLevelPoints,
      progress
    };
  };

  const refreshStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      return;
    }

    try {
      const data = await gamificationService.getUserStats();
      if (data) {
        const { currentLevel, nextLevelPoints, progress } = calculateLevelProgress(data.total_points);
        
        setStats({
          total_points: data.total_points,
          current_level: currentLevel, // Poderíamos usar data.current_level se quiséssemos persistir
          current_streak: data.current_streak,
          next_level_points,
          progress_to_next_level: progress
        });
      }
    } catch (error) {
      console.error("Failed to fetch gamification stats", error);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Daily login tracking
  useEffect(() => {
    if (user) {
      // Tenta registrar login diário (o backend vai ignorar se já foi hoje)
      gamificationService.trackEvent('daily_login').then((result) => {
        if (result?.success) {
          refreshStats();
        }
      });
    }
  }, [user, refreshStats]);

  const trackAction = useCallback(async (action: GamificationActionType, metadata?: any) => {
    if (!user) return;
    
    // Otimisticamente poderíamos atualizar a UI, mas como há validação no server,
    // melhor esperar a resposta para garantir consistência.
    const result = await gamificationService.trackEvent(action, metadata);
    
    if (result?.success) {
      await refreshStats();
    }
  }, [user, refreshStats]);

  const value = {
    stats,
    trackAction,
    loading,
    refreshStats
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};