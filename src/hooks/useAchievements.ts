
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
}

// Simple cache to avoid unnecessary API calls
const achievementsCache = new Map<string, { data: Achievement[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const cacheKey = `achievements_${user.id}`;
    const cached = achievementsCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setAchievements(cached.data);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Get user's unlocked achievements and all achievements in parallel
      const [userAchievementsResult, _allAchievementsResult] = await Promise.all([
        supabase
          .from('user_achievements')
          .select(`
            achievement_id,
            unlocked_at,
            achievements (
              id,
              title,
              description,
              icon,
              points
            )
          `)
          .eq('user_id', user.id),
        supabase
          .from('achievements')
          .select('*')
      ]);

      if (_allAchievementsResult.error) {
        throw _allAchievementsResult.error;
      }

      if (_allAchievementsResult.data) {
        const unlockedIds = new Set(
          (userAchievementsResult.data || [])
            .filter(ua => ua.achievements)
            .map(ua => ua.achievement_id)
        );

        const achievementsWithStatus = _allAchievementsResult.data.map(achievement => ({
          ...achievement,
          unlocked: unlockedIds.has(achievement.id)
        }));

        // Cache the results
        achievementsCache.set(cacheKey, {
          data: achievementsWithStatus,
          timestamp: Date.now()
        });

        setAchievements(achievementsWithStatus);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
      setError('Não foi possível carregar as conquistas');
    } finally {
      setLoading(false);
    }
  }, [user, setError]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const refreshAchievements = useCallback(() => {
    if (user) {
      // Clear cache for this user
      achievementsCache.delete(`achievements_${user.id}`);
      setLoading(true);
      fetchAchievements();
    }
  }, [user, fetchAchievements]);

  return { 
    achievements, 
    loading, 
    error,
    refreshAchievements 
  };
};