
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Mail, Users, Gift, Heart, Star } from "lucide-react";
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Envia hoje.
            <span className="bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent"> Surpreende no futuro.</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A primeira plataforma que te permite agendar entregas de presentes físicos 
            ou digitais para datas especiais. O teu eu do futuro vai agradecer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800" 
              onClick={() => navigate('/create-delivery')}
            >
              Começa Já
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-yellow-600 text-yellow-700 hover:bg-yellow-50" 
              onClick={() => navigate('/how-it-works')}
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Como Funciona - 3 Passos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Como Funciona</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <Gift className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Escolhe o Tipo de Presente</h4>
                  <p className="text-gray-600 text-sm">
                    Presente físico, mensagem digital ou cápsula do tempo
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <Calendar className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Define a Data e Destinatário</h4>
                  <p className="text-gray-600 text-sm">
                    Escolhe quando e para quem queres enviar
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-lg">Nós Guardamos e Entregamos</h4>
                  <p className="text-gray-600 text-sm">
                    Guardamos com segurança e entregamos na data exacta
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tipos de Entrega */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Tipos de Entrega</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <Gift className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Presente Físico</h4>
                  <p className="text-gray-600 text-sm">
                    Enviamos o teu presente para o nosso armazém seguro
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <Mail className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Mensagem Digital</h4>
                  <p className="text-gray-600 text-sm">
                    Cartas, vídeos e ficheiros especiais por email
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Cápsula do Tempo</h4>
                  <p className="text-gray-600 text-sm">
                    Combinação de presentes físicos e digitais
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testemunhos */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">O Que Dizem os Nossos Clientes</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-600 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-yellow-700">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Pronto para Criar a Tua Primeira Entrega?
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Junta-te a milhares de pessoas que já estão a surpreender o futuro.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              onClick={() => navigate('/register')}
            >
              Criar Conta
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
                <Clock className="h-6 w-6 text-yellow-700" />
                <h4 className="font-bold text-yellow-700">FuturoPresente</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Criando memórias para o futuro, uma entrega de cada vez.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Empresa</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-yellow-700">Sobre</a></li>
                <li><a href="#" className="hover:text-yellow-700">Contactos</a></li>
                <li><a href="#" className="hover:text-yellow-700">Parcerias</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Serviços</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-yellow-700">Preços & Planos</a></li>
                <li><a href="#" className="hover:text-yellow-700">Loja do Tempo</a></li>
                <li><a href="/how-it-works" className="hover:text-yellow-700">Como Funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3 text-gray-800">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-yellow-700">Termos e Condições</a></li>
                <li><a href="#" className="hover:text-yellow-700">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 FuturoPresente. Criando memórias para o futuro.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
