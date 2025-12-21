
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface GamificationCardProps {
  type: "achievement" | "level" | "quest" | "streak";
  title: string;
  description: string;
  progress?: number;
  maxProgress?: number;
  reward?: string;
  unlocked?: boolean;
  icon?: React.ReactNode;
}

const GamificationCard = ({ 
  type, 
  title, 
  description, 
  progress = 0, 
  maxProgress = 100, 
  reward, 
  unlocked = false,
  icon 
}: GamificationCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "achievement": return <Trophy className="h-5 w-5 text-keepla-red" />;
      case "level": return <Star className="h-5 w-5 text-keepla-red" />;
      case "quest": return <Target className="h-5 w-5 text-keepla-red" />;
      case "streak": return <Zap className="h-5 w-5 text-keepla-red" />;
      default: return icon || <Star className="h-5 w-5 text-keepla-red" />;
    }
  };

  const getTypeColor = () => {
    if (!unlocked) return "bg-keepla-gray text-gray-600";
    return "bg-keepla-red/10 text-keepla-red";
  };

  const progressPercentage = (progress / maxProgress) * 100;

  return (
    <Card className={`border-keepla-gray hover:border-keepla-red transition-colors ${!unlocked ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <CardTitle className="text-lg font-inter text-keepla-black">{title}</CardTitle>
          </div>
          {unlocked && (
            <Badge className={getTypeColor()}>
              Desbloqueado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        
        {maxProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-keepla-black font-medium">Progresso</span>
              <span className="text-gray-600">{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-keepla-gray rounded-full h-2">
              <div 
                className="bg-keepla-red h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {reward && (
          <div className="pt-2 border-t border-keepla-gray">
            <div className="flex items-center justify-between text-sm">
              <span className="text-keepla-black font-medium">Recompensa:</span>
              <span className="text-keepla-red font-medium">{reward}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GamificationCard;
