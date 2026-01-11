import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { KeepsakeFormData } from '@/hooks/useKeepsakeForm';
import { Button } from '@/components/ui/button';

interface TypeStepProps {
  form: UseFormReturn<KeepsakeFormData>;
  selectedType: 'digital' | 'physical';
  onTypeSelect: (type: 'digital' | 'physical') => void;
  onNext: () => void;
}

const TypeStep: React.FC<TypeStepProps> = ({ selectedType, onTypeSelect, onNext }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Escolhe o tipo de cápsula</h2>
      <div className="flex gap-4">
        <Button
          variant={selectedType === 'digital' ? 'default' : 'outline'}
          onClick={() => onTypeSelect('digital')}
        >
          Digital
        </Button>
        <Button
          variant={selectedType === 'physical' ? 'default' : 'outline'}
          onClick={() => onTypeSelect('physical')}
        >
          Física
        </Button>
      </div>
      <Button onClick={onNext} className="mt-4 self-end">Seguinte</Button>
    </div>
  );
};

export default TypeStep;