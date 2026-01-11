import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";

interface ProductsStepProps {
  form: UseFormReturn<KeepsakeFormValues>;
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
      <h2 className="text-2xl font-serif text-center">
        Produtos (opcional)
      </h2>

      {products.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          Nenhum produto selecionado
        </p>
      )}

      <ul className="space-y-3">
        {products.map(product => (
          <li
            key={product.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div>
              <p className="font-medium">{product.name}</p>
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
                className="w-16 border rounded px-2 py-1"
              />

              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="text-red-600 text-sm"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between">
        <button type="button" onClick={prevStep}>
          Voltar
        </button>

        <div className="flex gap-3">
          <button type="button" onClick={addProduct}>
            Adicionar produto
          </button>

          <button type="button" onClick={nextStep}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsStep;