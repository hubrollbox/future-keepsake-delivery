import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export interface Service {
  name: string;
  price: string;
  description: string;
  yearlyPrice?: string;
}

interface ServiceCardProps {
  service: Service;
  highlightYearly?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, highlightYearly }) => {
  return (
    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
        <p className="text-2xl font-bold text-amber-700 mb-1">{service.price}</p>
        {highlightYearly && service.yearlyPrice && (
          <p className="text-lg text-green-600 mb-2">({service.yearlyPrice} poupas 20%)</p>
        )}
        <p className="text-gray-600 text-sm">{service.description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;