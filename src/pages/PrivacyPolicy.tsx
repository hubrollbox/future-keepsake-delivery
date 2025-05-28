
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-amber-700 mb-6">Política de Privacidade</h1>
            <p className="text-gray-600 mb-8">Última atualização: 28 de maio de 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">1. Informações que Recolhemos</h2>
                <div className="ml-4">
                  <h3 className="font-medium mb-2">1.1 Informações Pessoais</h3>
                  <p className="mb-4">
                    Recolhemos informações que nos fornece diretamente, incluindo nome, email, morada, 
                    número de telefone e informações de pagamento necessárias para prestar o nosso serviço.
                  </p>
                  
                  <h3 className="font-medium mb-2">1.2 Informações de Utilização</h3>
                  <p className="mb-4">
                    Recolhemos automaticamente informações sobre como utiliza a nossa plataforma, 
                    incluindo endereços IP, tipo de browser, páginas visitadas e tempo de utilização.
                  </p>
                  
                  <h3 className="font-medium mb-2">1.3 Conteúdo dos Utilizadores</h3>
                  <p>
                    Armazenamos de forma segura as mensagens, ficheiros e informações sobre presentes 
                    que escolhe guardar na nossa plataforma para entrega futura.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">2. Como Utilizamos as Suas Informações</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Prestar e melhorar os nossos serviços de entrega programada</li>
                  <li>Processar pagamentos e gerir a sua conta</li>
                  <li>Comunicar consigo sobre o seu serviço e atualizações importantes</li>
                  <li>Garantir a segurança da plataforma e prevenir fraudes</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Personalizar a sua experiência na plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">3. Partilha de Informações</h2>
                <p className="mb-4">
                  Não vendemos, alugamos ou partilhamos as suas informações pessoais com terceiros, 
                  exceto nas seguintes circunstâncias:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Com o seu consentimento explícito</li>
                  <li>Para prestar o serviço solicitado (ex: serviços de entrega)</li>
                  <li>Para cumprir obrigações legais ou ordens judiciais</li>
                  <li>Para proteger os nossos direitos e segurança</li>
                  <li>Com prestadores de serviços que nos auxiliam (sob acordos de confidencialidade)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">4. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                  as suas informações pessoais contra acesso não autorizado, alteração, divulgação ou 
                  destruição. Isto inclui encriptação, controlos de acesso e monitorização regular dos 
                  nossos sistemas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">5. Retenção de Dados</h2>
                <p>
                  Mantemos as suas informações pessoais apenas pelo tempo necessário para cumprir os 
                  propósitos descritos nesta política, exceto quando um período de retenção mais longo 
                  é exigido ou permitido por lei. Os dados de entregas são mantidos até à data de entrega 
                  especificada, podendo ser eliminados posteriormente conforme solicitado.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">6. Os Seus Direitos</h2>
                <p className="mb-4">
                  De acordo com a legislação aplicável de proteção de dados, tem os seguintes direitos:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Acesso às suas informações pessoais</li>
                  <li>Retificação de dados incorretos ou incompletos</li>
                  <li>Eliminação dos seus dados pessoais</li>
                  <li>Limitação do processamento dos seus dados</li>
                  <li>Portabilidade dos dados</li>
                  <li>Oposição ao processamento</li>
                  <li>Retirada do consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">7. Cookies e Tecnologias Similares</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar a sua experiência na plataforma, 
                  analisar o uso do site e personalizar conteúdo. Pode gerir as suas preferências de cookies 
                  através das configurações do seu browser.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">8. Transferências Internacionais</h2>
                <p>
                  Os seus dados podem ser transferidos e processados em países fora do Espaço Económico Europeu. 
                  Quando isto acontecer, garantimos que são implementadas salvaguardas adequadas para proteger 
                  as suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">9. Menores de Idade</h2>
                <p>
                  Os nossos serviços não se destinam a menores de 16 anos. Não recolhemos conscientemente 
                  informações pessoais de menores de 16 anos. Se tomar conhecimento de que recolhemos 
                  dados de um menor, contacte-nos para que possamos eliminar essas informações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">10. Alterações a Esta Política</h2>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                  alterações significativas por email ou através de um aviso na nossa plataforma. 
                  A continuação do uso dos nossos serviços após as alterações constitui aceitação da 
                  nova política.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">11. Contacto</h2>
                <p>
                  Se tiver questões sobre esta Política de Privacidade ou quiser exercer os seus direitos, 
                  contacte o nosso Responsável pela Proteção de Dados através do centro de apoio na 
                  plataforma ou por email.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
