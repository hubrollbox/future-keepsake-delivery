
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

const PlanCard = ({ 
  name, 
  price, 
  originalPrice, 
  description, 
  features, 
  isPopular = false, 
  isCurrentPlan = false,
  onSelect 
}: PlanCardProps) => {
  return (
    <Card className={`emotion-card relative gentle-hover ${
      isPopular 
        ? 'border-keepla-red/40 ring-2 ring-keepla-red/20' 
        : 'border-keepla-red/20'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-keepla-red text-white border-0 px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-fraunces text-keepla-gray-dark mb-2">{name}</CardTitle>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-bold text-keepla-red">{price}</span>
            {originalPrice && (
              <span className="text-lg text-keepla-gray-light line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-keepla-gray-light text-sm">{description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={`feature-${feature.slice(0, 15).replace(/\s+/g, '-')}-${index}`} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-keepla-red mt-0.5 flex-shrink-0" />
              <span className="text-keepla-gray-dark text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4">
          {isCurrentPlan ? (
            <Button 
              variant="gentle" 
              className="w-full" 
              disabled
            >
              Plano Atual
            </Button>
          ) : (
            <Button 
              variant={isPopular ? "brand" : "brand-outline"} 
              className="w-full" 
              onClick={onSelect}
            >
              {isPopular ? "Escolher Plano" : "Selecionar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
