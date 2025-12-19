
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSecureForm } from "@/hooks/useSecureForm";
import { secureTitleSchema, secureMessageSchema, sanitizeHtml } from "@/components/auth/SecureInputValidation";
import { z } from "zod";

const messageStepSchema = z.object({
  title: secureTitleSchema,
  message: secureMessageSchema,
  delivery_date: z.string().min(1, "Data de entrega é obrigatória")
});

type MessageStepData = z.infer<typeof messageStepSchema>;

interface SecureMessageStepProps {
  formData: MessageStepData;
  updateFormData: (data: Partial<MessageStepData>) => void;
  nextStep: () => void;
}

const SecureMessageStep: React.FC<SecureMessageStepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    formData.delivery_date ? new Date(formData.delivery_date) : undefined
  );

  const { data, errors, updateField, handleSubmit, isValid } = useSecureForm<MessageStepData>({
    schema: messageStepSchema,
    onSubmit: async (validatedData) => {
      // Sanitize the message content before saving
      const sanitizedData = {
        ...validatedData,
        message: sanitizeHtml(validatedData.message)
      };
      
      updateFormData(sanitizedData);
      nextStep();
    },
    sanitizeFields: ['title', 'message']
  });

  // Initialize form with existing data
  React.useEffect(() => {
    if (formData.title) updateField('title', formData.title);
    if (formData.message) updateField('message', formData.message);
    if (formData.delivery_date) updateField('delivery_date', formData.delivery_date);
  }, [formData, updateField]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? date.toISOString().split('T')[0] : '';
    updateField('delivery_date', dateString || '');
  };

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1); // Minimum tomorrow

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2">
          A Tua Mensagem para o Futuro
        </h2>
        <p className="text-keepla-gray-light">
          Escreve uma mensagem que será entregue no momento perfeito
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-keepla-gray-dark font-medium">
            Título da Cápsula *
          </Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ex: Para a minha filha aos 18 anos"
            className={cn(
              "border-white/50 focus:border-keepla-red",
              errors.title && "border-red-500"
            )}
            maxLength={200}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-keepla-gray-dark font-medium">
            Mensagem *
          </Label>
          <Textarea
            id="message"
            value={data.message || ''}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Escreve aqui a tua mensagem para o futuro..."
            className={cn(
              "min-h-[150px] border-white/50 focus:border-keepla-red resize-none",
              errors.message && "border-red-500"
            )}
            maxLength={5000}
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message}</p>
          )}
          <p className="text-sm text-keepla-gray-light">
            {data.message?.length || 0}/5000 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-keepla-gray-dark font-medium">Data de Entrega *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-white/50",
                  !selectedDate && "text-muted-foreground",
                  errors.delivery_date && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: pt })
                ) : (
                  <span>Escolhe uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < minDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.delivery_date && (
            <p className="text-sm text-red-500">{errors.delivery_date}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit"
            variant="brand" 
            size="lg"
            disabled={!isValid}
            className="min-w-[150px]"
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecureMessageStep;
