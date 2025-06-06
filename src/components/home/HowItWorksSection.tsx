
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Package, Heart, Mail } from "lucide-react";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Heart,
      title: "Escolhe o Momento",
      description: "Define quando queres que a tua mensagem ou presente seja entregue. Pode ser daqui a dias, meses ou anos."
    },
    {
      icon: Mail,
      title: "Cria a Tua Mensagem",
      description: "Escreve cartas, grava vídeos, ou escolhe um presente físico para guardar até ao momento perfeito."
    },
    {
      icon: Package,
      title: "Guardamos com Segurança",
      description: "As tuas memórias ficam protegidas nos nossos sistemas seguros ou armazém climatizado."
    },
    {
      icon: Clock,
      title: "Entregamos na Hora Certa",
      description: "No momento exato que definiste, a tua mensagem ou presente será entregue como prometido."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fraunces font-bold text-steel-blue mb-6">
              Como <span className="text-earthy-burgundy">Funciona</span>
            </h2>
            <p className="text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
              Em apenas quatro passos simples, podes criar uma experiência inesquecível para o futuro.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-earthy-burgundy/20 transition-colors">
                    <step.icon className="h-10 w-10 text-earthy-burgundy" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-earthy-burgundy text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-fraunces font-semibold text-steel-blue mb-3">{step.title}</h3>
                <p className="text-misty-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="emotion-card p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-fraunces font-semibold text-steel-blue mb-4">
                Pronto para Começar?
              </h3>
              <p className="text-misty-gray mb-6 leading-relaxed">
                Cria a tua primeira entrega temporal em menos de 5 minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="brand"
                  onClick={() => navigate('/register')}
                  className="group"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="brand-outline" 
                  size="lg" 
                  onClick={() => navigate('/how-it-works')}
                >
                  Saber Mais
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
