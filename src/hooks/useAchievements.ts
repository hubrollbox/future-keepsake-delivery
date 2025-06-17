import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
}

type UserAchievementRow = Database["user_achievements"];
type AchievementRow = Database["achievements"];

const useAchievements = (userId: string | null) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_achievements")
          .select(`achievement_id (id, title, description, icon, points), unlocked_at`)
          .eq("user_id", userId);

        if (error) throw error;

        const formattedAchievements = data.map((item: { achievement_id: { id: string; title: string; description: string; icon: string; points: number }[]; unlocked_at: string | null }) => {
          const achievement = item.achievement_id[0]; // Extrair o primeiro elemento do array
          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            unlocked: !!item.unlocked_at,
          };
        });

        setAchievements(formattedAchievements);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userId]);

  return { achievements, loading, error };
};

export default useAchievements;
