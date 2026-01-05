
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
          <h1 className="text-hero text-keepla-gray-dark font-fraunces mb-2">Política de Privacidade – KEEPLA.PT</h1>
          <p className="text-keepla-gray">Versão MVP / Beta Fechada</p>
          <p className="text-keepla-gray-light">Última atualização: 5 de janeiro de 2026</p>
        </div>

        <Card className="max-w-4xl mx-auto emotion-card">
          <CardContent className="p-8">
            <div className="space-y-8 text-keepla-gray">
              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">1. Responsável pelo Tratamento</h2>
                <p className="leading-relaxed">
                  A keepla.pt é operada pela Obtain Success Unipessoal Lda, NIF 515 811 165, com sede em Matosinhos, Portugal, doravante “Keepla”.
                </p>
                <p className="leading-relaxed mt-2">
                  A Keepla é a Responsável pelo Tratamento dos dados pessoais, nos termos do Regulamento (UE) 2016/679 (RGPD).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">2. Dados Pessoais Tratados</h2>
                <p className="leading-relaxed">No contexto do MVP / beta fechada, a Keepla pode tratar:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>dados de identificação (nome, email);</li>
                  <li>dados de conta e autenticação;</li>
                  <li>conteúdos digitais carregados pelo utilizador;</li>
                  <li>dados técnicos (logs básicos, endereço IP, dispositivo).</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Não são tratados dados sensíveis, salvo se introduzidos voluntariamente pelo utilizador nos conteúdos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">3. Finalidades do Tratamento</h2>
                <p className="leading-relaxed">Os dados são tratados exclusivamente para:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>criação e gestão da conta de utilizador;</li>
                  <li>funcionamento da plataforma;</li>
                  <li>execução do serviço solicitado;</li>
                  <li>comunicações relacionadas com o beta;</li>
                  <li>cumprimento de obrigações legais.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">4. Fundamento Legal</h2>
                <p className="leading-relaxed">O tratamento baseia-se:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>na execução do contrato (art. 6.º, n.º 1, al. b) RGPD);</li>
                  <li>no cumprimento de obrigações legais (al. c));</li>
                  <li>no consentimento do utilizador, quando aplicável (al. a)).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">5. Conservação dos Dados</h2>
                <p className="leading-relaxed">Os dados são conservados:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>enquanto a conta estiver ativa;</li>
                  <li>ou enquanto necessário à finalidade do tratamento;</li>
                  <li>podendo ser eliminados sem aviso no encerramento do beta.</li>
                </ul>
                <p className="leading-relaxed mt-4">O utilizador pode solicitar a eliminação da conta a qualquer momento.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">6. Partilha de Dados</h2>
                <p className="leading-relaxed">
                  Os dados podem ser tratados por prestadores de serviços técnicos (ex.: alojamento, infraestrutura cloud), atuando como subcontratantes, apenas para execução do serviço.
                </p>
                <p className="leading-relaxed mt-2">
                  Não há transferência de dados para fora da União Europeia sem garantias legais adequadas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">7. Direitos do Utilizador</h2>
                <p className="leading-relaxed">Nos termos do RGPD, o utilizador tem direito a:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>acesso;</li>
                  <li>retificação;</li>
                  <li>apagamento;</li>
                  <li>limitação do tratamento;</li>
                  <li>oposição;</li>
                  <li>portabilidade dos dados.</li>
                </ul>
                <p className="leading-relaxed mt-4">O exercício destes direitos pode ser feito através da plataforma.</p>
                <p className="leading-relaxed mt-2">
                  O utilizador tem ainda o direito de apresentar reclamação junto da CNPD – Comissão Nacional de Proteção de Dados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">8. Segurança</h2>
                <p className="leading-relaxed">
                  A Keepla aplica medidas técnicas e organizativas adequadas para proteger os dados pessoais. Contudo, atendendo à natureza experimental do beta, não é garantida segurança absoluta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">9. Menores</h2>
                <p className="leading-relaxed">
                  A plataforma não se destina a menores de 13 anos. A utilização por menores depende de consentimento parental válido.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">10. Alterações à Política de Privacidade</h2>
                <p className="leading-relaxed">
                  Esta Política pode ser alterada a qualquer momento. As alterações produzem efeitos após publicação na plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-keepla-gray-dark mb-4 font-fraunces">11. Lei Aplicável</h2>
                <p className="leading-relaxed">Aplica-se a lei portuguesa.</p>
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
