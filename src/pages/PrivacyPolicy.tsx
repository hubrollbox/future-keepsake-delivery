
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
// Removido ícone antigo e substituído por novo logo Keepla

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-keepla-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-keepla-gray-dark hover:text-keepla-red"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <img
            src="/keepla-logo-black.png?v=3"
            alt="Keepla"
            className="mx-auto mb-4 w-20 h-20 object-contain"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/keepla-logo-red.png?v=3";
            }}
          />
          <h1 className="text-hero text-keepla-gray-dark font-fraunces mb-2">Política de Privacidade</h1>
          <p className="text-keepla-gray-light">Última atualização: 28 de maio de 2025</p>
        </div>

        <Card className="max-w-4xl mx-auto emotion-card">
          <CardContent className="p-8">
            <div className="space-y-8 text-keepla-gray-light">
              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-800 mb-4 font-fraunces">1. Informações que Recolhemos</h2>
                <div className="ml-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 text-keepla-gray-800">1.1 Informações Pessoais</h3>
                    <p className="leading-relaxed">
                      Recolhemos informações que nos fornece diretamente, incluindo nome, email, morada, 
                      número de telefone e informações de pagamento necessárias para prestar o nosso serviço.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-keepla-gray-800">1.2 Informações de Utilização</h3>
                    <p className="leading-relaxed">
                      Recolhemos automaticamente informações sobre como utiliza a nossa plataforma, 
                      incluindo endereços IP, tipo de browser, páginas visitadas e tempo de utilização.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-keepla-gray-800">1.3 Conteúdo dos Utilizadores</h3>
                    <p className="leading-relaxed">
                      Armazenamos de forma segura as mensagens, ficheiros e informações sobre presentes 
                      que escolhe guardar na nossa plataforma para entrega futura.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-800 mb-4 font-fraunces">2. Como Utilizamos as Suas Informações</h2>
                <ul className="list-disc ml-6 space-y-2 leading-relaxed">
                  <li>Prestar e melhorar os nossos serviços de entrega programada</li>
                  <li>Processar pagamentos e gerir a sua conta</li>
                  <li>Comunicar consigo sobre o seu serviço e atualizações importantes</li>
                  <li>Garantir a segurança da plataforma e prevenir fraudes</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Personalizar a sua experiência na plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-800 mb-4 font-fraunces">11. Contacto</h2>
                <p className="leading-relaxed">
                  Se tiver questões sobre esta Política de Privacidade ou quiser exercer os seus direitos, 
                  contacte o nosso Responsável pela Proteção de Dados através do centro de apoio na 
                  plataforma ou por email.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
