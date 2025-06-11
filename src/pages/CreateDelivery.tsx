
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
    deliveryDate: "",
    deliveryTime: "",
    location: "",
    message: "",
    digitalFile: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        digitalFile: e.target.files[0]
      });
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return !!deliveryType; // Check if deliveryType is selected
      case 1:
        return !!formData.title && !!formData.recipient && !!formData.deliveryDate && (deliveryType === "digital" || !!formData.location);
      case 2:
        return !!formData.message;
      case 3:
        return true; // Review step doesn't require validation
      case 4:
        return true; // Confirmation step doesn't require validation
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

      let digitalFileUrl = null;
      if (deliveryType === "digital" && formData.digitalFile) {
        const { data, error } = await supabase.storage
          .from("digital-files")
          .upload(`${Date.now()}-${formData.digitalFile.name}`, formData.digitalFile);

        if (error) {
          setError("Erro ao fazer upload do ficheiro digital.");
          setLoading(false);
          toast({ title: "Erro", description: "Erro ao fazer upload do ficheiro digital." });
          return;
        }
        digitalFileUrl = data.path;
      }

      const { error } = await supabase.from("deliveries").insert([
        {
          title: formData.title,
          recipient: formData.recipient,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message,
          delivery_type: deliveryType,
          location: formData.location,
          digital_file_url: digitalFileUrl,
        },
      ]);

      if (error) {
        console.log(error); // Adicione esta linha
        setError("Erro ao criar entrega.");
        toast({ title: "Erro", description: "Erro ao criar entrega." });
      } else {
        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4); // Move to confirmation step
      }
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div>
              <Label className="text-base font-semibold">Tipo de Presente</Label>
              <RadioGroup
                value={deliveryType}
                onValueChange={setDeliveryType}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Presente Digital</p>
                      <p className="text-sm text-gray-600">Carta, vídeo, ou ficheiro digital</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Presente Físico</p>
                      <p className="text-sm text-gray-600">Objeto que será guardado e entregue</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={nextStep}>Próximo</Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título da Entrega</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Presente de aniversário"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recipient">Destinatário</Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="Para quem é o presente?"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Data de Entrega</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Hora de Entrega (Opcional)</Label>
                <Input
                  id="deliveryTime"
                  name="deliveryTime"
                  type="time"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {deliveryType === "physical" && (
              <div>
                <Label htmlFor="location">Local de Entrega</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Rua da Felicidade, 123"
                  required
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <Button onClick={nextStep}>Próximo</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <Label htmlFor="message">Mensagem ou Instruções</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Deixe uma mensagem ou instruções especiais..."
                rows={5}
                required
              />
            </div>

            {deliveryType === "digital" && (
              <div className="mt-4">
                <Label htmlFor="digitalFile">Carregar Ficheiro Digital</Label>
                <Input
                  id="digitalFile"
                  name="digitalFile"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png,.mp4,.mov,.mp3"
                />
                {formData.digitalFile && (
                  <p className="text-sm text-gray-500 mt-1">Ficheiro selecionado: {formData.digitalFile.name}</p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <Button onClick={nextStep}>Próximo</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Rever Detalhes da Entrega</h2>
            <div className="space-y-2">
              <p><strong>Tipo de Entrega:</strong> {deliveryType === "digital" ? "Digital" : "Físico"}</p>
              <p><strong>Título:</strong> {formData.title}</p>
              <p><strong>Destinatário:</strong> {formData.recipient}</p>
              <p><strong>Data de Entrega:</strong> {formData.deliveryDate}</p>
              {formData.deliveryTime && <p><strong>Hora de Entrega:</strong> {formData.deliveryTime}</p>}
              {deliveryType === "physical" && <p><strong>Local de Entrega:</strong> {formData.location}</p>}
              <p><strong>Mensagem:</strong> {formData.message}</p>
              {formData.digitalFile && <p><strong>Ficheiro Digital:</strong> {formData.digitalFile.name}</p>}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "A Enviar..." : "Confirmar e Criar Entrega"}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        );
      case 4:
        return (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Entrega Criada com Sucesso!</h2>
              <p className="text-lg">Obrigado por usar o Future Keepsake Delivery.</p>
              <p className="text-md mt-2">A sua entrega para <strong>{formData.recipient}</strong> foi agendada para <strong>{formData.deliveryDate}</strong>.</p>
              <Button onClick={() => navigate("/dashboard")} className="mt-6">Voltar ao Dashboard</Button>
            </div>
          </>
        );
      default:
        return null;
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}
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
