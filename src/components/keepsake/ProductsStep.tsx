import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ProductsStepProps {
  form: UseFormReturn<KeepsakeFormValues>;
  nextStep: () => void;
  prevStep: () => void;
}

const ProductsStep = ({ form }: ProductsStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2 text-center">
        Produtos (opcional)
      </h2>
      <p className="text-keepla-gray-light text-center mb-4">
        Selecione produtos a incluir na cápsula
      </p>

      <FormField
        control={form.control}
        name="selected_products"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produtos</FormLabel>
            <FormControl>
              <input
                {...field}
                className="w-full border rounded px-3 py-2"
                placeholder="IDs ou nomes de produtos (opcional)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductsStep;