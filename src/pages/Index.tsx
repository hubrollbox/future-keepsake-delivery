
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Mail, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="h-8 w-8 text-amber-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            FuturoPresente
          </h1>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button onClick={() => navigate('/register')}>
            Registar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Guarda o presente para
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> o futuro</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agenda entregas de presentes físicos ou digitais para datas especiais. 
            O teu eu do futuro vai agradecer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/create-delivery')}>
              Criar Primera Entrega
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/how-it-works')}>
              Ver Como Funciona
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agenda para o Futuro</h3>
                <p className="text-gray-600 text-sm">
                  Escolhe a data perfeita para a tua surpresa
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Presentes Digitais</h3>
                <p className="text-gray-600 text-sm">
                  Cartas, vídeos e mensagens especiais
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Entrega Segura</h3>
                <p className="text-gray-600 text-sm">
                  Guardamos os teus presentes físicos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Momentos Únicos</h3>
                <p className="text-gray-600 text-sm">
                  Cria memórias inesquecíveis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Motivational Quote */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <blockquote className="text-2xl font-medium text-gray-700 italic">
              "As melhores surpresas são aquelas que chegam quando menos esperamos,
              vindas do nosso eu do passado que se preocupou connosco."
            </blockquote>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 FuturoPresente. Criando memórias para o futuro.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
