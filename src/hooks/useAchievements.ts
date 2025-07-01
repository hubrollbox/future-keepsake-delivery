
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        // Get user's unlocked achievements
        const { data: userAchievements } = await supabase
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
          .eq('user_id', user.id);

        // Get all achievements
        const { data: allAchievements } = await supabase
          .from('achievements')
          .select('*');

        if (allAchievements) {
          const unlockedIds = new Set(
            (userAchievements || [])
              .filter(ua => ua.achievements)
              .map(ua => ua.achievement_id)
          );

          const achievementsWithStatus = allAchievements.map(achievement => ({
            ...achievement,
            unlocked: unlockedIds.has(achievement.id)
          }));

          setAchievements(achievementsWithStatus);
        }
      } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return { achievements, loading };
};
