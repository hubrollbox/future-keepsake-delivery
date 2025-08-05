
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
import { useAuth } from "@/hooks/useAuth";

const CreateDelivery = () => {
  const { user } = useAuth();
  const user_id = user?.id;
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

  const isValidFutureDate = (dateString: string, timeString: string) => {
    const deliveryDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    return deliveryDateTime > now;
  };

  const validateStep = () => {
    
      
        return !!deliveryType; // Check if deliveryType is selected
      
        if (!formData.title || !formData.recipient || !formData.deliveryDate || !formData.deliveryTime) {
          toast({ title: "Erro de Validação", description: "Por favor, preencha todos os campos de Título, Destinatário, Data e Hora." });
          return false;
        }
        if (!isValidFutureDate(formData.deliveryDate, formData.deliveryTime)) {
          toast({ title: "Erro de Validação", description: "A data e hora de entrega devem ser no futuro." });
          return false;
        }
        if (deliveryType === "physical" && !formData.location) {
          toast({ title: "Erro de Validação", description: "Por favor, preencha o campo de Localização para entregas físicas." });
          return false;
        }
        if (deliveryType === "digital" && !formData.digitalFile) {
          toast({ title: "Erro de Validação", description: "Por favor, selecione um ficheiro digital para a entrega." });
          return false;
        }
        return true;
      
        if (!formData.message) {
          toast({ title: "Erro de Validação", description: "Por favor, preencha o campo de Mensagem." });
          return false;
        }
        return true;
      
        return true; // Review step doesn't require validation
      
        return true; // Confirmation step doesn't require validation
      
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
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message,
          delivery_type: deliveryType,
          location: formData.location,
          digital_file_url: digitalFileUrl,
        };
        console.log("Dados a serem inseridos:", dataToInsert);

        await insertDelivery(dataToInsert);

        toast({ title: "Sucesso", description: "Entrega criada com sucesso!" });
        setCurrentStep(4);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Erro", description: err.message });
        console.log(JSON.stringify(err));
      }

      const dataToInsert = {
          title: formData.title,
          recipient: formData.recipient,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime,
          message: formData.message,
          delivery_type: deliveryType,
          location: formData.location,
          digital_file_url: digitalFileUrl,
      };
      console.log("Dados a serem inseridos:", dataToInsert); // Adicione esta linha

      setLoading(false);
    }
    let deliveryAddress = deliveryType === "physical" ? formData.location : null;
    let deliveryDate = formData.deliveryDate + (formData.deliveryTime ? `T${formData.deliveryTime}` : "");
    let digitalFileUrl = null;
    if (deliveryType === "digital" && formData.digitalFile) {
      const file = formData.digitalFile;
      const filePath = `deliveries/${user_id || "anonymous"}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("digital-files").upload(filePath, file);
      if (uploadError) {
        setLoading(false);
        setError("Erro ao fazer upload do ficheiro: " + uploadError.message);
        toast({ title: "Erro ao fazer upload do ficheiro", description: uploadError.message, variant: "destructive" });
        return;
      }
      digitalFileUrl = uploadData?.path ? uploadData.path : null;
    }
    const { data: deliveryData, error: deliveryError } = await supabase.from("deliveries").insert([
      {
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_type: deliveryType,
        message: formData.message,
        status: "scheduled",
        user_id,
        digital_file_url: digitalFileUrl
      }
    ]).select().single();
    setLoading(false);
    if (deliveryError) {
      setError("Erro ao agendar entrega: " + deliveryError.message);
      toast({ title: "Erro ao agendar entrega", description: deliveryError.message, variant: "destructive" });
      return;
    }
    // Se for entrega digital, cria mensagem digital associada
    if (deliveryType === "digital" && deliveryData) {
      const { error: messageError } = await supabase.from("digital_messages").insert([
        {
          body: formData.message,
          subject: formData.title,
          delivery_id: deliveryData.id,
        }
      ]);
      if (messageError) {
        toast({ title: "Erro ao criar mensagem digital", description: messageError.message, variant: "destructive" });
        // Não retorna aqui, pois a entrega já foi criada
      }
    }
    toast({ title: "Entrega agendada!", description: "A tua entrega foi criada com sucesso." });
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    
      
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
      
        return null;
    }
  };

  
      
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
      
        return null;
    }
  };

  // Duplicate renderStepContent removed

  // CLEANUP START: Remove all code after this point and restore a single, correct implementation for validateStep and renderStepContent.

}

export default CreateDelivery;

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
      
        return null;
    }
  };

  // Duplicate renderStepContent removed
    
      
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
      
        return null;
    }
  };

  // Duplicate renderStepContent removed
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
      case 6:
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
      case 7:
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
      case 8:
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
      case 9:
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
      case 10:
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
      case 11:
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
      case 12:
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
      case 13:
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
      case 14:
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
      case 15:
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
      case 16:
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
      case 17:
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
