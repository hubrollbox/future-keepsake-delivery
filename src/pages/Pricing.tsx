
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, Star, Package, Mail, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Gratuito",
      price: "0€",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "1 entrega digital por mês",
        "Mensagens de texto simples",
        "Suporte por email",
        "Calendário básico"
      ],
      buttonText: "Começar Grátis",
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Pessoal",
      price: "3€",
      period: "/mês",
      description: "Para utilizadores regulares",
      features: [
        "5 entregas digitais por mês",
        "10% desconto em entregas físicas",
        "Upload de imagens e vídeos",
        "Notificações prioritárias",
        "Histórico completo"
      ],
      buttonText: "Escolher Pessoal",
      popular: false,
      color: "border-yellow-200"
    },
    {
      name: "Premium",
      price: "8€",
      period: "/mês",
      description: "O mais popular",
      features: [
        "Entregas digitais ilimitadas",
        "Armazenamento incluído (6 meses)",
        "Embalagem personalizada gratuita",
        "Editor de mensagens avançado",
        "Suporte prioritário",
        "Cápsulas do tempo digitais"
      ],
      buttonText: "Escolher Premium",
      popular: true,
      color: "border-yellow-500"
    },
    {
      name: "Família",
      price: "12€",
      period: "/mês",
      description: "Para toda a família",
      features: [
        "Até 4 membros da família",
        "Tudo do plano Premium",
        "Cápsulas partilhadas",
        "Prioridade nas datas especiais",
        "Gestão familiar centralizada",
        "Descontos em eventos especiais"
      ],
      buttonText: "Escolher Família",
      popular: false,
      color: "border-yellow-300"
    }
  ];

  const digitalServices = [
    {
      name: "Entrega Digital Simples",
      price: "2€",
      description: "Mensagem de texto com data programada"
    },
    {
      name: "Entrega Digital Premium",
      price: "5€",
      description: "Com imagens, vídeos e formatação especial"
    },
    {
      name: "Pacote 5 Entregas",
      price: "15€",
      description: "5 entregas digitais (poupas 10€)"
    }
  ];

  const physicalServices = [
    {
      name: "Armazenamento",
      price: "Grátis 30 dias",
      description: "Depois 1€/mês por presente"
    },
    {
      name: "Receção de Encomenda",
      price: "3€ - 5€",
      description: "Recebemos o teu presente no nosso armazém"
    },
    {
      name: "Serviço de Compra",
      price: "10% + 5€ mín.",
      description: "Compramos o produto por ti"
    },
    {
      name: "Entrega Programada",
      price: "4€ - 8€",
      description: "Entrega em Portugal Continental"
    }
  ];

  const premiumExtras = [
    {
      name: "Embalagem Personalizada",
      price: "3€ - 10€",
      description: "Cartão especial e papel premium"
    },
    {
      name: "Vídeo Editado",
      price: "5€ - 20€",
      description: "Mensagem animada ou editada profissionalmente"
    },
    {
      name: "Cápsula Pequena",
      price: "15€",
      description: "Caixa metálica para pequenos objetos"
    },
    {
      name: "Cápsula Média",
      price: "25€",
      description: "Com fechadura e maior capacidade"
    },
    {
      name: "Cápsula Premium",
      price: "40€+",
      description: "Com gravação personalizada"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
              FuturoPresente
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Preços & Planos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolhe o plano perfeito para as tuas necessidades. Sem surpresas, só memórias especiais.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Planos de Assinatura</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'scale-105 shadow-xl' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-yellow-700">
                    {plan.price}<span className="text-lg text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    onClick={() => navigate('/register')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Digital Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Entregas Digitais</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Envia mensagens, fotos e vídeos para o futuro com total segurança.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {digitalServices.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <p className="text-2xl font-bold text-yellow-700 mb-2">{service.price}</p>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Physical Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Entregas Físicas</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guardamos os teus presentes físicos e entregamos na data exacta.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {physicalServices.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <p className="text-2xl font-bold text-yellow-700 mb-2">{service.price}</p>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Extras */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Extras Premium</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Torna as tuas entregas ainda mais especiais com os nossos serviços premium.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumExtras.map((extra, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">{extra.name}</h4>
                  <p className="text-2xl font-bold text-yellow-700 mb-2">{extra.price}</p>
                  <p className="text-gray-600 text-sm">{extra.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Junta-te a milhares de pessoas que já estão a criar memórias para o futuro. 
            Comeza com o plano gratuito e actualiza quando quiseres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
              onClick={() => navigate('/register')}
            >
              Começar Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-yellow-600 text-yellow-700 hover:bg-yellow-50"
              onClick={() => navigate('/how-it-works')}
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </div>

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
                <li><a href="/pricing" className="hover:text-yellow-700">Preços & Planos</a></li>
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

export default Pricing;
