
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  points: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const { title, description, icon: Icon, unlocked, points } = achievement;

  return (
    <Card className={`transition-all duration-300 ${unlocked 
      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200 shadow-md' 
      : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${unlocked
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
            : 'bg-gray-300'
          }`}>
            <Icon className={`h-5 w-5 ${unlocked ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold text-sm ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {title}
            </h4>
            <p className={`text-xs ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {description}
            </p>
          </div>
          <Badge 
            variant={unlocked ? "default" : "secondary"}
            className={unlocked ? "bg-amber-500" : ""}
          >
            +{points} XP
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
