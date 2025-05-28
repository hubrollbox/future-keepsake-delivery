
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Calendar, MapPin, Mail, CheckCircle, Upload, Video, FileText, Heart, Users, Shield, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "E se mudar de morada?",
      answer: "Podes actualizar a morada de entrega até 30 dias antes da data agendada através do teu dashboard de Guardião do Tempo."
    },
    {
      question: "Como garantem que o meu presente está seguro?",
      answer: "O nosso armazém tem segurança 24/7, controlo de temperatura e humidade, e seguro total contra danos. Somos verdadeiros guardiões dos teus presentes."
    },
    {
      question: "Posso cancelar uma entrega?",
      answer: "Sim, podes cancelar até 48 horas antes da data de entrega e receber reembolso total."
    },
    {
      question: "Como funciona o sistema de gamificação?",
      answer: "Ganhas selos baseados na distância temporal das entregas, desbloqueias níveis de Guardião e crias a tua árvore de memórias única."
    },
    {
      question: "Que tipos de ficheiros posso enviar?",
      answer: "Aceites vídeos, fotos, documentos PDF, áudio e texto até 100MB por ficheiro, com verificação blockchain opcional."
    }
  ];

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
          <Button variant="ghost" onClick={() => navigate('/how-it-works')}>
            Como Funciona
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            Preços & Planos
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Como Funciona o
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent"> FuturoPresente</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            <strong>O teu tempo, entregue.</strong> Descobre como podes enviar presentes para o futuro e tornares-te um verdadeiro Guardião do Tempo.
          </p>
        </div>

        {/* Sistema de Gamificação Preview */}
        <div className="mb-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <Trophy className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Torna-te um Guardião do Tempo</h3>
            <p className="text-gray-600">
              Mais do que entregas, é uma jornada temporal com selos, níveis e conquistas únicas.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-10 w-10 text-amber-700 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Selos Temporais</h4>
              <p className="text-sm text-gray-600">Conquista selos únicos baseados na distância das entregas</p>
            </div>
            <div className="text-center">
              <Trophy className="h-10 w-10 text-amber-700 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Níveis de Guardião</h4>
              <p className="text-sm text-gray-600">Desbloqueia prestígio com entregas mais distantes</p>
            </div>
            <div className="text-center">
              <Gift className="h-10 w-10 text-amber-700 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Árvore de Memórias</h4>
              <p className="text-sm text-gray-600">Timeline visual das tuas cápsulas temporais</p>
            </div>
            <div className="text-center">
              <Calendar className="h-10 w-10 text-amber-700 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Missões Temporais</h4>
              <p className="text-sm text-gray-600">Desafios especiais para Guardiões dedicados</p>
            </div>
          </div>
        </div>

        {/* Infográficos Interativos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tipos de Entrega Detalhados</h3>
          
          {/* Presente Físico */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Gift className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Presente Físico</h3>
                <span className="ml-auto text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Desde 1,90€/mês</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Envia o teu presente para o nosso armazém seguro em Lisboa</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700">Recebemos, fotografamos e guardamos com cuidado climatizado 24/7</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700">Entregamos no local e data exactos que escolheste</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <p className="text-gray-700">Ganhas selos temporais e subes de nível como Guardião</p>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-amber-700">Opções Disponíveis:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Envio próprio para armazém (gratuito)</li>
                    <li>• Recolha em casa (€5 em Lisboa/Porto)</li>
                    <li>• Compra por ti via link (comissão 10%)</li>
                    <li>• Embrulho especial (+€3)</li>
                    <li>• Seguro total incluído</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagem Digital */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Mensagem Digital</h3>
                <span className="ml-auto text-sm bg-yellow-100 text-amber-700 px-3 py-1 rounded-full">Grátis - 9,90€</span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <FileText className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Carta Escrita</h4>
                    <p className="text-sm text-gray-600">Mensagem emocional com verificação blockchain opcional</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <Video className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Vídeo Mensagem</h4>
                    <p className="text-sm text-gray-600">Com edição profissional incluída nos planos premium</p>
                  </CardContent>
                </Card>
                
                <Card className="p-4 bg-white/60">
                  <CardContent className="pt-4">
                    <Upload className="h-8 w-8 text-amber-700 mb-2" />
                    <h4 className="font-semibold mb-2">Ficheiros Especiais</h4>
                    <p className="text-sm text-gray-600">Fotos, documentos, áudio até 100MB</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Cápsula do Tempo */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 hover:shadow-xl transition-shadow">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-amber-800 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Cápsula do Tempo</h3>
                <span className="ml-auto text-sm bg-amber-200 text-amber-800 px-3 py-1 rounded-full">Desde 15€</span>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6">
                  Combina presentes físicos e digitais numa experiência única, individual ou coletiva
                </p>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Gift className="h-8 w-8 text-amber-700" />
                    <span className="text-gray-700 text-sm font-semibold">Individual</span>
                    <span className="text-xs text-gray-600">Desde 15€</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Users className="h-8 w-8 text-amber-700" />
                    <span className="text-gray-700 text-sm font-semibold">Coletiva</span>
                    <span className="text-xs text-gray-600">Desde 49€</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Trophy className="h-8 w-8 text-amber-700" />
                    <span className="text-gray-700 text-sm font-semibold">Premium</span>
                    <span className="text-xs text-gray-600">Desde 25€</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Heart className="h-8 w-8 text-amber-700" />
                    <span className="text-gray-700 text-sm font-semibold">Luxo</span>
                    <span className="text-xs text-gray-600">Desde 40€</span>
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
                  <h4 className="font-semibold mb-3 text-amber-700">{item.question}</h4>
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
                <Shield className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Armazém Seguro</h4>
                <p className="text-gray-600 text-sm">
                  Vigilância 24/7, controlo climático e seguro total contra danos
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Guardiões Dedicados</h4>
                <p className="text-gray-600 text-sm">
                  Equipa especializada para cuidar dos teus presentes temporais
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Garantia Total</h4>
                <p className="text-gray-600 text-sm">
                  Reembolso completo se algo correr mal. O teu tempo merece confiança.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <Trophy className="h-12 w-12 text-amber-700 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Te Tornares um Guardião do Tempo?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            O teu tempo, entregue. Começa a criar memórias para o futuro e desbloqueias os teus primeiros selos temporais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" 
              onClick={() => navigate('/create-delivery')}
            >
              Criar Primeira Entrega
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-amber-600 text-amber-700 hover:bg-amber-50" 
              onClick={() => navigate('/pricing')}
            >
              Ver Preços
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-amber-700" />
            <h4 className="font-bold text-amber-700">FuturoPresente™</h4>
          </div>
          <p>&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
