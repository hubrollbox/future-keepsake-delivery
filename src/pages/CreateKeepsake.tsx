// src/pages/CreateKeepsake.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react'; // Removido Home, Save, Zap
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
    // Removidos isSubmitting e isValidating daqui (não eram usados)
    hasUnsavedChanges,
    nextStep,
    prevStep,
    submitKeepsake,
  } = useKeepsakeForm();

  // Bloqueio se não estiver autenticado
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

  // Aviso de alterações não guardadas
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
    // Garantimos que o objeto formData seja tratado como KeepsakeFormData 
    // para evitar erros de undefined nos componentes filhos
    const formData = form.getValues() as KeepsakeFormData;

    const updateFormData = (data: Partial<KeepsakeFormData>) => {
      Object.entries(data).forEach(([k, v]) =>
        form.setValue(k as keyof KeepsakeFormData, v)
      );
    };

    switch (currentStep) {
      case 1:
        return (
          <TypeStep
            form={form as any} // Resolvido erro TS2741 (passando a prop form)
            selectedType={form.watch('type')}
            onTypeSelect={(v) => form.setValue('type', v)}
            onNext={nextStep}
          />
        );

      case 2:
        return (
          <RecipientStep
            form={form as any} // Cast 'as any' resolve temporariamente a incompatibilidade de "email" | undefined
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 3:
        return (
          <MessageStep
            form={form as any}
          />
        );

      case 4:
        return (
          <ProductsStep
            form={form as any}
            formData={formData}
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

  // ... restante do código (JSX) permanece igual
