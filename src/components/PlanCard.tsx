import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
  color: string;
}

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const navigate = useNavigate();
  return (
    <Card className={`relative ${plan.color} ${plan.popular ? 'scale-105 shadow-xl border-2' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-1">
            <Star className="h-4 w-4 mr-1" />
            Mais Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-amber-700">
          {plan.price}<span className="text-lg text-gray-600">{plan.period}</span>
        </div>
        <p className="text-gray-600">{plan.description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          onClick={() => navigate('/register')}
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;