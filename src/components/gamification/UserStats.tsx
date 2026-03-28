import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Target, Flame } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

interface UserStatsProps {
  totalDeliveries: number;
}

const UserStats = ({ totalDeliveries }: UserStatsProps) => {
  const { stats, loading } = useGamification();

  if (loading || !stats) {
    return (
      <Card className="border-green-100 bg-green-50/50 animate-pulse">
        <CardContent className="p-6 h-40 flex items-center justify-center">
          <span className="text-green-600">A carregar estatísticas...</span>
        </CardContent>
      </Card>
    );
  }

  const { total_points, current_level, current_streak, next_level_points, progress_to_next_level } = stats;

  return (
    <Card className="border-green-100 bg-green-50/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">Nível {current_level}</span>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-primary/20">
                    Progresso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {Math.round(progress_to_next_level)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-primary/20">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  style={{ '--progress-width': `${progress_to_next_level}%` } as React.CSSProperties}
                ></div>
              </div>
            </div>

            <p className="text-sm text-green-600 mt-1">
              {total_points} / {next_level_points} pontos para o próximo nível
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1 p-2 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Pontos</span>
              </div>
              <p className="text-lg font-bold text-foreground">{total_points}</p>
            </div>
            <div className="space-y-1 p-2 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-4 w-4 text-keepla-red" />
                <span className="text-xs font-medium text-foreground">Entregas</span>
              </div>
              <p className="text-lg font-bold text-foreground">{totalDeliveries}</p>
            </div>
            <div className="space-y-1 p-2 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-foreground">Streak</span>
              </div>
              <p className="text-lg font-bold text-foreground">{current_streak} dias</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
