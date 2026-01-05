import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
// Removido ícone antigo e substituído por novo logo Keepla

const TermsConditions = () => {
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
          <h1 className="text-hero text-keepla-gray-dark font-fraunces mb-2">Termos e Condições – KEEPLA.PT</h1>
          <p className="text-keepla-gray">Versão MVP / Beta Fechada</p>
          <p className="text-keepla-gray-light">Última atualização: 5 de janeiro de 2026</p>
        </div>

        <Card className="max-w-4xl mx-auto emotion-card">
          <CardContent className="p-8">
            <div className="space-y-8 text-keepla-gray">
              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">1. Identificação</h2>
                <p className="leading-relaxed">
                  A plataforma keepla.pt é operada pela Obtain Success Unipessoal Lda, NIF 515 811 165, com sede em Matosinhos, Portugal, doravante designada por Keepla.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">2. Natureza do Serviço (Beta)</h2>
                <p className="leading-relaxed">A Keepla encontra-se em fase MVP / beta fechada. O serviço consiste numa plataforma digital experimental que permite:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>criação de conta de utilizador;</li>
                  <li>criação e agendamento de conteúdos digitais para entrega futura;</li>
                  <li>gestão básica de datas, destinatários e mensagens.</li>
                </ul>
                <p className="leading-relaxed mt-4">O utilizador reconhece que:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>o serviço está em desenvolvimento;</li>
                  <li>podem existir falhas, interrupções ou perda de dados;</li>
                  <li>funcionalidades podem ser alteradas ou removidas sem aviso prévio.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">3. Acesso e Convites</h2>
                <p className="leading-relaxed">O acesso ao beta é:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>limitado;</li>
                  <li>sujeito a convite ou aprovação pela Keepla;</li>
                  <li>revogável a qualquer momento, sem necessidade de justificação.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">4. Registo e Conta</h2>
                <p className="leading-relaxed">O utilizador compromete-se a fornecer dados verdadeiros e atualizados. É responsável:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>pela segurança das credenciais;</li>
                  <li>por toda a atividade realizada na sua conta.</li>
                </ul>
                <p className="leading-relaxed mt-4">A Keepla pode suspender ou eliminar contas em caso de uso abusivo, ilegal ou incompatível com o beta.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">5. Conteúdos do Utilizador</h2>
                <p className="leading-relaxed">O utilizador é o único responsável pelos conteúdos carregados, garantindo que:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>tem legitimidade para os utilizar;</li>
                  <li>não violam a lei nem direitos de terceiros.</li>
                </ul>
                <p className="leading-relaxed mt-4">O utilizador concede à Keepla uma licença limitada, não exclusiva e temporária para:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>armazenar;</li>
                  <li>processar;</li>
                  <li>disponibilizar os conteúdos exclusivamente para execução do serviço.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">6. Pagamentos</h2>
                <p className="leading-relaxed">Durante a fase MVP / beta fechada:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>o serviço pode ser gratuito ou pago;</li>
                  <li>eventuais valores cobrados são apresentados de forma clara antes da adesão.</li>
                </ul>
                <p className="leading-relaxed mt-4">A Keepla pode alterar o modelo de preços ou encerrar funcionalidades sem compensação.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">7. Direito de Livre Resolução</h2>
                <p className="leading-relaxed">Quando aplicável, o utilizador beneficia do direito de livre resolução nos termos do DL n.º 24/2014, com as limitações legais aplicáveis a serviços digitais já iniciados ou conteúdos personalizados.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">8. Proteção de Dados Pessoais</h2>
                <p className="leading-relaxed">A Keepla atua como Responsável pelo Tratamento, nos termos do RGPD.</p>
                <p className="leading-relaxed mt-2">Os dados pessoais são tratados para:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>gestão da conta;</li>
                  <li>funcionamento do serviço;</li>
                  <li>cumprimento de obrigações legais.</li>
                </ul>
                <p className="leading-relaxed mt-4">O utilizador pode exercer os direitos previstos no RGPD e apresentar reclamação junto da CNPD.</p>
                <p className="leading-relaxed mt-2">Os dados podem ser eliminados sem aviso no contexto de encerramento do beta.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">9. Menores</h2>
                <p className="leading-relaxed">O serviço não se destina a menores de 13 anos. O acesso por menores depende de consentimento parental válido.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">10. Limitação de Responsabilidade (Beta)</h2>
                <p className="leading-relaxed">Atendendo à natureza experimental do serviço, a Keepla:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>não garante disponibilidade contínua;</li>
                  <li>não garante preservação definitiva de conteúdos;</li>
                  <li>não responde por danos indiretos ou expectativas não cumpridas.</li>
                </ul>
                <p className="leading-relaxed mt-4">Nada no presente exclui responsabilidade por dolo ou negligência grave, nos termos da lei.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">11. Alterações e Encerramento</h2>
                <p className="leading-relaxed">A Keepla pode:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>alterar estes Termos;</li>
                  <li>suspender ou encerrar o beta;</li>
                  <li>eliminar dados associados ao beta,</li>
                </ul>
                <p className="leading-relaxed mt-4">sem obrigação de continuidade do serviço.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">12. Lei Aplicável e Litígios</h2>
                <p className="leading-relaxed">Aplica-se a lei portuguesa. O consumidor pode recorrer a entidade de Resolução Alternativa de Litígios legalmente competente.</p>
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
