import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap, Award } from "lucide-react";
import { UserProfile } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";

interface UserStatsProps {
  profile: UserProfile | null;
  totalDeliveries: number;
}

const UserStats = ({ profile, totalDeliveries }: UserStatsProps) => {
  const { achievements, loading } = useGamification();

  if (loading) {
    return <p>Carregando estatísticas...</p>;
  }

  const currentLevel = profile?.level || 1;
  const totalPoints = profile?.total_points || 0;
  const pointsForNextLevel = currentLevel * 100; // 100 pontos por nível
  const currentLevelPoints = totalPoints % 100;
  const progressPercentage = (currentLevelPoints / pointsForNextLevel) * 100;

  const getLevelTitle = (level: number) => {
    if (level >= 10) return "Mestre Temporal";
    if (level >= 7) return "Guardião Experiente";
    if (level >= 5) return "Viajante do Tempo";
    if (level >= 3) return "Aprendiz Temporal";
    return "Guardião Iniciante";
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{getLevelTitle(currentLevel)}</h3>
              <p className="text-sm text-gray-600">Nível {currentLevel}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
            {totalPoints} XP
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso para Nível {currentLevel + 1}</span>
            <span>{currentLevelPoints}/{pointsForNextLevel} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Entregas</p>
            <p className="font-bold text-sm">{totalDeliveries}</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Sequência</p>
            <p className="font-bold text-sm">0</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Conquistas</p>
            <p className="font-bold text-sm">{achievements.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
