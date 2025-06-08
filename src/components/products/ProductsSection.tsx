
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Clock, Star, Calendar, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductsSection = () => {
  const navigate = useNavigate();

  const products = [
    {
      title: "Carta Digital Simples",
      description: "Uma mensagem do coração, guardada até ao momento perfeito",
      price: "Grátis",
      originalPrice: null,
      icon: Heart,
      features: ["Mensagem de texto", "Data programada", "Entrega por email"],
      popular: false,
      category: "Digital"
    },
    {
      title: "Carta Digital Premium",
      description: "Mensagem com verificação blockchain e formatação especial",
      price: "2,50€",
      originalPrice: null,
      icon: Star,
      features: ["Verificação blockchain", "Formatação rica", "Certificado de autenticidade"],
      popular: true,
      category: "Digital"
    },
    {
      title: "Presente Físico Guardado",
      description: "Guardamos o teu presente numa instalação ultra-segura",
      price: "Desde 1,90€/mês",
      originalPrice: null,
      icon: Gift,
      features: ["Armazenamento seguro", "Controlo climático", "Seguro incluído"],
      popular: false,
      category: "Físico"
    },
    {
      title: "Cápsula Individual",
      description: "Caixa personalizada para pequenos objectos e memórias",
      price: "Desde 15€",
      originalPrice: null,
      icon: Package,
      features: ["Caixa personalizada", "Múltiplos objectos", "Cerimónia de abertura"],
      popular: false,
      category: "Cápsula"
    },
    {
      title: "Cápsula Premium",
      description: "Experiência completa com fechadura especial e maior capacidade",
      price: "Desde 25€",
      originalPrice: null,
      icon: Clock,
      features: ["Fechadura especial", "Maior capacidade", "Documentação especial"],
      popular: true,
      category: "Cápsula"
    },
    {
      title: "Cápsula Coletiva",
      description: "Perfeita para eventos, escolas, empresas e grupos especiais",
      price: "Desde 49€",
      originalPrice: null,
      icon: Calendar,
      features: ["Para grupos", "Múltiplas contribuições", "Evento especial"],
      popular: false,
      category: "Cápsula"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-fraunces font-bold text-steel-blue mb-6 leading-tight">
          Presentes com Alma
          <span className="text-earthy-burgundy block">Para Quem Amas</span>
        </h1>
        <p className="text-xl text-misty-gray mb-8 leading-relaxed max-w-3xl mx-auto">
          Cada presente é uma promessa ao futuro, guardada com o carinho do presente. 
          Escolhe como queres tocar o coração de quem amas no momento perfeito.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product, index) => (
          <Card key={index} className="emotion-card hover:shadow-soft hover:scale-105 transition-all duration-300 border border-dusty-rose/20 group relative">
            {product.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-earthy-burgundy text-white">
                Mais Popular
              </Badge>
            )}
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <product.icon className="h-8 w-8 text-earthy-burgundy" />
              </div>
              
              <h3 className="text-xl font-semibold text-steel-blue mb-3 text-center font-fraunces">
                {product.title}
              </h3>
              
              <p className="text-misty-gray text-sm mb-4 text-center leading-relaxed">
                {product.description}
              </p>
              
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-earthy-burgundy">
                  {product.price}
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-misty-gray line-through">
                    {product.originalPrice}
                  </div>
                )}
              </div>
              
              <ul className="space-y-2 mb-6">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-misty-gray">
                    <Star className="h-4 w-4 text-dusty-rose mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="brand"
                className="w-full"
                onClick={() => navigate('/register')}
              >
                Escolher Este Presente
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Services */}
      <div className="emotion-card p-8 text-center">
        <h2 className="text-3xl font-fraunces font-bold text-steel-blue mb-6">
          Serviços Adicionais
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4">
            <h3 className="font-semibold text-steel-blue mb-2 font-fraunces">Edição de Vídeo Profissional</h3>
            <p className="text-misty-gray text-sm mb-2">Vídeo editado profissionalmente (até 1 minuto)</p>
            <p className="text-earthy-burgundy font-bold">9,90€</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-steel-blue mb-2 font-fraunces">Serviço de Compra</h3>
            <p className="text-misty-gray text-sm mb-2">Compramos o produto por ti para entrega futura</p>
            <p className="text-earthy-burgundy font-bold">10% + 5€ mín.</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-steel-blue mb-2 font-fraunces">Entrega Programada</h3>
            <p className="text-misty-gray text-sm mb-2">Entrega em Portugal Continental na data exacta</p>
            <p className="text-earthy-burgundy font-bold">Desde 6,50€</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-fraunces font-bold text-steel-blue mb-4">
          Não Sabes Qual Escolher?
        </h2>
        <p className="text-misty-gray mb-8 max-w-2xl mx-auto">
          A nossa equipa está aqui para te ajudar a encontrar o presente perfeito para cada momento especial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="brand"
            onClick={() => navigate('/contact')}
          >
            Falar com a Nossa Equipa
          </Button>
          <Button 
            variant="brand-outline" 
            size="lg" 
            onClick={() => navigate('/how-it-works')}
          >
            Como Funciona
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
