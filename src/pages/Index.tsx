
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
      text: "Enviei uma carta para o meu aniversário de 30 anos. Quando a recebi, chorei de emoção! Foi como receber um abraço do passado.",
      rating: 5
    },
    {
      name: "João Santos", 
      text: "O meu presente físico chegou exactamente no dia certo. O meu filho ficou radiante ao receber o livro que escolhi para ele há 2 anos. Serviço impecável!",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Criei uma cápsula do tempo para a minha filha quando ela tinha 8 anos. Agora aos 16, ficou emocionada ao ver as fotos e a carta que escrevi. Memórias preservadas para sempre!",
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
            <span className="text-gold"> entregue no futuro.</span>
          </h2>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            A primeira plataforma portuguesa que te permite agendar entregas de presentes físicos 
            ou digitais para datas especiais no futuro. Cria memórias atemporais com armazenamento seguro e entrega garantida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold" 
              onClick={() => navigate('/register')}
            >
              Criar a Minha Primeira Entrega
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-gold text-black hover-gold font-semibold" 
              onClick={() => navigate('/how-it-works')}
            >
              Descobrir Como Funciona
            </Button>
          </div>

          {/* Sistema de Gamificação Preview */}
          <div className="mb-16 bg-light-gold rounded-2xl p-8 border border-gold">
            <div className="flex justify-center mb-6">
              <Trophy className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Torna-te um Verdadeiro Guardião do Tempo
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Cada entrega que crias é uma missão temporal única. Conquista selos exclusivos, 
              desbloqueia níveis de prestígio e constrói a tua própria árvore de memórias através do tempo.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Selos Temporais Únicos</p>
                <p className="text-xs text-gray-600">Colecciona marcos especiais</p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Níveis de Guardião</p>
                <p className="text-xs text-gray-600">Do Iniciante ao Mestre</p>
              </div>
              <div className="text-center">
                <Gift className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Árvore de Memórias</p>
                <p className="text-xs text-gray-600">Visualiza a tua jornada</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-black">Missões Temporais</p>
                <p className="text-xs text-gray-600">Desafios únicos</p>
              </div>
            </div>
          </div>

          {/* Como Funciona - 3 Passos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">Como Funciona em 3 Passos Simples</h3>
            <p className="text-lg text-gray-600 mb-8">É mais fácil do que pensas. Em poucos minutos, podes criar a tua primeira entrega temporal.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">1</span>
                  </div>
                  <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Escolhe o Tipo de Presente</h4>
                  <p className="text-gray-600 text-sm">
                    Presente físico que guardamos por ti, mensagem digital especial ou uma cápsula do tempo completa com múltiplos elementos
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">2</span>
                  </div>
                  <Calendar className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Define Quando e Para Quem</h4>
                  <p className="text-gray-600 text-sm">
                    Escolhe a data exacta da entrega (pode ser daqui a meses ou anos) e define o destinatário. Podes enviá-lo para ti próprio ou para alguém especial
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold text-xl">3</span>
                  </div>
                  <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg text-black">Relaxa, Nós Tratamos do Resto</h4>
                  <p className="text-gray-600 text-sm">
                    Armazenamento ultra-seguro e entrega garantida na data exacta. Recebes notificações sobre o progresso e podes acompanhar tudo no teu painel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tipos de Entrega */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">Três Formas de Viajar no Tempo</h3>
            <p className="text-lg text-gray-600 mb-8">Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Presente Físico</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Guardamos o teu presente numa instalação segura e climatizada. Desde jóias a livros, cartas a brinquedos.
                  </p>
                  <p className="text-gold font-semibold text-xs">A partir de 1,90€/mês</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Mensagem Digital</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Cartas escritas do coração, vídeos pessoais, fotos especiais. Tudo protegido com tecnologia blockchain.
                  </p>
                  <p className="text-gold font-semibold text-xs">Verificação de autenticidade incluída</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-black">Cápsula do Tempo</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Combina elementos físicos e digitais numa experiência única. Perfeito para marcos importantes da vida.
                  </p>
                  <p className="text-gold font-semibold text-xs">Experiências personalizadas</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testemunhos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">Histórias Reais dos Nossos Guardiões do Tempo</h3>
            <p className="text-lg text-gray-600 mb-8">Mais de 10.000 pessoas já criaram memórias especiais connosco. Estas são algumas das suas histórias.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-white border-2 border-gold">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gold fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{testimonial.text}"</p>
                    <p className="font-semibold text-gold">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Secção de Confiança */}
          <div className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Porque Confiar em Nós?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-xl">🔒</span>
                </div>
                <h4 className="font-semibold mb-2">Segurança Máxima</h4>
                <p className="text-sm text-gray-600">Instalações monitorizadas 24/7, seguros contra todos os riscos</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                </div>
                <h4 className="font-semibold mb-2">100% de Fiabilidade</h4>
                <p className="text-sm text-gray-600">Mais de 50.000 entregas realizadas com sucesso</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-xl">🇵🇹</span>
                </div>
                <h4 className="font-semibold mb-2">Empresa Portuguesa</h4>
                <p className="text-sm text-gray-600">Sediada no Porto, com apoio local dedicado</p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-light-gold border-2 border-gold rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">
              Pronto para a Tua Primeira Viagem no Tempo?
            </h3>
            <p className="text-xl text-gray-700 mb-6">
              Junta-te a milhares de pessoas que já estão a criar memórias para o futuro. 
              Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold"
                onClick={() => navigate('/register')}
              >
                Começar Grátis Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-gold text-gold hover:bg-gold/10"
                onClick={() => navigate('/contact')}
              >
                Falar Connosco
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">Sem compromissos • Cancelamento a qualquer momento</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
