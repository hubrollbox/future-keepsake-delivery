
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, Star, Package, Mail, Heart, Users, Trophy, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Explorador",
      price: "Grátis",
      yearlyPrice: "",
      description: "Para começar a tua jornada temporal",
      features: [
        "1 entrega digital grátis por mês",
        "Armazenamento grátis primeiros 30 dias",
        "Acesso básico à árvore de memórias",
        "Comunidade de guardiões"
      ],
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Guardião",
      price: "5€/mês",
      yearlyPrice: "50€/ano",
      description: "Para guardiões do tempo dedicados",
      features: [
        "Entregas digitais ilimitadas",
        "Acesso prioritário a todas as funcionalidades",
        "Selos e conquistas exclusivos",
        "Desconto 10% em armazenamento físico",
        "Mural de cápsulas públicas"
      ],
      popular: true,
      color: "from-amber-600 to-amber-700"
    },
    {
      name: "Mestre do Tempo",
      price: "15€/mês",
      yearlyPrice: "150€/ano",
      description: "Para criadores de memórias épicas",
      features: [
        "Tudo do plano Guardião",
        "Armazenamento físico incluído (até 1kg)",
        "Edição profissional de vídeos incluída",
        "Cápsulas coletivas com desconto",
        "Suporte prioritário 24/7"
      ],
      popular: false,
      color: "from-purple-600 to-purple-700"
    },
    {
      name: "Cronos Elite",
      price: "35€/mês",
      yearlyPrice: "350€/ano",
      description: "Para organizações e eventos especiais",
      features: [
        "Tudo do plano anterior",
        "Armazenamento ilimitado",
        "Gestão de equipas e eventos",
        "Cápsulas empresariais personalizadas",
        "API dedicada para integrações"
      ],
      popular: false,
      color: "from-indigo-600 to-indigo-700"
    }
  ];

  const storageServices = [
    {
      name: "Armazenamento Pequeno",
      price: "1,90€/mês",
      yearlyPrice: "19€/ano",
      description: "Até 1kg - perfeito para cartas, pequenos objectos",
      savings: "Poupa 3,80€"
    },
    {
      name: "Armazenamento Médio",
      price: "3,90€/mês",
      yearlyPrice: "39€/ano", 
      description: "Até 5kg - livros, roupas, presentes médios",
      savings: "Poupa 7,80€"
    },
    {
      name: "Primeiros 30 dias",
      price: "Grátis",
      yearlyPrice: "",
      description: "Experimenta sem compromisso",
      savings: ""
    }
  ];

  const digitalServices = [
    {
      name: "Carta Digital Simples",
      price: "Grátis",
      description: "Mensagem de texto básica com data programada"
    },
    {
      name: "Carta Digital Premium",
      price: "2,50€",
      description: "Com verificação blockchain e formatação especial"
    },
    {
      name: "Edição de Vídeo Profissional",
      price: "9,90€",
      description: "Vídeo editado profissionalmente (até 1 minuto)"
    }
  ];

  const physicalServices = [
    {
      name: "Entrega Programada Nacional",
      price: "Desde 6,50€",
      description: "Entrega em Portugal Continental na data exacta"
    },
    {
      name: "Receção de Encomenda",
      price: "3€ - 5€",
      description: "Recebemos o teu presente no nosso armazém"
    },
    {
      name: "Serviço de Compra",
      price: "10% + 5€ mín.",
      description: "Compramos o produto por ti para entrega futura"
    }
  ];

  const timeCapsules = [
    {
      name: "Cápsula Individual",
      price: "Desde 15€",
      description: "Caixa personalizada para pequenos objectos e memórias"
    },
    {
      name: "Cápsula Premium",
      price: "Desde 25€",
      description: "Com fechadura especial e maior capacidade"
    },
    {
      name: "Cápsula Coletiva",
      price: "Desde 49€",
      description: "Pack para eventos, escolas, empresas e grupos"
    },
    {
      name: "Cápsula Luxo",
      price: "Desde 40€",
      description: "Com gravação personalizada e cerimónia de abertura"
    }
  ];

  const gamificationFeatures = [
    {
      name: "Selos Temporais",
      description: "Conquista selos únicos baseados na distância temporal das tuas entregas",
      icon: Target
    },
    {
      name: "Níveis de Guardião",
      description: "Quanto mais distante a entrega, maior o prestígio desbloqueado",
      icon: Trophy
    },
    {
      name: "Árvore de Memórias",
      description: "Timeline visual com todas as tuas cápsulas e entregas programadas",
      icon: Star
    },
    {
      name: "Missões Temporais",
      description: "Desafios especiais como 'Envia algo a ti próprio daqui a 5 anos'",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Preços & Planos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <strong className="text-gold">O teu tempo, entregue.</strong> Escolhe o plano perfeito para criares memórias futuras e viveres experiências emocionais únicas como um verdadeiro Guardião do Tempo.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Planos de Assinatura</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative p-6 ${plan.popular ? 'ring-2 ring-gold shadow-xl' : 'shadow-lg'} hover:shadow-xl transition-shadow`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gold">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-800">
                    {plan.price}
                    {plan.yearlyPrice && (
                      <div className="text-sm text-gold font-normal">
                        ou {plan.yearlyPrice}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-gold mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full bg-gradient-to-r from-gold to-amber-700 hover:opacity-90`}
                    onClick={() => navigate('/register')}
                  >
                    {plan.price === "Grátis" ? "Começar Grátis" : "Escolher Plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gamification Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <Trophy className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Sistema de Gamificação</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Torna cada entrega numa aventura temporal. Conquista selos, desbloqueia níveis e cria a tua árvore de memórias como um verdadeiro Guardião do Tempo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamificationFeatures.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2 text-amber-800">{feature.name}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Storage Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Armazenamento Seguro</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guardamos os teus presentes físicos com total segurança até à data de entrega. Vigilância 24/7 e controlo climático.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {storageServices.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <div className="text-2xl font-bold text-amber-700 mb-2">{service.price}</div>
                  {service.yearlyPrice && (
                    <div className="text-amber-600 font-semibold mb-2">
                      {service.yearlyPrice}
                      {service.savings && <span className="text-green-600 text-sm block">{service.savings}</span>}
                    </div>
                  )}
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Digital Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Entregas Digitais</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Envia mensagens, fotos e vídeos para o futuro com verificação blockchain e edição profissional.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {digitalServices.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <div className="text-2xl font-bold text-amber-700 mb-2">{service.price}</div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Physical Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-amber-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Serviços Físicos</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recebemos, compramos e entregamos os teus presentes físicos na data exacta com garantia total.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {physicalServices.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <div className="text-2xl font-bold text-amber-700 mb-2">{service.price}</div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Time Capsules */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Cápsulas do Tempo</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experiências únicas para indivíduos, casais, famílias, escolas e empresas. Cria memórias que duram para sempre.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeCapsules.map((capsule, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <h4 className="font-semibold text-lg mb-2">{capsule.name}</h4>
                  <div className="text-2xl font-bold text-amber-700 mb-2">{capsule.price}</div>
                  <p className="text-gray-600 text-sm">{capsule.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-gold mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Te Tornares um Guardião do Tempo?
          </h3>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Junta-te a milhares de guardiões do tempo que já estão a criar memórias para o futuro. 
            Começa com o plano gratuito e descobre o poder de enviar presentes para o futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-gold to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/register')}
            >
              Começar Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-gold text-gold hover:bg-gold/10"
              onClick={() => navigate('/how-it-works')}
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;

const plans = [
  {
    name: "Essencial",
    price: "Grátis",
    features: [
      "1 cápsula do tempo",
      "Armazenamento digital: 100MB",
      "Entrega digital",
      "Personalização básica"
    ],
    // bg: "from-dusty-rose/20 to-white/90",
    bg: "bg-gradient-to-br from-dusty-rose/20 to-white/90",
    ring: "ring-2 ring-dusty-rose/40"
  },
  {
    name: "Premium",
    price: "9,99€/ano",
    features: [
      "5 cápsulas do tempo",
      "Armazenamento digital: 1GB",
      "Entrega digital e física",
      "Personalização avançada",
      "Prioridade no suporte"
    ],
    bg: "bg-gradient-to-br from-steel-blue/10 to-white/90",
    ring: "ring-2 ring-steel-blue/40"
  },
  {
    name: "Família",
    price: "19,99€/ano",
    features: [
      "20 cápsulas do tempo",
      "Armazenamento digital: 10GB",
      "Entrega digital e física",
      "Personalização premium",
      "Acesso familiar",
      "Suporte prioritário"
    ],
    bg: "bg-gradient-to-br from-earthy-burgundy/10 to-white/90",
    ring: "ring-2 ring-earthy-burgundy/40"
  }
];
  .map((plan, index) => (
    <Card
      key={plan.name}
      className={`p-8 ${plan.bg} ${plan.ring} rounded-2xl shadow-soft flex flex-col items-center`}
    >
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gold">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-gray-800">
          {plan.price}
          {plan.yearlyPrice && (
            <div className="text-sm text-gold font-normal">
              ou {plan.yearlyPrice}
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm">{plan.description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start text-sm">
              <Check className="h-4 w-4 text-gold mr-2 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full bg-gradient-to-r from-gold to-amber-700 hover:opacity-90`}
          onClick={() => navigate('/register')}
        >
          {plan.price === "Grátis" ? "Começar Grátis" : "Escolher Plano"}
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
