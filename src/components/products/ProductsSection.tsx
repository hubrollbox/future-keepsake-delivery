import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/useCart";
import { toast } from "sonner";

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

const ProductsSection = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .gt('stock', 0)
        .order('type', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, product.name, product.price);
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho");
    }
  };

  const getProductsByType = (type: string) => {
    return products.filter(p => p.type === type);
  };

  const ProductCard = ({ product }: { product: Product }) => {
    return (
      <Card className="h-full border-keepla-gray/20 hover:border-keepla-red/40 transition-all duration-300 hover:shadow-keepla-sm bg-keepla-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-keepla-black font-serif">
                {product.name}
              </CardTitle>
            </div>
            <div className="text-right ml-4">
              <div className="font-semibold text-keepla-black">
                {product.price === 0 ? 'Grátis' : `€${product.price.toFixed(2)}`}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-keepla-black mb-3">
            {product.description}
          </p>
          {product.poetry && (
            <p className="text-sm italic text-keepla-red font-serif mb-4">
              "{product.poetry}"
            </p>
          )}
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

  if (loading) {
    return (
      <div className="py-16 bg-keepla-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepla-red mx-auto"></div>
            <p className="text-keepla-black mt-4">A carregar produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  const digitalProducts = getProductsByType('digital');
  const physicalProducts = getProductsByType('physical');
  const serviceProducts = getProductsByType('service');

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

        {digitalProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
              Produtos Digitais
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {digitalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {physicalProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
              Produtos Físicos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {physicalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {serviceProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-serif text-keepla-black mb-6 text-center">
              Serviços Adicionais
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {serviceProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-keepla-black">Nenhum produto disponível no momento.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="brand" 
            size="lg" 
            className="px-8 py-3"
            onClick={() => window.location.href = '/create-keepsake'}
          >
            Criar a Minha Cápsula
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
