import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PhotoBackground from "@/components/layout/PhotoBackground";
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
import ruaPalacioImage from "@/assets/rua-palacio.jpg";

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
    <div className="min-h-screen bg-keepla-black">
      <Navigation />
      
      {/* Hero Section with Photo Background */}
      <PhotoBackground 
        image={ruaPalacioImage} 
        alt="Rua do Palácio"
        overlay="dark"
        className="min-h-[40vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-inter font-bold text-keepla-white mb-4">
            Suporte & Perguntas Frequentes
          </h1>
          <p className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter">
            Encontra respostas para as tuas questões sobre cápsulas do tempo e os nossos serviços.
          </p>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={`faq-${faq.question.slice(0, 20).replace(/\s+/g, '-')}-${index}`} value={`item-${index}`}>
                  <Card className="border-keepla-red/20">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h3 className="text-left font-semibold text-keepla-black font-inter">
                        {faq.question}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed font-inter">
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
            <Card className="bg-keepla-black border-0">
              <CardHeader>
                <CardTitle className="text-keepla-white font-inter">
                  Ainda tens dúvidas?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-keepla-white/70 font-inter">
                  A nossa equipa está sempre disponível para te ajudar com qualquer questão sobre as tuas cápsulas do tempo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="flex items-center gap-2 bg-keepla-red hover:bg-keepla-red/90 text-keepla-white font-inter">
                      <Mail className="h-4 w-4" />
                      Contactar por Email
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center gap-2 border-keepla-white text-keepla-white hover:bg-keepla-white/10 font-inter">
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
