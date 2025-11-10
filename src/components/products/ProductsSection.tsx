

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { 
  Star, 
  Package, 
  Gift, 
  Lock, 
  Users, 
  Video, 
  ShoppingCart, 
  Truck,
  Mail
} from "lucide-react";

const ProductsSection = () => {
  const { addToCart } = useCart();
  
  const iconMap = {
    star: Star,
    package: Package,
    gift: Gift,
    lock: Lock,
    users: Users,
    video: Video,
    'shopping-cart': ShoppingCart,
    truck: Truck,
    mail: Mail
  };

  const digitalProducts = [
    {
      id: "digital-letter-simple",
      name: "Carta Digital Simples",
      price: "Grátis",
      priceValue: 0,
      icon: "mail",
      description: "Texto entregue por email na data marcada",
      poetry: "Palavras que atravessam o tempo"
    },
    {
      id: "digital-letter-premium",
      name: "Carta Digital Premium",
      price: "2,50 €",
      priceValue: 2.50,
      icon: "star",
      description: "Formatação rica, verificação blockchain, certificado",
      poetry: "Elegância digital para memórias eternas"
    }
  ];

  const physicalProducts = [
    {
      id: "physical-gift-storage",
      name: "Presente Físico Guardado",
      price: "desde 1,90€/mês",
      priceValue: 1.90,
      icon: "package",
      description: "Armazenamento seguro com controlo climático",
      poetry: "Guardamos os teus tesouros até ao momento certo"
    },
    {
      id: "capsule-individual",
      name: "Cápsula Individual",
      price: "desde 15 €",
      priceValue: 15,
      icon: "gift",
      description: "Caixa personalizada para um presente simbólico",
      poetry: "Um cofre único para o teu gesto mais precioso"
    },
    {
      id: "capsule-collective",
      name: "Cápsula Coletiva",
      price: "desde 49 €",
      priceValue: 49,
      icon: "users",
      description: "Para grupos, com evento de abertura",
      poetry: "Memórias partilhadas, momentos inesquecíveis",
      popular: true
    }
  ];

  const additionalServices = [
    {
      id: "video-editing",
      name: "Edição de Vídeo Profissional",
      price: "9,90 €",
      priceValue: 9.90,
      icon: "video",
      description: "Vídeo editado profissionalmente (até 1 minuto)",
      poetry: "Transformamos momentos em cinema"
    },
    {
      id: "purchase-service",
      name: "Serviço de Compra",
      price: "10% + 5 € mín.",
      priceValue: 5,
      icon: "shopping-cart",
      description: "Compramos o produto por ti",
      poetry: "Encontramos e guardamos aquilo que mais importa"
    },
    {
      id: "scheduled-delivery",
      name: "Entrega Programada",
      price: "desde 6,50 €",
      priceValue: 6.50,
      icon: "truck",
      description: "Entrega em Portugal Continental na data exacta",
      poetry: "Pontualidade que honra cada momento especial"
    }
  ];

  interface Product {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  icon: string;
  description: string;
  poetry: string;
  popular?: boolean;
}

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, product.name, product.priceValue);
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho");
    }
  };

const ProductCard = ({ product, category }: { product: Product, category: string }) => {
    const IconComponent = iconMap[product.icon as keyof typeof iconMap] || Gift;
    
    return (
      <Card className="h-full border-keepla-gray/20 hover:border-keepla-red/40 transition-all duration-300 hover:shadow-keepla-sm bg-keepla-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-keepla-red/10">
                <IconComponent className="h-5 w-5 text-keepla-red" />
              </div>
              <div>
                <CardTitle className="text-lg text-keepla-black font-serif">
                  {product.name}
                </CardTitle>
                <Badge variant="outline" className="mt-1 text-xs border-keepla-gray/30 text-keepla-black">
                  {category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-keepla-black">
                {product.price}
              </div>
              {product.popular && (
                <Badge className="mt-2 bg-keepla-red text-keepla-white">Popular</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-keepla-black mb-3">
            {product.description}
          </p>
          <p className="text-sm italic text-keepla-red font-serif mb-4">
            "{product.poetry}"
          </p>
          <Button
            onClick={() => handleAddToCart(product)}
            variant="brand"
            size="sm"
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="py-16 bg-keepla-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-keepla-black mb-4">
            Presentes com Alma
          </h1>
          <p className="text-lg text-keepla-black max-w-2xl mx-auto">
            Cada presente é uma ponte entre o presente e o futuro, carregando o peso precioso das nossas intenções.
          </p>
        </div>

        {/* Produtos Digitais */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
            Produtos Digitais
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {digitalProducts.map((product, index) => (
              <ProductCard key={index} product={product} category="Digital" />
            ))}
          </div>
        </div>

        {/* Produtos Físicos */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
            Produtos Físicos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {physicalProducts.map((product, index) => (
              <ProductCard key={index} product={product} category="Físico" />
            ))}
          </div>
        </div>

        {/* Serviços Adicionais */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
            Serviços Adicionais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((product, index) => (
              <ProductCard key={index} product={product} category="Serviço" />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/create-keepsake">
            <Button variant="brand" size="lg" className="px-8 py-3">
              Criar a Minha Cápsula
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
