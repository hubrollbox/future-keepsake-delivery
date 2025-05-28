
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
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
            <h1 className="text-3xl font-bold text-amber-700 mb-6">Termos e Condições</h1>
            <p className="text-gray-600 mb-8">Última atualização: 28 de maio de 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao aceder e utilizar a plataforma FuturoPresente™, aceita estar vinculado a estes Termos e Condições. 
                  Se não concordar com qualquer parte destes termos, não deve utilizar o nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O FuturoPresente™ é uma plataforma que permite agendar entregas de presentes físicos ou digitais 
                  para datas específicas no futuro. Oferecemos armazenamento seguro e entrega garantida na data escolhida.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">3. Registo e Conta de Utilizador</h2>
                <p>
                  Para utilizar o serviço, deve criar uma conta fornecendo informações precisas e atualizadas. 
                  É responsável por manter a confidencialidade da sua palavra-passe e por todas as atividades que 
                  ocorram na sua conta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">4. Tipos de Entrega</h2>
                <div className="ml-4">
                  <h3 className="font-medium mb-2">4.1 Presentes Físicos</h3>
                  <p className="mb-4">
                    Oferecemos armazenamento seguro de presentes físicos com taxas mensais a partir de 1,90€. 
                    Os presentes são mantidos em condições controladas até à data de entrega.
                  </p>
                  
                  <h3 className="font-medium mb-2">4.2 Mensagens Digitais</h3>
                  <p className="mb-4">
                    Cartas, vídeos e ficheiros digitais são armazenados com verificação blockchain para 
                    garantir a integridade e autenticidade.
                  </p>
                  
                  <h3 className="font-medium mb-2">4.3 Cápsulas do Tempo</h3>
                  <p>
                    Experiências personalizadas que podem incluir múltiplos elementos digitais e físicos, 
                    entregues numa data específica.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">5. Pagamentos e Reembolsos</h2>
                <p>
                  Os pagamentos são processados de forma segura. As taxas de armazenamento são cobradas mensalmente. 
                  Reembolsos podem ser solicitados até 14 dias após a criação da entrega, sujeitos às nossas 
                  políticas específicas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">6. Responsabilidades do Utilizador</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Fornecer informações precisas sobre destinatários e datas de entrega</li>
                  <li>Garantir que os presentes físicos cumprem as nossas diretrizes de segurança</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                  <li>Não utilizar o serviço para fins ilegais ou prejudiciais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">7. Limitação de Responsabilidade</h2>
                <p>
                  O FuturoPresente™ fará todos os esforços razoáveis para entregar os presentes na data especificada. 
                  No entanto, não nos responsabilizamos por atrasos causados por circunstâncias fora do nosso controlo, 
                  como desastres naturais ou alterações de endereço não comunicadas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">8. Propriedade Intelectual</h2>
                <p>
                  Todos os direitos de propriedade intelectual da plataforma FuturoPresente™ pertencem-nos. 
                  Os utilizadores mantêm os direitos sobre o conteúdo que carregam, mas concedem-nos uma 
                  licença para armazenar e entregar esse conteúdo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">9. Alterações aos Termos</h2>
                <p>
                  Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entrarão 
                  em vigor após a publicação na plataforma. O uso continuado do serviço constitui aceitação 
                  dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-700 mb-3">10. Contacto</h2>
                <p>
                  Para questões relacionadas com estes termos, contacte-nos através do nosso centro de apoio 
                  ao cliente na plataforma ou por email.
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

export default TermsConditions;
