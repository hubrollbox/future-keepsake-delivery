// src/pages/CreateKeepsake.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PhotoBackground from "@/components/layout/PhotoBackground";
import ProgressStepper from '../components/ProgressStepper';
import MessageStep from '../components/keepsake/MessageStep';
import RecipientStep from '../components/keepsake/RecipientStep';
import ReviewStep from '../components/keepsake/ReviewStep';
import TypeStep from '@/components/keepsake/TypeStep';
import ProductsStep from '@/components/keepsake/ProductsStep';
import SuccessStep from '@/components/keepsake/SuccessStep';
import { Form } from '@/components/ui/form';
import { motion } from "framer-motion";
import timeCapsuleImage from "@/assets/time-capsule.jpg";
import { useKeepsakeForm, KeepsakeFormData } from '@/hooks/useKeepsakeForm';

function CreateKeepsake() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const {
    form,
    formState,
    currentStep,
    hasUnsavedChanges,
    nextStep,
    prevStep,
    submitKeepsake,
  } = useKeepsakeForm();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', {
        state: { from: '/create-keepsake', message: 'Precisa de fazer login' }
      });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && currentStep < 6) {
        e.preventDefault();
        e.returnValue = 'Alterações não guardadas.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, currentStep]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center italic">A carregar...</div>;
  if (!user) return null;

  const renderStepContent = () => {
    // Usamos cast 'as any' para evitar conflitos de validação rigorosa de tipos no build
    const formData = form.getValues() as any;

    const updateFormData = (data: Partial<KeepsakeFormData>) => {
      Object.entries(data).forEach(([k, v]) =>
        form.setValue(k as keyof KeepsakeFormData, v)
      );
    };

    switch (currentStep) {
      case 1:
        return (
          <TypeStep
            form={form as any}
            selectedType={form.watch('type')}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );

      case 2:
        return (
          <RecipientStep
            form={form as any}
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 3:
        return (
          <MessageStep
            form={form as any}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );

      case 4:
        return (
          <ProductsStep
            form={form as any}
            updateFormData={updateFormData}
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
        return null;
    }
  };

  const progressSteps = ['Tipo', 'Destinatário', 'Mensagem', 'Produtos', 'Revisão', 'Sucesso'];

  return (
    <div className="min-h-screen bg-keepla-black">
      <Navigation />
      <PhotoBackground image={timeCapsuleImage} alt="Cápsula" overlay="dark" className="py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-keepla-white mb-4">Nova Cápsula</h1>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-keepla-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </motion.div>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white py-8">
        <div className="container mx-auto px-4">
          <ProgressStepper steps={progressSteps} currentStep={currentStep} />
          <Card className="max-w-4xl mx-auto mt-8 shadow-xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitKeepsake)}>
                  {renderStepContent()}
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
