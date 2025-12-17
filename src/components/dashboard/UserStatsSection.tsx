

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Target } from "lucide-react";
import UserStats from "@/components/gamification/UserStats";
import AchievementCard from "@/components/gamification/AchievementCard";
import QuestCard from "@/components/gamification/QuestCard";
import type { UserProfile } from "@/contexts/useAuthContext";

interface UserStatsSectionProps {
  profile: UserProfile | null;
  totalDeliveries: number;
}

const UserStatsSection = ({ totalDeliveries }: Omit<UserStatsSectionProps, 'profile'>) => {
  return (
    <div className="mb-8">
      <Card className="shadow-soft border-green-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-green-900 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            A Tua Jornada Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserStats totalDeliveries={totalDeliveries} />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Conquistas
              </h4>
              <AchievementCard 
                achievement={{ 
                  id: "1", 
                  title: "Primeira Entrega", 
                  description: "Enviaste a tua primeira mensagem!", 
                  icon: Award, 
                  unlocked: totalDeliveries > 0, 
                  points: 50 
                }} 
              />
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Missões Ativas
              </h4>
              <QuestCard 
                quest={{ 
                  id: "1", 
                  title: "Enviar 5 Mensagens", 
                  description: "Envia 5 mensagens para desbloquear esta missão.", 
                  progress: totalDeliveries, 
                  target: 5, 
                  reward: 100 
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsSection;
