
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Package, Clock, ArrowRight } from "lucide-react";

const ProductsSection = () => {
  const navigate = useNavigate();

  const products = [
    {
      icon: Mail,
      title: "Mensagens Digitais",
      subtitle: "Cartas do Coração",
      description: "Escreve cartas, grava vídeos ou envia ficheiros que só serão revelados no momento perfeito. Ideal para declarações de amor, conselhos para o futuro ou memórias especiais.",
      features: ["Vídeos e áudios", "Documentos e fotos", "Encriptação total", "Entrega garantida"],
      price: "Grátis",
      highlight: false
    },
    {
      icon: Package,
      title: "Presentes Físicos",
      subtitle: "Presentes com Alma",
      description: "Guarda presentes físicos no nosso armazém seguro até à data de entrega. Perfeito para aniversários especiais, formaturas ou marcos importantes da vida.",
      features: ["Armazenamento seguro", "Controlo climático", "Seguro incluído", "Entrega na data exata"],
      price: "Desde 1,90€/mês",
      highlight: true
    },
    {
      icon: Clock,
      title: "Cápsulas do Tempo",
      subtitle: "Experiências Completas",
      description: "Combina mensagens digitais e presentes físicos numa experiência única. Cria verdadeiras cápsulas do tempo para momentos extraordinários.",
      features: ["Digital + Físico", "Experiência personalizada", "Múltiplas entregas", "Apoio dedicado"],
      price: "Personalizado",
      highlight: false
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-lavender-mist">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fraunces font-bold text-steel-blue mb-6">
              Os Nossos <span className="text-earthy-burgundy">Presentes com Alma</span>
            </h2>
            <p className="text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
              Cada produto foi pensado para criar momentos únicos e inesquecíveis. 
              Escolhe a forma perfeita de enviar o teu amor através do tempo.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {products.map((product, index) => (
              <div 
                key={index} 
                className={`emotion-card p-8 h-full flex flex-col relative ${
                  product.highlight 
                    ? 'border-2 border-earthy-burgundy shadow-lg scale-105 bg-white' 
                    : 'border border-dusty-rose/20'
                } hover:scale-105 transition-all duration-300 group`}
              >
                {product.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-earthy-burgundy text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-earthy-burgundy/20 transition-colors">
                    <product.icon className="h-8 w-8 text-earthy-burgundy" />
                  </div>
                  <h3 className="text-2xl font-fraunces font-bold text-steel-blue mb-2">{product.title}</h3>
                  <p className="text-dusty-rose font-medium italic">{product.subtitle}</p>
                </div>

                <div className="flex-1">
                  <p className="text-misty-gray leading-relaxed mb-6">{product.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-earthy-burgundy rounded-full flex-shrink-0"></div>
                        <span className="text-steel-blue font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-fraunces font-bold text-earthy-burgundy mb-6">{product.price}</p>
                  <Button 
                    variant={product.highlight ? "brand" : "brand-outline"}
                    className="w-full group"
                    onClick={() => navigate('/register')}
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="emotion-card p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-fraunces font-semibold text-steel-blue mb-4">
                Não Sabes Qual Escolher?
              </h3>
              <p className="text-misty-gray mb-6 leading-relaxed">
                A nossa equipa está aqui para te ajudar a criar a experiência perfeita para o teu momento especial.
              </p>
              <Button 
                variant="brand-outline" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Falar com a Nossa Equipa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
