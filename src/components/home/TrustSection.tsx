
import { Shield, CheckCircle, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TrustSection = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Instalações monitorizadas 24/7, controlo climático e seguro total contra todos os riscos.",
      highlight: "100% Protegido"
    },
    {
      icon: CheckCircle,
      title: "Tecnologia Inovadora",
      description: "Plataforma desenvolvida com as mais recentes tecnologias para garantir precisão nas entregas.",
      highlight: "Entrega Garantida"
    },
    {
      icon: MapPin,
      title: "Empresa Portuguesa",
      description: "Sediada em Matosinhos, com apoio local dedicado e equipa que fala a tua língua.",
      highlight: "Apoio Nacional"
    }
  ];

  return (
    <div className="emotional-spacing">
      <div className="emotion-card p-8 md:p-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-earthy-burgundy" />
            </div>
          </div>
          
          <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
            Porque Confiar em Nós?
          </h2>
          
          <p className="text-body-large text-misty-gray mb-8 leading-relaxed max-w-3xl mx-auto">
            Somos uma empresa <span className="text-earthy-burgundy font-semibold">100% portuguesa</span> focada em preservar as tuas memórias com total segurança e carinho.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <Card key={index} className="bg-lavender-mist/50 border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-earthy-burgundy/20 transition-colors duration-300">
                  <point.icon className="h-8 w-8 text-earthy-burgundy" />
                </div>
                
                <h3 className="font-bold mb-3 text-lg text-steel-blue font-fraunces group-hover:text-earthy-burgundy transition-colors">
                  {point.title}
                </h3>
                
                <p className="text-misty-gray text-sm leading-relaxed mb-4">
                  {point.description}
                </p>
                
                <span className="inline-block px-3 py-1 bg-earthy-burgundy text-white text-xs rounded-full font-semibold">
                  {point.highlight}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
