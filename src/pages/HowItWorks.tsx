
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Calendar, MapPin, Mail, CheckCircle, Upload, Video, FileText, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "E se mudar de morada?",
      answer: "Podes actualizar a morada de entrega até 30 dias antes da data agendada através do teu dashboard."
    },
    {
      question: "Como garantem que o meu presente está seguro?",
      answer: "O nosso armazém tem segurança 24/7, controlo de temperatura e humidade, e seguro total contra danos."
    },
    {
      question: "Posso cancelar uma entrega?",
      answer: "Sim, podes cancelar até 48 horas antes da data de entrega e receber reembolso total."
    },
    {
      question: "Que tipos de ficheiros posso enviar?",
      answer: "Aceites vídeos, fotos, documentos PDF, áudio e texto até 100MB por ficheiro."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="h-8 w-8 text-yellow-700" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent">
            FuturoPresente
          </h1>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
          >
            Registar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Como Funciona o
            <span className="bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent"> FuturoPresente</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descobre como podes enviar presentes para o futuro em apenas alguns passos simples.
          </p>
        </div>

        {/* Infográficos Interativos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tipos de Entrega Detalhados</h3>
          
          {/* Presente Físico */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Gift className="h-8 w-8 text-yellow-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Presente Físico</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Envia o teu presente para o nosso armazém seguro em Lisboa</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700">Recebemos, fotografamos e guardamos com cuidado climatizado</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700">Entregamos no local e data exactos que escolheste</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <p className="text-gray-700">Incluímos a tua mensagem personalizada e confirmação de entrega</p>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-700">Opções Disponíveis:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Envio próprio para armazém (gratuito)</li>
                    <li>• Recolha em casa (€5 em Lisboa/Porto)</li>
                    <li>• Compra por ti via link (comissão 10%)</li>
                    <li>• Embrulho especial (+€3)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagem Digital */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Mensagem Digital</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <FileText className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Carta Escrita</h4>
                    <p className="text-sm text-gray-600">Escreve uma mensagem emocional para o futuro</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <Video className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Vídeo Mensagem</h4>
                    <p className="text-sm text-gray-600">Grava um vídeo especial até 50MB</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <Upload className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Ficheiros</h4>
                    <p className="text-sm text-gray-600">Fotos, documentos, áudio e mais</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Cápsula do Tempo */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-300 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-yellow-800 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Cápsula do Tempo</h3>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">
                  Combina presentes físicos e digitais numa experiência única
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Gift className="h-6 w-6 text-yellow-700" />
                    <span className="text-gray-700">Presente físico guardado</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-6 w-6 text-yellow-700" />
                    <span className="text-gray-700">Mensagens digitais</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 text-yellow-700">{item.question}</h4>
                  <p className="text-gray-700 text-sm">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Segurança e Garantias */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Segurança e Garantias</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Armazém Seguro</h4>
                <p className="text-gray-600 text-sm">
                  Vigilância 24/7, controlo climático e seguro total
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Equipa Dedicada</h4>
                <p className="text-gray-600 text-sm">
                  Profissionais treinados para cuidar dos teus presentes
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Garantia Total</h4>
                <p className="text-gray-600 text-sm">
                  Reembolso completo se algo correr mal
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            O teu eu do futuro está à espera da tua surpresa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800" 
              onClick={() => navigate('/create-delivery')}
            >
              Criar Primeira Entrega
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-yellow-600 text-yellow-700 hover:bg-yellow-50" 
              onClick={() => navigate('/')}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 FuturoPresente. Criando memórias para o futuro.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
