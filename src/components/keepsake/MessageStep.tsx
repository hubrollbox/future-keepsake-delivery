import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface MessageStepProps {
  form: UseFormReturn<KeepsakeFormValues>;
  _nextStep: () => void;
  _prevStep: () => void;
}

const MessageStep = ({ form, _nextStep, _prevStep }: MessageStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2 text-center">
        Mensagem
      </h2>
      <p className="text-keepla-gray-light text-center mb-4">
        Escreva a mensagem que será entregue na cápsula
      </p>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título *</FormLabel>
            <FormControl>
              <input
                {...field}
                className="w-full border rounded px-3 py-2"
                placeholder="Título da mensagem"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem *</FormLabel>
            <FormControl>
              <textarea
                {...field}
                className="w-full border rounded px-3 py-2"
                placeholder="Escreva aqui a mensagem..."
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="delivery_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Entrega *</FormLabel>
            <FormControl>
              <input
                type="date"
                {...field}
                className="w-full border rounded px-3 py-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MessageStep;