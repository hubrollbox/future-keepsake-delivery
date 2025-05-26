
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Calendar, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateDelivery = () => {
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState("digital");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar criação de entrega com Supabase
    console.log("Creating delivery:", { deliveryType, ...formData });
    navigate('/dashboard');
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

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Detalhes da Entrega</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de presente */}
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

              {/* Informações básicas */}
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

              {/* Data e hora */}
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
                  <Label htmlFor="deliveryTime">Hora de Entrega</Label>
                  <Input
                    id="deliveryTime"
                    name="deliveryTime"
                    type="time"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Local (apenas para presentes físicos) */}
              {deliveryType === "physical" && (
                <div>
                  <Label htmlFor="location">Local de Entrega</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Morada completa para entrega"
                    required
                  />
                </div>
              )}

              {/* Upload de ficheiro (apenas para presentes digitais) */}
              {deliveryType === "digital" && (
                <div>
                  <Label>Ficheiro Digital (opcional)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arrasta um ficheiro ou clica para selecionar
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileUpload"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <Label htmlFor="fileUpload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm">
                        Selecionar Ficheiro
                      </Button>
                    </Label>
                    {formData.digitalFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.digitalFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Mensagem personalizada */}
              <div>
                <Label htmlFor="message">Mensagem Personalizada</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Escreve uma mensagem especial para acompanhar o presente..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Agendar Entrega
              </Button>
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
