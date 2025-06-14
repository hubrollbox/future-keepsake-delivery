
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksFAQ = () => {
  const faqItems = [
    {
      question: "E se mudar de morada antes da entrega?",
      answer: "Sem problema! Podes actualizar a morada de entrega até 30 dias antes da data agendada através do teu painel de Guardião do Tempo. É gratuito e simples."
    },
    {
      question: "Como garantem que o meu presente está realmente seguro?",
      answer: "O nosso armazém tem certificação ISO 27001, segurança 24/7 com câmaras HD, controlo rigoroso de temperatura e humidade, e seguro total contra danos até €10.000 por entrega. Somos verdadeiros guardiões dos teus presentes."
    },
    {
      question: "Posso cancelar uma entrega agendada?",
      answer: "Sim, podes cancelar até 48 horas antes da data de entrega e receber reembolso total. Para entregas com mais de 1 ano de antecedência, o prazo de cancelamento é de 7 dias."
    },
    {
      question: "Como funciona exactamente o sistema de gamificação?",
      answer: "Ganhas selos baseados na distância temporal das entregas (1 mês = Selo Bronze, 1 ano = Selo Ouro, etc.), desbloqueias níveis de Guardião e crias a tua árvore de memórias única com cada entrega realizada."
    },
    {
      question: "Que tipos de ficheiros digitais posso enviar?",
      answer: "Aceitas vídeos (MP4, AVI), fotos (JPG, PNG), documentos (PDF), áudio (MP3, WAV) e texto até 100MB por ficheiro. Oferecemos também verificação blockchain opcional para autenticidade."
    },
    {
      question: "E se a empresa deixar de existir?",
      answer: "Temos um fundo de garantia e parcerias estabelecidas para assegurar que todas as entregas agendadas sejam cumpridas, mesmo em cenários extremos. A tua confiança é sagrada."
    }
  ];

  return (
    <div className="mb-12 md:mb-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-blue mb-8 md:mb-12 text-center font-fraunces">
        Perguntas Mais <span className="text-earthy-burgundy">Frequentes</span>
      </h2>
      <p className="text-lg md:text-xl text-misty-gray mb-8 md:mb-10 text-center max-w-4xl mx-auto leading-relaxed">
        Esclarecemos as dúvidas mais comuns dos nossos <strong className="text-earthy-burgundy">Guardiões do Tempo</strong>.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {faqItems.map((item, index) => (
          <Card key={index} className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-[1.02] rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20">
            <CardContent className="pt-6">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-earthy-burgundy font-fraunces">{item.question}</h3>
              <p className="text-misty-gray text-sm md:text-base leading-relaxed">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksFAQ;
