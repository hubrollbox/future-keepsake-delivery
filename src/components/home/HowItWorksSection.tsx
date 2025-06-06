
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Calendar, Clock } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <div className="mb-16 md:mb-20 animate-fade-in">
      <h2 className="text-section-title-sm md:text-section-title text-steel-blue mb-4 md:mb-6 text-center font-fraunces">Como Funciona em 3 Passos Simples</h2>
      <p className="text-body md:text-body-large text-misty-gray mb-8 md:mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        É mais fácil do que pensas. Em poucos minutos, podes criar a tua primeira entrega temporal.
      </p>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <Card className="emotion-card text-center p-6 md:p-8 hover:shadow-soft hover:scale-105 transition-all duration-300 border border-dusty-rose/20 group">
          <CardContent className="pt-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-earthy-burgundy rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle">
              <span className="text-white font-bold text-xl md:text-2xl">1</span>
            </div>
            <Gift className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6" />
            <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue font-fraunces">Escolhe o Tipo de Presente</h3>
            <p className="text-misty-gray text-sm md:text-base leading-relaxed">
              Presente físico que guardamos por ti, mensagem digital especial ou uma cápsula do tempo completa com múltiplos elementos
            </p>
          </CardContent>
        </Card>

        <Card className="emotion-card text-center p-6 md:p-8 hover:shadow-soft hover:scale-105 transition-all duration-300 border border-dusty-rose/20 group">
          <CardContent className="pt-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-earthy-burgundy rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle">
              <span className="text-white font-bold text-xl md:text-2xl">2</span>
            </div>
            <Calendar className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6" />
            <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue font-fraunces">Define Quando e Para Quem</h3>
            <p className="text-misty-gray text-sm md:text-base leading-relaxed">
              Escolhe a data exacta da entrega (pode ser daqui a meses ou anos) e define o destinatário. Podes enviá-lo para ti próprio ou para alguém especial
            </p>
          </CardContent>
        </Card>

        <Card className="emotion-card text-center p-6 md:p-8 hover:shadow-soft hover:scale-105 transition-all duration-300 border border-dusty-rose/20 group">
          <CardContent className="pt-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-earthy-burgundy rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle">
              <span className="text-white font-bold text-xl md:text-2xl">3</span>
            </div>
            <Clock className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6" />
            <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue font-fraunces">Relaxa, Nós Tratamos do Resto</h3>
            <p className="text-misty-gray text-sm md:text-base leading-relaxed">
              Armazenamento ultra-seguro e entrega garantida na data exacta. Recebes notificações sobre o progresso e podes acompanhar tudo no teu painel
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSection;
