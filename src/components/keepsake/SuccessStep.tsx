

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

interface SuccessStepProps {
  formData: KeepsakeFormData;
}

const SuccessStep = ({ formData }: SuccessStepProps) => {
  const getChannelLabel = () => {
    switch (formData.delivery_channel) {
      case 'email': return 'email';
      case 'sms': return 'SMS';
      case 'physical': return 'morada física';
      default: return 'email';
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="animate-pulse">
          <Sparkles className="h-16 w-16 text-dusty-rose mx-auto mb-4" />
        </div>
        <CheckCircle className="h-8 w-8 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
      </div>

      <div>
        <h2 className="text-3xl font-serif text-steel-blue mb-4">
          Cápsula Selada!
        </h2>
        <div className="max-w-md mx-auto">
          <Card className="bg-dusty-rose/5 border-dusty-rose/30">
            <CardContent className="p-6">
              <p className="text-steel-blue font-serif text-lg italic">
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
        <p className="text-misty-gray">
          A tua mensagem está agora guardada no tempo, esperando pelo momento perfeito para chegar ao destinatário.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-6">
              Ver no Dashboard
            </Button>
          </Link>
          <Link to="/create-keepsake">
            <Button variant="outline" className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10">
              Criar Nova Cápsula
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
