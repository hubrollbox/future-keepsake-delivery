
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Heart, Target, Award, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Clock,
      title: "Tempo Precioso",
      description: "Acreditamos que o tempo é o recurso mais valioso e que preservar momentos é essencial."
    },
    {
      icon: Heart,
      title: "Conexões Humanas",
      description: "Fortalecemos laços entre pessoas através de mensagens e presentes significativos."
    },
    {
      icon: Target,
      title: "Compromisso",
      description: "Garantimos que cada entrega chegue no momento certo, sem falhas."
    },
    {
      icon: Award,
      title: "Inovação",
      description: "Combinamos tecnologia avançada com a magia de receber algo especial."
    }
  ];

  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      description: "Visionária por trás do conceito de entregas temporais."
    },
    {
      name: "Miguel Santos",
      role: "CTO",
      description: "Especialista em tecnologia que torna possível guardar o tempo."
    },
    {
      name: "Carla Oliveira",
      role: "Head of Operations",
      description: "Garante que cada entrega seja perfeita e pontual."
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
          <Button variant="ghost" onClick={() => navigate('/')}>
            Início
          </Button>
          <Button variant="ghost" onClick={() => navigate('/how-it-works')}>
            Como Funciona
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            Preços
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
            Sobre o 
            <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent"> FuturoPresente</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Nascemos da ideia simples mas poderosa de que o tempo é o presente mais valioso que podemos dar. 
            Criámos uma plataforma que permite preservar momentos e entregá-los no futuro.
          </p>
        </div>

        {/* Nossa História */}
        <div className="mb-16">
          <Card className="p-8 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-0">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">A Nossa História</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    Em 2024, um grupo de empreendedores portugueses percebeu que vivemos numa era onde tudo acontece instantaneamente, 
                    mas por vezes queremos que algo especial aconteça no momento certo.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Inspirados pelas cápsulas do tempo tradicionais, decidimos criar uma versão moderna e digital. 
                    O FuturoPresente permite que guardes mensagens, presentes físicos e memórias para serem entregues 
                    em datas específicas no futuro.
                  </p>
                  <p className="text-gray-700">
                    Hoje, milhares de pessoas já usam a nossa plataforma para criar memórias atemporais e fortalecer laços humanos.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Lightbulb className="h-32 w-32 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missão e Visão */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Missão</h3>
              <p className="text-gray-700 text-center">
                Conectar pessoas através do tempo, preservando momentos especiais e criando experiências únicas 
                de entrega programada que fortalecem relações humanas.
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Visão</h3>
              <p className="text-gray-700 text-center">
                Ser a plataforma líder mundial em entregas temporais, tornando possível que cada pessoa 
                possa ser um guardião do tempo e criar memórias para o futuro.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Os Nossos Valores</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Equipa */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">A Nossa Equipa</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Users className="h-16 w-16 text-amber-700 mx-auto mb-4" />
                  <h4 className="font-bold text-lg mb-2">{member.name}</h4>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Quer Fazer Parte da Nossa História?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Junta-te à comunidade de Guardiões do Tempo e cria as tuas próprias memórias para o futuro.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            onClick={() => navigate('/register')}
          >
            Começar Agora
          </Button>
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

export default About;
