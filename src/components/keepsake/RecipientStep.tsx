// src/components/keepsake/RecipientStep.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import { Button } from '@/components/ui/button';

interface RecipientStepProps {
  form: UseFormReturn<any>; // Usamos 'any' para evitar o conflito de tipos com 'delivery_channel'
  onNext: () => void;       // Alinhado com o nome passado no CreateKeepsake.tsx
  onBack: () => void;       // Alinhado com o nome passado no CreateKeepsake.tsx
}

const RecipientStep: React.FC<RecipientStepProps> = ({ form, onNext, onBack }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Informações do destinatário</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do destinatário</label>
        <input
          {...form.register('recipient_name')}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-keepla-red outline-none"
          placeholder="Ex: João Silva"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Contacto (Email)</label>
        <input
          {...form.register('recipient_contact')}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-keepla-red outline-none"
          placeholder="email@exemplo.com"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={onBack}>
          Anterior
        </Button>
        <Button type="button" onClick={onNext}>
          Seguinte
        </Button>
      </div>
    </div>
  );
};

export default RecipientStep;
