
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  onLearnMore?: () => void;
}

const ServiceCard = ({ title, description, features, icon, onLearnMore }: ServiceCardProps) => {
  return (
    <Card className="emotion-card border-dusty-rose/20 gentle-hover group">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center text-earthy-burgundy group-hover:bg-earthy-burgundy/15 transition-colors duration-200">
          {icon}
        </div>
        <CardTitle className="text-xl font-fraunces text-steel-blue mb-2">{title}</CardTitle>
        <p className="text-misty-gray text-sm leading-relaxed">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-earthy-burgundy rounded-full mt-2 flex-shrink-0" />
              <span className="text-steel-blue text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        {onLearnMore && (
          <div className="pt-2">
            <Button 
              variant="brand-outline" 
              size="sm" 
              className="w-full group/btn"
              onClick={onLearnMore}
            >
              Saber Mais
              <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
