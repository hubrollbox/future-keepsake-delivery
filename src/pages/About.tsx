
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Heart, Target, Award, Lightbulb, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Clock,
      title: "O Tempo é Precioso",
      description: "Acreditamos que o tempo é o recurso mais valioso que temos. Cada momento merece ser preservado e cada memória tem o poder de transformar o futuro."
    },
    {
      icon: Heart,
      title: "Conexões Humanas Autênticas",
      description: "Fortalecemos laços entre pessoas através de gestos significativos que atravessam o tempo, criando pontes emocionais entre o presente e o futuro."
    },
    {
      icon: Target,
      title: "Compromisso Absoluto",
      description: "A nossa promessa é sagrada: cada entrega chegará no momento exacto, sem falhas. É uma responsabilidade que levamos muito a sério."
    },
    {
      icon: Award,
      title: "Inovação com Propósito",
      description: "Combinamos tecnologia de ponta com a magia humana de receber algo especial, criando experiências que marcam a vida das pessoas."
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "A Ideia Nasce",
      description: "Tudo começou quando o nosso fundador quis enviar uma carta para si próprio no futuro, mas não encontrou nenhum serviço confiável em Portugal."
    },
    {
      year: "2024",
      title: "Primeiros Passos",
      description: "Desenvolvemos a plataforma e realizamos as primeiras entregas de teste com amigos e família. Os resultados foram emocionantes."
    },
    {
      year: "2024",
      title: "Lançamento Oficial", 
      description: "Abrimos as portas ao público português. Em poucas semanas, centenas de pessoas criaram as suas primeiras entregas temporais."
    },
    {
      year: "2025",
      title: "Expansão e Crescimento",
      description: "Hoje servimos milhares de clientes e continuamos a inovar, sempre com o mesmo objectivo: preservar memórias e criar momentos mágicos."
    }
  ];

  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      description: "Formada em Gestão pelo ISCTE, Ana teve a visão de criar uma empresa que liga pessoas através do tempo. É apaixonada por histórias e acredita no poder transformador das memórias.",
      quote: "Cada entrega é uma promessa ao futuro."
    },
    {
      name: "Miguel Santos",
      role: "CTO & Co-fundador",
      description: "Engenheiro Informático pela FEUP com 10 anos de experiência em startups tecnológicas. Miguel é o responsável por toda a arquitectura técnica que torna possível guardar e entregar o tempo.",
      quote: "A tecnologia deve servir as emoções humanas."
    },
    {
      name: "Carla Oliveira",
      role: "Directora de Operações",
      description: "Com 15 anos de experiência em logística, Carla garante que cada presente físico é tratado como um tesouro e cada entrega acontece na perfeição.",
      quote: "Cada detalhe importa quando se trata de memórias."
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
            Manifesto do
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent"> FuturoPresente</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Somos uma empresa portuguesa nascida da paixão por preservar momentos especiais e criar experiências inesquecíveis. 
            A nossa missão é simples: ajudar pessoas a enviar amor através do tempo.
          </p>
        </div>

        {/* Nossa História Detalhada */}
        <div className="mb-16">
          <Card className="p-8 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-0">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Como Tudo Começou</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Em 2023, numa tarde chuvosa no Porto, a Ana estava a arrumar a casa da avó que tinha falecido. 
                    Entre os objectos antigos, encontrou uma carta que a avó tinha escrito para ela própria 
                    30 anos antes, guardada numa caixa especial.
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Ao ler aquelas palavras carinhosas, percebeu o poder incrível que uma mensagem do passado 
                    pode ter no presente. Foi nesse momento que nasceu a ideia: "E se toda a gente pudesse 
                    enviar mensagens e presentes para o futuro?"
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Juntamente com o Miguel, seu amigo de longa data e génio da tecnologia, começaram a 
                    desenvolver uma plataforma que tornasse isso possível. O primeiro protótipo foi testado 
                    com as suas próprias famílias.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Hoje, milhares de pessoas já usam o FuturoPresente para criar memórias atemporais, 
                    fortalecer laços familiares e surpreender pessoas queridas no momento perfeito.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-amber-200 to-yellow-200 rounded-2xl p-6">
                    <Lightbulb className="h-32 w-32 text-amber-700 mx-auto mb-4" />
                    <p className="text-center text-amber-800 font-medium">
                      "Cada memória é uma semente que pode florescer no futuro"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">A Nossa Jornada</h3>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm">
                      {item.year}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Missão e Visão */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">A Nossa Missão</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Conectar pessoas através do tempo, preservando momentos especiais e criando experiências únicas 
                de entrega programada. Queremos que cada pessoa possa ser um guardião do tempo, 
                enviando amor e memórias para o futuro de forma segura e emocionante.
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">A Nossa Visão</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Ser a plataforma de referência mundial em entregas temporais, presente em cada momento importante 
                da vida das pessoas. Queremos criar uma rede global de guardiões do tempo que preservam 
                e partilham memórias através das gerações.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Os Nossos Valores</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-3 text-lg">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Equipa */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Conhece a Nossa Equipa</h3>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Somos um grupo apaixonado de pessoas que acredita no poder das memórias e na importância 
            de preservar momentos especiais. Cada membro da nossa equipa contribui para a magia do FuturoPresente.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{member.name}</h4>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                  <p className="text-amber-700 italic text-sm font-medium">"{member.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Números e Impacto */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-r from-amber-100 to-yellow-100">
            <CardContent className="pt-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">O Nosso Impacto</h3>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-amber-700 mb-2">10.000+</p>
                  <p className="text-gray-700">Entregas Criadas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-700 mb-2">5.000+</p>
                  <p className="text-gray-700">Clientes Felizes</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-700 mb-2">98%</p>
                  <p className="text-gray-700">Taxa de Satisfação</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-700 mb-2">100%</p>
                  <p className="text-gray-700">Entregas Bem-sucedidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Quer Fazer Parte da Nossa História?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Junta-te à nossa comunidade de Guardiões do Tempo e ajuda-nos a continuar a criar 
            momentos mágicos para milhares de pessoas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              onClick={() => navigate('/register')}
            >
              Começar Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-amber-600 text-amber-700 hover:bg-amber-50"
              onClick={() => navigate('/contact')}
            >
              Falar Connosco
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
