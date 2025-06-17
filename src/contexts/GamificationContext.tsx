import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import useAchievements, { Achievement } from "@/hooks/useAchievements";
import { supabase } from "@/integrations/supabase/client";

interface GamificationContextProps {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refreshAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextProps | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { achievements, loading, error } = useAchievements(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  const refreshAchievements = () => {
    // Logic to refresh achievements if needed
  };

  return (
    <GamificationContext.Provider value={{ achievements, loading, error, refreshAchievements }}>
      {children}
    </GamificationContext.Provider>
  );
};

export { GamificationContext };
