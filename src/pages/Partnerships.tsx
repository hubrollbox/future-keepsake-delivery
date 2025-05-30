
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Handshake, Building, Users, Mail, Phone, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Partnerships = () => {
  const navigate = useNavigate();

  const partnerTypes = [
    {
      icon: Building,
      title: "Empresas de Logística",
      description: "Parceiros para entrega de presentes físicos em todo o país",
      benefits: ["Rede nacional de distribuição", "Armazenamento seguro", "Rastreamento em tempo real"]
    },
    {
      icon: Users,
      title: "Plataformas Digitais",
      description: "Integração com outros serviços para ampliar funcionalidades",
      benefits: ["APIs compartilhadas", "Experiência integrada", "Maior alcance"]
    },
    {
      icon: Star,
      title: "Marcas e Retailers",
      description: "Ofertas especiais e produtos exclusivos para os nossos utilizadores",
      benefits: ["Descontos exclusivos", "Produtos únicos", "Experiências premium"]
    }
  ];

  const currentPartners = [
    {
      name: "CTT - Correios de Portugal",
      description: "Parceiro oficial para entregas nacionais",
      logo: "🏢"
    },
    {
      name: "Fnac",
      description: "Produtos tecnológicos e culturais",
      logo: "📱"
    },
    {
      name: "Worten",
      description: "Eletrodomésticos e tecnologia",
      logo: "💻"
    },
    {
      name: "El Corte Inglés",
      description: "Produtos premium e experiências únicas",
      logo: "🛍️"
    }
  ];

  const benefits = [
    "Acesso a milhares de utilizadores ativos",
    "Integração tecnológica completa",
    "Marketing conjunto e co-branding",
    "Análise de dados e insights",
    "Suporte técnico especializado",
    "Condições comerciais preferenciais"
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
          <Button variant="ghost" onClick={() => navigate('/')}>
            Início
          </Button>
          <Button variant="ghost" onClick={() => navigate('/about')}>
            Sobre
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')}>
            Contacto
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
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">Parcerias</span>
            {" "}Estratégicas
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junta-te ao ecossistema FuturoPresente e cria valor conjunto. 
            Trabalhamos com empresas que partilham a nossa visão de conectar pessoas através do tempo.
          </p>
          <div className="flex justify-center">
            <Handshake className="h-24 w-24 text-amber-600" />
          </div>
        </div>

        {/* Tipos de Parcerias */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tipos de Parcerias</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white/60 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <type.icon className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-bold text-lg mb-3 text-center">{type.title}</h4>
                  <p className="text-gray-600 mb-4 text-center">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Parceiros Atuais */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Os Nossos Parceiros</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{partner.logo}</div>
                  <h4 className="font-bold mb-2">{partner.name}</h4>
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefícios de Ser Parceiro */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Porquê Ser Nosso Parceiro?
              </h3>
              <p className="text-gray-700 mb-6">
                O FuturoPresente está a crescer rapidamente, com milhares de utilizadores ativos que confiam 
                na nossa plataforma para criar memórias especiais. Ao tornar-se nosso parceiro, 
                terá acesso a este mercado em expansão.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="pt-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Estatísticas da Plataforma
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-amber-700">10K+</p>
                    <p className="text-sm text-gray-600">Utilizadores Ativos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-700">25K+</p>
                    <p className="text-sm text-gray-600">Entregas Agendadas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-700">95%</p>
                    <p className="text-sm text-gray-600">Taxa de Satisfação</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-700">50+</p>
                    <p className="text-sm text-gray-600">Cidades Cobertas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Processo de Parceria */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Como Funciona</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Contacto Inicial", description: "Entre em contacto connosco através do formulário" },
              { step: 2, title: "Reunião de Apresentação", description: "Discutimos oportunidades e alinhamento" },
              { step: 3, title: "Proposta Comercial", description: "Desenvolvemos uma proposta personalizada" },
              { step: 4, title: "Implementação", description: "Iniciamos a parceria e integração técnica" }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA de Contacto */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Interessado em Ser Nosso Parceiro?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Vamos construir juntos o futuro das entregas temporais. Entre em contacto connosco hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/contact')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Entrar em Contacto
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-amber-600 text-amber-700 hover:bg-amber-50"
            >
              <Phone className="h-5 w-5 mr-2" />
              +351 210 123 456
            </Button>
          </div>
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

export default Partnerships;
