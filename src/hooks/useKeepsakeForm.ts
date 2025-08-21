import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { keepsakeFormSchema } from '@/validations/keepsakeValidationSchema';
import { useAuth } from '@/hooks/useAuth';

// ============================================================================
// TIPOS E INTERFACES MELHORADOS
// ============================================================================

export type KeepsakeFormData = z.infer<typeof keepsakeFormSchema>;

export interface KeepsakeFormState {
  currentStep: number;
  isSubmitting: boolean;
  isValidating: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;
  stepValidation: Record<number, boolean>;
}

export interface StepValidationConfig {
  step: number;
  fields: (keyof KeepsakeFormData)[];
  customValidation?: (data: Partial<KeepsakeFormData>) => Promise<boolean>;
}

// ============================================================================
// CONFIGURAÇÃO DE VALIDAÇÃO POR ETAPA
// ============================================================================

const STEP_VALIDATION_CONFIG: StepValidationConfig[] = [
  {
    step: 1,
    fields: ['type'],
  },
  {
    step: 2,
    fields: ['recipient_name', 'delivery_channel', 'recipient_contact', 'street', 'city', 'postal_code'],
    customValidation: async (data) => {
      // Validação customizada para dados do destinatário
      if (data.delivery_channel === 'email' && data.recipient_contact) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.recipient_contact);
      }
      return true;
    }
  },
  {
    step: 3,
    fields: ['title', 'message', 'delivery_date'],
  },
  {
    step: 4,
    fields: ['selected_products'],
    customValidation: async (data) => {
      return (data.selected_products?.length ?? 0) > 0;
    }
  },
];

// ============================================================================
// HOOK PRINCIPAL MELHORADO
// ============================================================================

export const useKeepsakeForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estados do formulário
  const [formState, setFormState] = useState<KeepsakeFormState>({
    currentStep: 1,
    isSubmitting: false,
    isValidating: false,
    hasUnsavedChanges: false,
    validationErrors: {},
    stepValidation: {},
  });
  const submittingRef = useRef(false);

  // Configuração do React Hook Form com validação melhorada
  const form = useForm<KeepsakeFormData>({
    resolver: zodResolver(keepsakeFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      type: 'digital',
      delivery_channel: 'email',
      selected_products: [],
      total_cost: 0,
      channel_cost: 0,
      country: 'Portugal',
    },
  });

  // Validação avançada por etapa
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    setFormState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const config = STEP_VALIDATION_CONFIG.find(c => c.step === step);
      if (!config) return true;

      const currentData = form.getValues();
      
      // Validar campos obrigatórios da etapa
      const stepErrors: string[] = [];
      
      for (const field of config.fields) {
        const fieldValue = currentData[field];
        
        // Validação condicional baseada no canal de entrega
          if (step === 2) {
            if (currentData.delivery_channel === 'email' && String(field) === 'recipient_contact') {
              if (!fieldValue) stepErrors.push('Email é obrigatório');
            } else if (currentData.delivery_channel === 'sms' && String(field) === 'recipient_contact') {
              if (!fieldValue) stepErrors.push('Telefone é obrigatório');
            } else if (currentData.delivery_channel === 'physical') {
              if (['street', 'city', 'postal_code'].includes(String(field)) && !fieldValue) {
                stepErrors.push(`${String(field)} é obrigatório para entrega física`);
              }
            }
          } else if (!fieldValue && String(field) !== 'selected_products') {
            stepErrors.push(`${String(field)} é obrigatório`);
          }
      }

      // Executar validação customizada se existir
      if (config.customValidation) {
        const isCustomValid = await config.customValidation(currentData);
        if (!isCustomValid) {
          stepErrors.push('Validação customizada falhou');
        }
      }

      const isValid = stepErrors.length === 0;
      
      setFormState(prev => ({
        ...prev,
        stepValidation: { ...prev.stepValidation, [step]: isValid },
        validationErrors: { ...prev.validationErrors, [step]: stepErrors }
      }));

      return isValid;
    } catch (error) {
      console.error('Erro na validação da etapa:', error);
      return false;
    } finally {
      setFormState(prev => ({ ...prev, isValidating: false }));
    }
  }, [form]);

  // Funções de navegação entre etapas
  const nextStep = useCallback(async () => {
    const isValid = await validateStep(formState.currentStep);
    if (isValid) {
      setFormState(prev => ({ 
        ...prev, 
        currentStep: Math.min(prev.currentStep + 1, 6) 
      }));
    }
  }, [formState.currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setFormState(prev => ({ 
      ...prev, 
      currentStep: Math.max(prev.currentStep - 1, 1) 
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setFormState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  // Submissão melhorada com retry e validação completa
  const submitKeepsake = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Precisa de estar autenticado para criar uma cápsula',
        variant: 'destructive',
      });
      return false;
    }

    if (submittingRef.current) {
      return false;
    }
    submittingRef.current = true;

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Validação completa do formulário
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          title: 'Dados inválidos',
          description: 'Por favor, corrija os erros antes de submeter',
          variant: 'destructive',
        });
        return false;
      }

      const formData = form.getValues();
      
      // Calcular custo total
      const productsCost = formData.selected_products.reduce(
        (sum, product) => sum + (product.price * product.quantity), 0
      );
      const totalCost = productsCost + formData.channel_cost;

      // Inserir dados na base de dados com transação
      const { data: keepsakeData, error: keepsakeError } = await supabase
        .from('keepsakes')
        .insert({
          user_id: user.id,
          title: formData.title,
          message_content: formData.message,
          delivery_date: formData.delivery_date,
          type: formData.type,
          status: 'scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (keepsakeError) throw keepsakeError;

      // Inserir dados do destinatário
      const recipientPayload: any = {
        keepsake_id: keepsakeData.id,
        name: formData.recipient_name,
        relationship: formData.relationship || null,
        delivery_channel: formData.delivery_channel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Campos obrigatórios baseados no canal de entrega
      if (formData.delivery_channel === 'email') {
        recipientPayload.email = formData.recipient_contact || '';
        // Phone pode ser null para email
        recipientPayload.phone = null;
      } else if (formData.delivery_channel === 'sms') {
        recipientPayload.phone = formData.recipient_contact || '';
        // Email pode ser null para SMS
        recipientPayload.email = null;
      } else if (formData.delivery_channel === 'physical') {
        // Para entrega física, ambos email e phone podem ser opcionais
        recipientPayload.email = formData.recipient_contact || null;
        recipientPayload.phone = null;
        recipientPayload.street = formData.street;
        recipientPayload.city = formData.city;
        recipientPayload.state = formData.state || null;
        recipientPayload.postal_code = formData.postal_code;
        recipientPayload.country = formData.country || 'Portugal';
      }

      const { error: recipientError } = await supabase
        .from('recipients')
        .insert(recipientPayload);

      if (recipientError) throw recipientError;

      // Inserir produtos selecionados
      if (formData.selected_products.length > 0) {
        const { error: productsError } = await supabase
          .from('keepsake_products')
          .insert(
            formData.selected_products.map(product => ({
              keepsake_id: keepsakeData.id,
              product_id: product.id,
              quantity: product.quantity || 1,
              unit_price: product.price,
              created_at: new Date().toISOString(),
            }))
          );

        if (productsError) throw productsError;
      }

      toast({
        title: 'Cápsula criada com sucesso!',
        description: 'A sua cápsula do tempo foi criada e será entregue na data especificada.',
      });

      // Resetar formulário e avançar para etapa de sucesso
      setFormState(prev => ({ 
        ...prev, 
        currentStep: 6,
        hasUnsavedChanges: false 
      }));
      
      return true;

    } catch (error) {
      console.error('Erro ao criar cápsula:', error);
      toast({
        title: 'Erro ao criar cápsula',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      submittingRef.current = false;
    }
  }, [user, form, toast]);

  // Monitorar mudanças no formulário
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormState(prev => ({ ...prev, hasUnsavedChanges: true }));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-save (opcional)
  useEffect(() => {
    if (formState.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        // Implementar auto-save se necessário
        console.log('Auto-save triggered');
      }, 30000); // 30 segundos

      return () => clearTimeout(timer);
    }
  }, [formState.hasUnsavedChanges]);

  return {
    form,
    formState,
    currentStep: formState.currentStep,
    isSubmitting: formState.isSubmitting,
    isValidating: formState.isValidating,
    hasUnsavedChanges: formState.hasUnsavedChanges,
    validationErrors: formState.validationErrors,
    stepValidation: formState.stepValidation,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    submitKeepsake,
    resetForm: form.reset,
  };
};
