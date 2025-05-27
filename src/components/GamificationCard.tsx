import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Target, Trophy, Clock, Zap } from "lucide-react";

export interface GamificationFeature {
  name: string;
  description: string;
}

interface GamificationCardProps {
  feature: GamificationFeature;
  iconIndex: number;
}

const icons = [
  <Target className="h-6 w-6 text-white" key="target" />,
  <Trophy className="h-6 w-6 text-white" key="trophy" />,
  <Clock className="h-6 w-6 text-white" key="clock" />,
  <Zap className="h-6 w-6 text-white" key="zap" />
];

const GamificationCard: React.FC<GamificationCardProps> = ({ feature, iconIndex }) => {
  return (
    <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
      <CardContent className="pt-6">
        <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
          {icons[iconIndex % icons.length]}
        </div>
        <h4 className="font-semibold text-lg mb-2">{feature.name}</h4>
        <p className="text-gray-600 text-sm">{feature.description}</p>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;