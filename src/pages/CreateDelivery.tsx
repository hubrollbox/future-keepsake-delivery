import { useState } from "react";
import ProgressStepper from "@/components/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Calendar, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import DeliveryFormStepper from "@/components/delivery/DeliveryFormStepper";

const CreateDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryType, setDeliveryType] = useState("digital");
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    recipient: "",
    recipient_email: "",
    deliveryDate: "",
    deliveryTime: "",
    location: "",
    message: "",
    description: "",
    delivery_method: "email",
    digitalFile: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Helper for client-side file validation (type/size)
  const isValidFile = (file: File) => {
    const allowedTypes = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","image/jpeg","image/png","video/mp4","video/quicktime","audio/mpeg"];
    const maxSizeMB = 20;
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Tipo de ficheiro não permitido", description: "Só são aceites PDF, DOC, JPG, PNG, MP4, MOV, MP3." });
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({ title: "Ficheiro demasiado grande", description: `O ficheiro não pode exceder ${maxSizeMB}MB.` });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!isValidFile(file)) return;
      setFormData({
        ...formData,
        digitalFile: file
      });
    }
  };

  const isValidFutureDate = (dateString: string, timeString: string) => {
    const deliveryDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    return deliveryDateTime > now;
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return !!deliveryType; // Check if deliveryType is selected
      case 1:
        if (
          !formData.title || 
          !formData.recipient ||
          !formData.recipient_email ||
          !formData.deliveryDate ||
          !formData.deliveryTime ||
          (deliveryType === "physical" && !formData.location) ||
          !formData.delivery_method
        ) {
          toast({ 
            title: "Erro de Validação", 
            description: "Preencha todos os campos obrigatórios do passo Detalhes: Título, Destinatário, Email, Data, Hora, Método, e Localização (no caso de entrega física)." 
          });
          return false;
        }
        if (!validateEmail(formData.recipient_email)) {
          toast({ title: "Erro de Validação", description: "O email do destinatário é inválido." });
          return false;
        }
        if (!isValidFutureDate(formData.deliveryDate, formData.deliveryTime)) {
          toast({ title: "Erro de Validação", description: "A data e hora de entrega devem ser no futuro." });
          return false;
        }
        if (deliveryType === "digital" && !formData.digitalFile) {
          toast({ title: "Erro de Validação", description: "Por favor, selecione um ficheiro digital para a entrega." });
          return false;
        }
        // Extra: Check digitalFile validity again for digital type
        if (deliveryType === "digital" && formData.digitalFile && !isValidFile(formData.digitalFile)) {
          return false;
        }
        return true;
      case 2:
        if (!formData.message || !formData.description) {
          toast({ title: "Erro de Validação", description: "Por favor, preencha os campos de Mensagem e Descrição." });
          return false;
        }
        return true;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    } else {
      toast({ title: "Erro de Validação", description: "Por favor, preenche todos os campos obrigatórios." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) { // Only submit on the review step
      setLoading(true);
      setError("");

      const uploadFile = async (file: File) => {
        const { data, error } = await supabase.storage
          .from("digital-files")
          .upload(`${Date.now()}-${file.name}`, file);
        if (error) {
          throw new Error(`Erro ao fazer upload do ficheiro digital: ${error.message}`);
        }
        return data.path;
      };

      const insertDelivery = async (dataToInsert: any) => {
        const { error } = await supabase.from("deliveries").insert([dataToInsert]);
        if (error) {
          throw new Error(`Erro ao criar entrega: ${error.message}`);
        }
      };

      let digitalFileUrl = null;
      try {
        if (deliveryType === "digital" && formData.digitalFile) {
          digitalFileUrl = await uploadFile(formData.digitalFile);
        }

        const dataToInsert = {
          title: formData.title,
          recipient: formData.recipient,
          recipient_email: formData.recipient_email,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message,
          description: formData.description,
          delivery_method: formData.delivery_method,
          type: deliveryType,
          location: formData.location,
          digital_file_url: digitalFileUrl,
        };

        await insertDelivery(dataToInsert);

        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Erro", description: err.message });
      }
      setLoading(false);
    }
  };

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
