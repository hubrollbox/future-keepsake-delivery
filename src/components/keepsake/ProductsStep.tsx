import { UseFormReturn } from "react-hook-form";
import { Button } from '@/components/ui/button';

interface ProductsStepProps {
  form: UseFormReturn<any>;
  nextStep: () => void;
  prevStep: () => void;
}

// Definimos uma interface para o produto para resolver os erros de parâmetro 'p'
interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ProductsStep = ({ form, nextStep, prevStep }: ProductsStepProps) => {
  const products = (form.watch("selected_products") as ProductItem[]) ?? [];

  const addProduct = () => {
    form.setValue("selected_products", [
      ...products,
      {
        id: crypto.randomUUID(),
        name: "Produto exemplo",
        price: 10,
        quantity: 1,
      },
    ]);
  };

  const removeProduct = (id: string) => {
    form.setValue(
      "selected_products",
      products.filter((p: ProductItem) => p.id !== id)
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    form.setValue(
      "selected_products",
      products.map((p: ProductItem) =>
        p.id === id ? { ...p, quantity } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-center text-keepla-black">
        Produtos (opcional)
      </h2>

      {products.length === 0 && (
        <p className="text-center text-sm text-gray-500 italic">
          Nenhum produto selecionado. Pode continuar se desejar apenas a cápsula digital.
        </p>
      )}

      <ul className="space-y-3">
        {products.map((product: ProductItem) => (
          <li
            key={product.id}
            className="flex items-center justify-between border rounded-lg p-3 bg-white shadow-sm"
          >
            <div>
              <p className="font-medium text-keepla-black">{product.name}</p>
              <p className="text-sm text-gray-500">
                {product.price} € / unidade
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={product.quantity}
                onChange={e =>
                  updateQuantity(product.id, Number(e.target.value))
                }
                className="w-16 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-keepla-red"
              />

              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="text-keepla-red text-sm hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          type="button"
          onClick={prevStep}
        >
          Voltar
        </Button>

        <div className="flex gap-3">
          <Button 
            variant="default" // Alterado de "secondary" para "default" (TS2322)
            type="button"
            onClick={addProduct}
          >
            Adicionar produto
          </Button>

          <Button 
            type="button"
            onClick={nextStep}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsStep;
