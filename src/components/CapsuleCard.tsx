
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
      case "pending": return "bg-keepla-gray text-keepla-black";
      case "delivered": return "bg-keepla-red/10 text-keepla-red";
      case "scheduled": return "bg-keepla-gray-neutral text-keepla-black";
      default: return "bg-keepla-gray text-keepla-black";
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
    <Card className="border-keepla-gray hover:border-keepla-red transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(type)}
            <CardTitle className="text-lg font-inter text-keepla-black">{title}</CardTitle>
          </div>
          <Badge className={`${getStatusColor(status)} border-0 font-medium`}>
            {getStatusText(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-keepla-black font-medium">Para:</span>
            <span className="text-gray-600">{recipient}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-keepla-black font-medium">Entrega:</span>
            <span className="text-gray-600">{deliveryDate}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group border-keepla-red text-keepla-red hover:bg-keepla-red hover:text-keepla-white"
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
