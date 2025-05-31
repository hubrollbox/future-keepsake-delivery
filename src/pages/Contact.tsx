
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aqui implementaria o envio do formulário
    alert("Mensagem enviada com sucesso! Entraremos em contacto brevemente.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-gray-700 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-black mb-6">
            Entre em 
            <span className="text-gold"> Contacto</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tens uma pergunta, sugestão ou precisas de ajuda? Estamos aqui para te apoiar na tua jornada temporal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulário de Contacto */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gold">Enviar Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="O teu nome"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="teu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Como podemos ajudar?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Conta-nos mais detalhes..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de Contacto */}
          <div className="space-y-8">
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Mail className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-semibold text-black">Email</h3>
                    <p className="text-gray-600">geral@rollbox.pt</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Phone className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-semibold text-black">Telefone</h3>
                    <p className="text-gray-600">220 145 169</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <MapPin className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-semibold text-black">Morada</h3>
                    <p className="text-gray-600">
                      Rua Brito Capelo<br />
                      Edifício Diplomata<br />
                      4450 Matosinhos<br />
                      Portugal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-light-gold border border-gold">
              <CardContent className="p-6">
                <h3 className="font-semibold text-black mb-3">Horário de Atendimento</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">24 horas por dia, 7 dias por semana!</p>
                  <p className="text-sm italic">Porque o tempo não para... e nós também não! ⏰</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-light-gold border border-gold">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="font-semibold text-black mb-2">Resposta Rápida</h3>
                <p className="text-gray-700 text-sm">
                  Respondemos a todas as mensagens em menos de 24 horas. 
                  O teu tempo é precioso para nós!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
