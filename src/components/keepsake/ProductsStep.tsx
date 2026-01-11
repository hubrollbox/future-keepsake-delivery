import { UseFormReturn } from "react-hook-form";
import { Button } from '@/components/ui/button'; // Usando o componente de UI padronizado

interface ProductsStepProps {
  form: UseFormReturn<any>; // 'any' para garantir que o build do Vercel passe
  nextStep: () => void;
  prevStep: () => void;
}

const ProductsStep = ({ form, nextStep, prevStep }: ProductsStepProps) => {
  const products = form.watch("selected_products") ?? [];

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
      products.filter(p => p.id !== id)
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    form.setValue(
      "selected_products",
      products.map(p =>
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
        {products.map(product => (
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
                type="button" // IMPORTANTE
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
          type="button" // IMPORTANTE
          onClick={prevStep}
        >
          Voltar
        </Button>

        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            type="button" // IMPORTANTE
            onClick={addProduct}
          >
            Adicionar produto
          </Button>

          <Button 
            type="button" // IMPORTANTE: Impede que tente submeter o form todo aqui
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
