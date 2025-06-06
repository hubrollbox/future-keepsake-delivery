
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Gift, Clock, Mail, ArrowRight, Heart } from "lucide-react";

const ProductHighlightSection = () => {
  const navigate = useNavigate();

  const highlights = [
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Cápsula do Tempo Completa",
      description: "A experiência mais emotiva: presente físico + mensagem digital numa única entrega no futuro.",
      price: "A partir de 49€",
      color: "earthy-burgundy"
    },
    {
      icon: <Gift className="h-12 w-12" />,
      title: "Presente Físico Guardado",
      description: "Guardamos o teu presente em segurança até ao dia perfeito da entrega.",
      price: "1,90€/mês",
      color: "dusty-rose"
    },
    {
      icon: <Mail className="h-12 w-12" />,
      title: "Mensagem para o Futuro",
      description: "Cartas, vídeos, fotos. Protegidas e entregues no momento que escolheres.",
      price: "9,90€",
      color: "steel-blue"
    }
  ];

  return (
    <div className="emotional-spacing bg-gradient-to-br from-sand-beige/30 to-lavender-mist rounded-3xl p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
          Presentes
          <span className="text-earthy-burgundy"> com Alma</span>
        </h2>
        <p className="text-body-large text-misty-gray leading-relaxed max-w-3xl mx-auto">
          Cada presente carrega uma história, uma emoção, um momento especial. 
          <span className="text-earthy-burgundy font-medium"> Descobre qual toca mais o teu coração.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {highlights.map((highlight, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group text-center">
            <CardContent className="p-6">
              <div className={`w-20 h-20 bg-${highlight.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-${highlight.color} group-hover:scale-110 transition-transform duration-300`}>
                {highlight.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-steel-blue mb-2 font-fraunces group-hover:text-earthy-burgundy transition-colors">
                {highlight.title}
              </h3>
              
              <p className="text-misty-gray text-sm leading-relaxed mb-4">
                {highlight.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-earthy-burgundy font-bold font-fraunces">
                  {highlight.price}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} className="h-3 w-3 fill-earthy-burgundy text-earthy-burgundy" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          variant="brand" 
          size="lg"
          onClick={() => navigate('/products')}
          className="group"
        >
          Ver Todos os Presentes com Alma
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ProductHighlightSection;
