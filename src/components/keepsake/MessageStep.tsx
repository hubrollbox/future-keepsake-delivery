import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import { Button } from '@/components/ui/button';

interface MessageStepProps {
  form: UseFormReturn<KeepsakeFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

const MessageStep: React.FC<MessageStepProps> = ({ form, nextStep, prevStep }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Escreve a tua mensagem</h2>
      <textarea
        {...form.register('message')}
        className="w-full border p-2 rounded"
        placeholder="Mensagem para a cápsula"
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Anterior</Button>
        <Button onClick={nextStep}>Seguinte</Button>
      </div>
    </div>
  );
};

export default MessageStep;