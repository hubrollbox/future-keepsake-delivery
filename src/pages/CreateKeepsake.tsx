import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeepsakeForm, KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import ProgressStepper from '@/components/ProgressStepper';
import TypeStep from '@/components/keepsake/TypeStep';
import RecipientStep from '@/components/keepsake/RecipientStep';
import MessageStep from '@/components/keepsake/MessageStep';
import ProductsStep from '@/components/keepsake/ProductsStep';
import ReviewStep from '@/components/keepsake/ReviewStep';
import SuccessStep from '@/components/keepsake/SuccessStep';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form'; // Add this import
import { AlertCircle, Save, Home, Crown, Zap } from 'lucide-react';
import { plans } from '@/lib/pricingData';


const CreateKeepsake: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userPlan, setUserPlan] = useState<string>('free');
  const [planLimits, setPlanLimits] = useState<Record<string, unknown> | null>(null);
  const [planValidationErrors, setPlanValidationErrors] = useState<string[]>([]);
  
  const {
    form,
    formState,
    currentStep,
    isSubmitting,
    isValidating,
    hasUnsavedChanges,
    validationErrors,
    stepValidation,
    nextStep,
    prevStep,
    submitKeepsake,
  } = useKeepsakeForm();

  // Redirecionamento se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { 
        state: { 
          from: '/create-keepsake',
          message: 'Precisa de fazer login para criar uma cápsula do tempo'
        }
      });
    }
  }, [user, authLoading, navigate]);

  // Carregar plano do usuário e configurar limites
  useEffect(() => {
    if (user) {
      // Por agora, assumir plano free. Em produção, buscar do perfil do usuário
      const currentPlan = user.user_metadata?.plan || 'free';
      setUserPlan(currentPlan);
      
      const plan = plans.find(p => p.id === currentPlan);
      if (plan) {
        setPlanLimits(plan.features || {});
      }
    }
  }, [user]);

  // Validar limites do plano quando dados do formulário mudam
  useEffect(() => {
    if (planLimits && currentStep >= 3) {
      validatePlanLimits();
    }
  }, [form, planLimits, currentStep, validatePlanLimits]);

  // Função para validar limites do plano
  const validatePlanLimits = useCallback(() => {
    if (!planLimits) return;
    
    const formData = form.getValues();
    const errors: string[] = [];
    
    // Validar limite de caracteres na mensagem
    if (formData.message && planLimits.maxMessageLength) {
      if (formData.message.length > planLimits.maxMessageLength) {
        errors.push(`Mensagem excede o limite de ${planLimits.maxMessageLength} caracteres do plano ${userPlan.toUpperCase()}`);
      }
    }
    
    // Validar número de produtos selecionados
    if (formData.selected_products && planLimits.maxProducts !== undefined) {
      if (formData.selected_products.length > planLimits.maxProducts) {
        errors.push(`Número de produtos excede o limite de ${planLimits.maxProducts} do plano ${userPlan.toUpperCase()}`);
      }
    }
    
    // Validar valor total
    if (formData.total_cost && planLimits.maxValue !== undefined) {
      if (formData.total_cost > planLimits.maxValue) {
        errors.push(`Valor total excede o limite de €${planLimits.maxValue} do plano ${userPlan.toUpperCase()}`);
      }
    }
    
    // Validar funcionalidades premium
    if (userPlan === 'free') {
      if (formData.type === 'physical') {
        errors.push('Cápsulas físicas requerem plano Premium ou Superior');
      }
      
      // Verificar se há produtos premium selecionados
      const premiumProducts = formData.selected_products?.filter(p => 
        p.name.toLowerCase().includes('premium') || 
        p.name.toLowerCase().includes('deluxe')
      ) || [];
      
      if (premiumProducts.length > 0) {
        errors.push('Produtos premium requerem plano Premium ou Superior');
      }
    }
    
    setPlanValidationErrors(errors);
  }, [form, planLimits, userPlan]);

  // Aviso sobre mudanças não guardadas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && currentStep < 6) {
        e.preventDefault();
        e.returnValue = 'Tem alterações não guardadas. Tem a certeza que quer sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, currentStep]);

  // Renderizar loading se ainda a carregar autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dusty-rose mx-auto"></div>
          <p className="mt-4 text-steel-blue">A carregar...</p>
        </div>
      </div>
    );
  }

  // Não renderizar se não autenticado (será redirecionado)
  if (!user) {
    return null;
  }

  const steps = [
    'Tipo',
    'Destinatário', 
    'Mensagem',
    'Produtos',
    'Revisão',
    'Sucesso'
  ];

  const renderStepContent = () => {
    const common = { form, nextStep, prevStep };
    const formData = form.getValues();
    const updateFormData = (data: Partial<KeepsakeFormData>) => {
      Object.entries(data).forEach(([k, v]) => form.setValue(k as keyof KeepsakeFormData, v));
    };

    switch (currentStep) {
      case 1:
        return (
          <TypeStep
            form={form}
            selectedType={form.watch('type') as 'digital' | 'physical'}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <RecipientStep
            {...common}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <MessageStep
            {...common}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <ProductsStep
            {...common}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onBack={prevStep}
            onSubmit={async () => { await submitKeepsake(); }}
            loading={formState.isSubmitting}
          />
        );
      case 6:
        return <SuccessStep formData={formData} />;
      default:
        return (
          <TypeStep
            form={form}
            selectedType={form.watch('type') as 'digital' | 'physical'}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-lavender-mist dashboard-layout">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-steel-blue hover:text-dusty-rose responsive-button touch-target"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="responsive-title font-serif text-steel-blue">
              Criar Cápsula do Tempo
            </h1>
            {planLimits && (
              <div className="flex items-center gap-2">
                {userPlan === 'free' ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    Plano Gratuito
                  </span>
                ) : userPlan === 'premium' ? (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
                  </span>
                )}
              </div>
            )}
          </div>
          <p className="text-misty-gray text-base md:text-lg">
            Guarde momentos especiais para o futuro
          </p>
        </div>

        {/* Alertas de validação */}
        {validationErrors[currentStep] && validationErrors[currentStep].length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold mb-2">Erros de validação:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors[currentStep].map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Alertas de limites do plano */}
        {planValidationErrors.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <Crown className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="font-semibold mb-2">Limites do plano {userPlan.toUpperCase()}:</div>
              <ul className="list-disc list-inside space-y-1 mb-3">
                {planValidationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/pricing')}
                className="border-amber-600 text-amber-800 hover:bg-amber-100"
              >
                <Zap className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Indicador de validação */}
        {isValidating && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <AlertDescription className="text-blue-800 ml-2">
              A validar dados...
            </AlertDescription>
          </Alert>
        )}

        {/* Aviso de mudanças não guardadas */}
        {hasUnsavedChanges && currentStep < 6 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Tem alterações não guardadas. Complete o processo para guardar a sua cápsula.
            </AlertDescription>
          </Alert>
        )}

        {/* Progresso (apenas se não for a última etapa) */}
        {currentStep < 6 && (
          <div className="mb-8">
            <ProgressStepper 
              steps={steps.slice(0, 5)} 
              currentStep={currentStep - 1} // Ajustar para base 0
            />
          </div>
        )}

        <Card className="bg-white shadow-elegant">
          <CardContent className="p-8">
            <Form {...form}>
              {renderStepContent()}
            </Form>
          </CardContent>
        </Card>

        {/* Botões de navegação (apenas se não for a última etapa) */}
        {currentStep < 5 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting || isValidating}
              className="border-steel-blue text-steel-blue hover:bg-steel-blue hover:text-white"
            >
              Anterior
            </Button>

            <div className="flex items-center space-x-4">
              {hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    // Implementar auto-save se necessário
                    console.log('Manual save triggered');
                  }}
                  disabled={isSubmitting || isValidating}
                  className="text-misty-gray hover:text-steel-blue"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Rascunho
                </Button>
              )}

              <Button
                onClick={currentStep === 5 ? submitKeepsake : nextStep}
                disabled={
                  isSubmitting || 
                  isValidating || 
                  stepValidation[currentStep] === false ||
                  planValidationErrors.length > 0
                }
                className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    A criar...
                  </>
                ) : isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    A validar...
                  </>
                ) : currentStep === 5 ? (
                  'Criar Cápsula'
                ) : (
                  'Próximo'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateKeepsake;