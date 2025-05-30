
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Mail, Users, Gift, Heart, Star, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
            O teu tempo,
            <span className="text-gold"> entregue.</span>
          </h2>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            A primeira plataforma que te permite agendar entregas de presentes físicos 
            ou digitais para datas especiais. Cria memórias para o futuro com armazenamento seguro e entrega garantida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold" 
              onClick={() => navigate('/register')}
            >
              Criar Primeira Entrega
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-gold text-black hover-gold font-semibold" 
              onClick={() => navigate('/how-it-works')}
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Sistema de Gamificação Preview */}
          <div className="mb-16 bg-light-gold rounded-2xl p-8 border border-gold">
            <div className="flex justify-center mb-6">
              <Trophy className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Torna-te um Guardião do Tempo
            </h3>
            <p className="text-gray-700 mb-6">
              Conquista selos únicos, desbloqueia níveis de prestígio e cria a tua árvore de memórias temporal.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Selos Temporais</p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Níveis de Guardião</p>
              </div>
              <div className="text-center">
                <Gift className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Árvore de Memórias</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Missões Temporais</p>
              </div>
            </div>
          </div>

          {/* Como Funciona - 3 Passos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-8">Como Funciona</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">1</span>
                  </div>
                  <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Escolhe o Tipo de Presente</h4>
                  <p className="text-gray-600 text-sm">
                    Presente físico, mensagem digital ou cápsula do tempo
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">2</span>
                  </div>
                  <Calendar className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Define a Data e Destinatário</h4>
                  <p className="text-gray-600 text-sm">
                    Escolhe quando e para quem queres enviar
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">3</span>
                  </div>
                  <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Nós Guardamos e Entregamos</h4>
                  <p className="text-gray-600 text-sm">
                    Armazenamento seguro e entrega garantida na data exacta
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tipos de Entrega */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-8">Tipos de Entrega</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Presente Físico</h4>
                  <p className="text-gray-700 text-sm">
                    Armazenamento seguro desde 1,90€/mês
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Mensagem Digital</h4>
                  <p className="text-gray-700 text-sm">
                    Cartas, vídeos e ficheiros com verificação blockchain
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Cápsula do Tempo</h4>
                  <p className="text-gray-700 text-sm">
                    Experiências únicas individuais ou coletivas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testemunhos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-8">O Que Dizem os Nossos Guardiões do Tempo</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-white border-2 border-gold">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gold fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-gold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-light-gold border-2 border-gold rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">
              Pronto para Te Tornares um Guardião do Tempo?
            </h3>
            <p className="text-xl text-gray-700 mb-6">
              Junta-te a milhares de pessoas que já estão a criar memórias para o futuro.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold"
              onClick={() => navigate('/register')}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
