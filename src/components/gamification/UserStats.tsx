

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Target } from "lucide-react";

interface UserProfile {
  level: number;
  total_points: number;
}

interface UserStatsProps {
  profile: UserProfile;
  totalDeliveries: number;
}

const UserStats = ({ profile, totalDeliveries }: UserStatsProps) => {
  // Dados mock para evitar o erro do useGamification
  const level = profile?.level || 1;
  const totalPoints = profile?.total_points || 0;
  const nextLevelPoints = (level * 100);
  const progressPercentage = Math.min((totalPoints % 100), 100);

  return (
    <Card className="border-green-100 bg-green-50/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-golden-honey" />
              <span className="text-lg font-semibold text-green-800">Nível {level}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div 
                className="bg-golden-honey h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-green-600 mt-1">
              {totalPoints} / {nextLevelPoints} pontos
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-golden-honey" />
                <span className="text-sm font-medium text-green-700">Pontos</span>
              </div>
              <p className="text-xl font-bold text-green-800">{totalPoints}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-4 w-4 text-dusty-rose" />
                <span className="text-sm font-medium text-green-700">Entregas</span>
              </div>
              <p className="text-xl font-bold text-green-800">{totalDeliveries}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
