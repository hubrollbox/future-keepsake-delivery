
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Mail, Users, Gift, Heart, Star, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Enviei uma carta para o meu aniversário de 30 anos. Quando a recebi, chorei de emoção!",
      rating: 5
    },
    {
      name: "João Santos",
      text: "O meu presente físico chegou exactamente no dia certo. Serviço impecável!",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Criei uma cápsula do tempo para a minha filha. Ela vai adorar receber aos 18 anos!",
      rating: 5
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            O teu tempo,
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent"> entregue.</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A primeira plataforma que te permite agendar entregas de presentes físicos 
            ou digitais para datas especiais. Cria memórias para o futuro com armazenamento seguro e entrega garantida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
              onClick={() => navigate('/how-it-works')}
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Sistema de Gamificação Preview */}
          <div className="mb-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <Trophy className="h-12 w-12 text-amber-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Torna-te um Guardião do Tempo
            </h3>
            <p className="text-gray-600 mb-6">
              Conquista selos únicos, desbloqueia níveis de prestígio e cria a tua árvore de memórias temporal.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="h-8 w-8 text-amber-700 mx-auto mb-2" />
                <p className="text-sm font-semibold">Selos Temporais</p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-amber-700 mx-auto mb-2" />
                <p className="text-sm font-semibold">Níveis de Guardião</p>
              </div>
              <div className="text-center">
                <Gift className="h-8 w-8 text-amber-700 mx-auto mb-2" />
                <p className="text-sm font-semibold">Árvore de Memórias</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-amber-700 mx-auto mb-2" />
                <p className="text-sm font-semibold">Missões Temporais</p>
              </div>
            </div>
          </div>

          {/* Como Funciona - 3 Passos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Como Funciona</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <Gift className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Escolhe o Tipo de Presente</h4>
                  <p className="text-gray-600 text-sm">
                    Presente físico, mensagem digital ou cápsula do tempo
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <Calendar className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Define a Data e Destinatário</h4>
                  <p className="text-gray-600 text-sm">
                    Escolhe quando e para quem queres enviar
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <Clock className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Nós Guardamos e Entregamos</h4>
                  <p className="text-gray-600 text-sm">
                    Armazenamento seguro e entrega garantida na data exacta
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tipos de Entrega */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Tipos de Entrega</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                <CardContent className="pt-6">
                  <Gift className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Presente Físico</h4>
                  <p className="text-gray-600 text-sm">
                    Armazenamento seguro desde 1,90€/mês
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                <CardContent className="pt-6">
                  <Mail className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Mensagem Digital</h4>
                  <p className="text-gray-600 text-sm">
                    Cartas, vídeos e ficheiros com verificação blockchain
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Cápsula do Tempo</h4>
                  <p className="text-gray-600 text-sm">
                    Experiências únicas individuais ou coletivas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testemunhos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">O Que Dizem os Nossos Guardiões do Tempo</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-600 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-amber-700">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Pronto para Te Tornares um Guardião do Tempo?
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Junta-te a milhares de pessoas que já estão a criar memórias para o futuro.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/register')}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-6 w-6 text-amber-700" />
                <h4 className="font-bold text-amber-700">FuturoPresente</h4>
              </div>
              <p className="text-gray-600 text-sm">
                O teu tempo, entregue. Criando memórias para o futuro, uma entrega de cada vez.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Empresa</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amber-700">Sobre</a></li>
                <li><a href="#" className="hover:text-amber-700">Contactos</a></li>
                <li><a href="#" className="hover:text-amber-700">Parcerias</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Serviços</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/pricing" className="hover:text-amber-700">Preços & Planos</a></li>
                <li><a href="#" className="hover:text-amber-700">Cápsulas do Tempo</a></li>
                <li><a href="/how-it-works" className="hover:text-amber-700">Como Funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/terms-conditions" className="hover:text-amber-700">Termos e Condições</a></li>
                <li><a href="/privacy-policy" className="hover:text-amber-700">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
