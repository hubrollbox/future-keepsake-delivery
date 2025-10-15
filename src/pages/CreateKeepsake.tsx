import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Save, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProgressStepper from '../components/ProgressStepper';
import MessageStep from '../components/keepsake/MessageStep';
import RecipientStep from '../components/keepsake/RecipientStep';
import ReviewStep from '../components/keepsake/ReviewStep';
import { useKeepsakeForm, KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import TypeStep from '@/components/keepsake/TypeStep';
import ProductsStep from '@/components/keepsake/ProductsStep';
import SuccessStep from '@/components/keepsake/SuccessStep';
// Removidos alerts não utilizados no fluxo simplificado
import { Form } from '@/components/ui/form';

// Fluxo simplificado: sem limitações por plano

function CreateKeepsake() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Estados do componente
  // Fluxo simplificado: remover estado de plano e validação associada
  
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

  // Removida validação baseada em plano

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

  const renderStepContent = () => {
    const common = { form, nextStep, prevStep };
    const formData: KeepsakeFormData = { 
      ...form.getValues(), 
      total_cost: form.getValues().total_cost || 0, 
      channel_cost: form.getValues().channel_cost || 0,
      selected_products: form.getValues().selected_products || []
    } as KeepsakeFormData;
    const updateFormData = (data: Partial<KeepsakeFormData>) => {
      Object.entries(data).forEach(([k, v]) => form.setValue(k as keyof KeepsakeFormData, v));
    };

    switch (currentStep) {
      case 1:
        return (
          <TypeStep
            form={form as any}
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
            form={form as any}
          />
        );
      case 3:
        return (
          <MessageStep
            {...common}
            formData={formData}
            updateFormData={updateFormData}
            form={form as any}
          />
        );
      case 4:
        return (
          <ProductsStep
            {...common}
            formData={formData}
            updateFormData={updateFormData}
            form={form as any}
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
            form={form as any}
            selectedType={form.watch('type') as 'digital' | 'physical'}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );
    }
  };

  const progressSteps = [
    'Tipo',
    'Destinatário', 
    'Mensagem',
    'Produtos',
    'Revisão',
    'Sucesso'
  ];

  const canProceed = () => {
    // Permitir avançar na Etapa 1 se o tipo estiver definido (valor por defeito "digital")
    if (currentStep === 1) {
      const type = form.getValues().type;
      return !!type;
    }

    if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
      return false;
    }

    return stepValidation[currentStep] || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-mist via-white to-sage-green">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-steel-blue mb-2">
            Criar Nova Cápsula do Tempo
          </h1>
          <p className="text-steel-blue/70 max-w-2xl mx-auto">
            Crie uma mensagem especial para ser entregue no futuro. 
            Adicione produtos únicos para tornar o momento ainda mais especial.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <ProgressStepper 
            steps={progressSteps} 
            currentStep={currentStep} 
          />
        </div>

        {/* Fluxo simplificado: sem erros de plano/upgrade */}

        {/* Form Content */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitKeepsake)} className="space-y-6">
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                {currentStep < 6 && (
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          disabled={isSubmitting}
                          className="border-steel-blue text-steel-blue hover:bg-steel-blue hover:text-white"
                        >
                          Anterior
                        </Button>
                      )}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        disabled={isSubmitting}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      {hasUnsavedChanges && (
                        <div className="flex items-center text-amber-600 text-sm">
                          <Save className="w-4 h-4 mr-1" />
                          Alterações não guardadas
                        </div>
                      )}
                      
                      <Button
                        type={currentStep === 5 ? "submit" : "button"}
                        onClick={currentStep === 5 ? undefined : nextStep}
                        disabled={isSubmitting || isValidating}
                        className="bg-gradient-to-r from-dusty-rose to-sage-green hover:from-dusty-rose/90 hover:to-sage-green/90 text-white px-8"
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
                        {currentStep < 5 && !isSubmitting && !isValidating && (
                          <Zap className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateKeepsake;