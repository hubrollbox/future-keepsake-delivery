
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Calendar, MapPin, Mail, CheckCircle, Upload, Video, FileText, Heart, Users, Shield, Trophy, Target, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const faqItems = [
    {
      question: "E se mudar de morada?",
      answer: "Podes actualizar a morada de entrega até 30 dias antes da data agendada através do teu painel de Guardião do Tempo."
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
        <div 
          className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => handleNavigation('/')}
        >
          <Clock className="h-8 w-8 text-amber-700" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
            FuturoPresente
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/how-it-works')}
            className="transition-all hover:scale-105 hover:bg-amber-100"
          >
            Como Funciona
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/pricing')}
            className="transition-all hover:scale-105 hover:bg-amber-100"
          >
            Preços & Planos
          </Button>
        </nav>
        <div className="space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/login')}
            className="transition-all hover:scale-105"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => handleNavigation('/register')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all hover:scale-105 hover:shadow-lg transform"
          >
            Começar Grátis
          </Button>
        </div>
      </header>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <Button
          size="lg"
          onClick={() => handleNavigation('/register')}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 text-base md:text-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Cria a Tua Cápsula do Tempo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 md:py-16 transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="text-center max-w-5xl mx-auto mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 mb-6 md:mb-8 leading-tight tracking-tight">
            Como Funciona o
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent block md:inline"> FuturoPresente</span>
          </h2>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 md:mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
            <strong className="text-amber-700">O teu tempo, entregue no momento perfeito.</strong>
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descobre como podes enviar presentes para o futuro e tornares-te um verdadeiro Guardião do Tempo.
          </p>
        </div>

        {/* Sistema de Gamificação Preview */}
        <div className="mb-12 md:mb-20 bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl border border-amber-200 transition-all hover:shadow-2xl">
          <div className="text-center mb-8 md:mb-12">
            <Trophy className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-6 animate-bounce" />
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Torna-te um Guardião do Tempo</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mais do que entregas, é uma jornada temporal com selos, níveis e conquistas únicas que tornam cada momento especial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
              <Target className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Selos Temporais</h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Conquista selos únicos baseados na distância das entregas</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
              <Trophy className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Níveis de Guardião</h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Desbloqueia prestígio com entregas mais distantes</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
              <Gift className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Árvore de Memórias</h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Timeline visual das tuas cápsulas temporais</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
              <Calendar className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Missões Temporais</h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">Desafios especiais para Guardiões dedicados</p>
            </div>
          </div>
        </div>

        {/* Infográficos Interativos */}
        <div className="mb-12 md:mb-20">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Tipos de Entrega Detalhados</h3>
          
          {/* Presente Físico */}
          <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <Gift className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mr-4" />
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Presente Físico</h3>
                </div>
                <span className="ml-auto text-sm md:text-base bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-semibold">Desde 1,90€/mês</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  {[
                    "Envia o teu presente para o nosso armazém seguro em Lisboa",
                    "Recebemos, fotografamos e guardamos com cuidado climatizado 24/7",
                    "Entregamos no local e data exactos que escolheste",
                    "Ganhas selos temporais e sobes de nível como Guardião"
                  ].map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm md:text-base font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/60 p-4 md:p-6 rounded-2xl shadow-inner">
                  <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-700">Opções Disponíveis:</h4>
                  <ul className="space-y-2 text-sm md:text-base text-gray-600 leading-relaxed">
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
          <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <Mail className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mr-4" />
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Mensagem Digital</h3>
                </div>
                <span className="ml-auto text-sm md:text-base bg-yellow-100 text-amber-700 px-4 py-2 rounded-full font-semibold">Grátis - 9,90€</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  { icon: FileText, title: "Carta Escrita", desc: "Mensagem emocional com verificação blockchain opcional" },
                  { icon: Video, title: "Vídeo Mensagem", desc: "Com edição profissional incluída nos planos premium" },
                  { icon: Upload, title: "Ficheiros Especiais", desc: "Fotos, documentos, áudio até 100MB" }
                ].map((item, index) => (
                  <Card key={index} className="p-4 md:p-6 bg-white/60 hover:bg-white/80 transition-all hover:scale-105 rounded-2xl">
                    <CardContent className="pt-4">
                      <item.icon className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mb-3 md:mb-4" />
                      <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">{item.title}</h4>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cápsula do Tempo */}
          <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <Heart className="h-10 w-10 md:h-12 md:w-12 text-amber-800 mr-4" />
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Cápsula do Tempo</h3>
                </div>
                <span className="ml-auto text-sm md:text-base bg-amber-200 text-amber-800 px-4 py-2 rounded-full font-semibold">Desde 15€</span>
              </div>
              
              <div className="text-center">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 leading-relaxed font-medium">
                  Combina presentes físicos e digitais numa experiência única, individual ou colectiva
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {[
                    { icon: Gift, title: "Individual", price: "Desde 15€" },
                    { icon: Users, title: "Colectiva", price: "Desde 49€" },
                    { icon: Trophy, title: "Premium", price: "Desde 25€" },
                    { icon: Heart, title: "Luxo", price: "Desde 40€" }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
                      <item.icon className="h-10 w-10 md:h-12 md:w-12 text-amber-700" />
                      <span className="text-gray-700 text-sm md:text-base font-bold">{item.title}</span>
                      <span className="text-xs md:text-sm text-gray-600 font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 md:mb-20">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-700">{item.question}</h4>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Segurança e Garantias */}
        <div className="mb-12 md:mb-20">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Segurança e Garantias</h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Shield, title: "Armazém Seguro", desc: "Vigilância 24/7, controlo climático e seguro total contra danos" },
              { icon: Users, title: "Guardiões Dedicados", desc: "Equipa especializada para cuidar dos teus presentes temporais" },
              { icon: CheckCircle, title: "Garantia Total", desc: "Reembolso completo se algo correr mal. O teu tempo merece confiança." }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <item.icon className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-4 md:mb-6" />
                  <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">{item.title}</h4>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl border border-amber-200">
          <Trophy className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-6 animate-bounce" />
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 md:mb-8">
            Pronto para Te Tornares um Guardião do Tempo?
          </h3>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 md:mb-8 font-medium">
            O teu tempo, entregue no momento perfeito.
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed">
            Começa a criar memórias para o futuro e desbloqueia os teus primeiros selos temporais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button 
              size="lg" 
              className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all hover:scale-110 hover:shadow-2xl font-bold rounded-full"
              onClick={() => handleNavigation('/register')}
            >
              <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Criar Primeira Entrega
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 transition-all hover:scale-105 hover:shadow-lg font-bold rounded-full" 
              onClick={() => handleNavigation('/pricing')}
            >
              Ver Preços
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm mt-12 md:mt-20">
        <div className="container mx-auto px-4 py-8 md:py-12 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4 md:mb-6">
            <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-700" />
            <h4 className="text-lg md:text-xl font-bold text-amber-700">FuturoPresente™</h4>
          </div>
          <p className="text-sm md:text-base">&copy; 2024 FuturoPresente™. O teu tempo, entregue no momento perfeito.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
