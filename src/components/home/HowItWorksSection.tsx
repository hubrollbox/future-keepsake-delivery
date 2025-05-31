
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Calendar, Clock } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-black mb-4">Como Funciona em 3 Passos Simples</h3>
      <p className="text-lg text-gray-600 mb-8">É mais fácil do que pensas. Em poucos minutos, podes criar a tua primeira entrega temporal.</p>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">1</span>
            </div>
            <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-lg text-black">Escolhe o Tipo de Presente</h4>
            <p className="text-gray-600 text-sm">
              Presente físico que guardamos por ti, mensagem digital especial ou uma cápsula do tempo completa com múltiplos elementos
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">2</span>
            </div>
            <Calendar className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-lg text-black">Define Quando e Para Quem</h4>
            <p className="text-gray-600 text-sm">
              Escolhe a data exacta da entrega (pode ser daqui a meses ou anos) e define o destinatário. Podes enviá-lo para ti próprio ou para alguém especial
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gold bg-white">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">3</span>
            </div>
            <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-lg text-black">Relaxa, Nós Tratamos do Resto</h4>
            <p className="text-gray-600 text-sm">
              Armazenamento ultra-seguro e entrega garantida na data exacta. Recebes notificações sobre o progresso e podes acompanhar tudo no teu painel
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSection;
