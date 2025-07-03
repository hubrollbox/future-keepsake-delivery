
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput, sanitizeHTML } from '@/utils/inputValidation';
import type { KeepsakeFormData } from '@/pages/CreateKeepsake';

interface MessageStepProps {
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
  nextStep: () => void;
}

interface MessageFormData {
  title: string;
  message: string;
}

const SecureMessageStep = ({ formData, updateFormData, nextStep }: MessageStepProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    formData.delivery_date ? new Date(formData.delivery_date) : undefined
  );

  const {
    updateField,
    getFieldValue,
    getFieldErrors,
    validateForm
  } = useSecureForm<MessageFormData>({
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 5000
    }
  });

  // Initialize form with existing data
  React.useEffect(() => {
    if (formData.title) {
      updateField('title', formData.title);
    }
    if (formData.message) {
      updateField('message', formData.message);
    }
  }, [formData.title, formData.message, updateField]);

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    if (!selectedDate) {
      return;
    }

    const title = sanitizeInput(getFieldValue('title'));
    const message = sanitizeHTML(getFieldValue('message'));

    updateFormData({
      title,
      message,
      delivery_date: selectedDate.toISOString()
    });

    nextStep();
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Minimum 1 day from now

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-steel-blue mb-2">
          A Sua Mensagem
        </h2>
        <p className="text-misty-gray">
          Escreva a mensagem que deseja entregar no futuro
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-steel-blue mb-2">
            Título da Cápsula *
          </label>
          <Input
            id="title"
            type="text"
            value={getFieldValue('title')}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ex: Para a minha filha aos 18 anos"
            maxLength={100}
            required
          />
          {getFieldErrors('title').map((error, index) => (
            <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
          ))}
          <p className="text-xs text-misty-gray mt-1">
            {getFieldValue('title').length}/100 caracteres
          </p>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-steel-blue mb-2">
            Mensagem *
          </label>
          <Textarea
            id="message"
            value={getFieldValue('message')}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Escreva aqui a sua mensagem para o futuro..."
            className="min-h-[200px] resize-none"
            maxLength={5000}
            required
          />
          {getFieldErrors('message').map((error, index) => (
            <p key={index} className="text-sm text-red-600 mt-1">{error}</p>
          ))}
          <p className="text-xs text-misty-gray mt-1">
            {getFieldValue('message').length}/5000 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-blue mb-2">
            Data de Entrega *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: pt })
                ) : (
                  <span>Selecione a data de entrega</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < minDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {!selectedDate && (
            <p className="text-sm text-red-600 mt-1">
              Por favor, selecione uma data de entrega
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!getFieldValue('title') || !getFieldValue('message') || !selectedDate}
          className="bg-dusty-rose hover:bg-dusty-rose/90 text-white px-8"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default SecureMessageStep;
