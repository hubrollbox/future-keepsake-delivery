import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export interface Capsule {
  name: string;
  price: string;
  description: string;
}

interface CapsuleCardProps {
  capsule: Capsule;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule }) => {
  return (
    <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
      <CardContent className="pt-6">
        <h4 className="font-semibold text-lg mb-2">{capsule.name}</h4>
        <p className="text-2xl font-bold text-amber-700 mb-2">{capsule.price}</p>
        <p className="text-gray-600 text-sm">{capsule.description}</p>
      </CardContent>
    </Card>
  );
};

export default CapsuleCard;