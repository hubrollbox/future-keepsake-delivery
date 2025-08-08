import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useKeepsakeForm } from '../hooks/useKeepsakeForm';
import ProgressStepper from '../components/ProgressStepper';
import TypeStep from '../components/keepsake/TypeStep';
import RecipientStep from '../components/keepsake/RecipientStep';
import MessageStep from '../components/keepsake/MessageStep';
import ProductsStep from '../components/keepsake/ProductsStep';
import ReviewStep from '../components/keepsake/ReviewStep';
import SuccessStep from '../components/keepsake/SuccessStep';
import { Card, CardContent } from '../components/ui/card';

const CreateKeepsake: React.FC = () => {
  const { user, loading } = useAuth();
  const {
    currentStep,
    formData,
    loading: submitting,
    updateFormData,
    nextStep,
    prevStep,
    submitKeepsake
  } = useKeepsakeForm();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dusty-rose mx-auto"></div>
          <p className="mt-4 text-steel-blue">Carregando...</p>
        </div>
      </div>
    );
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
    switch (currentStep) {
      case 0:
        return (
          <TypeStep
            selectedType={formData.type}
            onTypeSelect={(type) => updateFormData({ type })}
            onNext={nextStep}
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
          <MessageStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ProductsStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={submitKeepsake}
            onBack={prevStep}
            loading={submitting}
          />
        );
      case 5:
        return (
          <SuccessStep formData={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-lavender-mist py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-steel-blue mb-4">
            Criar Cápsula do Tempo
          </h1>
          <p className="text-misty-gray text-lg">
            Guarde momentos especiais para o futuro
          </p>
        </div>

        {currentStep < 5 && (
          <div className="mb-8">
            <ProgressStepper 
              steps={steps.slice(0, 5)} 
              currentStep={currentStep} 
            />
          </div>
        )}

        <Card className="bg-white shadow-elegant">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateKeepsake;