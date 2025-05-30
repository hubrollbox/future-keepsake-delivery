
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Handshake, Building, Users, Star, ArrowLeft, Gift, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Partnerships = () => {
  const navigate = useNavigate();

  const partnershipTypes = [
    {
      icon: Building,
      title: "Empresas",
      description: "Soluções corporativas para eventos especiais, recompensas de funcionários e campanhas de marketing temporal.",
      benefits: ["Descontos em volume", "API personalizada", "Suporte dedicado"]
    },
    {
      icon: Gift,
      title: "Retailers",
      description: "Integração com lojas físicas e online para expandir os serviços de entrega programada.",
      benefits: ["Comissões atrativas", "Formação incluída", "Material promocional"]
    },
    {
      icon: Users,
      title: "Influenciadores",
      description: "Programa de afiliados para criadores de conteúdo que querem partilhar a magia do tempo.",
      benefits: ["Códigos de desconto exclusivos", "Comissões por referência", "Acesso antecipado"]
    }
  ];

  const currentPartners = [
    {
      name: "TimeBox Stores",
      type: "Retail Partner",
      description: "Rede de lojas especializadas em presentes únicos"
    },
    {
      name: "Memória Digital",
      type: "Tech Partner",
      description: "Soluções de digitalização e preservação de memórias"
    },
    {
      name: "Correios Premium",
      type: "Logistics Partner",
      description: "Serviços de entrega especializada e segura"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">Parcerias</span>
            {" "}Estratégicas
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junta-te à nossa rede de parceiros e ajuda-nos a transformar a forma como as pessoas experienciam o tempo e as memórias.
          </p>
          <div className="flex justify-center mb-8">
            <Handshake className="h-16 w-16 text-amber-700" />
          </div>
        </div>

        {/* Tipos de Parcerias */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tipos de Parcerias</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <type.icon className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <CardTitle className="text-xl text-gray-800">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-amber-700 text-sm">Benefícios:</h4>
                    <ul className="space-y-1">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <Star className="h-3 w-3 text-amber-600 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefícios da Parceria */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Por que Ser Nosso Parceiro?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-amber-700 mb-4" />
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Mercado em Crescimento</h4>
                <p className="text-gray-600">
                  O mercado de experiências personalizadas e entregas programadas está em rápida expansão. 
                  Junta-te a nós enquanto pioneiro neste setor inovador.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-amber-700 mb-4" />
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Tecnologia Avançada</h4>
                <p className="text-gray-600">
                  Acesso a tecnologia de ponta, incluindo blockchain para verificação de autenticidade 
                  e sistemas de armazenamento seguros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Parceiros Atuais */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Os Nossos Parceiros</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Building className="h-10 w-10 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2">{partner.name}</h4>
                  <p className="text-amber-600 text-sm font-medium mb-2">{partner.type}</p>
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Como Tornar-se Parceiro */}
        <div className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-amber-700">Como Tornar-se Parceiro</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Contacta-nos</h4>
                  <p className="text-gray-600 text-sm">
                    Envia-nos uma proposta através do nosso formulário de contacto
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Avaliação</h4>
                  <p className="text-gray-600 text-sm">
                    Analisamos a compatibilidade e o potencial da parceria
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Integração</h4>
                  <p className="text-gray-600 text-sm">
                    Formação e integração com as nossas plataformas e processos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Ser Nosso Parceiro?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Vamos criar juntos o futuro das entregas temporais e experiências memoráveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/contact')}
            >
              Propor Parceria
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-amber-600 text-amber-700 hover:bg-amber-50"
              onClick={() => navigate('/contact')}
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;
