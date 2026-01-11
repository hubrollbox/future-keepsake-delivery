import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import { Button } from '@/components/ui/button';

interface RecipientStepProps {
  form: UseFormReturn<KeepsakeFormData>;
  nextStep: () => void;
  prevStep: () => void;
  formData: KeepsakeFormData;
  updateFormData: (data: Partial<KeepsakeFormData>) => void;
}

const RecipientStep: React.FC<RecipientStepProps> = ({ form, nextStep, prevStep, formData, updateFormData }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Informações do destinatário</h2>
      <input
        {...form.register('recipient_name')}
        className="w-full border p-2 rounded"
        placeholder="Nome do destinatário"
      />
      <input
        {...form.register('recipient_contact')}
        className="w-full border p-2 rounded"
        placeholder="Contacto do destinatário"
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Anterior</Button>
        <Button onClick={nextStep}>Seguinte</Button>
      </div>
    </div>
  );
};

export default RecipientStep;