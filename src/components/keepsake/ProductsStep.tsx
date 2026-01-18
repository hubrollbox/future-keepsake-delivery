import { useState, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Minus, Loader2 } from "lucide-react";

interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  icon: string | null;
  stock: number;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductsStepProps {
  form: UseFormReturn<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const ProductsStep = ({ form, nextStep, prevStep }: ProductsStepProps) => {
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedProducts: SelectedProduct[] = form.watch("selected_products") ?? [];

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("id, name, price, description, icon, stock")
          .eq("active", true)
          .gt("stock", 0)
          .order("name");

        if (fetchError) throw fetchError;
        setCatalog(data ?? []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Não foi possível carregar os produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate total cost
  const totalCost = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }, [selectedProducts]);

  // Update form total_cost when selection changes
  useEffect(() => {
    form.setValue("total_cost", totalCost, { shouldDirty: true });
  }, [totalCost, form]);

  const isProductSelected = (productId: string) =>
    selectedProducts.some((p) => p.id === productId);

  const getSelectedQuantity = (productId: string) =>
    selectedProducts.find((p) => p.id === productId)?.quantity ?? 0;

  const addProduct = (product: CatalogProduct) => {
    if (isProductSelected(product.id)) return;
    form.setValue("selected_products", [
      ...selectedProducts,
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
      },
    ]);
  };

  const removeProduct = (productId: string) => {
    form.setValue(
      "selected_products",
      selectedProducts.filter((p) => p.id !== productId)
    );
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = catalog.find((p) => p.id === productId);
    const maxStock = product?.stock ?? 99;

    form.setValue(
      "selected_products",
      selectedProducts.map((p) => {
        if (p.id !== productId) return p;
        const newQty = Math.max(1, Math.min(p.quantity + delta, maxStock));
        return { ...p, quantity: newQty };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-foreground">
          Produtos (opcional)
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione produtos físicos à sua cápsula do tempo
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            type="button"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Empty catalog */}
      {!loading && !error && catalog.length === 0 && (
        <p className="text-center text-sm text-muted-foreground italic py-8">
          Nenhum produto disponível de momento. Pode continuar apenas com a
          cápsula digital.
        </p>
      )}

      {/* Product catalog grid */}
      {!loading && !error && catalog.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((product) => {
            const selected = isProductSelected(product.id);
            const qty = getSelectedQuantity(product.id);

            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 transition-all ${
                  selected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {product.icon ? (
                      <span className="text-xl">{product.icon}</span>
                    ) : (
                      <Package className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary mt-2">
                      {Number(product.price).toFixed(2)} €
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {selected ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {qty}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, 1)}
                          disabled={qty >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeProduct(product.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => addProduct(product)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected products summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-foreground mb-2">Resumo</h3>
          <ul className="space-y-1 text-sm">
            {selectedProducts.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>
                  {p.name} × {p.quantity}
                </span>
                <span className="font-medium">
                  {(p.price * p.quantity).toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">{totalCost.toFixed(2)} €</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" type="button" onClick={prevStep}>
          Voltar
        </Button>

        <Button type="button" onClick={nextStep}>
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default ProductsStep;
