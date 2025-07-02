
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MessageStep from "@/components/keepsake/MessageStep";
import RecipientStep from "@/components/keepsake/RecipientStep";
import ProductsStep from "@/components/keepsake/ProductsStep";
import ReviewStep from "@/components/keepsake/ReviewStep";
import SuccessStep from "@/components/keepsake/SuccessStep";

export interface KeepsakeFormData {
  title: string;
  message: string;
  delivery_date: string;
  recipient_name: string;
  relationship: string;
  delivery_channel: 'email' | 'sms' | 'physical';
  recipient_contact: string;
  channel_cost: number;
  selected_products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_cost: number;
}

const CreateKeepsake = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<KeepsakeFormData>({
    title: '',
    message: '',
    delivery_date: '',
    recipient_name: '',
    relationship: '',
    delivery_channel: 'email',
    recipient_contact: '',
    channel_cost: 0,
    selected_products: [],
    total_cost: 0
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const steps = [
    { title: "Mensagem", component: MessageStep },
    { title: "Destinatário", component: RecipientStep },
    { title: "Extras", component: ProductsStep },
    { title: "Revisão", component: ReviewStep },
    { title: "Sucesso", component: SuccessStep }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<KeepsakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    // Esta função será implementada com integração Stripe
    setLoading(true);
    try {
      // Simular criação da cápsula
      await new Promise(resolve => setTimeout(resolve, 2000));
      nextStep(); // Ir para o passo de sucesso
      toast({
        title: "Cápsula Criada!",
        description: "A tua cápsula foi selada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a cápsula.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-steel-blue text-center mb-4">
            Criar Nova Cápsula
          </h1>
          
          {currentStep < steps.length - 1 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-misty-gray mb-2">
                <span>Passo {currentStep + 1} de {steps.length - 1}</span>
                <span>{Math.round(progress)}% completo</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex justify-center mb-8">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${index < steps.length - 2 ? 'mr-4' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index <= currentStep
                      ? 'bg-dusty-rose text-white'
                      : 'bg-sand-beige text-misty-gray'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentStep ? 'text-steel-blue' : 'text-misty-gray'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 2 && (
                  <div className="w-8 h-px bg-sand-beige mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-soft border-dusty-rose/20">
          <CardContent className="p-8">
            <StepComponent
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={currentStep}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateKeepsake;
