import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";

interface TypeStepProps {
  form: UseFormReturn<KeepsakeFormValues>;
  selectedType: 'digital' | 'physical';
  onTypeSelect: (type: 'digital' | 'physical') => void;
  onNext: () => void;
}

const TypeStep = ({ form, selectedType, onTypeSelect, onNext }: TypeStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2">
        Tipo de Cápsula
      </h2>
      <p className="text-keepla-gray-light mb-4">
        Escolha se a cápsula será digital ou física
      </p>
      <div className="flex justify-center gap-4">
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
      <Button className="mt-6" onClick={onNext}>
        Próximo
      </Button>
    </div>
  );
};

export default TypeStep;