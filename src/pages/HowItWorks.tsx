
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Calendar, MapPin, Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Como Funciona o
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> FuturoPresente</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descobre como podes enviar presentes para o futuro em apenas alguns passos simples.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-100">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <Gift className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-lg">Escolhe o Tipo de Presente</h3>
              <p className="text-gray-600 text-sm">
                Decide se queres enviar um presente físico ou digital. 
                Presentes físicos são guardados no nosso armazém seguro.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-100">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-lg">Define a Data</h3>
              <p className="text-gray-600 text-sm">
                Escolhe quando queres que o presente seja entregue. 
                Pode ser daqui a dias, meses ou até anos!
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-amber-100">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-lg">Local de Entrega</h3>
              <p className="text-gray-600 text-sm">
                Para presentes físicos, indica onde queres a entrega. 
                Presentes digitais são enviados por email.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process Types */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Physical Gifts */}
          <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Gift className="h-8 w-8 text-amber-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Presentes Físicos</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Envia o teu presente para o nosso armazém seguro</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Guardamos com cuidado até à data agendada</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Entregamos no local e data exactos que escolheste</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Inclui a tua mensagem personalizada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Gifts */}
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
            <CardContent className="pt-0">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Presentes Digitais</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Escreve uma carta emocional para o futuro</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Envia vídeos, fotos ou ficheiros especiais</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Entrega automática por email na data escolhida</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Perfeito para mensagens de aniversário futuras</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            O teu eu do futuro está à espera da tua surpresa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/create-delivery')}>
              Criar Primera Entrega
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
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

export default HowItWorks;
