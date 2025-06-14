
import ProgressStepper from "@/components/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DeliveryFormStepper from "@/components/delivery/DeliveryFormStepper";
import { useCreateDeliveryForm } from "@/features/create-delivery/useCreateDeliveryForm";

const CreateDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    deliveryType,
    setDeliveryType,
    currentStep,
    loading,
    error,
    formData,
    handleInputChange,
    handleFileChange,
    nextStep,
    prevStep,
    handleSubmit,
  } = useCreateDeliveryForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FuturoPresente
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Criar Nova Entrega
          </h2>
          <p className="text-gray-600">
            Prepara uma surpresa especial para o futuro
          </p>
        </div>

        <ProgressStepper
          steps={["Tipo", "Detalhes", "Mensagem", "Revisão", "Confirmação"]}
          currentStep={currentStep}
        />

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Detalhes da Entrega</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              <DeliveryFormStepper
                step={currentStep}
                deliveryType={deliveryType}
                setDeliveryType={setDeliveryType}
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                nextStep={nextStep}
                prevStep={prevStep}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            </form>
          </CardContent>
        </Card>

        {/* Motivational message */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <p className="text-center text-lg font-medium text-gray-700 italic">
            "Estás a criar um momento mágico para o futuro. 🌟"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;
