import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-steel-blue hover:text-dusty-rose"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <SeloDoTempoIcon size={60} className="mx-auto mb-4" />
          <h1 className="text-hero text-steel-blue font-fraunces mb-2">Termos e Condições</h1>
          <p className="text-misty-gray">Última atualização: 28 de maio de 2025</p>
        </div>

        <Card className="max-w-4xl mx-auto emotion-card">
          <CardContent className="p-8">
            <div className="space-y-8 text-misty-gray">
              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">1. Aceitação dos Termos</h2>
                <p className="leading-relaxed">
                  Ao aceder e utilizar a plataforma FuturoPresente™, aceita estar vinculado a estes Termos e Condições. 
                  Se não concordar com qualquer parte destes termos, não deve utilizar o nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">2. Descrição do Serviço</h2>
                <p className="leading-relaxed">
                  O FuturoPresente™ é uma plataforma que permite agendar entregas de presentes físicos ou digitais 
                  para datas específicas no futuro. Oferecemos armazenamento seguro e entrega garantida na data escolhida.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">3. Registo e Conta de Utilizador</h2>
                <p className="leading-relaxed">
                  Para utilizar o serviço, deve criar uma conta fornecendo informações precisas e atualizadas. 
                  É responsável por manter a confidencialidade da sua palavra-passe e por todas as atividades que 
                  ocorram na sua conta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">4. Tipos de Entrega</h2>
                <div className="ml-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 text-steel-blue">4.1 Presentes Físicos</h3>
                    <p className="leading-relaxed">
                      Oferecemos armazenamento seguro de presentes físicos com taxas mensais a partir de 1,90€. 
                      Os presentes são mantidos em condições controladas até à data de entrega.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-steel-blue">4.2 Mensagens Digitais</h3>
                    <p className="leading-relaxed">
                      Cartas, vídeos e ficheiros digitais são armazenados com verificação blockchain para 
                      garantir a integridade e autenticidade.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-steel-blue">4.3 Cápsulas do Tempo</h3>
                    <p className="leading-relaxed">
                      Experiências personalizadas que podem incluir múltiplos elementos digitais e físicos, 
                      entregues numa data específica.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">5. Pagamentos e Reembolsos</h2>
                <p className="leading-relaxed">
                  Os pagamentos são processados de forma segura. As taxas de armazenamento são cobradas mensalmente. 
                  Reembolsos podem ser solicitados até 14 dias após a criação da entrega, sujeitos às nossas 
                  políticas específicas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">6. Responsabilidades do Utilizador</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Fornecer informações precisas sobre destinatários e datas de entrega</li>
                  <li>Garantir que os presentes físicos cumprem as nossas diretrizes de segurança</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                  <li>Não utilizar o serviço para fins ilegais ou prejudiciais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">7. Limitação de Responsabilidade</h2>
                <p className="leading-relaxed">
                  O FuturoPresente™ fará todos os esforços razoáveis para entregar os presentes na data especificada. 
                  No entanto, não nos responsabilizamos por atrasos causados por circunstâncias fora do nosso controlo, 
                  como desastres naturais ou alterações de endereço não comunicadas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">8. Propriedade Intelectual</h2>
                <p className="leading-relaxed">
                  Todos os direitos de propriedade intelectual da plataforma FuturoPresente™ pertencem-nos. 
                  Os utilizadores mantêm os direitos sobre o conteúdo que carregam, mas concedem-nos uma 
                  licença para armazenar e entregar esse conteúdo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">9. Alterações aos Termos</h2>
                <p className="leading-relaxed">
                  Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entrarão 
                  em vigor após a publicação na plataforma. O uso continuado do serviço constitui aceitação 
                  dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-steel-blue mb-4 font-fraunces">10. Contacto</h2>
                <p className="leading-relaxed">
                  Para questões relacionadas com estes termos, contacte-nos através do nosso centro de apoio 
                  ao cliente na plataforma ou por email.
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

export default TermsConditions;
