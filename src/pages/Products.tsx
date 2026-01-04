import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import PhotoBackground from "@/components/layout/PhotoBackground";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Star, 
  Users, 
  PenTool, 
  Gift, 
  Package, 
  Heart,
  Check,
  Clock,
  ShoppingCart,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import memorialImage from "@/assets/memorial-pc.jpg";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  icon: string | null;
  poetry: string | null;
  type: string;
  stock: number;
  active: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  mail: Mail,
  star: Star,
  users: Users,
  "pen-tool": PenTool,
  gift: Gift,
  package: Package,
  heart: Heart,
};

const Products = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (product.price === 0) {
      if (!user) {
        navigate("/register");
        return;
      }
      navigate("/create-keepsake");
      return;
    }

    if (!user) {
      toast.error("Faz login para continuar");
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id, product.name, product.price);
      toast.success(`${product.name} adicionado ao carrinho!`);
      navigate("/checkout");
    } catch {
      toast.error("Erro ao adicionar produto ao carrinho");
    }
  };

  const getProductsByType = (type: string) => {
    return products.filter((p) => p.type === type);
  };

  const getFeatures = (poetry: string | null) => {
    if (!poetry) return [];
    return poetry.split(" • ").filter(Boolean);
  };

  const digitalProducts = getProductsByType("digital");
  const physicalProducts = getProductsByType("physical");
  const bundles = getProductsByType("bundle");

  if (loading) {
    return (
      <div className="min-h-screen bg-keepla-black">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepla-red mx-auto" />
            <p className="text-keepla-white/70 mt-4">A carregar catálogo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-keepla-black">
      <SEOHead
        title="Catálogo de Produtos - Keepla"
        description="Descobre todas as formas de guardar e enviar memórias através do tempo. Mensagens digitais, cápsulas físicas e muito mais."
        keywords="keepla produtos, cápsula tempo, carta futuro, presente memória"
      />
      <Navigation />

      {/* Hero Section with Photo Background */}
      <PhotoBackground 
        image={memorialImage} 
        alt="Memorial de memórias"
        overlay="dark"
        className="min-h-[50vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <Badge className="bg-keepla-white/20 text-keepla-white border-0 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Catálogo Completo
          </Badge>
          <h1 className="text-4xl md:text-6xl font-inter font-bold text-keepla-white mb-6">
            Presentes com <span className="text-keepla-red">Alma</span>
          </h1>
          <p className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter">
            Cada presente é uma ponte entre o presente e o futuro, carregando o
            peso precioso das nossas intenções e emoções.
          </p>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white">
        <div className="container mx-auto px-4 py-16">

        {/* Digital Products */}
        {digitalProducts.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground font-inter mb-2">
                Produtos Digitais
              </h2>
              <p className="text-muted-foreground">
                Memórias que viajam através do tempo, entregues no momento perfeito
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {digitalProducts.map((product) => {
                const IconComponent = iconMap[product.icon || "star"] || Star;
                const features = getFeatures(product.poetry);
                const isHighlighted = product.price === 9.9;

                return (
                  <Card
                    key={product.id}
                    className={`relative h-full transition-all duration-300 ${
                      isHighlighted
                        ? "border-2 border-keepla-red shadow-xl scale-[1.02]"
                        : "border border-border hover:border-foreground/30 hover:shadow-lg"
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-keepla-red text-keepla-white">
                          Mais Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8 pb-4">
                      <div className="mx-auto p-3 bg-muted rounded-full w-fit mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-keepla-black font-inter">
                        {product.name}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-keepla-red">
                          {product.price === 0
                            ? "Grátis"
                            : `${product.price.toFixed(2).replace(".", ",")}€`}
                        </span>
                        {product.price > 0 && (
                          <span className="text-muted-foreground text-sm ml-1">
                            /único
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-6 text-center">
                        {product.description}
                      </p>
                      {features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        variant="brand"
                        className="cta w-full"
                        size="lg"
                      >
                        {product.price === 0 ? (
                          "Começar Grátis"
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar Agora
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Physical Products */}
        {physicalProducts.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground font-inter mb-2">
                Produtos Físicos
              </h2>
              <p className="text-muted-foreground">
                Memórias tangíveis que podes tocar, guardar e entregar
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {physicalProducts.map((product) => {
                const IconComponent = iconMap[product.icon || "gift"] || Gift;
                const features = getFeatures(product.poetry);

                return (
                  <Card
                    key={product.id}
                    className="h-full border border-border hover:border-foreground/30 hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-foreground font-inter mb-1">
                            {product.name}
                          </CardTitle>
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toFixed(2).replace(".", ",")}€
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>
                      {features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        variant="brand"
                        className="cta w-full"
                        size="lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Bundles */}
        {bundles.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <Heart className="h-3 w-3 mr-1 text-primary" />
                Poupa mais
              </Badge>
              <h2 className="text-3xl font-bold text-foreground font-inter mb-2">
                Pacotes Especiais
              </h2>
              <p className="text-muted-foreground">
                Combinações pensadas para quem quer mais, por menos
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundles.map((product) => {
                const IconComponent = iconMap[product.icon || "package"] || Package;
                const features = getFeatures(product.poetry);

                return (
                  <Card
                    key={product.id}
                    className="h-full border-2 border-dashed border-primary/40 bg-primary/5 hover:border-primary hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-foreground font-inter mb-1">
                            {product.name}
                          </CardTitle>
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toFixed(2).replace(".", ",")}€
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>
                      {features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary hover:bg-secondary text-primary-foreground"
                        size="lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar Bundle
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Coming Soon */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Brevemente
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground font-inter">
              Produtos Futuros
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto opacity-60">
            <Card className="border border-dashed border-border">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">
                  Cápsula Empresarial
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para empresas que querem criar cápsulas corporativas
                </p>
              </CardContent>
            </Card>
            <Card className="border border-dashed border-border">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">
                  Cápsula de Casamento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pacote especial para casais e celebrações
                </p>
              </CardContent>
            </Card>
            <Card className="border border-dashed border-border">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">
                  Cápsula Escolar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para turmas de finalistas e universidades
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center bg-keepla-black rounded-2xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter text-white">
            Começa a guardar memórias hoje
          </h2>
          <p className="text-white/80 mb-8 font-inter text-lg">
            A tua primeira mensagem é grátis. Experimenta a magia de enviar amor
            através do tempo.
          </p>
          <Button
            onClick={() => navigate(user ? "/create-keepsake" : "/register")}
            size="lg"
            className="bg-keepla-red hover:bg-keepla-red/90 text-white font-inter font-semibold px-8 py-6 text-lg"
          >
            Criar Primeira Memória
          </Button>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
