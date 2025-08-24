
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Package, ArrowRight } from "lucide-react";

interface CapsuleCardProps {
  title: string;
  description: string;
  deliveryDate: string;
  status: "pending" | "delivered" | "scheduled";
  type: "email" | "physical" | "digital";
  recipient: string;
}

const CapsuleCard = ({ 
  title, 
  description, 
  deliveryDate, 
  status, 
  type, 
  recipient 
}: CapsuleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-sand-beige text-steel-blue";
      case "delivered": return "bg-earthy-burgundy/10 text-earthy-burgundy";
      case "scheduled": return "bg-dusty-rose/20 text-steel-blue";
      default: return "bg-misty-gray/20 text-steel-blue";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "delivered": return "Entregue";
      case "scheduled": return "Agendado";
      default: return "Desconhecido";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Clock className="h-4 w-4" />;
      case "physical": return <Package className="h-4 w-4" />;
      case "digital": return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="emotion-card border-dusty-rose/20 gentle-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(type)}
            <CardTitle className="text-lg font-fraunces text-steel-blue">{title}</CardTitle>
          </div>
          <Badge className={`${getStatusColor(status)} border-0 font-medium`}>
            {getStatusText(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-misty-gray text-sm leading-relaxed">{description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-steel-blue font-medium">Para:</span>
            <span className="text-misty-gray">{recipient}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-steel-blue font-medium">Entrega:</span>
            <span className="text-misty-gray">{deliveryDate}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            variant="brand-outline" 
            size="sm" 
            className="w-full group"
          >
            Ver Detalhes
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapsuleCard;
