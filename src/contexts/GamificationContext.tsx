
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { getCurrentUser } from "@/services/userService";

interface GamificationContextProps {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refreshAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextProps | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { achievements, loading } = useAchievements();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user");
      }
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
