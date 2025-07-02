
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "O que é uma cápsula do tempo?",
      answer: "Uma cápsula do tempo é um recipiente digital ou físico onde guardas mensagens, fotografias, vídeos ou objectos para serem entregues numa data futura específica. É uma forma única de conectar o presente com o futuro, criando momentos especiais para as pessoas que mais amas."
    },
    {
      question: "Como funciona a entrega?",
      answer: "Após criares a tua cápsula e definires a data de entrega, o nosso sistema automaticamente agenda a entrega para o momento exacto que escolheste. Podes escolher entre entrega por email (gratuita), SMS ou entrega física em Portugal Continental. Receberás uma confirmação quando a cápsula for entregue."
    },
    {
      question: "Posso adicionar um vídeo à minha cápsula?",
      answer: "Sim! Oferecemos um serviço de edição de vídeo profissional por 9,90€. Podes enviar-nos o teu vídeo (até 1 minuto) e a nossa equipa irá editá-lo profissionalmente, adicionando música de fundo, transições suaves e uma apresentação elegante que honra a importância da tua mensagem."
    },
    {
      question: "Quanto custam os extras?",
      answer: "Os nossos extras incluem: Carta Digital Premium (2,50€), Presente Físico Guardado (desde 1,90€/mês), Cápsula Individual (desde 15€), Cápsula Premium (desde 25€), Cápsula Coletiva (desde 49€), Edição de Vídeo (9,90€), Serviço de Compra (10% + 5€ mín.) e Entrega Programada (desde 6,50€)."
    },
    {
      question: "Como posso agendar uma cápsula para outra pessoa?",
      answer: "É muito simples! Durante o processo de criação, apenas introduces o nome e contacto da pessoa destinatária. Podes escolher o canal de entrega (email, SMS ou morada física) e personalizar a mensagem. A cápsula será entregue directamente ao destinatário na data que escolheste."
    },
    {
      question: "Como sei se a cápsula foi entregue?",
      answer: "Receberás uma notificação automática assim que a cápsula for entregue ao destinatário. No teu dashboard, podes acompanhar o status de todas as tuas cápsulas: agendadas, entregues ou em processamento. Também mantemos um histórico completo de todas as entregas."
    },
    {
      question: "Posso cancelar ou modificar uma cápsula depois de criada?",
      answer: "Podes modificar alguns detalhes da cápsula até 48 horas antes da data de entrega. Isto inclui alterar a mensagem, o destinatário ou a data de entrega. Após esse período, a cápsula fica 'selada' e não pode ser alterada para preservar a autenticidade da experiência."
    },
    {
      question: "Os meus dados estão seguros?",
      answer: "Sim, absolutamente. Utilizamos encriptação de ponta a ponta para proteger todas as tuas mensagens e dados pessoais. As cápsulas físicas são armazenadas em instalações com controlo climático e segurança 24/7. A tua privacidade e a segurança das tuas memórias são as nossas prioridades máximas."
    },
    {
      question: "Posso criar cápsulas para grupos?",
      answer: "Sim! A nossa Cápsula Coletiva (desde 49€) é perfeita para grupos. Podes convidar familiares, amigos ou colegas para contribuir com mensagens, fotos ou vídeos. Organizamos até um evento especial de abertura quando chegar a data de entrega."
    },
    {
      question: "Que tipos de presente físico posso guardar?",
      answer: "Podes guardar quase qualquer coisa: joias, cartas manuscritas, fotografias impressas, pequenos objectos com valor sentimental, documentos importantes, ou presentes simbólicos. A nossa equipa avalia cada item para garantir que pode ser preservado adequadamente até à data de entrega."
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-steel-blue mb-4">
              Suporte & Perguntas Frequentes
            </h1>
            <p className="text-lg text-misty-gray max-w-2xl mx-auto">
              Encontra respostas para as tuas questões sobre cápsulas do tempo e os nossos serviços.
            </p>
          </div>

          <div className="mb-12">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <Card className="border-dusty-rose/20">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h3 className="text-left font-semibold text-steel-blue">
                        {faq.question}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 px-6 pb-6">
                        <p className="text-misty-gray leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center">
            <Card className="bg-sand-beige/30 border-dusty-rose/30">
              <CardHeader>
                <CardTitle className="text-steel-blue font-serif">
                  Ainda tens dúvidas?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-misty-gray">
                  A nossa equipa está sempre disponível para te ajudar com qualquer questão sobre as tuas cápsulas do tempo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="flex items-center gap-2 bg-dusty-rose hover:bg-dusty-rose/90 text-white">
                      <Mail className="h-4 w-4" />
                      Contactar por Email
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center gap-2 border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10">
                    <MessageCircle className="h-4 w-4" />
                    Chat em Directo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
