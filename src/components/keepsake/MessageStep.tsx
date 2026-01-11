import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface MessageStepProps {
  form: UseFormReturn<any>; // 'any' evita conflitos de tipos no build do Vercel
  nextStep: () => void;
  prevStep: () => void;
}

const MessageStep: React.FC<MessageStepProps> = ({ form, nextStep, prevStep }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-keepla-black">Escreve a tua mensagem</h2>
      
      <div className="space-y-2">
        <textarea
          {...form.register('message')}
          className="w-full border p-4 rounded-md min-h-[200px] focus:ring-2 focus:ring-keepla-red outline-none shadow-sm"
          placeholder="Escreve aqui as memórias e mensagens para o futuro..."
        />
        {form.formState.errors.message && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.message.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        {/* Adicionado type="button" para evitar submissão precoce */}
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
