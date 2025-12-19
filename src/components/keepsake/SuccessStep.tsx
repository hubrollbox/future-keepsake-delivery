

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

interface SuccessStepProps {
  formData: KeepsakeFormData;
}

const SuccessStep = ({ formData }: SuccessStepProps) => {
  const getChannelLabel = () => 'email';

  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="animate-pulse">
          <Sparkles className="h-16 w-16 text-keepla-red mx-auto mb-4" />
        </div>
        <CheckCircle className="h-8 w-8 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
      </div>

      <div>
        <h2 className="text-3xl font-serif text-keepla-gray-dark mb-4">
          Cápsula Selada!
        </h2>
        <div className="max-w-md mx-auto">
          <Card className="bg-keepla-red/5 border-keepla-red/30">
            <CardContent className="p-6">
              <p className="text-keepla-gray-dark font-serif text-lg italic">
                "A tua cápsula foi selada. Será entregue a{' '}
                <span className="font-semibold">{formData.recipient_name}</span>{' '}
                por {getChannelLabel()} em{' '}
                <span className="font-semibold">
                  {new Date(formData.delivery_date).toLocaleDateString('pt-PT')}
                </span>."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <p className="text-keepla-gray-light">
          A tua mensagem está agora guardada no tempo, esperando pelo momento perfeito para chegar ao destinatário.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button className="bg-keepla-red hover:bg-keepla-red/90 text-white px-6">
              Ver no Dashboard
            </Button>
          </Link>
          <Link to="/create-keepsake">
            <Button variant="outline" className="border-keepla-red text-keepla-red hover:bg-keepla-red/10">
              Criar Nova Cápsula
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
