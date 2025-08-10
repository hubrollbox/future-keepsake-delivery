import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface KeepsakeFormData {
  title: string;
  message: string;
  delivery_date: string;
  type: 'digital' | 'physical';
  recipient_name: string;
  recipient_contact: string; // for email/sms
  delivery_channel: 'email' | 'sms' | 'physical';
  relationship: string;
  channel_cost: number;
  // Address fields for physical deliveries
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  selected_products: any[];
  total_cost: number;
}

export const useKeepsakeForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KeepsakeFormData>({
    title: "",
    message: "",
    delivery_date: "",
    type: 'digital',
    recipient_name: "",
    recipient_contact: "",
    delivery_channel: 'email',
    relationship: "",
    channel_cost: 0,
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Portugal",
    selected_products: [],
    total_cost: 0,
  });

  const updateFormData = (data: Partial<KeepsakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Type selection
        if (!formData.type) {
          toast({
            title: "Erro de Validação",
            description: "Selecione o tipo de cápsula.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 1: // Recipient info
        if (!formData.recipient_name || !formData.delivery_channel) {
          toast({
            title: "Erro de Validação", 
            description: "Preencha o nome e o canal de entrega.",
            variant: "destructive",
          });
          return false;
        }

        if (formData.delivery_channel === 'physical') {
          if (!formData.street || !formData.city || !formData.postal_code) {
            toast({
              title: "Erro de Validação",
              description: "Preencha morada, cidade e código postal.",
              variant: "destructive",
            });
            return false;
          }
          return true;
        }
        
        if (!formData.recipient_contact) {
          toast({
            title: "Erro de Validação", 
            description: "Preencha o contacto do destinatário.",
            variant: "destructive",
          });
          return false;
        }
        
        // Validate email format if email channel
        if (formData.delivery_channel === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.recipient_contact)) {
            toast({
              title: "Erro de Validação",
              description: "Email inválido.",
              variant: "destructive",
            });
            return false;
          }
        }
        
        // Basic phone validation for SMS
        if (formData.delivery_channel === 'sms') {
          const digits = formData.recipient_contact.replace(/\D/g, '');
          if (digits.length < 9) {
            toast({
              title: "Erro de Validação",
              description: "Número de telemóvel inválido.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;

      case 2: // Message
        if (!formData.title || !formData.message || !formData.delivery_date) {
          toast({
            title: "Erro de Validação",
            description: "Preencha título, mensagem e data de entrega.",
            variant: "destructive",
          });
          return false;
        }
        
        // Validate future date
        const deliveryDate = new Date(formData.delivery_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deliveryDate <= today) {
          toast({
            title: "Erro de Validação",
            description: "A data de entrega deve ser futura.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 3: // Products (optional)
        return true;

      default:
        return true;
    }
  };

  const submitKeepsake = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Calculate total cost
      const productsCost = formData.selected_products.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0
      );
      const totalCost = productsCost + formData.channel_cost;

      // 1. Create keepsake
      const { data: keepsakeData, error: keepsakeError } = await supabase
        .from('keepsakes')
        .insert({
          user_id: user.id,
          title: formData.title,
          message: formData.message,
          delivery_date: new Date(formData.delivery_date).toISOString(),
          type: formData.type,
          message_type: 'keepsake',
          message_content: formData.message, // Store message in both fields for compatibility
          total_cost: totalCost,
          payment_status: 'pending',
          status: 'scheduled'
        })
        .select()
        .single();

      if (keepsakeError) throw keepsakeError;

      // 2. Create recipient
      const recipientData: any = {
        keepsake_id: keepsakeData.id,
        name: formData.recipient_name,
        delivery_channel: formData.delivery_channel,
        channel_cost: formData.channel_cost,
        relationship: formData.relationship,
        country: 'Portugal'
      };

      // Set contact info based on delivery channel
      switch (formData.delivery_channel) {
        case 'email':
          recipientData.email = formData.recipient_contact;
          break;
        case 'sms':
          recipientData.phone = formData.recipient_contact;
          recipientData.email = `${formData.recipient_name.toLowerCase().replace(/\s+/g, '')}@placeholder.com`;
          break;
        case 'physical':
          recipientData.street = formData.street;
          recipientData.city = formData.city;
          recipientData.state = formData.state;
          recipientData.postal_code = formData.postal_code;
          recipientData.country = formData.country || 'Portugal';
          recipientData.email = `${formData.recipient_name.toLowerCase().replace(/\s+/g, '')}@placeholder.com`;
          break;
      }

      const { error: recipientError } = await supabase
        .from('recipients')
        .insert(recipientData);

      if (recipientError) throw recipientError;

      // 3. Create keepsake products if any
      if (formData.selected_products.length > 0) {
        const productsData = formData.selected_products.map(product => ({
          keepsake_id: keepsakeData.id,
          product_id: product.id,
          quantity: product.quantity,
          unit_price: product.price
        }));

        const { error: productsError } = await supabase
          .from('keepsake_products')
          .insert(productsData);

        if (productsError) throw productsError;
      }

      toast({
        title: "Sucesso!",
        description: "Cápsula criada com sucesso.",
      });

      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error creating keepsake:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar cápsula.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    formData,
    loading,
    updateFormData,
    nextStep,
    prevStep,
    submitKeepsake,
    validateCurrentStep
  };
};
