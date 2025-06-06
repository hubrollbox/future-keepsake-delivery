
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Calendar, Clock, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: Gift,
      title: "Escolhe o Tipo de Presente",
      description: "Presente físico que guardamos por ti, mensagem digital especial ou uma cápsula do tempo completa com múltiplos elementos."
    },
    {
      number: 2,
      icon: Calendar,
      title: "Define Quando e Para Quem",
      description: "Escolhe a data exacta da entrega (pode ser daqui a meses ou anos) e define o destinatário. Podes enviá-lo para ti próprio ou para alguém especial."
    },
    {
      number: 3,
      icon: Clock,
      title: "Relaxa, Nós Tratamos do Resto",
      description: "Armazenamento ultra-seguro e entrega garantida na data exacta. Recebes notificações sobre o progresso e podes acompanhar tudo no teu painel."
    }
  ];

  return (
    <div className="emotional-spacing">
      <div className="text-center mb-12">
        <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
          Como Funciona em
          <span className="text-earthy-burgundy"> 3 Passos Simples</span>
        </h2>
        <p className="text-body-large text-misty-gray mb-8 leading-relaxed max-w-3xl mx-auto">
          É mais fácil do que pensas. Em poucos minutos, podes criar a tua primeira entrega temporal. 
          <span className="text-earthy-burgundy font-medium"> Deixa que te guiemos nesta jornada.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <Card className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group text-center h-full">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-earthy-burgundy rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl font-fraunces">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-earthy-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-6 w-6 text-earthy-burgundy" />
                  </div>
                </div>

                <h3 className="font-bold mb-3 text-lg text-steel-blue font-fraunces group-hover:text-earthy-burgundy transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-misty-gray text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>

            {/* Arrow for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-earthy-burgundy" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksSection;
