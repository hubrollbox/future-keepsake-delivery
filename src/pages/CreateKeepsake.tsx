
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SecureMessageStep from "@/components/keepsake/SecureMessageStep";
import RecipientStep from "@/components/keepsake/RecipientStep";
import ProductsStep from "@/components/keepsake/ProductsStep";
import ReviewStep from "@/components/keepsake/ReviewStep";
import SuccessStep from "@/components/keepsake/SuccessStep";
import { supabase } from "@/integrations/supabase/client";

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
    { title: "Mensagem", component: SecureMessageStep },
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
    if (!user) {
      console.log("DEBUG: No user found");
      toast({ 
        title: "Erro", 
        description: "É necessário fazer login para criar uma cápsula.", 
        variant: "destructive" 
      });
      navigate("/login");
      return;
    }

    console.log("DEBUG: Starting keepsake creation with user:", user.id);
    console.log("DEBUG: Form data:", formData);

    setLoading(true);
    
    try {
      // Enhanced validations with security checks
      if (!formData.title?.trim() || !formData.message?.trim() || !formData.delivery_date) {
        throw new Error("Título, mensagem e data de entrega são obrigatórios");
      }

      if (!formData.recipient_name?.trim() || !formData.recipient_contact?.trim()) {
        throw new Error("Nome e contacto do destinatário são obrigatórios");
      }

      // Validate delivery date is in the future
      const deliveryDate = new Date(formData.delivery_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deliveryDate <= today) {
        throw new Error("Data de entrega deve ser no futuro");
      }

      // Validate email format if email delivery
      if (formData.delivery_channel === 'email') {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(formData.recipient_contact)) {
          throw new Error("Email do destinatário inválido");
        }
      }

      console.log("DEBUG: Creating keepsake...");
      
      // Criar a keepsake
      const { data: keepsakeData, error: keepsakeError } = await supabase
        .from("keepsakes")
        .insert([
          {
            title: formData.title.trim(),
            message: formData.message.trim(),
            delivery_date: formData.delivery_date,
            user_id: user.id,
            status: 'scheduled',
            payment_status: 'pending',
            total_cost: formData.total_cost
          }
        ])
        .select()
        .single();

      if (keepsakeError) {
        console.error("DEBUG: Erro ao criar keepsake:", keepsakeError);
        if (keepsakeError.code === '23505') {
          throw new Error("Já existe uma cápsula com este título");
        }
        throw keepsakeError;
      }

      console.log("DEBUG: Keepsake created successfully:", keepsakeData);

      // Create the recipient with enhanced validation
      console.log("DEBUG: Creating recipient...");
      const { error: recipientError } = await supabase
        .from("recipients")
        .insert([
          {
            name: formData.recipient_name.trim(),
            relationship: formData.relationship?.trim() || null,
            delivery_channel: formData.delivery_channel,
            email: formData.delivery_channel === 'email' ? formData.recipient_contact.trim() : null,
            phone: formData.delivery_channel === 'sms' ? formData.recipient_contact.trim() : null,
            address: formData.delivery_channel === 'physical' ? formData.recipient_contact.trim() : null,
            channel_cost: formData.channel_cost,
            keepsake_id: keepsakeData.id
          }
        ]);

      if (recipientError) {
        console.error("DEBUG: Erro ao criar destinatário:", recipientError);
        throw recipientError;
      }

      console.log("DEBUG: Recipient created successfully");

      // Create the products with validation
      if (formData.selected_products.length > 0) {
        console.log("DEBUG: Creating products...");
        const keepsakeProducts = formData.selected_products.map(product => ({
          keepsake_id: keepsakeData.id,
          product_id: product.id,
          quantity: Math.max(1, product.quantity), // Ensure positive quantity
          unit_price: Math.max(0, product.price) // Ensure non-negative price
        }));

        const { error: productsError } = await supabase
          .from("keepsake_products")
          .insert(keepsakeProducts);

        if (productsError) {
          console.error("DEBUG: Erro ao adicionar produtos:", productsError);
          throw productsError;
        }

        console.log("DEBUG: Products created successfully");
      }

      console.log("DEBUG: All operations completed successfully");
      nextStep();
      toast({ 
        title: "Cápsula Criada!", 
        description: "A tua cápsula foi selada com sucesso." 
      });
      
    } catch (error: any) {
      console.error("DEBUG: Erro detalhado na criação da cápsula:", error);
      
      let errorMessage = "Não foi possível criar a cápsula.";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.code === 'PGRST301') {
        errorMessage = "Dados inválidos. Verifica se todos os campos estão preenchidos corretamente.";
      }
      
      toast({ 
        title: "Erro", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!user) return null;

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SecureMessageStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <RecipientStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <ProductsStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={formData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );
      case 4:
        return (
          <SuccessStep
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

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
            {renderStepComponent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateKeepsake;
