
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Mail, Heart, Star } from "lucide-react";

const DeliveryTypesSection = () => {
  const deliveryTypes = [
    {
      icon: Gift,
      title: "Presente Físico",
      description: "Guardamos o teu presente numa instalação segura e climatizada. Desde jóias a livros, cartas a brinquedos.",
      price: "A partir de 1,90€/mês",
      emotional: "Para presentes que precisam de ser tocados",
      features: ["Caixa de proteção", "Seguro incluído", "Controlo climático"]
    },
    {
      icon: Mail,
      title: "Mensagem Digital",
      description: "Cartas escritas do coração, vídeos pessoais, fotos especiais. Tudo protegido com tecnologia blockchain.",
      price: "A partir de 9,90€",
      emotional: "Para palavras que ganham vida no tempo certo",
      features: ["Verificação blockchain", "Múltiplos formatos", "Entrega garantida"]
    },
    {
      icon: Heart,
      title: "Cápsula do Tempo",
      description: "Combina elementos físicos e digitais numa experiência única. Perfeito para marcos importantes da vida.",
      price: "Experiências personalizadas",
      emotional: "Para momentos que merecem ser eternizados",
      features: ["Presente + mensagem", "Design personalizado", "Experiência completa"]
    }
  ];

  return (
    <div className="emotional-spacing">
      <div className="text-center mb-12">
        <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
          Três Formas de
          <span className="text-earthy-burgundy"> Viajar no Tempo</span>
        </h2>
        <p className="text-body-large text-misty-gray mb-8 leading-relaxed max-w-3xl mx-auto">
          Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos. 
          <span className="text-earthy-burgundy font-medium"> Qual toca mais o teu coração?</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {deliveryTypes.map((type, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group text-center overflow-hidden">
            <div className="bg-gradient-to-br from-sand-beige/30 to-dusty-rose/10 p-6">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-earthy-burgundy/20 transition-colors duration-300">
                <type.icon className="h-8 w-8 text-earthy-burgundy" />
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="font-bold mb-2 text-lg text-steel-blue font-fraunces group-hover:text-earthy-burgundy transition-colors">
                {type.title}
              </h3>
              
              <p className="text-earthy-burgundy italic text-sm font-fraunces mb-3">
                {type.emotional}
              </p>
              
              <p className="text-misty-gray text-sm mb-4 leading-relaxed">
                {type.description}
              </p>

              <div className="space-y-3 mb-4">
                {type.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-center space-x-2">
                    <Star className="h-3 w-3 text-earthy-burgundy fill-earthy-burgundy" />
                    <span className="text-steel-blue text-xs">{feature}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-earthy-burgundy font-semibold font-fraunces">
                {type.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTypesSection;
