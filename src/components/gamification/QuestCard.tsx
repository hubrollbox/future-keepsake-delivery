import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  timeLimit?: string;
}

interface QuestCardProps {
  quest: Quest;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const { title, description, progress, target, reward, timeLimit } = quest;
  const progressPercentage = (progress / target) * 100;
  const isCompleted = progress >= target;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">{title}</h4>
          </div>
          <Badge className="bg-blue-500">
            +{reward} XP
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-3">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{progress}/{target}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {timeLimit && (
          <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{timeLimit}</span>
          </div>
        )}

        {isCompleted && (
          <Badge className="mt-2 bg-green-500">
            ✓ Completada!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestCard;
