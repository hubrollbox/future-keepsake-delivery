
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Star, Package, Gift, Lock, Users, Video, ShoppingCart, Truck } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";
import { BASE_PRICE_EUR, computeExtrasTotal, computeTotalSimple } from "@/lib/simplePricing";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  icon: string;
}

interface ProductsStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  form: UseFormReturn<KeepsakeFormValues>;
}

const ProductsStep = ({ formData, updateFormData }: ProductsStepProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    star: Star,
    package: Package,
    gift: Gift,
    lock: Lock,
    users: Users,
    video: Video,
    'shopping-cart': ShoppingCart,
    truck: Truck
  };

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);



  const isProductSelected = (productId: string) => {
    return formData.selected_products.some((p: { id: string }) => p.id === productId);
  };

  const toggleProduct = (product: Product) => {
    const isSelected = isProductSelected(product.id);
    let newSelectedProducts;
    
    if (isSelected) {
      newSelectedProducts = formData.selected_products.filter((p: { id: string }) => p.id !== product.id);
    } else {
      newSelectedProducts = [
        ...formData.selected_products,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ];
    }

    const total = computeTotalSimple({
      ...formData,
      selected_products: newSelectedProducts,
    });

    updateFormData({
      selected_products: newSelectedProducts,
      total_cost: total
    });
  };

  

  if (loading) {
    return <div className="text-center py-8">A carregar produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Gift className="h-12 w-12 text-dusty-rose mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          Queres adicionar um presente especial?
        </h2>
        <p className="text-misty-gray">
          Os extras são opcionais. A mensagem digital tem preço base de {BASE_PRICE_EUR.toFixed(2)} €.
        </p>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const IconComponent = iconMap[product.icon as keyof typeof iconMap] || Gift;
          const isSelected = isProductSelected(product.id);

          return (
            <Card
              key={product.id}
              className={`transition-all hover:shadow-soft ${
                isSelected
                  ? 'border-dusty-rose bg-dusty-rose/5'
                  : 'border-sand-beige hover:border-dusty-rose/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-dusty-rose/10">
                      <IconComponent className="h-5 w-5 text-dusty-rose" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-steel-blue">
                          {product.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {product.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-misty-gray mt-1">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-steel-blue">
                          {product.price.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(product)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {formData.selected_products.length > 0 && (
        <Card className="bg-sand-beige/30 border-dusty-rose/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-steel-blue mb-2">Resumo dos Extras</h3>
            <div className="space-y-1 text-sm">
              {formData.selected_products.map((product: { id: string; name: string; price: number }) => (
                <div key={product.id} className="flex justify-between">
                  <span>{product.name}</span>
                  <span>{product.price.toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-dusty-rose/20 pt-1 mt-2 flex justify-between font-semibold">
                <span>Total Extras:</span>
                <span>{computeExtrasTotal(formData).toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navegação controlada pela barra inferior de CreateKeepsake */}
    </div>
  );
};

export default ProductsStep;
