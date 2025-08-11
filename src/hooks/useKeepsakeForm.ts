import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { keepsakeFormSchema, KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import { getTomorrowDate, sanitizeInput } from "@/utils/validation";

export type KeepsakeFormData = KeepsakeFormValues & {
  recipient_contact: string; // for email/sms
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export const useKeepsakeForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Inicializar o formulário com react-hook-form e validação Zod
  const form = useForm<KeepsakeFormValues>({
    resolver: zodResolver(keepsakeFormSchema),
    defaultValues: {
      title: "",
      message: "",
      delivery_date: getTomorrowDate(),
      type: 'digital',
      recipient_name: "",
      delivery_channel: 'email',
      relationship: "",
      channel_cost: 0,
      selected_products: [],
      total_cost: 0,
    },
    mode: 'onChange' // Validar ao alterar os campos
  });
  
  // Estado para campos adicionais não cobertos pelo esquema Zod
  const [formData, setFormData] = useState<KeepsakeFormData>({
    ...form.getValues(),
    recipient_contact: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Portugal",
  });

  // Atualiza o estado do formulário e sincroniza com react-hook-form
  const updateFormData = (data: Partial<KeepsakeFormData>) => {
    // Atualizar o estado local
    setFormData(prev => {
      const newData = { ...prev, ...data };
      
      // Sincronizar com react-hook-form para campos que estão no esquema Zod
      const formFields: Partial<KeepsakeFormValues> = {};
      
      // Verificar quais campos do data estão no esquema Zod
      Object.keys(data).forEach(key => {
        const fieldKey = key as keyof KeepsakeFormValues;
        if (fieldKey in keepsakeFormSchema.shape) {
          // @ts-ignore - Ignorar erro de tipagem aqui
          formFields[fieldKey] = data[fieldKey];
        }
      });
      
      // Atualizar os campos no formulário react-hook-form
      if (Object.keys(formFields).length > 0) {
        Object.entries(formFields).forEach(([field, value]) => {
          form.setValue(field as any, value as any, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        });
      }
      
      return newData;
    });
  };

  // Avança para o próximo passo se a validação for bem-sucedida
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Retorna ao passo anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Valida o passo atual usando Zod e react-hook-form
  const validateCurrentStep = async (): Promise<boolean> => {
    switch (currentStep) {
      case 0: // Seleção de tipo
        // Validar o tipo usando react-hook-form
        const typeValid = await form.trigger('type');
        if (!typeValid) {
          const error = form.formState.errors.type;
          toast({
            title: "Erro de Validação",
            description: error?.message || "Selecione o tipo de cápsula.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 1: // Informações do destinatário
        // Validar nome e canal de entrega
        const recipientFieldsValid = await form.trigger(['recipient_name', 'delivery_channel']);
        if (!recipientFieldsValid) {
          const errors = form.formState.errors;
          toast({
            title: "Erro de Validação",
            description: errors.recipient_name?.message || errors.delivery_channel?.message || "Preencha os campos obrigatórios.",
            variant: "destructive",
          });
          return false;
        }

        // Validação específica para cada canal de entrega
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
        
        // Validar email ou telefone com base no canal selecionado
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
        } else if (formData.delivery_channel === 'sms') {
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

      case 2: // Mensagem
        // Validar título, mensagem e data de entrega
        const messageFieldsValid = await form.trigger(['title', 'message', 'delivery_date']);
        if (!messageFieldsValid) {
          const errors = form.formState.errors;
          toast({
            title: "Erro de Validação",
            description: errors.title?.message || errors.message?.message || errors.delivery_date?.message || "Preencha todos os campos obrigatórios.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 3: // Produtos (opcional)
        return true;

      default:
        return true;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitKeepsake = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Validar o formulário completo antes de submeter
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        const firstError = Object.values(errors)[0];
        toast({
          title: "Erro de Validação",
          description: firstError?.message || "Por favor, verifique os campos do formulário.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Utilizador não autenticado.",
          variant: "destructive",
        });
        return false;
      }

      // Calcular custo total
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

      if (keepsakeError) {
        console.error('Error creating keepsake:', keepsakeError);
        toast({
          title: "Erro",
          description: "Erro ao criar a cápsula: " + (keepsakeError?.message || ""),
          variant: "destructive",
        });
        return false;
      }

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

      if (recipientError) {
        console.error('Error creating recipient:', recipientError);
        toast({
          title: "Erro",
          description: "Erro ao registar o destinatário: " + (recipientError?.message || ""),
          variant: "destructive",
        });
        
        // Tentar remover a cápsula criada para evitar dados órfãos
        await supabase
          .from('keepsakes')
          .delete()
          .eq('id', keepsakeData.id);
          
        return false;
      }

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

        if (productsError) {
          console.error('Error adding products:', productsError);
          toast({
            title: "Aviso",
            description: "Cápsula criada, mas houve um erro ao adicionar produtos: " + (productsError?.message || ""),
            variant: "warning",
          });
        }
      }

      toast({
        title: "Sucesso!",
        description: "Cápsula criada com sucesso.",
      });

      navigate('/dashboard');
      return true;

    } catch (error: any) {
      console.error('Error creating keepsake:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar cápsula.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    updateFormData,
    nextStep,
    prevStep,
    submitKeepsake,
    validateCurrentStep,
    form
  };
};
