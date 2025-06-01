
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksFAQ = () => {
  const faqItems = [
    {
      question: "E se mudar de morada?",
      answer: "Podes actualizar a morada de entrega até 30 dias antes da data agendada através do teu painel de Guardião do Tempo."
    },
    {
      question: "Como garantem que o meu presente está seguro?",
      answer: "O nosso armazém tem segurança 24/7, controlo de temperatura e humidade, e seguro total contra danos. Somos verdadeiros guardiões dos teus presentes."
    },
    {
      question: "Posso cancelar uma entrega?",
      answer: "Sim, podes cancelar até 48 horas antes da data de entrega e receber reembolso total."
    },
    {
      question: "Como funciona o sistema de gamificação?",
      answer: "Ganhas selos baseados na distância temporal das entregas, desbloqueias níveis de Guardião e crias a tua árvore de memórias única."
    },
    {
      question: "Que tipos de ficheiros posso enviar?",
      answer: "Aceites vídeos, fotos, documentos PDF, áudio e texto até 100MB por ficheiro, com verificação blockchain opcional."
    }
  ];

  return (
    <div className="mb-12 md:mb-20">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Perguntas Frequentes</h3>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {faqItems.map((item, index) => (
          <Card key={index} className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-700">{item.question}</h4>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksFAQ;
