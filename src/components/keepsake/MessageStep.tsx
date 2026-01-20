import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MessageStepProps {
  form: UseFormReturn<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const MessageStep: React.FC<MessageStepProps> = ({ form, nextStep, prevStep }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const deliveryDateValue = form.watch('delivery_date');
  const selectedDate = deliveryDateValue ? new Date(deliveryDateValue) : undefined;
  const tomorrow = addDays(new Date(), 1);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('delivery_date', date.toISOString().slice(0, 10), { shouldValidate: true });
      setCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-keepla-black">Detalhes da tua cápsula</h2>
      
      {/* Campo Título */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-keepla-black">
          Título da cápsula <span className="text-keepla-red">*</span>
        </label>
        <Input
          id="title"
          {...form.register('title')}
          placeholder="Ex: Carta para o meu eu do futuro"
          className="focus:ring-2 focus:ring-keepla-red"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.title.message as string}
          </p>
        )}
      </div>

      {/* Campo Mensagem */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-keepla-black">
          Mensagem <span className="text-keepla-red">*</span>
        </label>
        <Textarea
          id="message"
          {...form.register('message')}
          className="w-full min-h-[200px] focus:ring-2 focus:ring-keepla-red"
          placeholder="Escreve aqui as memórias e mensagens para o futuro..."
        />
        {form.formState.errors.message && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.message.message as string}
          </p>
        )}
      </div>

      {/* Campo Data de Entrega */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-keepla-black">
          Data de entrega <span className="text-keepla-red">*</span>
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: pt })
                : "Seleciona a data de entrega"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < tomorrow}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {form.formState.errors.delivery_date && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.delivery_date.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={prevStep}
        >
          Anterior
        </Button>
        
        <Button 
          type="button" 
          onClick={nextStep}
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
};

export default MessageStep;
