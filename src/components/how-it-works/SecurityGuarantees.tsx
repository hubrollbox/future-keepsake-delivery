
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, CheckCircle } from "lucide-react";

const SecurityGuarantees = () => {
  return (
    <div className="mb-12 md:mb-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-keepla-black mb-8 md:mb-12 text-center font-inter">
        Segurança e <span className="text-keepla-red">Garantias</span>
      </h2>
      <p className="text-lg md:text-xl text-keepla-gray-700 mb-8 md:mb-10 text-center max-w-4xl mx-auto leading-relaxed font-inter">
        A tua confiança é sagrada. Por isso, implementámos as <strong className="text-keepla-red">mais altas normas de segurança</strong> da indústria.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {[
          { 
            icon: Shield, 
            title: "Armazém Ultra-Seguro", 
            desc: "Vigilância 24/7 com câmaras HD, controlo de temperatura e humidade, e seguro total contra danos, roubo e catástrofes naturais" 
          },
          { 
            icon: Users, 
            title: "Guardiões Especializados", 
            desc: "Equipa dedicada e treinada para cuidar dos teus presentes com o máximo cuidado. Cada item é tratado como se fosse nosso" 
          },
          { 
            icon: CheckCircle, 
            title: "Garantia Total", 
            desc: "Reembolso completo se algo correr mal. Cobertura de seguro até €10.000 por entrega. O teu tempo merece total confiança" 
          }
        ].map((item, index) => (
          <Card key={index} className="text-center p-6 md:p-8 hover:shadow-md transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-keepla-red/20 group">
            <CardContent className="pt-6">
              <item.icon className="h-16 w-16 md:h-20 md:w-20 text-keepla-red mx-auto mb-4 md:mb-6" />
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-keepla-black font-inter">{item.title}</h3>
              <p className="text-keepla-gray-700 text-sm md:text-base leading-relaxed font-inter">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityGuarantees;
