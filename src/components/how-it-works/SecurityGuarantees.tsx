
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, CheckCircle } from "lucide-react";

const SecurityGuarantees = () => {
  return (
    <div className="mb-12 md:mb-20">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Segurança e Garantias</h3>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: Shield, title: "Armazém Seguro", desc: "Vigilância 24/7, controlo climático e seguro total contra danos" },
          { icon: Users, title: "Guardiões Dedicados", desc: "Equipa especializada para cuidar dos teus presentes temporais" },
          { icon: CheckCircle, title: "Garantia Total", desc: "Reembolso completo se algo correr mal. O teu tempo merece confiança." }
        ].map((item, index) => (
          <Card key={index} className="text-center p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <item.icon className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-4 md:mb-6" />
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">{item.title}</h4>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityGuarantees;
