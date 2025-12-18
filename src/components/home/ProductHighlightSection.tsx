
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Gift, Clock, Star } from "lucide-react";

const ProductHighlightSection = () => {
  const navigate = useNavigate();

  const products = [
    {
      title: "Cápsula do Tempo Digital",
      description: "Mensagens, fotos e vídeos guardados com tecnologia blockchain até ao momento perfeito",
      price: "Desde 2,50€",
      icon: Clock,
      features: ["Verificação de autenticidade", "Entrega programada", "Formato digital"]
    },
    {
      title: "Presente Físico Guardado",
      description: "Guardamos o teu presente numa instalação segura até à data de entrega",
      price: "Desde 1,90€/mês",
      icon: Gift,
      features: ["Armazenamento seguro", "Controlo climático", "Entrega garantida"]
    },
    {
      title: "Cápsula Completa",
      description: "Combina elementos físicos e digitais numa experiência única e personalizada",
      price: "Desde 15€",
      icon: Heart,
      features: ["Experiência híbrida", "Personalização total", "Momentos especiais"]
    }
  ];

  return (
    <div className="mb-16 md:mb-20 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-section-title-sm md:text-section-title text-steel-blue mb-4 md:mb-6 font-fraunces">
          Presentes com Alma
        </h2>
        <p className="text-body md:text-body-large text-misty-gray mb-8 max-w-3xl mx-auto leading-relaxed">
          Cada presente é uma promessa ao futuro, guardada com o carinho do presente. 
          <span className="text-dusty-rose font-medium"> Escolhe como queres tocar o coração de quem amas.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
        {products.map((product, index) => (
          <Card key={index} className="emotion-card hover:shadow-md hover:scale-105 transition-all duration-300 border border-keepla-red/20 group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <product.icon className="h-10 w-10 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-semibold text-steel-blue mb-3 font-fraunces">{product.title}</h3>
              <p className="text-misty-gray text-sm mb-4 leading-relaxed">{product.description}</p>
              <div className="text-lg font-bold text-earthy-burgundy mb-4">{product.price}</div>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-misty-gray">
                    <Star className="h-4 w-4 text-dusty-rose mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          size="lg" 
          variant="brand"
          onClick={() => navigate('/products')}
          className="px-12 py-6 text-lg"
        >
          Descobrir Todos os Presentes
        </Button>
      </div>
    </div>
  );
};

export default ProductHighlightSection;
