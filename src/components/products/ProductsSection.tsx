
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Mail, Gift, Star, Package } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const ProductsSection = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: "cápsula-completa",
      title: "Cápsula do Tempo Completa",
      description: "A experiência mais emotiva: combina presentes físicos, mensagens digitais e memórias especiais numa única entrega no futuro.",
      price: "A partir de 49€",
      icon: <Clock className="h-8 w-8" />,
      features: ["Presente físico guardado", "Mensagem personalizada", "Fotos e vídeos", "Entrega na data exata"],
      emotional: "Para momentos que merecem ser eternizados",
      image: "/lovable-uploads/a0a4d629-33c3-42a1-ac33-76dc16738d0a.png"
    },
    {
      id: "presente-fisico",
      title: "Presente Físico Guardado",
      description: "Enviamos-te uma caixa especial. Tu colocas o presente lá dentro e nós guardamos até ao dia perfeito.",
      price: "1,90€/mês",
      icon: <Gift className="h-8 w-8" />,
      features: ["Caixa de proteção incluída", "Armazenamento climatizado", "Seguro total", "Entrega garantida"],
      emotional: "Porque há presentes que só fazem sentido no momento certo",
      image: "/lovable-uploads/bf42c521-e251-4043-b3ff-6177090921b8.png"
    },
    {
      id: "mensagem-digital",
      title: "Mensagem para o Futuro",
      description: "Cartas, vídeos, fotos. Tudo protegido e entregue exatamente quando escolheres.",
      price: "9,90€",
      icon: <Mail className="h-8 w-8" />,
      features: ["Mensagem de texto", "Vídeo pessoal", "Álbum de fotos", "Verificação blockchain"],
      emotional: "Palavras que ganham vida no tempo certo",
      image: "/lovable-uploads/3125dc68-c3ff-4bea-9d5d-93026732abb8.png"
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-mist py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-steel-blue hover:text-earthy-burgundy transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <SeloDoTempoIcon size={80} className="drop-shadow-sm" />
          </div>
          
          <h1 className="text-hero text-steel-blue mb-6 leading-tight font-fraunces">
            Presentes
            <span className="text-earthy-burgundy block">com Alma</span>
          </h1>
          
          <p className="text-subtitle text-misty-gray mb-8 leading-relaxed">
            Cada presente que oferecemos carrega uma história, uma emoção, um momento especial. 
            <span className="text-earthy-burgundy font-medium"> Porque os melhores presentes são aqueles que chegam no momento perfeito.</span>
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <Card key={product.id} className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group overflow-hidden">
              <div className="relative h-32 bg-gradient-to-br from-sand-beige to-dusty-rose/20 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={`${product.title} - Selo do Tempo`}
                  className="h-20 w-20 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-earthy-burgundy/10 rounded-full flex items-center justify-center text-earthy-burgundy">
                    {product.icon}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-fraunces text-steel-blue mb-2 group-hover:text-earthy-burgundy transition-colors">
                  {product.title}
                </CardTitle>
                <p className="text-earthy-burgundy font-medium italic text-sm font-fraunces">
                  {product.emotional}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-misty-gray leading-relaxed">{product.description}</p>
                
                <ul className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <Heart className="h-4 w-4 text-earthy-burgundy mt-0.5 flex-shrink-0" />
                      <span className="text-steel-blue text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-dusty-rose/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-earthy-burgundy font-fraunces">{product.price}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-earthy-burgundy text-earthy-burgundy" />
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="brand" 
                    className="w-full group"
                    onClick={() => navigate('/register')}
                  >
                    Escolher Este Presente
                    <Package className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emotional CTA */}
        <div className="emotion-card p-8 md:p-12 text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-earthy-burgundy" />
            </div>
          </div>
          
          <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
            Não Sabes Qual Escolher?
          </h2>
          
          <p className="text-misty-gray mb-6 leading-relaxed">
            Cada pessoa é única, cada momento é especial. Deixa-nos ajudar-te a encontrar 
            o presente perfeito para a pessoa certa no momento ideal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="brand" 
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Falar com um Especialista
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
    </div>
  );
};

export default ProductsSection;
