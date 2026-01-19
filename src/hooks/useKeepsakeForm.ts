import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { keepsakeFormSchema, KeepsakeFormValues } from '@/validations/keepsakeValidationSchema';
import { computeTotalSimple } from '@/lib/simplePricing';
import { useAuth } from '@/hooks/useAuth';

// ============================================================================
// TIPOS E INTERFACES MELHORADOS
// ============================================================================

export type KeepsakeFormData = KeepsakeFormValues;

export interface KeepsakeFormState {
  currentStep: number;
  isSubmitting: boolean;
  isValidating: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;
  stepValidation: Record<number, boolean>;
  submissionError?: string;
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
    fields: ['recipient_name', 'recipient_contact'],
    customValidation: async (data) => {
      // Validação customizada para dados do destinatário
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return data.recipient_contact ? emailRegex.test(data.recipient_contact) : false;
    }
  },
  {
    step: 3,
    fields: ['title', 'message', 'delivery_date'],
  },
  {
    step: 4,
    fields: [], // Produtos são opcionais; não há campos obrigatórios neste passo
    customValidation: async () => true,
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
  const form = useForm<z.input<typeof keepsakeFormSchema>>({
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
      recipient_contact: '',
    },
  });

  // Validação avançada por etapa
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    console.log('[useKeepsakeForm] validateStep called for step:', step);
    setFormState(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Passo 4 (Produtos) é opcional - sempre permitir avançar
      if (step === 4) {
        console.log('[useKeepsakeForm] Step 4 - products is optional, returning true');
        setFormState(prev => ({
          ...prev,
          stepValidation: { ...prev.stepValidation, [step]: true },
          validationErrors: { ...prev.validationErrors, [step]: [] },
          isValidating: false
        }));
        return true;
      }

      const config = STEP_VALIDATION_CONFIG.find(c => c.step === step);
      if (!config) return true;

      const currentData = form.getValues();
      
      // Validar campos obrigatórios da etapa
      const stepErrors: string[] = [];
      
      for (const field of config.fields) {
        const fieldValue = currentData[field];
        if (!fieldValue && String(field) !== 'selected_products') {
          stepErrors.push(`${String(field)} é obrigatório`);
        }
      }

      // Executar validação customizada se existir
      if (config.customValidation) {
        const isCustomValid = await config.customValidation({
          recipient_contact: currentData.recipient_contact,
          total_cost: currentData.total_cost || 0,
          channel_cost: currentData.channel_cost || 0,
          selected_products: currentData.selected_products || []
        });
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
    console.log('[useKeepsakeForm] nextStep called, currentStep:', formState.currentStep);
    const isValid = await validateStep(formState.currentStep);
    console.log('[useKeepsakeForm] validateStep returned:', isValid);
    if (isValid) {
      setFormState(prev => {
        const newStep = Math.min(prev.currentStep + 1, 6);
        console.log('[useKeepsakeForm] Advancing to step:', newStep);
        return { ...prev, currentStep: newStep };
      });
    } else {
      console.log('[useKeepsakeForm] Validation failed, not advancing');
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
      
      // Calcular custo total simples e garantir que está refletido no estado
      const computedTotal = computeTotalSimple({
        ...formData,
        selected_products: formData.selected_products || [],
        channel_cost: formData.channel_cost || 0,
        total_cost: formData.total_cost || 0,
      } as any);
      // Atualizar total no formulário para manter consistência
      try {
        form.setValue('total_cost', computedTotal, { shouldDirty: true, shouldValidate: false });
      } catch {}

      // Inserir dados na base de dados com transação
      const basePayload = {
        user_id: user.id,
        title: formData.title,
        delivery_date: new Date(formData.delivery_date).toISOString(),
        type: formData.type,
        status: 'scheduled', // Changed from 'pending_payment' to match enum
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // CORREÇÃO 4: Simplificar a inserção, removendo a lógica de retry
      console.log('Submitting keepsake...', basePayload);
      const { data: keepsakeData, error: keepsakeError } = await supabase
        .from('keepsakes')
        .insert({
          ...basePayload,
          message: formData.message || " ", // Schema uses 'message', not 'message_content'
        })
        .select()
        .single();

      if (keepsakeError) {
        console.error('Error inserting keepsake:', keepsakeError);
        throw keepsakeError;
      }
      console.log('Keepsake created:', keepsakeData);

      // Inserir dados do destinatário
      const recipientPayload: {
        keepsake_id: string;
        name: string;
        email: string;
      } = {
        keepsake_id: keepsakeData.id,
        name: formData.recipient_name,
        email: formData.recipient_contact || '',
      };

      const { error: recipientError } = await supabase
        .from('recipients')
        .insert(recipientPayload);

      if (recipientError) throw recipientError;

      // REMOVIDO: Inserção de produtos (não existe no schema mínimo)
      /* 
      if (formData.selected_products && formData.selected_products.length > 0) {
        ...
      } 
      */

      toast({
        title: 'Cápsula criada com sucesso!',
        description: 'A sua cápsula do tempo foi criada e será entregue na data especificada.',
      });

      console.log('Success! Advancing to step 6');
      // Resetar formulário e avançar para etapa de sucesso
      setFormState(prev => {
        console.log('Updating form state to step 6');
        return { 
          ...prev, 
          currentStep: 6,
          hasUnsavedChanges: false,
          submissionError: '',
        };
      });
      
      return true;

    } catch (error: unknown) {
      console.error('Erro ao criar cápsula:', error);
      const message = error instanceof Error
        ? error.message
        : (typeof error === 'object' && error && 'message' in (error as any)
          ? String((error as any).message)
          : 'Ocorreu um erro inesperado. Tente novamente.');

      // Tentar identificar erros comuns para melhorar mensagem
      const hint = (typeof error === 'object' && error && 'hint' in (error as any)) ? String((error as any).hint) : undefined;
      const details = (typeof error === 'object' && error && 'details' in (error as any)) ? String((error as any).details) : undefined;
      const fullDescription = [message, hint, details].filter(Boolean).join(' \u2022 ');

      setFormState(prev => ({ ...prev, submissionError: fullDescription }));
      toast({
        title: 'Erro ao criar cápsula',
        description: fullDescription,
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
    return () => {
      if (subscription) subscription.unsubscribe();
    };
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
    return;
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
    submissionError: formState.submissionError,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    submitKeepsake,
    resetForm: form.reset,
  };
};
