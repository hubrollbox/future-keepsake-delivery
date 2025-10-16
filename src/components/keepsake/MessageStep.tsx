

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Calendar, MessageSquare } from "lucide-react";
import { KeepsakeFormData } from "@/hooks/useKeepsakeForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";
import { getTomorrowDate } from "@/utils/validation";

interface MessageStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  form: UseFormReturn<KeepsakeFormValues>;
}

const MessageStep = ({ updateFormData, form }: MessageStepProps) => {

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MessageSquare className="h-12 w-12 text-keepla-red mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          A Tua Mensagem
        </h2>
        <p className="text-misty-gray">
          Escreve as palavras que queres partilhar no futuro
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-steel-blue font-medium">
                  Título da Cápsula *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Para a minha filha aos 18 anos"
                    className="mt-1"
                    maxLength={100}
                    onChange={(e) => {
                      field.onChange(e);
                      updateFormData({ title: e.target.value });
                    }}
                  />
                </FormControl>
                <p className="text-xs text-misty-gray mt-1">
                  {field.value?.length || 0}/100 caracteres
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-steel-blue font-medium">
                  Mensagem *
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Escreve aqui a tua mensagem..."
                    className="mt-1 min-h-32"
                    maxLength={2000}
                    onChange={(e) => {
                      field.onChange(e);
                      updateFormData({ message: e.target.value });
                    }}
                  />
                </FormControl>
                <p className="text-xs text-misty-gray mt-1">
                  {field.value?.length || 0}/2000 caracteres
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-steel-blue font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Entrega *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    min={getTomorrowDate()}
                    className="mt-1"
                    onChange={(e) => {
                      field.onChange(e);
                      updateFormData({ delivery_date: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {/* Navegação controlada pela barra inferior de CreateKeepsake */}
    </div>
  );
};

export default MessageStep;
