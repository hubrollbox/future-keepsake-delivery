import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Save, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PhotoBackground from "@/components/layout/PhotoBackground";
import ProgressStepper from '../components/ProgressStepper';
import MessageStep from '../components/keepsake/MessageStep';
import RecipientStep from '../components/keepsake/RecipientStep';
import ReviewStep from '../components/keepsake/ReviewStep';
import { useKeepsakeForm, KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import TypeStep from '@/components/keepsake/TypeStep';
import ProductsStep from '@/components/keepsake/ProductsStep';
import SuccessStep from '@/components/keepsake/SuccessStep';
import { Form } from '@/components/ui/form';
import { motion } from "framer-motion";
import timeCapsuleImage from "@/assets/time-capsule.jpg";

function CreateKeepsake() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const {
    form,
    formState,
    currentStep,
    isSubmitting,
    isValidating,
    hasUnsavedChanges,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-keepla-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepla-red mx-auto"></div>
          <p className="mt-4 text-keepla-black">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderStepContent = () => {
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
            form={form}
            selectedType={form.watch('type') as 'digital' | 'physical'}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <RecipientStep
            formData={formData}
            updateFormData={updateFormData}
            form={form}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <MessageStep
            formData={formData}
            updateFormData={updateFormData}
            form={form}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <ProductsStep
            formData={formData}
            updateFormData={updateFormData}
            form={form}
            nextStep={nextStep}
            prevStep={prevStep}
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

  const progressSteps = ['Tipo','Destinatário','Mensagem','Produtos','Revisão','Sucesso'];

  return (
    <div className="min-h-screen bg-keepla-black">
      <Navigation />

      <PhotoBackground 
        image={timeCapsuleImage} 
        alt="Cápsula do tempo"
        overlay="dark"
        className="py-12"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-keepla-white/70 font-georgia italic text-lg mb-2">
              Guarda as tuas memórias mais preciosas
            </p>
            <h1 className="text-3xl md:text-4xl font-inter font-bold text-keepla-white mb-4">
              Criar Nova <span className="text-keepla-red">Cápsula do Tempo</span>
            </h1>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="text-keepla-white hover:text-keepla-red hover:bg-keepla-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Voltar ao Dashboard</span>
            </Button>
          </motion.div>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 max-w-4xl mx-auto">
            <ProgressStepper 
              steps={progressSteps} 
              currentStep={currentStep} 
            />
          </div>

          <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 pb-24 sm:pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitKeepsake)} className="space-y-6">
                  {renderStepContent()}

                  {currentStep === 5 && formState.submissionError && (
                    <div className="rounded-md border border-keepla-red/30 bg-keepla-red/5 text-keepla-red p-3">
                      <p className="font-medium">Erro ao criar cápsula</p>
                      <p className="text-sm mt-1">{formState.submissionError}</p>
                    </div>
                  )}
                  
                  {currentStep < 6 && (
                    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 pb-[env(safe-area-inset-bottom)] shadow-lg sm:static sm:bg-transparent sm:shadow-none sm:px-0 sm:py-0 sm:border-t sm:border-gray-200">
                      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                          {currentStep > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={prevStep}
                              disabled={isSubmitting}
                              className="border-keepla-red text-keepla-red hover:bg-keepla-red/10 hover:text-keepla-red focus-visible:ring-2 focus-visible:ring-keepla-red/40 w-full sm:w-auto"
                            >
                              Anterior
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            disabled={isSubmitting}
                            className="border-gray-300 text-gray-600 hover:bg-gray-100 w-full sm:w-auto"
                          >
                            <Home className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
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
                            className="bg-keepla-red hover:bg-keepla-red/90 text-white px-8 w-full sm:w-auto"
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
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CreateKeepsake;