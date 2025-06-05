
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
      case "achievement": return <Trophy className="h-5 w-5 text-earthy-burgundy" />;
      case "level": return <Star className="h-5 w-5 text-earthy-burgundy" />;
      case "quest": return <Target className="h-5 w-5 text-earthy-burgundy" />;
      case "streak": return <Zap className="h-5 w-5 text-earthy-burgundy" />;
      default: return icon || <Star className="h-5 w-5 text-earthy-burgundy" />;
    }
  };

  const getTypeColor = () => {
    if (!unlocked) return "bg-misty-gray/20 text-misty-gray";
    return "bg-earthy-burgundy/10 text-earthy-burgundy";
  };

  const progressPercentage = (progress / maxProgress) * 100;

  return (
    <Card className={`emotion-card border-dusty-rose/20 gentle-hover ${!unlocked ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <CardTitle className="text-lg font-fraunces text-steel-blue">{title}</CardTitle>
          </div>
          {unlocked && (
            <Badge className={getTypeColor()}>
              Desbloqueado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-misty-gray text-sm leading-relaxed">{description}</p>
        
        {maxProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-steel-blue font-medium">Progresso</span>
              <span className="text-misty-gray">{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-sand-beige rounded-full h-2">
              <div 
                className="bg-earthy-burgundy h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {reward && (
          <div className="pt-2 border-t border-dusty-rose/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-steel-blue font-medium">Recompensa:</span>
              <span className="text-earthy-burgundy font-medium">{reward}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GamificationCard;
