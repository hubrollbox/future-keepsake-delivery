
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui implementaríamos o envio do formulário
    toast({
      title: "Mensagem Enviada!",
      description: "Entraremos em contacto brevemente.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="h-8 w-8 text-amber-700" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
            FuturoPresente
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Início
          </Button>
          <Button variant="ghost" onClick={() => navigate('/about')}>
            Sobre
          </Button>
          <Button variant="ghost" onClick={() => navigate('/how-it-works')}>
            Como Funciona
          </Button>
        </nav>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
          >
            Registar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Entre em 
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent"> Contacto</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tens alguma questão sobre o FuturoPresente? Queremos ajudar-te a criar as melhores memórias para o futuro.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulário de Contacto */}
          <Card className="p-8 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-amber-700" />
                Envie-nos uma Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="O seu nome"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="o.seu.email@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input 
                    id="subject"
                    name="subject"
                    type="text" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Sobre o que gostaria de falar?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 min-h-[120px]"
                    placeholder="Conte-nos como podemos ajudar..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de Contacto */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Informações de Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-amber-700" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">contacto@futuropresente.pt</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-amber-700" />
                    <div>
                      <p className="font-semibold">Telefone</p>
                      <p className="text-gray-600">+351 210 123 456</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-amber-700" />
                    <div>
                      <p className="font-semibold">Morada</p>
                      <p className="text-gray-600">
                        Avenida da Liberdade, 123<br />
                        1250-096 Lisboa, Portugal
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Horário de Atendimento</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Segunda a Sexta:</span> 9h00 - 18h00</p>
                  <p><span className="font-semibold">Sábado:</span> 10h00 - 14h00</p>
                  <p><span className="font-semibold">Domingo:</span> Encerrado</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h3>
                <p className="text-gray-700 mb-4">
                  Tem dúvidas sobre como funciona o FuturoPresente? Consulte as nossas perguntas frequentes 
                  para respostas rápidas às questões mais comuns.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/how-it-works')}
                  className="border-amber-600 text-amber-700 hover:bg-amber-50"
                >
                  Ver FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mapa de Localização (placeholder) */}
        <div className="mt-16">
          <Card className="p-6 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Como Chegar</h3>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Mapa interativo será implementado aqui</p>
                  <p className="text-sm">Avenida da Liberdade, 123 - Lisboa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-amber-700" />
            <span className="font-bold text-amber-700">FuturoPresente</span>
          </div>
          <p className="text-gray-600">&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
