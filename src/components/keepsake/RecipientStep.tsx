import { User, Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RecipientStepProps {
  nextStep: () => void;
  prevStep: () => void;
  form: UseFormReturn<KeepsakeFormData>;
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
}

const RecipientStep = ({ form, formData, updateFormData, nextStep, prevStep }: RecipientStepProps) => {
  const EMAIL_PLACEHOLDER = 'email@exemplo.com';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-keepla-red mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2">
          Destinatário
        </h2>
        <p className="text-keepla-gray-light">
          Para quem é esta cápsula?
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-keepla-gray-dark font-medium">
                  Nome do Destinatário *
                </FormLabel>
                <FormControl>
                  <input
                    placeholder="Nome completo"
                    {...field}
                    className="w-full border rounded px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-keepla-gray-dark font-medium">
                  Relação
                </FormLabel>
                <FormControl>
                  <input
                    placeholder="Ex: filha, amigo, irmão"
                    {...field}
                    className="w-full border rounded px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border border-white/50 p-4 bg-white/30">
          <div className="flex items-center gap-2 text-keepla-gray-dark">
            <Mail className="h-5 w-5 text-keepla-red" />
            <span className="font-medium">Entrega por Email (Grátis)</span>
          </div>
          <p className="text-sm text-keepla-gray-light mt-1">
            Usamos email para entregar a tua memória no futuro.
          </p>
        </div>

        <FormField
          control={form.control}
          name="recipient_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="recipient_contact" className="text-keepla-gray-dark font-medium">
                Email do Destinatário *
              </FormLabel>
              <FormControl>
                <input
                  id="recipient_contact"
                  type="email"
                  placeholder={EMAIL_PLACEHOLDER}
                  {...field}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RecipientStep;