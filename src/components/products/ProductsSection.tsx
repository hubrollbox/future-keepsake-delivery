

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
      name: "Carta Digital Simples",
      price: "Grátis",
      icon: "mail",
      description: "Texto entregue por email na data marcada",
      poetry: "Palavras que atravessam o tempo"
    },
    {
      name: "Carta Digital Premium",
      price: "2,50 €",
      icon: "star",
      description: "Formatação rica, verificação blockchain, certificado",
      poetry: "Elegância digital para memórias eternas"
    }
  ];

  const physicalProducts = [
    {
      name: "Presente Físico Guardado",
      price: "desde 1,90€/mês",
      icon: "package",
      description: "Armazenamento seguro com controlo climático",
      poetry: "Guardamos os teus tesouros até ao momento certo"
    },
    {
      name: "Cápsula Individual",
      price: "desde 15 €",
      icon: "gift",
      description: "Caixa personalizada para um presente simbólico",
      poetry: "Um cofre único para o teu gesto mais precioso"
    },
    {
      name: "Cápsula Premium",
      price: "desde 25 €",
      icon: "lock",
      description: "Com fechadura, maior capacidade e documentação",
      poetry: "Segurança e beleza para os momentos mais importantes"
    },
    {
      name: "Cápsula Coletiva",
      price: "desde 49 €",
      icon: "users",
      description: "Para grupos, com evento de abertura",
      poetry: "Memórias partilhadas, momentos inesquecíveis"
    }
  ];

  const additionalServices = [
    {
      name: "Edição de Vídeo Profissional",
      price: "9,90 €",
      icon: "video",
      description: "Vídeo editado profissionalmente (até 1 minuto)",
      poetry: "Transformamos momentos em cinema"
    },
    {
      name: "Serviço de Compra",
      price: "10% + 5 € mín.",
      icon: "shopping-cart",
      description: "Compramos o produto por ti",
      poetry: "Encontramos e guardamos aquilo que mais importa"
    },
    {
      name: "Entrega Programada",
      price: "desde 6,50 €",
      icon: "truck",
      description: "Entrega em Portugal Continental na data exacta",
      poetry: "Pontualidade que honra cada momento especial"
    }
  ];

  interface Product {
  name: string;
  price: string;
  icon: string;
  description: string;
  poetry: string;
}

const ProductCard = ({ product, category }: { product: Product, category: string }) => {
    const IconComponent = iconMap[product.icon as keyof typeof iconMap] || Gift;
    
    return (
      <Card className="h-full border-dusty-rose/20 hover:border-dusty-rose/40 transition-all duration-300 hover:shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-dusty-rose/10">
                <IconComponent className="h-5 w-5 text-dusty-rose" />
              </div>
              <div>
                <CardTitle className="text-lg text-steel-blue font-serif">
                  {product.name}
                </CardTitle>
                <Badge variant="outline" className="mt-1 text-xs border-dusty-rose/30 text-dusty-rose">
                  {category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-steel-blue">
                {product.price}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-misty-gray mb-3">
            {product.description}
          </p>
          <p className="text-sm italic text-dusty-rose font-serif mb-4">
            "{product.poetry}"
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="py-16 bg-lavender-mist">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-steel-blue mb-4">
            Presentes com Alma
          </h1>
          <p className="text-lg text-misty-gray max-w-2xl mx-auto">
            Cada presente é uma ponte entre o presente e o futuro, carregando o peso precioso das nossas intenções.
          </p>
        </div>

        {/* Produtos Digitais */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-steel-blue mb-6 text-center">
            Produtos Digitais
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {digitalProducts.map((product, index) => (
              <ProductCard key={index} product={product} category="Digital" />
            ))}
          </div>
        </div>

        {/* Produtos Físicos */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-steel-blue mb-6 text-center">
            Produtos Físicos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {physicalProducts.map((product, index) => (
              <ProductCard key={index} product={product} category="Físico" />
            ))}
          </div>
        </div>

        {/* Serviços Adicionais */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-steel-blue mb-6 text-center">
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
            <Button className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-semibold shadow-soft hover:opacity-90 transition-all">
              Criar a Minha Cápsula
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
